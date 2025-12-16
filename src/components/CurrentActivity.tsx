import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { Play, Square, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../types';
import clsx from 'clsx';

const CurrentActivity: React.FC = () => {
    const { activeActivity, stopActivity } = useApp();
    const [elapsed, setElapsed] = useState<string>('00:00');

    useEffect(() => {
        if (!activeActivity) return;

        const interval = setInterval(() => {
            const start = new Date();
            const [h, m] = activeActivity.start_time.split(':').map(Number);
            start.setHours(h, m, 0, 0);

            const now = new Date();
            const diff = now.getTime() - start.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            // const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setElapsed(`${hours > 0 ? hours + 'h ' : ''}${minutes}m`);
        }, 1000);

        return () => clearInterval(interval);
    }, [activeActivity]);

    if (!activeActivity) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <Clock size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">Ready to focus?</h3>
                <p className="text-slate-500 text-sm mb-6">Start tracking your activity to get insights.</p>
                <Link to="/log" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Play size={18} fill="currentColor" />
                    Start Activity
                </Link>
            </div>
        );
    }

    const category = CATEGORIES.find(c => c.id === activeActivity.category.toLowerCase()) || CATEGORIES[0];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-50 relative overflow-hidden">
            <div className={clsx("absolute top-0 left-0 w-1 h-full", category.color.replace('text-', 'bg-'))} />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={clsx("text-xs font-bold uppercase tracking-wider", category.color)}>
                        {activeActivity.category}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800 mt-1">{activeActivity.activity}</h2>
                    {activeActivity.notes && <p className="text-slate-500 text-sm mt-1">{activeActivity.notes}</p>}
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-mono font-bold">
                    {elapsed}
                </div>
            </div>

            <button
                onClick={stopActivity}
                className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
                <Square size={18} fill="currentColor" />
                Stop Activity
            </button>
        </div>
    );
};

export default CurrentActivity;
