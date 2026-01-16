
import React, { useState } from 'react';
import { GlobalSettings, Task, Withdrawal, User, TaskType } from '../types';

interface AdminPanelProps {
  settings: GlobalSettings;
  setSettings: (s: GlobalSettings) => void;
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  users: User[];
  setUsers: (u: User[]) => void;
  withdrawals: Withdrawal[];
  setWithdrawals: (w: Withdrawal[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  settings, setSettings, tasks, setTasks, users, setUsers, withdrawals, setWithdrawals 
}) => {
  const [tab, setTab] = useState<'settings' | 'tasks' | 'users' | 'withdrawals' | 'levels'>('settings');

  // New Task State
  const [nt, setNt] = useState<Partial<Task>>({ type: TaskType.YOUTUBE, reward: 100, timer: 30 });
  
  // Handlers
  const addTask = () => {
    if (!nt.title || !nt.url) return alert("Title and URL required");
    const task: Task = {
      id: 't' + Date.now(),
      creatorId: 'admin',
      type: nt.type || TaskType.YOUTUBE,
      title: nt.title || '',
      url: nt.url || '',
      reward: nt.reward || 100,
      timer: nt.timer || 30,
      approved: true,
      viewCount: 0
    };
    setTasks([...tasks, task]);
    setNt({ type: TaskType.YOUTUBE, reward: 100, timer: 30 });
    alert("Task Added!");
  };

  const updateSettings = (field: keyof GlobalSettings, value: any) => setSettings({ ...settings, [field]: value });
  
  const toggleBan = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u));
    alert("User status updated");
  };

  const manualVerify = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isVerified: true } : u));
    alert("User manually verified");
  };

  const resetBalance = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, balance: 0 } : u));
    alert("User balance reset to zero");
  };

  return (
    <div className="space-y-6 pb-20 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic">SUPER ADMIN <span className="text-blue-500">HUB</span></h2>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar bg-slate-900 p-1 rounded-2xl border border-slate-800">
        {['settings', 'tasks', 'users', 'withdrawals', 'levels'].map((t: any) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{t}</button>
        ))}
      </div>

      {tab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
            <h3 className="text-sm font-black mb-4 uppercase text-blue-400">Mandatory Channels</h3>
            <div className="space-y-4">
              {settings.mandatoryChannels.map((c, i) => (
                <div key={c.id} className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-600">CHANNEL #{i+1}</p>
                  <input value={c.name} onChange={e => {
                    const ch = [...settings.mandatoryChannels];
                    ch[i].name = e.target.value;
                    updateSettings('mandatoryChannels', ch);
                  }} className="w-full bg-slate-900 px-3 py-2 rounded-lg text-xs" />
                  <input value={c.url} onChange={e => {
                    const ch = [...settings.mandatoryChannels];
                    ch[i].url = e.target.value;
                    updateSettings('mandatoryChannels', ch);
                  }} className="w-full bg-slate-900 px-3 py-2 rounded-lg text-[10px] text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
            <h3 className="text-sm font-black mb-4 uppercase text-green-400">Add New Global Task</h3>
            <div className="space-y-3">
              <input placeholder="Task Title" value={nt.title || ''} onChange={e => setNt({...nt, title: e.target.value})} className="w-full bg-slate-950 px-4 py-3 rounded-xl text-xs" />
              <input placeholder="Target URL" value={nt.url || ''} onChange={e => setNt({...nt, url: e.target.value})} className="w-full bg-slate-950 px-4 py-3 rounded-xl text-xs" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Reward Points" value={nt.reward} onChange={e => setNt({...nt, reward: parseInt(e.target.value)})} className="w-full bg-slate-950 px-4 py-3 rounded-xl text-xs" />
                <input type="number" placeholder="Timer (sec)" value={nt.timer} onChange={e => setNt({...nt, timer: parseInt(e.target.value)})} className="w-full bg-slate-950 px-4 py-3 rounded-xl text-xs" />
              </div>
              <button onClick={addTask} className="w-full bg-blue-600 py-4 rounded-xl font-black text-xs">CREATE CAMPAIGN</button>
            </div>
          </div>
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <p className="text-xs font-bold">{t.title} <span className="text-slate-500">({t.reward}p)</span></p>
                <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-red-500 text-xs">DELETE</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-black">@{u.username} <span className="text-[10px] text-slate-500">({u.telegramId})</span></p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.isBanned ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>{u.isBanned ? 'BANNED' : 'ACTIVE'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => toggleBan(u.id)} className="text-[10px] bg-red-600/20 text-red-500 py-1.5 rounded-lg border border-red-500/30 font-bold">{u.isBanned ? 'UNBAN' : 'BAN'}</button>
                <button onClick={() => resetBalance(u.id)} className="text-[10px] bg-yellow-600/20 text-yellow-500 py-1.5 rounded-lg border border-yellow-500/30 font-bold">RESET</button>
                <button onClick={() => manualVerify(u.id)} className="text-[10px] bg-blue-600/20 text-blue-500 py-1.5 rounded-lg border border-blue-500/30 font-bold">VERIFY</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'withdrawals' && (
        <div className="space-y-4">
          {withdrawals.filter(w => w.status === 'PENDING').map(w => (
            <div key={w.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">@{w.username}</h4>
                <p className="text-xl font-black text-blue-500">${(w.amount/100).toFixed(2)}</p>
              </div>
              <code className="block bg-slate-950 p-3 rounded-xl text-[10px] text-slate-500 break-all">{w.address}</code>
              <div className="flex gap-2">
                <button onClick={() => setWithdrawals(withdrawals.map(x => x.id === w.id ? {...x, status: 'COMPLETED'} : x))} className="flex-1 bg-green-600 py-2.5 rounded-xl font-black text-xs">APPROVE</button>
                <button onClick={() => setWithdrawals(withdrawals.map(x => x.id === w.id ? {...x, status: 'REJECTED'} : x))} className="flex-1 bg-red-600 py-2.5 rounded-xl font-black text-xs">REJECT</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'levels' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl">
            <h3 className="text-sm font-black mb-4 uppercase text-yellow-500">Milestone Settings</h3>
            <div className="space-y-4">
              {settings.levelRequirements.map((req, i) => (
                <div key={req.level} className="grid grid-cols-3 gap-2 items-center">
                  <p className="text-xs font-bold">Level {req.level}</p>
                  <input type="number" value={req.xpNeeded} onChange={e => {
                    const lv = [...settings.levelRequirements];
                    lv[i].xpNeeded = parseInt(e.target.value);
                    updateSettings('levelRequirements', lv);
                  }} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" />
                  <input type="number" value={req.bonus} onChange={e => {
                    const lv = [...settings.levelRequirements];
                    lv[i].bonus = parseInt(e.target.value);
                    updateSettings('levelRequirements', lv);
                  }} className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
