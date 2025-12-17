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
    logManualActivity: (activity: Omit<Activity, 'id'>) => void;
    updateActivity: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentDate, setCurrentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [data, setData] = useState<TymOraData | null>(null);
    const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
    const [theme, setThemeState] = useState<Theme>(THEMES[0]);

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
    };

    useEffect(() => {
        refreshData();
    }, []);

    const currentDayLog = data?.days.find(d => d.date === currentDate);

    const startActivity = (activity: Omit<Activity, 'id'>) => {
        const newActivity: Activity = { ...activity, id: crypto.randomUUID() };
        setActiveActivity(newActivity);
    };

    const logManualActivity = (activity: Omit<Activity, 'id'>) => {
        // Prepare day log - create if doesn't exist
        let dayToSave = currentDayLog;
        if (!dayToSave) {
            dayToSave = {
                date: currentDate,
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

    const updateActivity = (updatedActivity: Activity) => {
        if (!currentDayLog) return;

        const updatedActivities = currentDayLog.activities.map(act =>
            act.id === updatedActivity.id ? updatedActivity : act
        );

        const updatedDay = { ...currentDayLog, activities: updatedActivities };
        storage.saveDay(updatedDay);
        refreshData();
    };

    const deleteActivity = (id: string) => {
        if (!currentDayLog) return;

        const updatedActivities = currentDayLog.activities.filter(act => act.id !== id);
        const updatedDay = { ...currentDayLog, activities: updatedActivities };
        storage.saveDay(updatedDay);
        refreshData();
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
            setTheme
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
