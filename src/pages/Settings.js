import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function Settings() {
  const { me, updateProfile, logout } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [dot, setDot] = useState('');
  const [iftaAccount, setIftaAccount] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const p = me?.profile;
    if (!p) return;
    setCompanyName(p.company_name || '');
    setDot(p.dot_number || '');
    setIftaAccount(p.ifta_account || '');
  }, [me]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="mt-6 rounded-lg bg-white shadow p-6">
        <h2 className="text-lg font-medium text-gray-900">Profile</h2>

        {me?.user?.email ? (
          <div className="mt-2 text-sm text-gray-600">Signed in as {me.user.email}</div>
        ) : null}

        {status ? (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{status}</div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">USDOT number</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={dot}
              onChange={(e) => setDot(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IFTA account</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={iftaAccount}
              onChange={(e) => setIftaAccount(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            onClick={async () => {
              setStatus('');
              await updateProfile({
                company_name: companyName || null,
                dot_number: dot || null,
                ifta_account: iftaAccount || null,
              });
              setStatus('Saved.');
              setTimeout(() => setStatus(''), 1500);
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => logout()}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
