import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function BookkeepingForTruckers() {
  const description =
    'Bookkeeping for truckers made simple. Keep receipts, expenses, and documents organized so you can stay audit-ready and maximize deductions with TruckerLog AI.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Bookkeeping for Truckers',
    description,
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Bookkeeping for Truckers | TruckerLog AI"
        description={description}
        canonicalPath="/bookkeeping-for-truckers"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Bookkeeping for Truckers (Owner-Operators & Fleets)</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{description}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Stay organized year-round</h2>
              <p className="mt-2 text-gray-600">
                Don’t wait for tax time. Keep expenses and receipts categorized as you go.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Make deductions easier</h2>
              <p className="mt-2 text-gray-600">
                Clean records help you identify deductible expenses and reduce missed write-offs.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Document storage</h2>
              <p className="mt-2 text-gray-600">
                Save permits, insurance, rate confirmations, invoices, and more in one place.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Share summaries</h2>
              <p className="mt-2 text-gray-600">
                Keep everything structured so your accountant or tax pro can work faster with fewer questions.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Common questions</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              <div>
                <p className="font-medium">What receipts should truckers keep?</p>
                <p className="mt-1 text-gray-600">
                  Fuel, repairs, maintenance, insurance, tolls, scales, supplies, and any business-related purchases.
                </p>
              </div>
              <div>
                <p className="font-medium">Will this help with audits?</p>
                <p className="mt-1 text-gray-600">
                  Organized records make it easier to provide documentation if you’re ever asked to verify expenses.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700"
            >
              Start now
            </Link>
            <Link
              to="/trucking-accounting-software"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Explore trucking accounting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
