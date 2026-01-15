
import React, { useState, useEffect } from 'react';
import { User, Task, TaskType } from '../types';

interface TaskEngineProps {
  user: User;
  tasks: Task[];
  onUpdateUser: (updates: Partial<User>) => void;
}

const TaskEngine: React.FC<TaskEngineProps> = ({ user, tasks, onUpdateUser }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);

  // Filter out claimed tasks and the user's own tasks
  const filteredTasks = tasks.filter(task => 
    task.creatorId !== user.id && 
    !claimedTasks.includes(task.id) && 
    task.approved
  );

  useEffect(() => {
    let timerId: any;
    if (activeTask && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (activeTask && timeLeft === 0) {
      setIsCompleted(true);
    }
    return () => clearInterval(timerId);
  }, [activeTask, timeLeft]);

  const startTask = (task: Task) => {
    window.open(task.url, '_blank');
    setActiveTask(task);
    setTimeLeft(task.timer);
    setIsCompleted(false);
  };

  const claimReward = () => {
    if (!activeTask || !isCompleted) return;

    onUpdateUser({
      balance: user.balance + activeTask.reward,
      xp: user.xp + (activeTask.reward / 2),
    });

    setClaimedTasks(prev => [...prev, activeTask.id]);
    setActiveTask(null);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Earn Gems</h2>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-black uppercase border border-blue-500/30 tracking-tight">
          {filteredTasks.length} Live Campaigns
        </span>
      </div>

      {activeTask && (
        <div className="bg-slate-900 border-2 border-blue-600/50 p-8 rounded-3xl text-center space-y-4 shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 duration-300">
          <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl">⏳</div>
          <h3 className="font-black text-xl tracking-tight">Verifying Stay...</h3>
          <div className="text-6xl font-black text-blue-500 tracking-tighter">{timeLeft}s</div>
          <p className="text-slate-500 text-xs">Stay on the target page. Closing early voids reward.</p>
          {isCompleted && (
            <button
              onClick={claimReward}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 animate-bounce mt-4"
            >
              Collect {activeTask.reward} Gems
            </button>
          )}
        </div>
      )}

      <div className="grid gap-3">
        {filteredTasks.map(task => (
          <div 
            key={task.id}
            className="bg-slate-900 border border-slate-800/50 p-4 rounded-2xl flex items-center justify-between hover:border-slate-700 hover:bg-slate-800/30 transition-all shadow-sm"
          >
            <div className="flex gap-4 items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                task.type === TaskType.YOUTUBE ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                task.type === TaskType.FACEBOOK ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' :
                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {task.type === TaskType.YOUTUBE ? '▶️' : task.type === TaskType.FACEBOOK ? '👥' : '🔗'}
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight text-slate-100">{task.title}</h4>
                <div className="flex gap-3 items-center mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-bold">⏱️ {task.timer}s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-yellow-500 font-black">💎 {task.reward}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              disabled={!!activeTask}
              onClick={() => startTask(task)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-30 shadow-lg shadow-blue-500/10"
            >
              START
            </button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-40">🌙</div>
            <h3 className="text-lg font-bold text-slate-400">All tasks completed</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-[200px] mx-auto">We're loading more campaigns soon. Check back in a few hours!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskEngine;
