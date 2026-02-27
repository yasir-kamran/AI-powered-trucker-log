import React, { useEffect, useState } from 'react';
import { authedRequest, useAuth } from '../auth/AuthContext';

export default function Expenses() {
  const { token } = useAuth();

  const [date, setDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('Fuel');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function loadExpenses() {
    setError('');
    setLoading(true);
    try {
      const data = await authedRequest('/api/expenses', { token });
      setRows(data.expenses || []);
    } catch (e) {
      setError(e?.payload?.error || 'failed_to_load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">New Expense</h2>

          {error ? (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <label className="block text-sm font-medium text-gray-700">Amount</label>
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
              <label className="block text-sm font-medium text-gray-700">Vendor</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={busy}
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-60"
                onClick={async () => {
                  setError('');
                  setBusy(true);
                  try {
                    const data = await authedRequest('/api/ai/expense-suggest', {
                      token,
                      method: 'POST',
                      body: { vendor, notes },
                    });
                    if (data?.category) setCategory(data.category);
                  } catch (e) {
                    setError(e?.payload?.error || 'ai_failed');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Suggest category (AI)
              </button>
              <button
                type="button"
                disabled={busy}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                onClick={async () => {
                  setError('');
                  setBusy(true);
                  try {
                    await authedRequest('/api/expenses', {
                      token,
                      method: 'POST',
                      body: {
                        date: date || null,
                        vendor: vendor || null,
                        category: category || null,
                        amount: amount === '' ? null : Number(amount),
                        notes: notes || null,
                      },
                    });
                    setDate('');
                    setVendor('');
                    setCategory('Fuel');
                    setAmount('');
                    setNotes('');
                    await loadExpenses();
                  } catch (e) {
                    setError(e?.payload?.error || 'create_failed');
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Save Expense
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => loadExpenses()}
              >
                Refresh
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50"
                onClick={async () => {
                  setError('');
                  try {
                    await authedRequest('/api/expenses/reset', { token, method: 'POST' });
                    await loadExpenses();
                  } catch (e) {
                    setError(e?.payload?.error || 'reset_failed');
                  }
                }}
              >
                Reset All Expenses
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Your Expenses</h2>

          <div className="mt-4 rounded-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Vendor</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={5}>Loading…</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={5}>No expenses yet.</td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.date || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.vendor || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.category || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{r.amount ?? '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                          onClick={async () => {
                            setError('');
                            try {
                              await authedRequest(`/api/expenses/${r.id}`, { token, method: 'DELETE' });
                              await loadExpenses();
                            } catch (e) {
                              setError(e?.payload?.error || 'delete_failed');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
