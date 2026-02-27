import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function IftaReportingSoftware() {
  const description =
    'IFTA reporting software for owner-operators and fleets. Track miles by state, log fuel purchases, and generate accurate IFTA reports with TruckerLog AI.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'IFTA Reporting Software',
    description,
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="IFTA Reporting Software | TruckerLog AI"
        description={description}
        canonicalPath="/ifta-reporting-software"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">IFTA Reporting Software for Owner-Operators</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{description}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Track miles by state</h2>
              <p className="mt-2 text-gray-600">
                Log trips and keep clean mileage totals per jurisdiction so you can file quarterly IFTA without scrambling.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Capture fuel purchases</h2>
              <p className="mt-2 text-gray-600">
                Store fuel receipts and purchases alongside your trip data so your IFTA tax reporting stays accurate.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Reduce IFTA errors</h2>
              <p className="mt-2 text-gray-600">
                Keep your miles and fuel organized to help avoid underpayments, overpayments, and costly corrections.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">All-in-one trucking paperwork</h2>
              <p className="mt-2 text-gray-600">
                Pair IFTA reporting with receipts, expenses, and document storage so your back office runs in one place.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Common questions</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              <div>
                <p className="font-medium">What is IFTA?</p>
                <p className="mt-1 text-gray-600">
                  The International Fuel Tax Agreement (IFTA) simplifies reporting fuel taxes for vehicles traveling across multiple jurisdictions.
                </p>
              </div>
              <div>
                <p className="font-medium">What do I need for an IFTA report?</p>
                <p className="mt-1 text-gray-600">
                  Typically you need miles by jurisdiction and fuel purchases. TruckerLog AI helps keep those records organized.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
