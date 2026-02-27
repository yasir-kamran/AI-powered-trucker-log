import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

const stats = [
  {
    name: 'Total Profit',
    value: '$4,250',
    change: '12%',
    changeType: 'increase',
  },
  {
    name: 'Miles This Month',
    value: '4,823',
    change: '5.4%',
    changeType: 'increase',
  },
  {
    name: 'Expenses',
    value: '$1,234',
    change: '3.2%',
    changeType: 'increase',
  },
  {
    name: 'Maintenance Due',
    value: '2',
    change: 'Due soon',
    changeType: 'decrease',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={classNames(
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon
                    className="self-center flex-shrink-0 h-4 w-4 text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="self-center flex-shrink-0 h-4 w-4 text-red-500"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                </span>
                {stat.change}
              </p>
            </div>
          </dt>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
