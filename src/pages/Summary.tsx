import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORIES } from '../types';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

const Summary: React.FC = () => {
    const { currentDayLog, data, theme } = useApp();
    const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');

    const getChartData = (activities: any[]) => {
        const agg: Record<string, number> = {};
        activities.forEach(act => {
            const duration = act.duration_minutes || 0;
            agg[act.category] = (agg[act.category] || 0) + duration;
        });

        return Object.entries(agg).map(([name, value]) => {
            const cat = CATEGORIES.find(c => c.label === name);
            let color = '#94a3b8';
            if (cat) {
                if (cat.color.includes('blue')) color = '#3b82f6';
                if (cat.color.includes('green')) color = '#22c55e';
                if (cat.color.includes('orange')) color = '#f97316';
                if (cat.color.includes('purple')) color = '#a855f7';
                if (cat.color.includes('pink')) color = '#ec4899';
                if (cat.color.includes('red')) color = '#ef4444';
                if (cat.color.includes('slate')) color = '#64748b';
            }
            return { name, value, color };
        });
    };

    const chartData = useMemo(() => {
        if (activeTab === 'today') {
            return currentDayLog ? getChartData(currentDayLog.activities) : [];
        } else {
            if (!data || !data.days) return [];
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            const retentionDays = data.historyRetentionDays || 2;
            const cutoffDate = format(subDays(new Date(), retentionDays), 'yyyy-MM-dd');

            // Filter out today and strictly respect retention date cutoff
            const historyDays = data.days
                .filter(d => d.date !== todayStr && d.date >= cutoffDate)
                .sort((a, b) => b.date.localeCompare(a.date));

            const allActivities = historyDays.flatMap(d => d.activities);
            return getChartData(allActivities);
        }
    }, [activeTab, currentDayLog, data]);

    const totalMinutes = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0);
    }, [chartData]);

    const timelineActivities = useMemo(() => {
        if (activeTab === 'today') {
            return currentDayLog ? currentDayLog.activities : [];
        } else {
            if (!data || !data.days) return [];
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            const retentionDays = data.historyRetentionDays || 2;
            const cutoffDate = format(subDays(new Date(), retentionDays), 'yyyy-MM-dd');

            // Filter out today and strictly respect retention date cutoff
            const historyDays = data.days
                .filter(d => d.date !== todayStr && d.date >= cutoffDate)
                .sort((a, b) => b.date.localeCompare(a.date));

            return historyDays
                .flatMap(d => d.activities.map(a => ({ ...a, date: d.date })))
                .sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.start_time}`);
                    const dateB = new Date(`${b.date}T${b.start_time}`);
                    return dateB.getTime() - dateA.getTime();
                });
        }
    }, [activeTab, currentDayLog, data]);

    if (!data) return null;

    return (
        <div className="p-6 space-y-8">

            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('today')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'today' ? clsx("shadow-sm text-white", theme.primary) : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Today
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'history' ? clsx("shadow-sm text-white", theme.primary) : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    History ({data.historyRetentionDays || 2} Days)
                </button>
            </div>

            {chartData.length === 0 ? (
                <div className="p-6 text-center text-slate-400 mt-10">
                    No data available for this view.
                </div>
            ) : (
                <>
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                            {activeTab === 'today' ? 'Today\'s Distribution' : 'History Distribution'}
                        </h3>
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
                        <h3 className="text-lg font-bold text-slate-800 mb-4">
                            {activeTab === 'today' ? 'Timeline' : 'Activity Log'}
                        </h3>
                        <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
                            {timelineActivities.map((act, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className={clsx("absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                                        CATEGORIES.find(c => c.label === act.category)?.color.replace('text-', 'bg-') || 'bg-slate-400'
                                    )} />
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-400 uppercase">
                                                    {(act as any).date ? `${(act as any).date} ` : ''}{act.start_time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {act.duration_minutes}m
                                                </span>
                                                <Link to={`/edit/${act.id}`} className={clsx("p-1 text-slate-400 hover:opacity-80", theme.text)}>
                                                    <Edit2 size={14} />
                                                </Link>
                                            </div>
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
                </>
            )}
        </div>
    );
};

export default Summary;
