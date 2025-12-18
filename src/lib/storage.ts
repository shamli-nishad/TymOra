import type { TymOraData, DayLog } from '../types';
import sampleData from '../../sample-data.json';
import { subDays, format } from 'date-fns';

const STORAGE_KEY = 'tymora_data';

export const storage = {
    getData: (): TymOraData => {
        const dataStr = localStorage.getItem(STORAGE_KEY);
        if (!dataStr) {
            // Seed with sample data if empty
            const initialData = sampleData as unknown as TymOraData;
            initialData.historyRetentionDays = 2; // Default
            // Ensure sample data has IDs
            initialData.days.forEach(day => {
                day.activities.forEach(act => {
                    if (!act.id) act.id = crypto.randomUUID();
                });
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
        }

        const data = JSON.parse(dataStr) as TymOraData;

        // Migration: Ensure historyRetentionDays exists
        if (typeof data.historyRetentionDays === 'undefined') {
            data.historyRetentionDays = 2;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        // Migration: Ensure all activities have IDs
        let hasChanges = false;
        data.days.forEach(day => {
            day.activities.forEach(act => {
                if (!act.id) {
                    act.id = crypto.randomUUID();
                    hasChanges = true;
                }
            });
        });

        if (hasChanges) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        return data;
    },

    saveData: (data: TymOraData) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    getDay: (date: string): DayLog | undefined => {
        const data = storage.getData();
        return data.days.find((d) => d.date === date);
    },

    saveDay: (day: DayLog) => {
        const data = storage.getData();
        const index = data.days.findIndex((d) => d.date === day.date);
        if (index >= 0) {
            data.days[index] = day;
        } else {
            data.days.push(day);
        }
        storage.saveData(data);
    },

    cleanupOldData: () => {
        const data = storage.getData();
        const retentionDays = data.historyRetentionDays || 2;
        // Keep today + last X days. So if retention is 2, we keep today, yesterday, and day before yesterday?
        // User said "one for the last two days".
        // Let's interpret "Last X Days" as X days of history + today.
        // Or maybe strictly X days including today?
        // "One for the current day summary, and one for the last two days." -> Today + 2 previous days.
        // "Make the number of days, in this case two configurable... maximum number of days being 7"
        // So we keep Today + N days.

        const cutoffDate = subDays(new Date(), retentionDays);
        const cutoffDateStr = format(cutoffDate, 'yyyy-MM-dd');

        // Filter: keep days where date > cutoffDateStr (roughly)
        // Actually, if retention is 2, we want Today (0), Yesterday (-1), DayBefore (-2).
        // So anything strictly before Today - 2 should be deleted.
        // date >= cutoffDateStr should work if cutoffDate is Today - 2.

        const filteredDays = data.days.filter(day => day.date >= cutoffDateStr);

        if (filteredDays.length !== data.days.length) {
            data.days = filteredDays;
            storage.saveData(data);
            console.log(`Cleaned up data. Kept days since ${cutoffDateStr}`);
        }
    }
};
