
import React from 'react';
import { User, GlobalSettings } from '../types';
import { LEVEL_REQUIREMENTS } from '../constants';

interface DashboardProps {
  user: User;
  settings: GlobalSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ user, settings }) => {
  const nextLevelXp = LEVEL_REQUIREMENTS(user.level, settings.levelRequirements);
  const progress = (user.xp / nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-200 text-xs font-black uppercase tracking-widest opacity-70">Authenticated</p>
              <h2 className="text-3xl font-black tracking-tighter">@{user.username}</h2>
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20">
              <span className="font-black text-xs uppercase">Level {user.level}</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-blue-100 text-xs mb-2 opacity-80 uppercase font-bold">Total Gems</p>
            <h3 className="text-5xl font-black flex items-center gap-3 tracking-tighter">
              <span className="text-yellow-400">💎</span> {user.balance.toLocaleString()}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-200">
              <span>XP Advancement</span>
              <span>{user.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-white/5 p-1">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem]">
          <span className="text-3xl block mb-2">🎯</span>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Active Jobs</p>
          <p className="text-2xl font-black">128</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem]">
          <span className="text-3xl block mb-2">🚀</span>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Multiplier</p>
          <p className="text-2xl font-black">x1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
