import React from 'react';
import { useApp } from '../context/AppProvider';
import CurrentActivity from '../components/CurrentActivity';
import RecentActivityList from '../components/RecentActivityList';
import { format } from 'date-fns';

const Home: React.FC = () => {
    const { currentDate } = useApp();

    return (
        <div className="p-6 space-y-8">
            <header>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">
                    {format(new Date(currentDate), 'EEEE, MMMM do')}
                </p>
                <h1 className="text-3xl font-bold text-slate-900">
                    Hello, Champion
                </h1>
            </header>

            <section>
                <CurrentActivity />
            </section>

            <section>
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
                </div>
                <RecentActivityList />
            </section>
        </div>
    );
};

export default Home;
