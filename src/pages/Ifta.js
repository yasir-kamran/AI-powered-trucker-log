import React, { useMemo, useState, useEffect } from 'react';
import { SparklesIcon, ArrowPathIcon, DocumentArrowDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

function sumBy(items, fn) {
  return items.reduce((acc, item) => acc + fn(item), 0);
}

const STATE_TAX_RATES = {
  'AL': 0.29, 'AK': 0.0895, 'AZ': 0.26, 'AR': 0.285, 'CA': 0.539, 'CO': 0.22,
  'CT': 0.25, 'DE': 0.22, 'FL': 0.35, 'GA': 0.315, 'HI': 0.16, 'ID': 0.33,
  'IL': 0.464, 'IN': 0.34, 'IA': 0.30, 'KS': 0.24, 'KY': 0.246, 'LA': 0.20,
  'ME': 0.312, 'MD': 0.361, 'MA': 0.24, 'MI': 0.267, 'MN': 0.285, 'MS': 0.18,
  'MO': 0.195, 'MT': 0.3275, 'NE': 0.246, 'NV': 0.23, 'NH': 0.222, 'NJ': 0.414,
  'NM': 0.17, 'NY': 0.3215, 'NC': 0.385, 'ND': 0.23, 'OH': 0.385, 'OK': 0.19,
  'OR': 0.38, 'PA': 0.576, 'RI': 0.35, 'SC': 0.28, 'SD': 0.28, 'TN': 0.27,
  'TX': 0.20, 'UT': 0.314, 'VT': 0.121, 'VA': 0.262, 'WA': 0.494, 'WV': 0.357,
  'WI': 0.309, 'WY': 0.24,
  'AB': 0.13, 'BC': 0.27, 'MB': 0.14, 'NB': 0.155, 'NL': 0.165, 'NS': 0.155,
  'NT': 0.063, 'NU': 0.063, 'ON': 0.147, 'PE': 0.158, 'QC': 0.192, 'SK': 0.15, 'YT': 0.062
};

export default function Ifta() {
  const [quarter, setQuarter] = useState('2026 Q1');
  const [trips, setTrips] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [receiptFuel, setReceiptFuel] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  // Load fuel receipts from localStorage (synced from Receipts page)
  useEffect(() => {
    const loadReceiptFuel = () => {
      const iftaReceipts = JSON.parse(localStorage.getItem('iftaReceipts') || '[]');
      const fuelReceipts = iftaReceipts.filter(r => r.category === 'Fuel' && r.state && r.gallons);
      setReceiptFuel(fuelReceipts);
    };
    loadReceiptFuel();
    window.addEventListener('storage', loadReceiptFuel);
    return () => window.removeEventListener('storage', loadReceiptFuel);
  }, []);

  const [tripJurisdiction, setTripJurisdiction] = useState('TX');
  const [tripMiles, setTripMiles] = useState('');

  const [fuelJurisdiction, setFuelJurisdiction] = useState('TX');
  const [fuelGallons, setFuelGallons] = useState('');

  // Combine manual fuel entries with receipt-imported fuel
  const allFuel = useMemo(() => {
    const receiptFuelEntries = receiptFuel.map(r => ({
      jurisdiction: r.state,
      gallons: r.gallons,
      fromReceipt: true,
      vendor: r.vendor,
      date: r.date,
      amount: r.amount
    }));
    return [...fuel, ...receiptFuelEntries];
  }, [fuel, receiptFuel]);

  const totals = useMemo(() => {
    const milesBy = trips.reduce((acc, t) => {
      acc[t.jurisdiction] = (acc[t.jurisdiction] || 0) + t.miles;
      return acc;
    }, {});

    const gallonsBy = allFuel.reduce((acc, f) => {
      acc[f.jurisdiction] = (acc[f.jurisdiction] || 0) + f.gallons;
      return acc;
    }, {});

    const jurisdictions = Array.from(
      new Set([...Object.keys(milesBy), ...Object.keys(gallonsBy)])
    ).sort();

    const totalMiles = sumBy(trips, (t) => t.miles);
    const totalGallons = sumBy(allFuel, (f) => f.gallons);
    const avgMpg = totalGallons > 0 ? totalMiles / totalGallons : 0;

    return {
      jurisdictions,
      milesBy,
      gallonsBy,
      totalMiles,
      totalGallons,
      avgMpg,
    };
  }, [trips, allFuel]);

  const generateAiReport = () => {
    setIsGenerating(true);
    setAiReport(null);
    
    setTimeout(() => {
      const { jurisdictions, milesBy, gallonsBy, totalMiles, totalGallons, avgMpg } = totals;
      
      // Calculate tax owed/credit per jurisdiction
      const jurisdictionDetails = jurisdictions.map(j => {
        const miles = milesBy[j] || 0;
        const gallons = gallonsBy[j] || 0;
        const milePercent = totalMiles > 0 ? miles / totalMiles : 0;
        const gallonsRequired = totalGallons * milePercent;
        const netGallons = gallons - gallonsRequired;
        const taxRate = STATE_TAX_RATES[j] || 0.25;
        const taxAmount = netGallons * taxRate;
        
        return {
          jurisdiction: j,
          miles,
          gallons,
          gallonsRequired: gallonsRequired.toFixed(2),
          netGallons: netGallons.toFixed(2),
          taxRate,
          taxAmount: taxAmount.toFixed(2),
          status: netGallons >= 0 ? 'credit' : 'owed'
        };
      });

      const totalOwed = jurisdictionDetails
        .filter(j => j.status === 'owed')
        .reduce((acc, j) => acc + Math.abs(parseFloat(j.taxAmount)), 0);
      
      const totalCredit = jurisdictionDetails
        .filter(j => j.status === 'credit')
        .reduce((acc, j) => acc + parseFloat(j.taxAmount), 0);

      setAiReport({
        quarter,
        generatedAt: new Date().toLocaleString(),
        summary: {
          totalMiles,
          totalGallons,
          avgMpg: avgMpg.toFixed(2),
          jurisdictionCount: jurisdictions.length,
          totalOwed: totalOwed.toFixed(2),
          totalCredit: totalCredit.toFixed(2),
          netAmount: (totalCredit - totalOwed).toFixed(2)
        },
        jurisdictions: jurisdictionDetails,
        recommendations: [
          avgMpg < 6 ? 'Your MPG is below average. Consider fuel efficiency improvements.' : null,
          totalOwed > 500 ? 'Significant tax liability detected. Consider adjusting fuel purchase locations.' : null,
          jurisdictions.length > 10 ? 'Operating in many jurisdictions. Ensure all permits are current.' : null,
        ].filter(Boolean)
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">IFTA</h1>
        <select
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
        >
          <option>2026 Q1</option>
          <option>2025 Q4</option>
          <option>2025 Q3</option>
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Trip Miles</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jurisdiction</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={tripJurisdiction}
                onChange={(e) => setTripJurisdiction(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Miles</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={tripMiles}
                onChange={(e) => setTripMiles(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                onClick={() => {
                  const miles = Number(tripMiles);
                  if (!tripJurisdiction || !Number.isFinite(miles) || miles <= 0) return;
                  setTrips((prev) => [...prev, { jurisdiction: tripJurisdiction, miles }]);
                  setTripMiles('');
                }}
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Jurisdiction</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Miles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {trips.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={2}>No trip miles yet.</td>
                  </tr>
                ) : (
                  trips.map((t, idx) => (
                    <tr key={`${t.jurisdiction}-${idx}`}>
                      <td className="px-4 py-3 text-sm text-gray-900">{t.jurisdiction}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{t.miles}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Fuel Purchases</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Jurisdiction</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={fuelJurisdiction}
                onChange={(e) => setFuelJurisdiction(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gallons</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={fuelGallons}
                onChange={(e) => setFuelGallons(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                onClick={() => {
                  const gallons = Number(fuelGallons);
                  if (!fuelJurisdiction || !Number.isFinite(gallons) || gallons <= 0) return;
                  setFuel((prev) => [...prev, { jurisdiction: fuelJurisdiction, gallons }]);
                  setFuelGallons('');
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Auto-imported from Receipts */}
          {receiptFuel.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center text-sm text-green-800">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                <span className="font-medium">{receiptFuel.length} fuel receipt(s) auto-imported</span>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-md border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Jurisdiction</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Gallons</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {allFuel.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-500" colSpan={3}>No fuel yet. Add manually or import from Receipts.</td>
                  </tr>
                ) : (
                  allFuel.map((f, idx) => (
                    <tr key={`${f.jurisdiction}-${idx}`} className={f.fromReceipt ? 'bg-green-50' : ''}>
                      <td className="px-4 py-3 text-sm text-gray-900">{f.jurisdiction}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{f.gallons}</td>
                      <td className="px-4 py-3 text-sm">
                        {f.fromReceipt ? (
                          <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            <SparklesIcon className="h-3 w-3 mr-1" />
                            {f.vendor}
                          </span>
                        ) : (
                          <span className="text-gray-500">Manual</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Quarter Summary</h2>
          <button
            type="button"
            disabled={isGenerating}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            onClick={generateAiReport}
          >
            {isGenerating ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate AI Report
              </>
            )}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-gray-50 p-4">
            <div className="text-sm text-gray-500">Quarter</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{quarter}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <div className="text-sm text-gray-500">Total Miles</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{totals.totalMiles}</div>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <div className="text-sm text-gray-500">Total Gallons</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{totals.totalGallons}</div>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Jurisdiction</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Miles</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Gallons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {totals.jurisdictions.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500" colSpan={3}>Add trips and fuel to see a breakdown.</td>
                </tr>
              ) : (
                totals.jurisdictions.map((j) => (
                  <tr key={j}>
                    <td className="px-4 py-3 text-sm text-gray-900">{j}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{totals.milesBy[j] || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{totals.gallonsBy[j] || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* AI Generated Report */}
        {aiReport && (
          <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SparklesIcon className="h-6 w-6 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">AI-Generated IFTA Report</h3>
              </div>
              <span className="text-xs text-gray-500">Generated: {aiReport.generatedAt}</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500">Total Miles</p>
                <p className="text-xl font-bold text-gray-900">{aiReport.summary.totalMiles.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500">Total Gallons</p>
                <p className="text-xl font-bold text-gray-900">{aiReport.summary.totalGallons.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500">Avg MPG</p>
                <p className="text-xl font-bold text-gray-900">{aiReport.summary.avgMpg}</p>
              </div>
              <div className={`rounded-lg p-4 shadow-sm ${parseFloat(aiReport.summary.netAmount) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="text-xs text-gray-500">Net Tax</p>
                <p className={`text-xl font-bold ${parseFloat(aiReport.summary.netAmount) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${aiReport.summary.netAmount}
                </p>
              </div>
            </div>

            {/* Jurisdiction Breakdown */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">State</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Miles</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Gallons</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Required</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Net</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tax Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {aiReport.jurisdictions.map((j) => (
                    <tr key={j.jurisdiction}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{j.jurisdiction}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{j.miles}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{j.gallons}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{j.gallonsRequired}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{j.netGallons}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">${j.taxRate.toFixed(3)}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${j.status === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {j.status === 'credit' ? '+' : '-'}${Math.abs(parseFloat(j.taxAmount)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Recommendations */}
            {aiReport.recommendations.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 flex items-center">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  AI Recommendations
                </h4>
                <ul className="mt-2 space-y-1">
                  {aiReport.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-yellow-700">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Export Button */}
            <div className="mt-4 flex gap-3">
              <button
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                onClick={() => {
                  const report = `IFTA Report - ${aiReport.quarter}\n\nGenerated: ${aiReport.generatedAt}\n\nSummary:\n- Total Miles: ${aiReport.summary.totalMiles}\n- Total Gallons: ${aiReport.summary.totalGallons}\n- Avg MPG: ${aiReport.summary.avgMpg}\n- Net Tax: $${aiReport.summary.netAmount}\n\nJurisdiction Breakdown:\n${aiReport.jurisdictions.map(j => `${j.jurisdiction}: ${j.miles} mi, ${j.gallons} gal, $${j.taxAmount}`).join('\n')}`;
                  const blob = new Blob([report], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ifta-report-${aiReport.quarter.replace(' ', '-')}.txt`;
                  a.click();
                }}
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
