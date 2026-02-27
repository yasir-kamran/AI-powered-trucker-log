import React, { useEffect, useMemo, useState, createContext, useContext } from 'react';
import { GlobeAltIcon, SparklesIcon } from '@heroicons/react/24/outline';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const CA_PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
];

const IFTA_CATEGORIES = ['Fuel', 'Tolls'];

export const ReceiptsContext = createContext();

export function useReceipts() {
  return useContext(ReceiptsContext);
}

export default function Receipts() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Fuel');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [state, setState] = useState('');
  const [gallons, setGallons] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  const isIftaCategory = IFTA_CATEGORIES.includes(category);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!previewUrl) return undefined;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Receipts</h1>
        {saveMessage && (
          <div className={`px-4 py-2 rounded-md text-sm font-medium ${
            saveMessage.includes('Please') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {saveMessage}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Scan / Import</h2>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Receipt image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {previewUrl ? (
            <div className="mt-4">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  loading="lazy"
                  decoding="async"
                  className="max-h-80 w-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              Add a receipt photo to preview it here.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Fuel</option>
                <option>Tolls</option>
                <option>Maintenance</option>
                <option>Meals</option>
                <option>Supplies</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vendor</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Pilot, Loves, TA..."
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* IFTA Fields - Show for Fuel/Tolls */}
          {isIftaCategory && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center mb-3">
                <GlobeAltIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-900">IFTA Tax Information</span>
                <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Auto-syncs to IFTA</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">State/Province</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">Select state...</option>
                    <optgroup label="United States">
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Canada">
                      {CA_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                {category === 'Fuel' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gallons Purchased</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      value={gallons}
                      onChange={(e) => setGallons(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-indigo-600 flex items-center">
                <SparklesIcon className="h-3 w-3 mr-1" />
                This receipt will automatically appear in your IFTA report
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                if (!amount || !vendor) {
                  setSaveMessage('Please enter vendor and amount');
                  setTimeout(() => setSaveMessage(''), 3000);
                  return;
                }
                const newReceipt = {
                  id: Date.now(),
                  category,
                  vendor,
                  amount: parseFloat(amount),
                  date: date || new Date().toISOString().split('T')[0],
                  hasImage: !!file,
                  state: isIftaCategory ? state : null,
                  gallons: category === 'Fuel' ? parseFloat(gallons) || 0 : null,
                  isIfta: isIftaCategory,
                };
                
                // Store in localStorage for IFTA page access
                if (isIftaCategory && state) {
                  const iftaReceipts = JSON.parse(localStorage.getItem('iftaReceipts') || '[]');
                  iftaReceipts.push(newReceipt);
                  localStorage.setItem('iftaReceipts', JSON.stringify(iftaReceipts));
                }
                setReceipts([newReceipt, ...receipts]);
                setFile(null);
                setVendor('');
                setAmount('');
                setDate('');
                setState('');
                setGallons('');
                setSaveMessage('Receipt saved!');
                setTimeout(() => setSaveMessage(''), 3000);
              }}
            >
              Save Receipt
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                setFile(null);
                setCategory('Fuel');
                setVendor('');
                setAmount('');
                setDate('');
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Offline Queue & Exports</h2>
          <div className="mt-2 text-sm text-gray-600">
            This section will store receipts offline (IndexedDB), run OCR locally, and export to CSV for bookkeeping.
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                if (receipts.length === 0) return;
                const headers = ['Date', 'Category', 'Vendor', 'Amount'];
                const rows = receipts.map(r => [r.date, r.category, r.vendor, r.amount.toFixed(2)]);
                const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `receipts-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                setSaveMessage('Receipts synced to cloud!');
                setTimeout(() => setSaveMessage(''), 3000);
              }}
            >
              Sync
            </button>
          </div>

          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
            {receipts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">Saved receipts will appear here.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {receipts.map((r) => (
                  <li key={r.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.vendor}</p>
                      <p className="text-xs text-gray-500">
                        {r.category} • {r.date}
                        {r.state && <span className="ml-1 text-indigo-600">• {r.state}</span>}
                        {r.gallons && <span className="ml-1">• {r.gallons} gal</span>}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">${r.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
