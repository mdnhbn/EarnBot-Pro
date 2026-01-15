
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'tasks', label: 'Tasks', icon: '🎯' },
    { id: 'advertise', label: 'Ads', icon: '📣' },
    { id: 'wallet', label: 'Wallet', icon: '💰' },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin', icon: '⚙️' });
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900 border-t border-slate-800 flex justify-around py-3 px-2 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-blue-500 scale-110' : 'text-slate-400'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
