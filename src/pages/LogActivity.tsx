import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { CATEGORIES } from '../types';
import clsx from 'clsx';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

const LogActivity: React.FC = () => {
    const navigate = useNavigate();
    const { startActivity, stopActivity, activeActivity, logManualActivity } = useApp();

    const [mode, setMode] = useState<'timer' | 'manual'>('timer');
    const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
    const [activityName, setActivityName] = useState('');
    const [notes, setNotes] = useState('');
    const [startTime, setStartTime] = useState(format(new Date(), 'HH:mm'));
    const [endTime, setEndTime] = useState(format(new Date(), 'HH:mm'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const categoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Other';

        if (mode === 'timer') {
            if (activeActivity) {
                stopActivity();
            }

            startActivity({
                start_time: format(new Date(), 'HH:mm'),
                category: categoryLabel,
                activity: activityName || 'Untitled Activity',
                notes: notes,
                logged_via: 'timer',
                energy_level: 'medium',
                mood: 'focused'
            });
        } else {
            // Manual entry
            const start = new Date();
            const [startH, startM] = startTime.split(':').map(Number);
            start.setHours(startH, startM, 0, 0);

            const end = new Date();
            const [endH, endM] = endTime.split(':').map(Number);
            end.setHours(endH, endM, 0, 0);

            let duration = (end.getTime() - start.getTime()) / 1000 / 60;
            if (duration < 0) duration += 24 * 60; // Handle overnight

            logManualActivity({
                start_time: startTime,
                end_time: endTime,
                duration_minutes: Math.round(duration),
                category: categoryLabel,
                activity: activityName || 'Untitled Activity',
                notes: notes,
                logged_via: 'manual',
                energy_level: 'medium',
                mood: 'focused'
            });
        }

        navigate('/');
    };

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Log Activity</h1>

            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setMode('timer')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        mode === 'timer' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Timer
                </button>
                <button
                    type="button"
                    onClick={() => setMode('manual')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        mode === 'manual' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Manual Entry
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Category</label>
                    <div className="grid grid-cols-3 gap-3">
                        {CATEGORIES.map((cat) => {
                            const IconName = cat.icon as keyof typeof Icons;
                            const Icon = Icons[IconName] as React.ElementType;
                            const isSelected = selectedCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={clsx(
                                        "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                                        isSelected
                                            ? `border-${cat.color.split('-')[1]}-500 bg-${cat.color.split('-')[1]}-50 ring-2 ring-${cat.color.split('-')[1]}-200`
                                            : "border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={clsx("mb-2", isSelected ? cat.color : "text-slate-400")}>
                                        {Icon && <Icon size={24} />}
                                    </div>
                                    <span className={clsx("text-xs font-medium", isSelected ? "text-slate-900" : "text-slate-500")}>
                                        {cat.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Activity Name</label>
                    <input
                        type="text"
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        placeholder="What are you doing?"
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                    />
                </section>

                {mode === 'manual' && (
                    <section className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                required
                            />
                        </div>
                    </section>
                )}

                <section>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add details..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-24 resize-none"
                    />
                </section>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                    {mode === 'timer' ? 'Start Activity' : 'Save Activity'}
                </button>
            </form>
        </div>
    );
};

export default LogActivity;
