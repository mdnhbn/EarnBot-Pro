
import React, { useState } from 'react';
import { GlobalSettings, Task, Withdrawal, User, TaskType, MandatoryChannel } from '../types';

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
  const [tab, setTab] = useState<'settings' | 'tasks' | 'users' | 'withdrawals'>('settings');

  // Task Creator State
  const [nt, setNt] = useState<Partial<Task>>({ type: TaskType.YOUTUBE, reward: 50, timer: 30 });

  const addTask = () => {
    if (!nt.title || !nt.url) return alert("Fill all fields");
    const task: Task = {
      id: 't' + Date.now(),
      creatorId: 'admin',
      type: nt.type || TaskType.YOUTUBE,
      title: nt.title || '',
      url: nt.url || '',
      reward: nt.reward || 50,
      timer: nt.timer || 30,
      approved: true,
      viewCount: 0
    };
    setTasks([...tasks, task]);
    setNt({ type: TaskType.YOUTUBE, reward: 50, timer: 30, title: '', url: '' });
  };

  const deleteT = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const updateChannel = (id: string, name: string, url: string) => {
    const updated = settings.mandatoryChannels.map(c => c.id === id ? { ...c, name, url } : c);
    setSettings({ ...settings, mandatoryChannels: updated });
  };

  const processW = (id: string, status: 'COMPLETED' | 'REJECTED') => {
    setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status } : w));
  };

  const toggleBan = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isBanned: !u.isBanned } : u));
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic tracking-tighter">CONTROL <span className="text-blue-500">PANEL</span></h2>
        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">SUPER_ADMIN</span>
      </div>

      {/* ADMIN NAV */}
      <div className="flex gap-1 bg-slate-900 p-1 rounded-xl overflow-x-auto no-scrollbar border border-slate-800">
        {['settings', 'tasks', 'users', 'withdrawals'].map((t: any) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${
              tab === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* CONTENT: SETTINGS */}
      {tab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <h3 className="text-sm font-black mb-4 uppercase text-blue-400">Mandatory Channels</h3>
            <div className="space-y-4">
              {settings.mandatoryChannels.map((c, i) => (
                <div key={c.id} className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Channel #{i+1}</span>
                  </div>
                  <input 
                    type="text" value={c.name} 
                    onChange={e => updateChannel(c.id, e.target.value, c.url)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                  <input 
                    type="text" value={c.url} 
                    onChange={e => updateChannel(c.id, c.name, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-[10px] text-blue-400 outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-600 text-center italic">Settings are auto-saved to LocalStorage system.</p>
        </div>
      )}

      {/* CONTENT: TASKS */}
      {tab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h3 className="font-black text-sm mb-4 uppercase text-green-400">Add New Campaign</h3>
            <div className="space-y-3">
              <input 
                placeholder="Campaign Title" value={nt.title || ''}
                onChange={e => setNt({...nt, title: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs"
              />
              <input 
                placeholder="Target URL" value={nt.url || ''}
                onChange={e => setNt({...nt, url: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" placeholder="Gems" value={nt.reward || ''}
                  onChange={e => setNt({...nt, reward: parseInt(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs"
                />
                <input 
                  type="number" placeholder="Sec" value={nt.timer || ''}
                  onChange={e => setNt({...nt, timer: parseInt(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs"
                />
              </div>
              <button onClick={addTask} className="w-full bg-blue-600 py-4 rounded-xl font-black text-xs shadow-lg shadow-blue-600/10">PUBLISH TASK</button>
            </div>
          </div>

          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold">{t.title}</p>
                  <p className="text-[10px] text-slate-500">{t.reward} Gems • {t.timer}s</p>
                </div>
                <button onClick={() => deleteT(t.id)} className="text-red-500 text-xs">🗑️</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT: USERS */}
      {tab === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold">@{u.username}</p>
                <p className="text-[10px] text-slate-500">ID: {u.telegramId} • Bal: {u.balance}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleBan(u.id)}
                  className={`text-[10px] font-black px-3 py-1 rounded-full border ${u.isBanned ? 'bg-green-600/10 border-green-600 text-green-500' : 'bg-red-600/10 border-red-600 text-red-500'}`}
                >
                  {u.isBanned ? 'UNBAN' : 'BAN'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: WITHDRAWALS */}
      {tab === 'withdrawals' && (
        <div className="space-y-4">
          {withdrawals.filter(w => w.status === 'PENDING').map(w => (
            <div key={w.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-sm">@{w.username}</h5>
                  <p className="text-xl font-black text-blue-500">${(w.amount/100).toFixed(2)} <span className="text-xs">{w.currency}</span></p>
                </div>
              </div>
              <code className="block bg-slate-950 p-2 rounded-lg text-[10px] text-slate-500 break-all">{w.address}</code>
              <div className="flex gap-2">
                <button onClick={() => processW(w.id, 'COMPLETED')} className="flex-1 bg-green-600 py-2 rounded-xl text-[10px] font-black">APPROVE</button>
                <button onClick={() => processW(w.id, 'REJECTED')} className="flex-1 bg-red-600 py-2 rounded-xl text-[10px] font-black">REJECT</button>
              </div>
            </div>
          ))}
          {withdrawals.filter(w => w.status === 'PENDING').length === 0 && (
             <div className="text-center py-12 text-slate-500 italic text-sm">No pending requests</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
