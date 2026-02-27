import React, { useEffect, useMemo, useState } from 'react';
import { authedRequest, useAuth } from '../auth/AuthContext';

export default function Trips() {
  const { token } = useAuth();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [miles, setMiles] = useState('');
  const [notes, setNotes] = useState('');

  const [tripRows, setTripRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jurisdictionMiles = useMemo(() => {
    const j = (jurisdiction || '').trim().toUpperCase();
    const m = Number(miles);
    if (!j || !Number.isFinite(m) || m <= 0) return {};
    return { [j]: m };
  }, [jurisdiction, miles]);

  async function loadTrips() {
    setError('');
    setLoading(true);
    try {
      const data = await authedRequest('/api/trips', { token });
      setTripRows(data.trips || []);
    } catch (e) {
      setError(e?.payload?.error || 'failed_to_load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Trips</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">New Trip</h2>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Origin</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Jurisdiction (2-letter)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Miles</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={miles}
                  onChange={(e) => setMiles(e.target.value)}
                />
              </div>
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
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                onClick={async () => {
                  setError('');
                  try {
                    await authedRequest('/api/trips', {
                      token,
                      method: 'POST',
                      body: {
                        start_date: startDate || null,
                        end_date: endDate || null,
                        origin: origin || null,
                        destination: destination || null,
                        jurisdiction_miles: jurisdictionMiles,
                        notes: notes || null,
                      },
                    });
                    setStartDate('');
                    setEndDate('');
                    setOrigin('');
                    setDestination('');
                    setJurisdiction('');
                    setMiles('');
                    setNotes('');
                    await loadTrips();
                  } catch (e) {
                    setError(e?.payload?.error || 'create_failed');
                  }
                }}
              >
                Save Trip
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={async () => {
                  setError('');
                  try {
                    await authedRequest('/api/trips/reset', { token, method: 'POST' });
                    await loadTrips();
                  } catch (e) {
                    setError(e?.payload?.error || 'reset_failed');
                  }
                }}
              >
                Reset All Trips
              </button>
            </div>

            {error ? (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Trips</h2>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => loadTrips()}
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 rounded-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Dates</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Route</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Miles</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>Loading…</td>
                  </tr>
                ) : tripRows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={4}>No trips yet.</td>
                  </tr>
                ) : (
                  tripRows.map((t) => {
                    const jm = t.jurisdiction_miles || {};
                    const totalMiles = Object.values(jm).reduce((a, b) => a + Number(b || 0), 0);
                    return (
                      <tr key={t.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {(t.start_date || '-') + ' → ' + (t.end_date || '-')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {(t.origin || '-') + ' → ' + (t.destination || '-')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{totalMiles}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                            onClick={async () => {
                              setError('');
                              try {
                                await authedRequest(`/api/trips/${t.id}`, { token, method: 'DELETE' });
                                await loadTrips();
                              } catch (e) {
                                setError(e?.payload?.error || 'delete_failed');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
