import React, { useEffect, useMemo, useState } from 'react';

export default function MechanicsEye() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

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
        <h1 className="text-2xl font-semibold text-gray-900">Mechanic&apos;s Eye</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Upload Dashboard Photo</h2>
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setResult('');
              }}
            />
          </div>

          {previewUrl ? (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
              <img
                src={previewUrl}
                alt="Dashboard preview"
                loading="lazy"
                decoding="async"
                className="max-h-80 w-full object-contain"
              />
            </div>
          ) : (
            <div className="mt-4 rounded-md border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
              Add a clear photo of the warning light.
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              onClick={() => {
                window.alert('Next step: connect OpenAI vision via a secure backend.');
              }}
            >
              Diagnose
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                setFile(null);
                setResult('');
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">Diagnosis</h2>
          <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-[220px]">
            {result || 'Upload an image and run Diagnose to get a plain-English explanation + next steps.'}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Next step will include confidence, severity, and recommended actions.
          </div>
        </div>
      </div>
    </div>
  );
}
