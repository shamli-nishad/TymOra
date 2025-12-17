import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart2, Lightbulb, Settings } from 'lucide-react';
import clsx from 'clsx';

import { useApp } from '../context/AppProvider';
import { format } from 'date-fns';

const Layout: React.FC = () => {
    const { currentDate, theme } = useApp();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
            <header className="bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-40">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">TymOra</h1>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                        {format(new Date(currentDate), 'EEE, MMM do')}
                    </p>
                </div>
                <p className="text-slate-400 text-xs mt-1">Track your activities for <span className={clsx("underline font-medium", theme.text)}>the day</span>, analyze habits, and master your time.</p>
            </header>

            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
                <NavLink to="/" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? theme.text : "text-slate-400 hover:text-slate-600")}>
                    <Home size={24} />
                    <span className="text-xs font-medium">Home</span>
                </NavLink>

                <NavLink to="/summary" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? theme.text : "text-slate-400 hover:text-slate-600")}>
                    <BarChart2 size={24} />
                    <span className="text-xs font-medium">Summary</span>
                </NavLink>

                <NavLink to="/log" className="flex flex-col items-center -mt-8">
                    <div className={clsx("text-white p-3 rounded-full shadow-lg transition-colors", theme.primary)}>
                        <PlusCircle size={32} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 mt-1">Log</span>
                </NavLink>

                <NavLink to="/insights" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? theme.text : "text-slate-400 hover:text-slate-600")}>
                    <Lightbulb size={24} />
                    <span className="text-xs font-medium">Insights</span>
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => clsx("flex flex-col items-center gap-1 transition-colors", isActive ? theme.text : "text-slate-400 hover:text-slate-600")}>
                    <Settings size={24} />
                    <span className="text-xs font-medium">Settings</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default Layout;
