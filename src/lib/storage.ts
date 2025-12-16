import type { TymOraData, DayLog } from '../types';
import sampleData from '../../sample-data.json';

const STORAGE_KEY = 'tymora_data';

export const storage = {
    getData: (): TymOraData => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            // Seed with sample data if empty
            const initialData = sampleData as unknown as TymOraData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
        }
        return JSON.parse(data);
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
    }
};
