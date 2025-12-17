import React from 'react';
import CurrentActivity from '../components/CurrentActivity';
import RecentActivityList from '../components/RecentActivityList';
const Home: React.FC = () => {
    return (
        <div className="p-6 space-y-8">

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
