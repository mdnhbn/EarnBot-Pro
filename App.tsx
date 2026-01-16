
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
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // --- DB SYNC (LocalStorage for now, easily switch to MongoDB API) ---
  useEffect(() => {
    const savedSettings = localStorage.getItem('eb_settings');
    const savedTasks = localStorage.getItem('eb_tasks');
    const savedWithdrawals = localStorage.getItem('eb_withdrawals');
    const savedUsers = localStorage.getItem('eb_users');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));

    setTimeout(() => {
      const allUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];
      setUsers(allUsers);

      // In production: window.Telegram.WebApp.initDataUnsafe.user.id
      const currentTgId = 929198867; // MOCKED FOR TESTING YOUR ADMIN ACCESS
      
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
      }
      
      setCurrentUser(user);
      setIsLoading(false);
    }, 1000);
  }, []);

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

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="text-center animate-pulse">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-2xl shadow-2xl">💎</div>
        <p className="text-slate-500 text-xs font-black tracking-widest uppercase">Connecting to Database...</p>
      </div>
    </div>
  );

  if (currentUser?.isBanned) return (
    <div className="flex h-screen items-center justify-center bg-slate-950 p-10 text-center">
       <div><span className="text-7xl">🚫</span><h1 className="text-2xl font-black mt-4">BAN ACTIVE</h1><p className="text-slate-500 mt-2">Access denied by administrator.</p></div>
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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black shadow-lg">E</div>
          <span className="font-black italic text-lg tracking-tighter uppercase">EarnBot <span className="text-blue-500">Pro</span></span>
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
