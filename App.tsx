
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

/**
 * ✅ DYNAMIC API BASE CONFIGURATION
 */
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://earnbot-pro.onrender.com';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('Initializing Security...');

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10; // Increased retries for Render cold starts

    const initApp = async () => {
      try {
        const webapp = (window as any).Telegram?.WebApp;
        if (webapp) {
          webapp.expand();
          webapp.ready();
        }

        const tgId = webapp?.initDataUnsafe?.user?.id || SUPER_ADMIN_ID;
        const username = webapp?.initDataUnsafe?.user?.username || 'User_' + tgId;
        
        setLoadingStep(`Connecting to Engine (Attempt ${retryCount + 1})...`);
        
        const res = await fetch(`${API_BASE}/api/init/${tgId}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!res.ok) throw new Error(`Server Status: ${res.status}`);

        const data = await res.json();
        
        if (data.settings) setSettings(data.settings);
        if (data.tasks) setTasks(data.tasks);
        if (data.withdrawals) setWithdrawals(data.withdrawals);
        if (data.allUsers) setUsers(data.allUsers);

        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setLoadingStep('Generating Account...');
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
          
          await fetch(`${API_BASE}/api/user/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
          });
          setCurrentUser(newUser);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Init failure:", err);
        
        if (retryCount < maxRetries) {
          retryCount++;
          setLoadingStep(`Server is waking up (Render tier)... ${retryCount}/${maxRetries}`);
          setTimeout(initApp, 3500);
        } else {
          setLoadingStep('Critical: Engine unreachable. Check internet connection.');
        }
      }
    };

    initApp();
  }, []);

  const handleUpdateUser = useCallback(async (updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      fetch(`${API_BASE}/api/user/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(e => console.error("Cloud sync failed:", e));

      setUsers(all => all.map(u => u.telegramId === prev.telegramId ? updated : u));
      return updated;
    });
  }, []);

  const handleUpdateSettings = async (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    await fetch(`${API_BASE}/api/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(console.error);
  };

  const handleAddTask = async (task: Task) => {
    setTasks(prev => [...prev, task]);
    await fetch(`${API_BASE}/api/admin/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    }).catch(console.error);
  };

  const handleDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch(`${API_BASE}/api/admin/tasks/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const isSuperAdmin = currentUser?.telegramId === SUPER_ADMIN_ID;

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a]">
      <div className="text-center px-6">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-3xl shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-pulse">💎</div>
        <h2 className="text-white font-black text-xl tracking-[0.2em] uppercase mb-2">EarnBot Pro</h2>
        <div className="h-1 w-48 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-500 animate-[loading_2s_infinite]"></div>
        </div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-4 leading-relaxed">
          {loadingStep}
        </p>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  if (currentUser?.isBanned) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] p-10 text-center">
       <div>
         <span className="text-7xl">🚫</span>
         <h1 className="text-2xl font-black mt-4 uppercase text-red-500">Security Access Denied</h1>
         <p className="text-slate-500 mt-2 text-sm">Your account has been restricted by the system administrator.</p>
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
