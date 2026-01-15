
import React, { useState } from 'react';
import { MandatoryChannel } from '../types';

interface JoinGuardProps {
  channels: MandatoryChannel[];
  onComplete: () => void;
}

const JoinGuard: React.FC<JoinGuardProps> = ({ channels, onComplete }) => {
  const [joinedStates, setJoinedStates] = useState<Record<string, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);

  const toggleJoined = (id: string, url: string) => {
    window.open(url, '_blank');
    setJoinedStates(prev => ({ ...prev, [id]: true }));
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const allJoined = channels.every(c => joinedStates[c.id]);
      if (allJoined) {
        onComplete();
      } else {
        alert("Please join all mandatory channels to unlock the app!");
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 p-6 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 space-y-8 mt-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-2xl mb-6 shadow-blue-600/20">💎</div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Unlock Access</h1>
          <p className="text-slate-500 text-sm mt-2">Join these partner channels to activate your earning engine.</p>
        </div>

        <div className="space-y-3">
          {channels.map((channel, idx) => (
            <button
              key={channel.id}
              onClick={() => toggleJoined(channel.id, channel.url)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                joinedStates[channel.id] 
                  ? 'bg-green-600/10 border-green-500/50' 
                  : 'bg-slate-900 border-slate-800 active:scale-95'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                   joinedStates[channel.id] ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <span className={`font-bold ${joinedStates[channel.id] ? 'text-green-400' : 'text-slate-200'}`}>
                  {channel.name}
                </span>
              </div>
              <span className="text-blue-500 text-xs font-black uppercase tracking-widest">
                {joinedStates[channel.id] ? 'JOINED' : 'JOIN'}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isVerifying ? 'Checking Status...' : 'VERIFY MEMBERSHIP'}
        </button>
      </div>
    </div>
  );
};

export default JoinGuard;
