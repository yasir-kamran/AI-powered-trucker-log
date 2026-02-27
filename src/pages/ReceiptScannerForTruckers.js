import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function ReceiptScannerForTruckers() {
  const description =
    'Receipt scanner for truckers that keeps your paperwork organized. Upload receipts, track expenses, and store documents in TruckerLog AI.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Receipt Scanner for Truckers',
    description,
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Receipt Scanner for Truckers | TruckerLog AI"
        description={description}
        canonicalPath="/receipt-scanner-for-truckers"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Receipt Scanner for Truckers</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{description}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload from anywhere</h2>
              <p className="mt-2 text-gray-600">Capture receipts on the road and keep them tied to your expenses.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Build a clean audit trail</h2>
              <p className="mt-2 text-gray-600">Keep supporting documents stored with the transaction for easy proof later.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Fewer missing receipts</h2>
              <p className="mt-2 text-gray-600">Centralize receipts so tax prep and bookkeeping doesn’t turn into a scavenger hunt.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Connect to expenses</h2>
              <p className="mt-2 text-gray-600">Track categories like fuel, repairs, insurance, tolls, meals, and more.</p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Common questions</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              <div>
                <p className="font-medium">Does this replace my receipt box?</p>
                <p className="mt-1 text-gray-600">
                  It’s a digital workflow that helps keep receipts and documents organized and searchable.
                </p>
              </div>
              <div>
                <p className="font-medium">Can I store other documents?</p>
                <p className="mt-1 text-gray-600">
                  Yes, you can store rate confirmations, permits, insurance, and other trucking documents.
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
              to="/documents"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              Open Documents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
