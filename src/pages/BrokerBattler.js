import React, { useState } from 'react';

export default function BrokerBattler() {
  const [company, setCompany] = useState('');
  const [broker, setBroker] = useState('');
  const [loadId, setLoadId] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [letter, setLetter] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Broker Battler</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Case Details</h2>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Your company</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Broker name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Load / Ref ID</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={loadId}
                  onChange={(e) => setLoadId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount owed (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">What happened?</label>
              <textarea
                rows={7}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Detention time, layover, TONU, payment delays..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              onClick={() => {
                window.alert('Next step: connect OpenAI via a secure backend. I will ask you for the API key only when the server is ready.');
              }}
            >
              Generate Demand Letter
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                setCompany('');
                setBroker('');
                setLoadId('');
                setAmount('');
                setDetails('');
                setLetter('');
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Letter Editor</h2>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                if (!letter) {
                  window.alert('Generate or paste a letter first.');
                  return;
                }
                navigator.clipboard.writeText(letter).catch(() => {});
              }}
            >
              Copy
            </button>
          </div>

          <div className="mt-4">
            <textarea
              rows={18}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Your generated demand letter will appear here. You can edit it before sending."
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
            />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Next step will include PDF export + email-ready formatting.
          </div>
        </div>
      </div>
    </div>
  );
}
