
import React, { useState } from 'react';
import { User, TaskType } from '../types';

interface AdPortalProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const AdPortal: React.FC<AdPortalProps> = ({ user, onUpdateUser }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<TaskType>(TaskType.YOUTUBE);
  const [budget, setBudget] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user.balance < budget) {
      alert("Insufficient balance!");
      return;
    }

    if (!title || !url) {
      alert("Please fill all fields");
      return;
    }

    // Simulate ad submission
    onUpdateUser({ balance: user.balance - budget });
    setTitle('');
    setUrl('');
    alert("Ad submitted for review! It will appear once approved by admin.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-2">Create Advertisement</h2>
        <p className="text-slate-400 text-sm mb-6">Drive traffic to your channels or videos using your Gems.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Platform</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
            >
              <option value={TaskType.YOUTUBE}>YouTube Video</option>
              <option value={TaskType.FACEBOOK}>Facebook Post</option>
              <option value={TaskType.DAILYMOTION}>Dailymotion</option>
              <option value={TaskType.ADSTERRA}>Direct Link (High Priority)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Task Title</label>
            <input 
              type="text"
              placeholder="e.g. Subscribe to my channel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target URL</label>
            <input 
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Budget (Gems)</label>
            <div className="flex gap-4">
              {[100, 500, 1000, 5000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudget(val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                    budget === val ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Cost: 10 Gems per view. Budget: {budget / 10} guaranteed views.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Launch Campaign
          </button>
        </form>
      </div>

      <div className="bg-slate-900/50 border border-dashed border-slate-800 p-6 rounded-2xl text-center">
        <h3 className="font-bold text-sm mb-1">Recent Performance</h3>
        <p className="text-slate-500 text-xs">You have no active ad campaigns.</p>
      </div>
    </div>
  );
};

export default AdPortal;
