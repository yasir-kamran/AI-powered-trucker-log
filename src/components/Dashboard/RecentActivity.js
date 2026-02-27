import React from 'react';
import { 
  CurrencyDollarIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const activity = [
  {
    id: 1,
    type: 'expense',
    title: 'Fuel at Pilot',
    amount: '-$450.00',
    time: '2 hours ago',
    icon: CurrencyDollarIcon,
  },
  {
    id: 2,
    type: 'trip',
    title: 'Completed trip #1234',
    description: 'Denver to Chicago',
    time: '4 hours ago',
    icon: TruckIcon,
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Scheduled maintenance',
    description: 'Oil change',
    time: '1 day ago',
    icon: WrenchScrewdriverIcon,
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-6 flow-root">
          <ul role="list" className="-mb-8">
            {activity.map((activityItem, activityItemIdx) => (
              <li key={activityItem.id}>
                <div className="relative pb-8">
                  {activityItemIdx !== activity.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        }
                      >
                        <activityItem.icon
                          className="h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-800">
                          {activityItem.title}{' '}
                          {activityItem.description && (
                            <span className="text-gray-500">- {activityItem.description}</span>
                          )}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="mr-1 h-4 w-4 text-gray-400" />
                          <time dateTime={activityItem.time}>{activityItem.time}</time>
                        </div>
                        {activityItem.amount && (
                          <div className={`mt-1 ${activityItem.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                            {activityItem.amount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
