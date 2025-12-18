import React, { useRef } from 'react';
import { Download, Trash2, User, Upload } from 'lucide-react';
import { storage } from '../lib/storage';
import { useApp } from '../context/AppProvider';
import { THEMES } from '../types';
import { APP_VERSION } from '../config/version';
import clsx from 'clsx';

const Settings: React.FC = () => {
    const { refreshData, theme, setTheme, historyRetentionDays, setHistoryRetentionDays } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = storage.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tymora-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = e.target?.result as string;
                const data = JSON.parse(json);

                // Basic validation
                if (!data.days || !Array.isArray(data.days)) {
                    alert('Invalid data format. Missing "days" array.');
                    return;
                }

                if (confirm('This will overwrite your current data. Are you sure?')) {
                    storage.saveData(data);
                    refreshData();
                    alert('Data imported successfully!');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to parse JSON file.');
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.href = '/';
        }
    };

    return (
        <div className="p-6 space-y-8">


            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                    <div className="bg-slate-100 p-3 rounded-full">
                        <User size={24} className="text-slate-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Local User</h3>
                        <p className="text-xs text-slate-500">Data stored locally on device</p>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide px-2">Appearance</h3>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="font-medium text-slate-800 mb-3">App Theme</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {THEMES.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t)}
                                className={clsx(
                                    "flex flex-col items-center gap-2 p-2 rounded-lg transition-all min-w-[60px]",
                                    theme.id === t.id ? "bg-slate-50 ring-2 ring-slate-200" : "hover:bg-slate-50"
                                )}
                            >
                                <div className={clsx("w-8 h-8 rounded-full shadow-sm", t.primary)} />
                                <span className={clsx("text-xs font-medium", theme.id === t.id ? "text-slate-900" : "text-slate-500")}>
                                    {t.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide px-2">History</h3>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-slate-800">History Retention</h4>
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            {historyRetentionDays} Days
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                        Automatically delete activity data older than {historyRetentionDays} days.
                    </p>
                    <input
                        type="range"
                        min="1"
                        max="7"
                        step="1"
                        value={historyRetentionDays}
                        onChange={(e) => setHistoryRetentionDays(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>1 Day</span>
                        <span>7 Days</span>
                    </div>
                </div>
            </section>

            <section className="space-y-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide px-2">Data Management</h3>

                <button
                    onClick={handleExport}
                    className="w-full bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                >
                    <Download size={20} className="text-blue-600" />
                    <div>
                        <h4 className="font-medium text-slate-800">Export Data</h4>
                        <p className="text-xs text-slate-500">Download your activity history as JSON</p>
                    </div>
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                />

                <button
                    onClick={handleImportClick}
                    className="w-full bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                >
                    <Upload size={20} className="text-green-600" />
                    <div>
                        <h4 className="font-medium text-slate-800">Import Data</h4>
                        <p className="text-xs text-slate-500">Restore from a JSON backup file</p>
                    </div>
                </button>

                <button
                    onClick={handleReset}
                    className="w-full bg-white p-4 rounded-xl border border-red-100 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
                >
                    <Trash2 size={20} className="text-red-600" />
                    <div>
                        <h4 className="font-medium text-red-600">Reset All Data</h4>
                        <p className="text-xs text-red-400">Clear local storage and start fresh</p>
                    </div>
                </button>
            </section>

            <div className="text-center text-xs text-slate-300 mt-10">
                TymOra v{APP_VERSION} MVP
                {/* TymOra v0.2.0 MVP */}
            </div>
        </div>
    );
};

export default Settings;
