import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TruckIcon, 
  WrenchScrewdriverIcon, 
  BoltIcon, 
  SparklesIcon,
  ArrowRightIcon,
  EyeIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import StatsCards from '../components/Dashboard/StatsCards';
import RecentActivity from '../components/Dashboard/RecentActivity';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <div className="py-2 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8">
          <div className="py-3 sm:py-4">
            <div className="rounded-lg">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-4">Welcome back, Driver!</h2>
                  <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your trucking business today.</p>
                </div>
                
                <StatsCards />

                {/* Load Oracle - Featured Hero Card */}
                <div 
                  onClick={() => navigate('/load-oracle')}
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 p-4 sm:p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all group"
                >
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"></div>
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <EyeIcon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">The Load Oracle</h3>
                          <p className="text-purple-200 text-sm">AI-Powered Bullshit Detector</p>
                        </div>
                      </div>
                      
                      <p className="mt-4 text-white/90 text-sm max-w-lg">
                        Upload any load offer screenshot and instantly see the <strong>True Net Profit</strong>. 
                        Our AI cross-references market rates, fuel costs, and deadhead risks to prevent revenue blindness.
                      </p>
                      
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-300 mr-1" />
                          <span className="text-xs text-white">True Profit Score</span>
                        </div>
                        <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          <MapPinIcon className="h-4 w-4 text-red-300 mr-1" />
                          <span className="text-xs text-white">Freight Desert Alerts</span>
                        </div>
                        <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
                          <ShieldExclamationIcon className="h-4 w-4 text-yellow-300 mr-1" />
                          <span className="text-xs text-white">Hidden Cost Analysis</span>
                        </div>
                      </div>
                      
                      <button className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-purple-700 shadow-lg hover:bg-purple-50 transition-colors group-hover:translate-x-1">
                        Analyze a Load Now
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="hidden lg:block ml-6">
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                        <div className="text-center mb-3">
                          <p className="text-white/70 text-xs">SAMPLE VERDICT</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-white">87</span>
                          </div>
                        </div>
                        <p className="text-center mt-2 text-green-300 font-bold">TAKE IT</p>
                        <div className="mt-3 space-y-1 text-xs">
                          <div className="flex justify-between text-white/80">
                            <span>Rate:</span>
                            <span className="font-medium">$2,450</span>
                          </div>
                          <div className="flex justify-between text-white/80">
                            <span>True Profit:</span>
                            <span className="font-medium text-green-300">$1,247</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-5 mt-4 sm:mt-6">
                  <button
                    type="button"
                    className="relative block w-full rounded-lg sm:rounded-xl bg-white border border-gray-200 p-3 sm:p-6 text-center sm:text-left hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    onClick={() => navigate('/load-oracle')}
                  >
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BoltIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-4">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">Oracle</p>
                        <p className="hidden sm:block text-xs text-gray-500">Check profitability</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="relative block w-full rounded-lg sm:rounded-xl bg-white border border-gray-200 p-3 sm:p-6 text-center sm:text-left hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    onClick={() => navigate('/broker-battler')}
                  >
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <ScaleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-4">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">Battler</p>
                        <p className="hidden sm:block text-xs text-gray-500">Start a dispute</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="relative block w-full rounded-lg sm:rounded-xl bg-white border border-gray-200 p-3 sm:p-6 text-center sm:text-left hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    onClick={() => navigate('/mechanics-eye')}
                  >
                    <div className="flex flex-col sm:flex-row items-center">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <WrenchScrewdriverIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="mt-2 sm:mt-0 sm:ml-4">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">Mechanic</p>
                        <p className="hidden sm:block text-xs text-gray-500">Diagnose issues</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="mt-8">
                  <RecentActivity />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;