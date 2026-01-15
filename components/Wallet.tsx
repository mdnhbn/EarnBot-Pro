
import React, { useState } from 'react';
import { User, Withdrawal, GlobalSettings } from '../types';

interface WalletProps {
  user: User;
  settings: GlobalSettings;
  withdrawals: Withdrawal[];
  setWithdrawals: (w: Withdrawal[]) => void;
  onUpdateUser: (updates: Partial<User>) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, settings, withdrawals, setWithdrawals, onUpdateUser }) => {
  const [amount, setAmount] = useState<number>(0);
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState<'USDT' | 'TRX'>('USDT');

  const min = currency === 'USDT' ? settings.minWithdrawalUSDT : settings.minWithdrawalTRX;

  const handleWithdraw = () => {
    if (user.balance < amount) return alert("Insufficient Gems!");
    if (amount < min) return alert(`Minimum is ${min} Gems`);
    if (!address) return alert("Enter wallet address");

    const newW: Withdrawal = {
      id: 'w' + Date.now(),
      userId: user.id,
      username: user.username,
      amount: amount,
      currency: currency,
      address: address,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWithdrawals([...withdrawals, newW]);
    onUpdateUser({ balance: user.balance - amount });
    setAmount(0);
    setAddress('');
    alert("Withdrawal submitted! Admin will verify soon.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center shadow-xl">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Available Balance</p>
        <h2 className="text-5xl font-black text-white mb-8 tracking-tighter">
          <span className="text-yellow-400">💎</span> {user.balance.toLocaleString()}
        </h2>

        <div className="flex gap-2 mb-6">
          {(['USDT', 'TRX'] as const).map(c => (
            <button 
              key={c} onClick={() => setCurrency(c)}
              className={`flex-1 py-3 rounded-2xl font-black text-xs border transition-all ${
                currency === c ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              {c} (TRC20)
            </button>
          ))}
        </div>

        <div className="space-y-4 text-left">
          <input 
            type="number" placeholder={`Amount (Min: ${min})`}
            value={amount || ''} onChange={e => setAmount(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500"
          />
          <input 
            placeholder="Wallet Address"
            value={address} onChange={e => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500"
          />
          <button 
            onClick={handleWithdraw}
            className="w-full bg-blue-600 py-5 rounded-2xl font-black text-sm shadow-xl active:scale-95"
          >
            WITHDRAW NOW
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Withdrawal Log</h3>
        {withdrawals.filter(w => w.userId === user.id).map(w => (
           <div key={w.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
             <div>
               <p className="text-sm font-bold">{w.amount} Gems → {w.currency}</p>
               <p className="text-[10px] text-slate-500">{w.status} • {w.createdAt}</p>
             </div>
             <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${w.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}`}>
               {w.status}
             </span>
           </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
