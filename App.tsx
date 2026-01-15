
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Task, GlobalSettings, Withdrawal } from './types';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskEngine from './components/TaskEngine';
import AdPortal from './components/AdPortal';
import Wallet from './components/Wallet';
import AdminPanel from './components/AdminPanel';
import JoinGuard from './components/JoinGuard';
import { SUPER_ADMIN_ID, DEFAULT_SETTINGS, INITIAL_TASKS } from './constants';

const App: React.FC = () => {
  // --- DATABASE STATE ---
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // --- PERSISTENCE & INITIALIZATION ---
  useEffect(() => {
    // 1. Load data from LocalStorage (Simulating MongoDB)
    const savedSettings = localStorage.getItem('eb_settings');
    const savedTasks = localStorage.getItem('eb_tasks');
    const savedWithdrawals = localStorage.getItem('eb_withdrawals');
    const savedUsers = localStorage.getItem('eb_users');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));
    
    // 2. Auth Simulation
    setTimeout(() => {
      const allUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];
      setUsers(allUsers);

      // Simulate getting user ID from Telegram
      // For this demo, we assume the current user is whoever is logged in.
      // If the ID matches your SUPER_ADMIN_ID, they get the Admin tab.
      const currentTgId = SUPER_ADMIN_ID; // In production: window.Telegram.WebApp.initDataUnsafe.user.id
      
      let user = allUsers.find(u => u.telegramId === currentTgId);
      
      if (!user) {
        user = {
          id: 'u' + Math.random().toString(36).substr(2, 9),
          telegramId: currentTgId,
          username: 'User_' + currentTgId,
          balance: 0,
          xp: 0,
          level: 1,
          role: currentTgId === SUPER_ADMIN_ID ? UserRole.ADMIN : UserRole.USER,
          joinedChannels: [],
          isBanned: false,
          isVerified: false
        };
        const updatedUsers = [...allUsers, user];
        setUsers(updatedUsers);
        localStorage.setItem('eb_users', JSON.stringify(updatedUsers));
      }
      
      setCurrentUser(user);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Sync state to local storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('eb_settings', JSON.stringify(settings));
      localStorage.setItem('eb_tasks', JSON.stringify(tasks));
      localStorage.setItem('eb_withdrawals', JSON.stringify(withdrawals));
      localStorage.setItem('eb_users', JSON.stringify(users));
    }
  }, [settings, tasks, withdrawals, users, isLoading]);

  const handleUpdateUser = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      setUsers(all => all.map(u => u.id === prev.id ? updated : u));
      return updated;
    });
  }, []);

  const isSuperAdmin = currentUser?.telegramId === SUPER_ADMIN_ID;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-2xl shadow-blue-500/20">💎</div>
          <h1 className="text-xl font-black text-white">EARNBOT PRO</h1>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Secure Handshake...</p>
        </div>
      </div>
    );
  }

  if (currentUser?.isBanned) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 p-10 text-center">
        <div>
          <span className="text-7xl">🚫</span>
          <h1 className="text-2xl font-black text-white mt-4 uppercase">Access Denied</h1>
          <p className="text-slate-400 mt-2">Your account has been banned for suspicious activity.</p>
        </div>
      </div>
    );
  }

  // --- DYNAMIC JOIN GUARD ---
  if (!currentUser?.isVerified) {
    return (
      <JoinGuard 
        channels={settings.mandatoryChannels} 
        onComplete={() => handleUpdateUser({ isVerified: true })} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 max-w-md mx-auto relative border-x border-slate-900 shadow-2xl pb-24">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shadow-blue-600/20">E</div>
          <span className="font-black text-lg tracking-tighter italic">EARNBOT <span className="text-blue-500">PRO</span></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          <span className="text-yellow-400 font-black text-sm">💎 {currentUser?.balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        {activeTab === 'dashboard' && <Dashboard user={currentUser} />}
        {activeTab === 'tasks' && <TaskEngine user={currentUser} tasks={tasks} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'advertise' && <AdPortal user={currentUser} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'wallet' && <Wallet user={currentUser} settings={settings} withdrawals={withdrawals} setWithdrawals={setWithdrawals} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'admin' && isSuperAdmin && (
          <AdminPanel 
            settings={settings} setSettings={setSettings}
            tasks={tasks} setTasks={setTasks}
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
