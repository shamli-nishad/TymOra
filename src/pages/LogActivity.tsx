import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { CATEGORIES } from '../types';
import clsx from 'clsx';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

const LogActivity: React.FC = () => {
    const navigate = useNavigate();
    const { startActivity, stopActivity, activeActivity } = useApp();

    const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);
    const [activityName, setActivityName] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (activeActivity) {
            stopActivity();
        }

        startActivity({
            start_time: format(new Date(), 'HH:mm'),
            category: CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Other',
            activity: activityName || 'Untitled Activity',
            notes: notes,
            logged_via: 'timer',
            energy_level: 'medium', // Default
            mood: 'focused' // Default
        });

        navigate('/');
    };

    return (
        <div className="p-6 pb-24">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Log Activity</h1>

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
                    Start Activity
                </button>
            </form>
        </div>
    );
};

export default LogActivity;
