import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function TruckingAccountingSoftware() {
  const description =
    'Trucking accounting software for owner-operators and fleets. Track expenses, organize receipts, and understand profit per load with TruckerLog AI.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Trucking Accounting Software',
    description,
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Trucking Accounting Software | TruckerLog AI"
        description={description}
        canonicalPath="/trucking-accounting-software"
        structuredData={structuredData}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
            Back to home
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Start Free Trial
          </Link>
        </div>

        <div className="mt-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Trucking Accounting Software that’s Built for the Road</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{description}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Expense tracking</h2>
              <p className="mt-2 text-gray-600">
                Track fuel, repairs, insurance, tolls, meals, and more so you always know where the money goes.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Receipt organization</h2>
              <p className="mt-2 text-gray-600">
                Store receipts and documents alongside expenses to simplify bookkeeping and tax-time prep.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Profit per load</h2>
              <p className="mt-2 text-gray-600">
                Estimate profit with load revenue and key costs so you can choose better freight and run smarter.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Cleaner reports</h2>
              <p className="mt-2 text-gray-600">
                Keep consistent records that make it easier to share summaries with your accountant or bookkeeper.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Common questions</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              <div>
                <p className="font-medium">Is TruckerLog AI a replacement for QuickBooks?</p>
                <p className="mt-1 text-gray-600">
                  It’s designed for trucking workflows first. Many users use it to stay organized and share clean summaries with their accountant.
                </p>
              </div>
              <div>
                <p className="font-medium">What should owner-operators track?</p>
                <p className="mt-1 text-gray-600">
                  Track revenue, miles, fuel, repairs, insurance, tolls, and receipts. Consistent records help maximize deductions.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700"
            >
              Create account
            </Link>
            <Link
              to="/ifta-reporting-software"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Explore IFTA reporting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
