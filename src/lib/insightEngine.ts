import type { DayLog } from '../types';
import { parse, isAfter } from 'date-fns';


export interface Insight {
    id: string;
    category: 'Time Allocation' | 'Context Switching' | 'Energy' | 'Untracked';
    title: string;
    description: string;
    type: 'info' | 'warning' | 'positive';
}

export const generateInsights = (day: DayLog): Insight[] => {
    const insights: Insight[] = [];
    const activities = day.activities;

    if (!activities || activities.length === 0) return insights;

    // Calculate total tracked time and category breakdown
    let totalMinutes = 0;
    const categoryMinutes: Record<string, number> = {};

    activities.forEach(act => {
        const duration = act.duration_minutes || 0;
        totalMinutes += duration;
        categoryMinutes[act.category] = (categoryMinutes[act.category] || 0) + duration;
    });

    // Rule 1: Category Dominance (> 40%)
    Object.entries(categoryMinutes).forEach(([cat, minutes]) => {
        const percentage = (minutes / totalMinutes) * 100;
        if (percentage > 40) {
            insights.push({
                id: `dominance-${cat}`,
                category: 'Time Allocation',
                title: `${cat} Dominated Your Day`,
                description: `${cat} activities took up ${Math.round(percentage)}% of your tracked time. Consider balancing if this wasn't intended.`,
                type: 'info'
            });
        }
    });

    // Rule 2: Missing Priority Time (Learning or Health < 30m)
    const learningTime = categoryMinutes['Learning'] || 0;
    const healthTime = categoryMinutes['Health'] || 0;

    if (learningTime < 30 && healthTime < 30) {
        insights.push({
            id: 'missing-priority',
            category: 'Time Allocation',
            title: 'Missing Priority Time',
            description: 'You spent less than 30 minutes on Learning or Health today. Even 15 minutes can help maintain consistency.',
            type: 'warning'
        });
    }

    // Rule 3: Frequent Switching (> 12 activities)
    if (activities.length > 12) {
        insights.push({
            id: 'context-switching',
            category: 'Context Switching',
            title: 'High Context Switching',
            description: `You logged ${activities.length} activities today. Grouping similar tasks might improve focus.`,
            type: 'warning'
        });
    }

    // Rule 4: Late High-Effort Tasks (> 8 PM)
    const lateHighEffort = activities.some(act => {
        if (act.energy_level !== 'high') return false;
        // Parse start time. Assuming HH:mm format.
        const startTime = parse(act.start_time, 'HH:mm', new Date());
        const cutoff = parse('20:00', 'HH:mm', new Date());
        return isAfter(startTime, cutoff);
    });

    if (lateHighEffort) {
        insights.push({
            id: 'late-effort',
            category: 'Energy',
            title: 'Late High-Effort Tasks',
            description: 'You handled demanding tasks after 8 PM. This might affect your rest quality.',
            type: 'warning'
        });
    }

    // Rule 5: Untracked Time (Simplified: Total day assumed 16h active = 960m. If tracked < 800m?)
    // Or better, check gaps between activities. For MVP, let's just check total tracked vs expected active day (e.g. 12h = 720m)
    if (totalMinutes < 600) { // Less than 10 hours tracked
        insights.push({
            id: 'untracked-time',
            category: 'Untracked',
            title: 'Significant Untracked Time',
            description: `You only tracked ${Math.floor(totalMinutes / 60)} hours today. Logging gaps can reveal hidden time sinks.`,
            type: 'info'
        });
    }

    return insights.slice(0, 5); // Limit to 5
};
