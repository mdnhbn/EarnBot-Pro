import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Task, GlobalSettings, Withdrawal } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskEngine from './components/TaskEngine';
import AdPortal from './components/AdPortal';
import Wallet from './components/Wallet';
import AdminPanel from './components/AdminPanel';
import JoinGuard from './components/JoinGuard';
import { SUPER_ADMIN_ID, DEFAULT_SETTINGS } from './constants';

console.log('🚀 EarnBot Pro: App.tsx Execution Started');

/**
 * ✅ 100% HARDCODED BACKEND URL
 */
const API_BASE = 'https://earnbot-pro.onrender.com';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('Initializing Application...');

  useEffect(() => {
    console.log('🛠️ App: Starting Initialization Sequence');
    
    // 1. Safe Telegram WebApp Initialization
    let tgUser: any = null;
    try {
      const webapp = (window as any).Telegram?.WebApp;
      if (webapp) {
        console.log('📱 Telegram WebApp Detected');
        webapp.ready();
        webapp.expand();
        webapp.setHeaderColor('#020617');
        webapp.setBackgroundColor('#020617');
        tgUser = webapp.initDataUnsafe?.user;
      } else {
        console.warn('💻 Browser Mode: Running in Demo Mode');
      }
    } catch (e) {
      console.error('❌ Telegram Init Failed:', e);
    }

    const initApp = async () => {
      setIsLoading(true);
      setError(null);
      let retryCount = 0;
      const maxRetries = 12; // 36 seconds total wait time
      const retryInterval = 3000;

      const attemptFetch = async () => {
        try {
          const tgId = tgUser?.id || SUPER_ADMIN_ID;
          const username = tgUser?.username || 'GuestUser_' + tgId;
          
          setLoadingStep(`Syncing with Engine... (Attempt ${retryCount + 1}/${maxRetries})`);
          console.log(`📡 Connecting to: ${API_BASE}/api/init/${tgId}`);
          
          const res = await fetch(`${API_BASE}/api/init/${tgId}`, {
            method: 'GET',
            mode: 'cors',
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
          }

          const data = await res.json();
          console.log('✅ Connection Successful: Data Received');
          
          if (data.settings) setSettings(data.settings);
          if (data.tasks) setTasks(data.tasks);
          if (data.withdrawals) setWithdrawals(data.withdrawals);
          if (data.allUsers) setUsers(data.allUsers);

          if (data.user) {
            setCurrentUser(data.user);
          } else {
            console.log('👤 Registering New Profile...');
            setLoadingStep('Creating Earning Profile...');
            const newUser: User = {
              id: 'u' + Math.random().toString(36).substr(2, 9),
              telegramId: tgId,
              username: username,
              balance: 0,
              xp: 0,
              level: 1,
              role: tgId === SUPER_ADMIN_ID ? UserRole.ADMIN : UserRole.USER,
              joinedChannels: [],
              isBanned: false,
              isVerified: false
            };
            
            const syncRes = await fetch(`${API_BASE}/api/user/sync`, {
              method: 'POST',
              mode: 'cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser)
            });
            
            if (!syncRes.ok) throw new Error("Profile Creation Failed");
            setCurrentUser(newUser);
          }
          setIsLoading(false);
        } catch (err: any) {
          console.error("⚠️ Connection Attempt Failed:", err.message);
          if (retryCount < maxRetries - 1) {
            retryCount++;
            setLoadingStep(`Engine is starting... (${retryCount}/${maxRetries})`);
            setTimeout(attemptFetch, retryInterval);
          } else {
            setError("NETWORK TIMEOUT: The earning engine is not responding. Please check your internet or retry later.");
            setIsLoading(false);
          }
        }
      };

      attemptFetch();
    };

    initApp();
  }, []);

  const handleUpdateUser = useCallback(async (updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      fetch(`${API_BASE}/api/user/sync`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(e => console.error("Update Sync Error:", e));

      setUsers(all => all.map(u => u.telegramId === prev.telegramId ? updated : u));
      return updated;
    });
  }, []);

  const handleUpdateSettings = async (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    await fetch(`${API_BASE}/api/admin/settings`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(console.error);
  };

  const handleAddTask = async (task: Task) => {
    setTasks(prev => [...prev, task]);
    await fetch(`${API_BASE}/api/admin/tasks`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    }).catch(console.error);
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch(`${API_BASE}/api/admin/tasks/${id}`, { 
      method: 'DELETE',
      mode: 'cors'
    }).catch(console.error);
  };

  const isSuperAdmin = currentUser?.telegramId === SUPER_ADMIN_ID;

  if (error) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] p-10 text-center">
      <div className="text-6xl mb-6">🔌</div>
      <h1 className="text-white font-black text-xl uppercase mb-4 tracking-widest">Handshake Failed</h1>
      <p className="text-red-400 text-[10px] font-mono mb-8 leading-relaxed max-w-xs mx-auto border border-red-900/50 p-4 bg-red-950/20 rounded-xl">
        {error}
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
      >
        Retry Connection
      </button>
    </div>
  );

  if (isLoading) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] p-8 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
        <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(37,99,235,0.4)] relative z-10 animate-pulse-slow">
          💎
        </div>
      </div>
      <h1 className="text-white font-black text-2xl tracking-[0.4em] uppercase italic mb-3">EarnBot Pro</h1>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-10 opacity-80">
        {loadingStep}
      </p>
    </div>
  );

  if (currentUser?.isBanned) return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] p-10 text-center">
       <div>
         <span className="text-7xl">🚫</span>
         <h1 className="text-2xl font-black mt-4 uppercase text-red-500 tracking-tighter">Access Denied</h1>
         <p className="text-slate-500 mt-2 text-sm">Security policies restricted this account.</p>
       </div>
    </div>
  );

  if (!currentUser?.isVerified) return (
    <JoinGuard 
      channels={settings.mandatoryChannels} 
      onComplete={() => handleUpdateUser({ isVerified: true })} 
    />
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto relative border-x border-slate-900 shadow-2xl pb-24">
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black shadow-lg shadow-blue-600/20">E</div>
          <span className="font-black italic text-lg tracking-tighter uppercase tracking-widest">EarnBot <span className="text-blue-500">Pro</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="text-yellow-400 font-black text-xs">💎 {currentUser?.balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard user={currentUser} settings={settings} />}
        {activeTab === 'tasks' && <TaskEngine user={currentUser} tasks={tasks} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'advertise' && <AdPortal user={currentUser} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'wallet' && <Wallet user={currentUser} settings={settings} withdrawals={withdrawals} setWithdrawals={setWithdrawals} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'admin' && isSuperAdmin && (
          <AdminPanel 
            settings={settings} setSettings={handleUpdateSettings}
            tasks={tasks} setTasks={handleAddTask as any}
            users={users} setUsers={setUsers}
            withdrawals={withdrawals} setWithdrawals={setWithdrawals}
          />
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isSuperAdmin} />
    </div>
  );
};

export default App;