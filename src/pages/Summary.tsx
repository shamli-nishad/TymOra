import React, { useMemo } from 'react';
import { useApp } from '../context/AppProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORIES } from '../types';
import clsx from 'clsx';

const Summary: React.FC = () => {
    const { currentDayLog } = useApp();

    const chartData = useMemo(() => {
        if (!currentDayLog) return [];

        const data: Record<string, number> = {};
        currentDayLog.activities.forEach(act => {
            const duration = act.duration_minutes || 0;
            data[act.category] = (data[act.category] || 0) + duration;
        });

        return Object.entries(data).map(([name, value]) => {
            const cat = CATEGORIES.find(c => c.label === name);
            // Map tailwind text colors to hex for Recharts
            let color = '#94a3b8'; // default slate-400
            if (cat) {
                if (cat.color.includes('blue')) color = '#3b82f6';
                if (cat.color.includes('green')) color = '#22c55e';
                if (cat.color.includes('orange')) color = '#f97316';
                if (cat.color.includes('purple')) color = '#a855f7';
                if (cat.color.includes('pink')) color = '#ec4899';
                if (cat.color.includes('red')) color = '#ef4444';
            }
            return { name, value, color };
        });
    }, [currentDayLog]);

    const totalMinutes = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0);
    }, [chartData]);

    const totalHours = (totalMinutes / 60).toFixed(1);

    if (!currentDayLog || currentDayLog.activities.length === 0) {
        return (
            <div className="p-6 text-center text-slate-400 mt-10">
                No data for today yet.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Daily Summary</h1>
                <p className="text-slate-500">You tracked <span className="font-bold text-slate-800">{totalHours}h</span> today</p>
            </header>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Time Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {chartData.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-600">{entry.name}</span>
                            <span className="text-slate-400 ml-auto">{Math.round((entry.value / totalMinutes) * 100)}%</span>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Timeline</h3>
                <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                    {currentDayLog.activities.map((act, idx) => (
                        <div key={idx} className="relative pl-6">
                            <div className={clsx("absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                                CATEGORIES.find(c => c.label === act.category)?.color.replace('text-', 'bg-') || 'bg-slate-400'
                            )} />
                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{act.start_time}</span>
                                    <span className="text-xs font-medium text-slate-400">{act.duration_minutes}m</span>
                                </div>
                                <h4 className="font-medium text-slate-800 mt-1">{act.activity}</h4>
                                <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md mt-2 inline-block">
                                    {act.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Summary;
