import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TymOraData, DayLog, Activity, Theme } from '../types';
import { THEMES } from '../types';
import { storage } from '../lib/storage';
import { format } from 'date-fns';

interface AppContextType {
    currentDate: string;
    setCurrentDate: (date: string) => void;
    currentDayLog: DayLog | undefined;
    refreshData: () => void;
    activeActivity: Activity | null;
    startActivity: (activity: Omit<Activity, 'id'>) => void;
    stopActivity: () => void;
    logManualActivity: (activity: Omit<Activity, 'id'>, date?: string) => void;
    updateActivity: (activity: Activity, date?: string) => void;
    deleteActivity: (id: string) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    historyRetentionDays: number;
    setHistoryRetentionDays: (days: number) => void;
    data: TymOraData | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [data, setData] = useState<TymOraData | null>(null);
    const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
    const [theme, setThemeState] = useState<Theme>(THEMES[0]);
    const [historyRetentionDays, setHistoryRetentionDaysState] = useState<number>(2);

    // Load theme from local storage
    useEffect(() => {
        const savedThemeId = localStorage.getItem('tymora_theme');
        if (savedThemeId) {
            const foundTheme = THEMES.find(t => t.id === savedThemeId);
            if (foundTheme) setThemeState(foundTheme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('tymora_theme', newTheme.id);
    };

    const refreshData = () => {
        const loadedData = storage.getData();
        setData(loadedData);
        setHistoryRetentionDaysState(loadedData.historyRetentionDays || 2);
    };

    const setHistoryRetentionDays = (days: number) => {
        const newData = storage.getData();
        newData.historyRetentionDays = days;
        storage.saveData(newData);
        setHistoryRetentionDaysState(days);

        // Trigger cleanup immediately when setting changes
        storage.cleanupOldData();
        refreshData();
    };

    useEffect(() => {
        storage.cleanupOldData();
        refreshData();
    }, []);

    const currentDayLog = data?.days.find(d => d.date === currentDate);

    const startActivity = (activity: Omit<Activity, 'id'>) => {
        const newActivity: Activity = { ...activity, id: crypto.randomUUID() };
        setActiveActivity(newActivity);
    };

    const logManualActivity = (activity: Omit<Activity, 'id'>, date?: string) => {
        const targetDate = date || currentDate;

        // Get fresh data to ensure we have the latest state
        const currentData = storage.getData();
        let dayToSave = currentData.days.find(d => d.date === targetDate);

        if (!dayToSave) {
            dayToSave = {
                date: targetDate,
                day_start_time: activity.start_time,
                activities: []
            };
        }

        const newActivity: Activity = { ...activity, id: crypto.randomUUID() };

        // Save to storage
        const updatedDay = { ...dayToSave, activities: [...dayToSave.activities, newActivity] };
        storage.saveDay(updatedDay);
        refreshData();
    };

    const updateActivity = (updatedActivity: Activity, newDate?: string) => {
        const currentData = storage.getData();

        // Find the activity's current location
        let originalDayIndex = -1;
        let originalActivityIndex = -1;

        for (let i = 0; i < currentData.days.length; i++) {
            const idx = currentData.days[i].activities.findIndex(a => a.id === updatedActivity.id);
            if (idx !== -1) {
                originalDayIndex = i;
                originalActivityIndex = idx;
                break;
            }
        }

        if (originalDayIndex === -1) return; // Activity not found

        const originalDay = currentData.days[originalDayIndex];
        const targetDate = newDate || originalDay.date;

        if (targetDate === originalDay.date) {
            // Same day update
            originalDay.activities[originalActivityIndex] = updatedActivity;
            storage.saveDay(originalDay);
        } else {
            // Move to different day
            // 1. Remove from old day
            originalDay.activities.splice(originalActivityIndex, 1);
            storage.saveDay(originalDay);

            // 2. Add to new day
            let targetDay = currentData.days.find(d => d.date === targetDate);
            if (!targetDay) {
                targetDay = {
                    date: targetDate,
                    day_start_time: updatedActivity.start_time,
                    activities: []
                };
                // We need to push this new day to data if we want to save it via saveDay properly 
                // but saveDay handles "push if not exists" logic internally if we pass the object.
            }

            // We need to be careful not to mutate the 'targetDay' reference if it came from 'currentData' 
            // without cloning if we were using React state, but here we are modifying the object 
            // and passing it to storage.saveDay which re-reads or updates.
            // Actually storage.saveDay reads fresh data. Let's use storage.saveDay logic.

            const updatedTargetDay = {
                ...targetDay,
                activities: [...targetDay.activities, updatedActivity]
            };
            storage.saveDay(updatedTargetDay);
        }

        refreshData();
    };

    const deleteActivity = (id: string) => {
        const currentData = storage.getData();

        // Find and remove
        for (const day of currentData.days) {
            const idx = day.activities.findIndex(a => a.id === id);
            if (idx !== -1) {
                day.activities.splice(idx, 1);
                storage.saveDay(day);
                refreshData();
                return;
            }
        }
    };

    const stopActivity = () => {
        if (!activeActivity) return;

        // Calculate duration
        const now = new Date();
        const endTime = format(now, 'HH:mm');
        // Simple duration calc (assuming same day for MVP)
        // In real app, handle date crossing
        const start = parseTime(activeActivity.start_time);
        const end = parseTime(endTime);
        const duration = (end.getTime() - start.getTime()) / 1000 / 60;

        const completedActivity: Activity = {
            ...activeActivity,
            end_time: endTime,
            duration_minutes: Math.round(duration)
        };

        // Prepare day log - create if doesn't exist
        let dayToSave = currentDayLog;
        if (!dayToSave) {
            dayToSave = {
                date: currentDate,
                day_start_time: activeActivity.start_time,
                activities: []
            };
        }

        // Save to storage
        const updatedDay = { ...dayToSave, activities: [...dayToSave.activities, completedActivity] };
        storage.saveDay(updatedDay);

        setActiveActivity(null);
        refreshData();
    };

    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    return (
        <AppContext.Provider value={{
            currentDate,
            setCurrentDate,
            currentDayLog,
            refreshData,
            activeActivity,
            startActivity,
            stopActivity,
            logManualActivity,
            updateActivity,
            deleteActivity,
            theme,
            setTheme,
            historyRetentionDays,
            setHistoryRetentionDays,
            data
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
