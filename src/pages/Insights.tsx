import React, { useMemo } from 'react';
import { useApp } from '../context/AppProvider';
import { generateInsights } from '../lib/insightEngine';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import clsx from 'clsx';

const Insights: React.FC = () => {
    const { currentDayLog } = useApp();

    const insights = useMemo(() => {
        if (!currentDayLog) return [];
        return generateInsights(currentDayLog);
    }, [currentDayLog]);

    if (!currentDayLog || insights.length === 0) {
        return (
            <div className="p-6 text-center mt-10">
                <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
                    <Lightbulb size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No insights yet</h3>
                <p className="text-slate-500 text-sm mt-2">
                    Keep tracking your activities. Insights will appear here as we learn your patterns.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-slate-900">Daily Insights</h1>
                <p className="text-slate-500">AI-driven observations for today</p>
            </header>

            <div className="space-y-4">
                {insights.map((insight) => {
                    let Icon = Info;
                    let colorClass = 'bg-blue-50 text-blue-700 border-blue-100';

                    if (insight.type === 'warning') {
                        Icon = AlertTriangle;
                        colorClass = 'bg-amber-50 text-amber-700 border-amber-100';
                    } else if (insight.type === 'positive') {
                        Icon = CheckCircle;
                        colorClass = 'bg-green-50 text-green-700 border-green-100';
                    }

                    return (
                        <div key={insight.id} className={clsx("p-5 rounded-2xl border flex gap-4", colorClass)}>
                            <div className="shrink-0">
                                <Icon size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1 block">
                                    {insight.category}
                                </span>
                                <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Insights;
