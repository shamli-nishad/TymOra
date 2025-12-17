export interface Activity {
    id: string;
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
    { id: 'health', label: 'Health', icon: 'Activity', color: 'text-red-500' },
    { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: 'text-slate-500' },
] as const;

export interface Theme {
    id: string;
    label: string;
    primary: string;
    secondary: string;
    text: string;
    ring: string;
}

export const THEMES: Theme[] = [
    { id: 'blue', label: 'Ocean', primary: 'bg-blue-600', secondary: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-500' },
    { id: 'violet', label: 'Royal', primary: 'bg-violet-600', secondary: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-500' },
    { id: 'emerald', label: 'Nature', primary: 'bg-emerald-600', secondary: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-500' },
    { id: 'rose', label: 'Passion', primary: 'bg-rose-600', secondary: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-500' },
    // { id: 'amber', label: 'Sunset', primary: 'bg-amber-600', secondary: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-500' }, //replace with a pinkish color
    { id: 'pink', label: 'Sunset', primary: 'bg-pink-600', secondary: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-500' },
];
