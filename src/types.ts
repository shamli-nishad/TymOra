export interface Activity {
    start_time: string; // HH:mm
    end_time?: string; // HH:mm, optional if currently running
    duration_minutes?: number;
    category: string;
    sub_category?: string;
    activity: string;
    tags?: string[];
    energy_level?: 'low' | 'medium' | 'high';
    mood?: string;
    logged_via?: 'manual' | 'timer';
    notes?: string;
}

export interface DayLog {
    date: string; // YYYY-MM-DD
    day_start_time?: string;
    activities: Activity[];
}

export interface TymOraData {
    timezone: string;
    days: DayLog[];
}

export const CATEGORIES = [
    { id: 'work', label: 'Work', icon: 'Briefcase', color: 'text-blue-500' },
    { id: 'personal', label: 'Personal', icon: 'User', color: 'text-green-500' },
    { id: 'home', label: 'Home', icon: 'Home', color: 'text-orange-500' },
    { id: 'learning', label: 'Learning', icon: 'BookOpen', color: 'text-purple-500' },
    { id: 'kids', label: 'Kids', icon: 'Baby', color: 'text-pink-500' },
    { id: 'health', label: 'Health', icon: 'Activity', color: 'text-red-500' },
] as const;
