import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  DocumentTextIcon,
  FolderIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
  EyeIcon,
  TrashIcon,
  CloudArrowDownIcon,
} from '@heroicons/react/24/outline';
import { authedRequest, useAuth } from '../auth/AuthContext';

const documentCategories = [
  { id: 'billing', name: 'Billing & Invoices', icon: CurrencyDollarIcon, color: 'bg-green-100 text-green-600', count: 24 },
  { id: 'rate-confirmation', name: 'Rate Confirmations', icon: DocumentDuplicateIcon, color: 'bg-blue-100 text-blue-600', count: 18 },
  { id: 'insurance', name: 'Insurance', icon: ShieldCheckIcon, color: 'bg-purple-100 text-purple-600', count: 6 },
  { id: 'permits', name: 'Permits & Licenses', icon: DocumentTextIcon, color: 'bg-orange-100 text-orange-600', count: 12 },
  { id: 'reports', name: 'AI Reports', icon: DocumentChartBarIcon, color: 'bg-indigo-100 text-indigo-600', count: 8 },
];

// Empty initial state for new users - documents will be added by user
const initialDocuments = [];

const aiFeatures = [
  {
    id: 'organize',
    title: 'One-Click Organize',
    description: 'AI automatically categorizes and tags all your documents',
    icon: FolderIcon,
    action: 'Organize All',
  },
  {
    id: 'extract',
    title: 'Smart Data Extraction',
    description: 'Extract key data from rate confirmations, invoices & BOLs',
    icon: SparklesIcon,
    action: 'Extract Data',
  },
  {
    id: 'report',
    title: 'Generate Reports',
    description: 'AI-powered accurate financial and compliance reports',
    icon: DocumentChartBarIcon,
    action: 'Generate Report',
  },
  {
    id: 'expiry',
    title: 'Expiry Alerts',
    description: 'Track insurance, permits & license expiration dates',
    icon: ExclamationTriangleIcon,
    action: 'Check Expiries',
  },
];

const statusConfig = {
  processed: { label: 'Processed', icon: CheckCircleIcon, color: 'text-green-600 bg-green-50' },
  pending: { label: 'Pending', icon: ClockIcon, color: 'text-yellow-600 bg-yellow-50' },
  expiring: { label: 'Expiring Soon', icon: ExclamationTriangleIcon, color: 'text-red-600 bg-red-50' },
  generated: { label: 'AI Generated', icon: SparklesIcon, color: 'text-indigo-600 bg-indigo-50' },
};

export default function Documents() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  function formatDate(iso) {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch {
      return String(iso);
    }
  }

  const docsForUi = useMemo(() => {
    return documents.map((d) => ({
      ...d,
      size: typeof d.size === 'number' ? formatBytes(d.size) : d.size,
      date: d.created_at ? formatDate(d.created_at) : d.date,
      aiExtracted: Boolean(d.ai_extracted ?? d.aiExtracted),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  async function loadDocuments() {
    setError('');
    setLoading(true);
    try {
      const data = await authedRequest('/api/documents', { token });
      setDocuments(data.documents || []);
    } catch (e) {
      setError(e?.payload?.error || 'failed_to_load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDocuments = docsForUi.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  async function readFileAsBase64(file) {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('read_failed'));
      reader.readAsDataURL(file);
    });
    const s = String(dataUrl || '');
    const comma = s.indexOf(',');
    return comma >= 0 ? s.slice(comma + 1) : s;
  }

  function onFilesPicked(files) {
    const next = Array.from(files || []).filter(Boolean);
    if (next.length === 0) return;
    setSelectedFiles((prev) => {
      const byKey = new Map(prev.map((f) => [`${f.name}:${f.size}:${f.lastModified}`, f]));
      for (const f of next) byKey.set(`${f.name}:${f.size}:${f.lastModified}`, f);
      return Array.from(byKey.values());
    });
  }

  async function handleDownloadOrView(doc, { download }) {
    setError('');
    try {
      const data = await authedRequest(`/api/documents/${doc.id}`, { token });
      const full = data?.document;
      const base64 = full?.data;
      if (!base64) throw new Error('missing_data');
      const bin = atob(base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: full.mime || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      if (download) {
        const a = document.createElement('a');
        a.href = url;
        a.download = full.name || 'document';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch (e) {
      setError(e?.payload?.error || 'download_failed');
    }
  }

  async function handleDelete(docId) {
    setError('');
    try {
      await authedRequest(`/api/documents/${docId}`, { token, method: 'DELETE' });
      await loadDocuments();
    } catch (e) {
      setError(e?.payload?.error || 'delete_failed');
    }
  }

  const handleAIAction = (actionId) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (actionId === 'report') {
        setShowReportModal(true);
      } else {
        alert(`AI ${actionId} completed successfully!`);
      }
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
          <p className="mt-1 text-sm text-gray-500">AI-powered document management for trucking professionals</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Upload Documents
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {/* AI Features Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aiFeatures.map((feature) => (
          <div key={feature.id} className="relative rounded-lg bg-white shadow p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <feature.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{feature.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleAIAction(feature.id)}
              disabled={isProcessing}
              className="mt-4 w-full inline-flex justify-center items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {feature.action}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Category Filters */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Document Categories</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Documents
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {documents.length}
            </span>
          </button>
          {documentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {documents.filter(d => d.category === category.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name, date, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Documents Table or Empty State */}
      {loading ? (
        <div className="mt-6 rounded-lg bg-white shadow p-12 text-center">
          <ClockIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading…</h3>
        </div>
      ) : docsForUi.length === 0 ? (
        <div className="mt-6 rounded-lg bg-white shadow p-12 text-center">
          <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No documents yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Start by uploading your first document. Our AI will automatically categorize, tag, and extract key data from your billing documents, rate confirmations, insurance certificates, and permits.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
            Upload Your First Document
          </button>
        </div>
      ) : (
      <div className="mt-6 rounded-lg bg-white shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Processed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.map((doc) => {
              const status = statusConfig[doc.status];
              const category = documentCategories.find((c) => c.id === doc.category);
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category?.color}`}>
                      {category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      <status.icon className="h-4 w-4 mr-1" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.aiExtracted ? (
                      <span className="inline-flex items-center text-indigo-600">
                        <SparklesIcon className="h-5 w-5 mr-1" />
                        <span className="text-xs">Extracted</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-indigo-600"
                        title="View"
                        onClick={() => handleDownloadOrView(doc, { download: false })}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-green-600"
                        title="Download"
                        onClick={() => handleDownloadOrView(doc, { download: true })}
                      >
                        <CloudArrowDownIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h3>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFilesPicked(e.dataTransfer.files);
              }}
            >
              <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, PNG, JPG up to 10MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => onFilesPicked(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Select Files
              </button>
            </div>

            {selectedFiles.length ? (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">Selected</p>
                <div className="mt-2 space-y-2">
                  {selectedFiles.map((f) => (
                    <div key={`${f.name}:${f.size}:${f.lastModified}`} className="flex items-center justify-between text-sm">
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate">{f.name}</p>
                        <p className="text-gray-500 text-xs">{formatBytes(f.size)}</p>
                      </div>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 text-xs font-semibold"
                        onClick={() => setSelectedFiles((prev) => prev.filter((x) => x !== f))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-start">
                <SparklesIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-900">AI Auto-Processing</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    Uploaded documents will be automatically categorized, tagged, and key data will be extracted.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing || selectedFiles.length === 0}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                onClick={async () => {
                  setError('');
                  setIsProcessing(true);
                  try {
                    for (const f of selectedFiles) {
                      const base64 = await readFileAsBase64(f);
                      await authedRequest('/api/documents', {
                        token,
                        method: 'POST',
                        body: {
                          name: f.name,
                          mime: f.type || 'application/octet-stream',
                          size: f.size,
                          data: base64,
                        },
                      });
                    }
                    setSelectedFiles([]);
                    setShowUploadModal(false);
                    await loadDocuments();
                  } catch (e) {
                    setError(e?.payload?.error || 'upload_failed');
                  } finally {
                    setIsProcessing(false);
                  }
                }}
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Report Generator</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: 'Weekly Earnings Summary', desc: 'Revenue, expenses, and profit breakdown' },
                { name: 'IFTA Mileage Report', desc: 'State-by-state fuel tax calculations' },
                { name: 'Insurance Compliance', desc: 'Coverage status and expiration alerts' },
                { name: 'Broker Performance', desc: 'Payment history and reliability scores' },
                { name: 'Expense Analysis', desc: 'Categorized spending with trends' },
                { name: 'Tax Preparation', desc: 'Deductions and quarterly estimates' },
              ].map((report) => (
                <button
                  key={report.name}
                  className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-left transition-colors"
                >
                  <div className="flex items-center">
                    <DocumentChartBarIcon className="h-6 w-6 text-indigo-600" />
                    <span className="ml-3 text-sm font-medium text-gray-900">{report.name}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{report.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate Selected Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
