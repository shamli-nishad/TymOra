import React from 'react';
import { useApp } from '../context/AppProvider';
import { CATEGORIES } from '../types';
import clsx from 'clsx';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentActivityList: React.FC = () => {
    const { currentDayLog } = useApp();

    if (!currentDayLog || currentDayLog.activities.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-400 text-sm">No activities logged yet today.</p>
            </div>
        );
    }

    // Show last 5 activities, reversed
    const recent = [...currentDayLog.activities].reverse().slice(0, 5);

    return (
        <div className="space-y-3">
            {recent.map((act, idx) => {
                const category = CATEGORIES.find(c => c.id === act.category.toLowerCase()) || CATEGORIES[0];
                // Dynamic icon rendering
                const IconName = category.icon as keyof typeof Icons;
                const Icon = Icons[IconName] as React.ElementType;

                return (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className={clsx("p-2 rounded-lg bg-opacity-10", category.color.replace('text-', 'bg-'))}>
                            {Icon && <Icon size={20} className={category.color} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate">{act.activity}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span>{act.start_time} - {act.end_time}</span>
                                <span>•</span>
                                <span>{act.duration_minutes}m</span>
                            </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                            {act.mood && <span className="text-lg">{moodEmoji(act.mood)}</span>}
                            <Link to={`/edit/${act.id}`} className="p-1 text-slate-400 hover:text-blue-600">
                                <Icons.Edit2 size={14} />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const moodEmoji = (mood: string) => {
    switch (mood) {
        case 'focused': return '🧠';
        case 'calm': return '😌';
        case 'busy': return '⚡';
        case 'tired': return '😴';
        case 'happy': return '😊';
        default: return '😐';
    }
};

export default RecentActivityList;
