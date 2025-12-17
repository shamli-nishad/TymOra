import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { CATEGORIES } from '../types';
import clsx from 'clsx';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

const LogActivity: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { startActivity, stopActivity, activeActivity, logManualActivity, updateActivity, deleteActivity, currentDayLog, theme } = useApp();

    const [mode, setMode] = useState<'timer' | 'manual'>('timer');
    const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
    const [activityName, setActivityName] = useState('');
    const [notes, setNotes] = useState('');
    const [startTime, setStartTime] = useState(format(new Date(), 'HH:mm'));
    const [endTime, setEndTime] = useState(format(new Date(), 'HH:mm'));

    // Load activity data if editing
    useEffect(() => {
        if (id && currentDayLog) {
            const activityToEdit = currentDayLog.activities.find(a => a.id === id);
            if (activityToEdit) {
                setMode('manual'); // Editing is always manual style
                setSelectedCategory(CATEGORIES.find(c => c.label === activityToEdit.category)?.id || CATEGORIES[0].id);
                setActivityName(activityToEdit.activity);
                setNotes(activityToEdit.notes || '');
                setStartTime(activityToEdit.start_time);
                setEndTime(activityToEdit.end_time || format(new Date(), 'HH:mm'));
            }
        }
    }, [id, currentDayLog]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const categoryLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Other';

        if (id) {
            // Update existing
            const start = new Date();
            const [startH, startM] = startTime.split(':').map(Number);
            start.setHours(startH, startM, 0, 0);

            const end = new Date();
            const [endH, endM] = endTime.split(':').map(Number);
            end.setHours(endH, endM, 0, 0);

            let duration = (end.getTime() - start.getTime()) / 1000 / 60;
            if (duration < 0) duration += 24 * 60;

            updateActivity({
                id,
                start_time: startTime,
                end_time: endTime,
                duration_minutes: Math.round(duration),
                category: categoryLabel,
                activity: activityName || 'Untitled Activity',
                notes: notes,
                logged_via: 'manual', // Keep original? For now override or keep simple
                energy_level: 'medium',
                mood: 'focused'
            });
        } else if (mode === 'timer') {
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
            if (duration < 0) duration += 24 * 60;

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
            <h1 className="text-2xl font-bold text-slate-900 mb-6">{id ? 'Edit Activity' : 'Log Activity'}</h1>

            {!id && (
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setMode('timer')}
                        className={clsx(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'timer' ? clsx("shadow-sm text-white", theme.primary) : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Timer
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('manual')}
                        className={clsx(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                            mode === 'manual' ? clsx("shadow-sm text-white", theme.primary) : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Manual Entry
                    </button>
                </div>
            )}

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
                        className={clsx(
                            "w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-white",
                            theme.ring
                        )}
                        required
                    />
                </section>

                {(mode === 'manual' || id) && (
                    <section className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className={clsx(
                                    "w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-white",
                                    theme.ring
                                )}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className={clsx(
                                    "w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-white",
                                    theme.ring
                                )}
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
                        className={clsx(
                            "w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-white h-24 resize-none",
                            theme.ring
                        )}
                    />
                </section>

                <div className="flex gap-4">
                    {id && (
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this activity?')) {
                                    deleteActivity(id);
                                    navigate('/');
                                }
                            }}
                            className="flex-1 bg-red-50 text-red-600 py-4 rounded-xl font-bold text-lg border border-red-100 hover:bg-red-100 transition-all"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        type="submit"
                        className={clsx(
                            "flex-[2] text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all",
                            theme.primary,
                            "shadow-slate-200 hover:opacity-90"
                        )}
                    >
                        {id ? 'Update Activity' : (mode === 'timer' ? 'Start Activity' : 'Save Activity')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogActivity;
