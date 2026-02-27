import React, { useState } from 'react';
import {
  UserGroupIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  BoltIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Empty initial state for new users - brokers will be added by user
const initialBrokers = [];

// AI insights will be generated based on user's broker data
const getAiInsights = (brokers) => {
  if (brokers.length === 0) return [];
  
  const insights = [];
  const topBroker = brokers.reduce((a, b) => (a.aiScore > b.aiScore ? a : b), brokers[0]);
  const riskyBroker = brokers.find(b => b.status === 'warning' || b.onTimePayment < 60);
  
  if (topBroker && topBroker.aiScore >= 80) {
    insights.push({
      id: 1,
      type: 'recommendation',
      title: 'Top Performer Alert',
      message: `${topBroker.name} has consistently paid on time. Consider prioritizing their loads.`,
      broker: topBroker.name,
      icon: CheckBadgeIcon,
      color: 'bg-green-50 border-green-200 text-green-800',
    });
  }
  
  if (riskyBroker) {
    insights.push({
      id: 2,
      type: 'warning',
      title: 'Payment Risk Detected',
      message: `${riskyBroker.name} has declining payment reliability. AI recommends caution.`,
      broker: riskyBroker.name,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-50 border-red-200 text-red-800',
    });
  }
  
  return insights;
};

const statusConfig = {
  premium: { label: 'Premium Partner', color: 'bg-indigo-100 text-indigo-700', icon: CheckBadgeIcon },
  verified: { label: 'Verified', color: 'bg-green-100 text-green-700', icon: ShieldCheckIcon },
  caution: { label: 'Caution', color: 'bg-yellow-100 text-yellow-700', icon: ClockIcon },
  warning: { label: 'High Risk', color: 'bg-red-100 text-red-700', icon: ExclamationTriangleIcon },
};

export default function Broker() {
  const [brokers, setBrokers] = useState(initialBrokers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('aiScore');

  const aiInsights = getAiInsights(brokers);

  const filteredBrokers = brokers
    .filter((broker) => {
      const matchesSearch =
        broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broker.contact.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || broker.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'aiScore') return b.aiScore - a.aiScore;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'totalLoads') return b.totalLoads - a.totalLoads;
      return 0;
    });

  const handleAnalyzeBroker = (brokerName) => {
    setIsAnalyzing(true);
    setShowAnalyzeModal(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < Math.floor(rating) ? (
        <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
      )
    ));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Broker Management</h1>
          <p className="mt-1 text-sm text-gray-500">AI-powered broker intelligence and relationship management</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleAnalyzeBroker(null)}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <SparklesIcon className="h-5 w-5 mr-2 text-indigo-600" />
            AI Market Analysis
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Broker
          </button>
        </div>
      </div>

      {/* AI Insights Panel - Only show if there are insights */}
      {aiInsights.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <SparklesIcon className="h-5 w-5 mr-2 text-indigo-600" />
            AI Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`rounded-lg border p-4 ${insight.color}`}>
                <div className="flex items-start">
                  <insight.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{insight.title}</h3>
                    <p className="mt-1 text-xs opacity-90">{insight.message}</p>
                    <button className="mt-2 text-xs font-medium underline hover:no-underline">
                      View {insight.broker} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Brokers</p>
              <p className="text-2xl font-semibold text-gray-900">{brokers.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Premium Partners</p>
              <p className="text-2xl font-semibold text-gray-900">
                {brokers.filter((b) => b.status === 'premium').length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-yellow-50 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Rate/Mile</p>
              <p className="text-2xl font-semibold text-gray-900">
                {brokers.length > 0 ? `$${(brokers.reduce((acc, b) => acc + b.avgRate, 0) / brokers.length).toFixed(2)}` : '$0.00'}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Disputes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {brokers.reduce((acc, b) => acc + (b.disputes || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brokers by name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="premium">Premium</option>
            <option value="verified">Verified</option>
            <option value="caution">Caution</option>
            <option value="warning">High Risk</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="aiScore">Sort by AI Score</option>
            <option value="rating">Sort by Rating</option>
            <option value="totalLoads">Sort by Total Loads</option>
          </select>
        </div>
      </div>

      {/* Broker Cards or Empty State */}
      {brokers.length === 0 ? (
        <div className="mt-6 rounded-lg bg-white shadow p-12 text-center">
          <UserGroupIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No brokers yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Start building your broker network. Add your first broker and our AI will help you track their reliability, payment history, and provide smart recommendations.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Broker
          </button>
        </div>
      ) : (
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredBrokers.map((broker) => {
          const status = statusConfig[broker.status];
          return (
            <div
              key={broker.id}
              className="rounded-lg bg-white shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{broker.name}</h3>
                      <p className="text-sm text-gray-500">{broker.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      <status.icon className="h-3.5 w-3.5 mr-1" />
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {renderStars(broker.rating)}
                    <span className="ml-2 text-sm text-gray-600">{broker.rating}</span>
                  </div>
                  <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(broker.aiScore)}`}>
                    <BoltIcon className="h-4 w-4 mr-1" />
                    AI Score: {broker.aiScore}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Total Loads</p>
                    <p className="text-lg font-semibold text-gray-900">{broker.totalLoads}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Payment</p>
                    <p className="text-lg font-semibold text-gray-900">{broker.avgPayment}d</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rate/Mile</p>
                    <p className="text-lg font-semibold text-gray-900">${broker.avgRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">On-Time %</p>
                    <p className={`text-lg font-semibold ${broker.onTimePayment >= 90 ? 'text-green-600' : broker.onTimePayment >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {broker.onTimePayment}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Last load: {broker.lastLoad}
                  </div>
                  <div className="flex items-center">
                    {broker.trend === 'up' ? (
                      <span className="flex items-center text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                        Trending Up
                      </span>
                    ) : broker.trend === 'down' ? (
                      <span className="flex items-center text-red-600">
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                        Declining
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        Stable
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button className="text-gray-400 hover:text-indigo-600" title="Call">
                      <PhoneIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-600" title="Email">
                      <EnvelopeIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-600" title="View History">
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-indigo-600" title="Message">
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleAnalyzeBroker(broker.name)}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <SparklesIcon className="h-4 w-4 mr-1" />
                    AI Analysis
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Add Broker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Broker</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter broker company name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">MC Number (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="For AI verification"
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-start">
                <SparklesIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-900">AI Auto-Verification</p>
                  <p className="text-xs text-indigo-700 mt-1">
                    We'll automatically verify the broker's MC number, check payment history from public records, and generate an initial AI score.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Add & Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAnalyzeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI Broker Analysis</h3>
            {isAnalyzing ? (
              <div className="py-12 text-center">
                <ArrowPathIcon className="h-12 w-12 mx-auto text-indigo-600 animate-spin" />
                <p className="mt-4 text-gray-600">Analyzing broker data and market trends...</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 flex items-center">
                      <CheckBadgeIcon className="h-5 w-5 mr-2" />
                      Strengths
                    </h4>
                    <ul className="mt-2 text-sm text-green-700 space-y-1">
                      <li>• Consistent on-time payments (96% rate)</li>
                      <li>• Above-market rates ($2.85/mile avg)</li>
                      <li>• Low dispute history</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                      Areas to Watch
                    </h4>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Payment terms recently extended from 25 to 28 days</li>
                      <li>• Seasonal volume fluctuations expected Q2</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-medium text-indigo-800 flex items-center">
                      <LightBulbIcon className="h-5 w-5 mr-2" />
                      AI Recommendations
                    </h4>
                    <ul className="mt-2 text-sm text-indigo-700 space-y-1">
                      <li>• Negotiate for 21-day payment terms based on your history</li>
                      <li>• Request dedicated lanes for better rate consistency</li>
                      <li>• Consider volume commitment for 5% rate increase</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAnalyzeModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Close
                  </button>
                  <button className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Export Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
