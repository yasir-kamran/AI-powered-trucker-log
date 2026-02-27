import React, { useState, useRef } from 'react';
import {
  SparklesIcon,
  ArrowUpTrayIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  TruckIcon,
  CurrencyDollarIcon,
  FireIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ClockIcon,
  BoltIcon,
  ShieldExclamationIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentTextIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon, XCircleIcon as XCircleSolidIcon } from '@heroicons/react/24/solid';

const marketHeatmapData = {
  'Los Angeles, CA': { demand: 'high', avgRate: 2.95, trend: 'up' },
  'Dallas, TX': { demand: 'medium', avgRate: 2.45, trend: 'stable' },
  'Chicago, IL': { demand: 'high', avgRate: 2.75, trend: 'up' },
  'Atlanta, GA': { demand: 'medium', avgRate: 2.35, trend: 'down' },
  'Phoenix, AZ': { demand: 'low', avgRate: 2.15, trend: 'down' },
  'Denver, CO': { demand: 'medium', avgRate: 2.55, trend: 'stable' },
  'Miami, FL': { demand: 'low', avgRate: 2.25, trend: 'down' },
  'Seattle, WA': { demand: 'high', avgRate: 3.05, trend: 'up' },
};

const freightDeserts = [
  'Rural Montana',
  'West Texas',
  'Eastern Oregon',
  'Northern Nevada',
  'Southern New Mexico',
  'Rural Wyoming',
];

export default function LoadOracle() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);
  const fileInputRef = useRef(null);

  const [loadDetails, setLoadDetails] = useState({
    origin: '',
    destination: '',
    miles: '',
    rate: '',
    weight: '',
    pickupDate: '',
    deliveryDate: '',
    brokerName: '',
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        simulateAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        simulateAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualAnalysis = () => {
    if (loadDetails.origin && loadDetails.destination && loadDetails.miles && loadDetails.rate) {
      simulateAIAnalysis();
    }
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI processing time
    setTimeout(() => {
      // Generate realistic analysis based on input or random demo data
      const miles = parseInt(loadDetails.miles) || Math.floor(Math.random() * 1500) + 300;
      const rate = parseFloat(loadDetails.rate) || Math.floor(Math.random() * 2000) + 800;
      const ratePerMile = rate / miles;
      
      const origin = loadDetails.origin || 'Dallas, TX';
      const destination = loadDetails.destination || 'Phoenix, AZ';
      
      // Calculate costs
      const fuelPricePerGallon = 3.89;
      const mpg = 6.5;
      const fuelCost = (miles / mpg) * fuelPricePerGallon;
      
      // Deadhead risk calculation
      const destMarket = marketHeatmapData[destination] || { demand: 'low', avgRate: 2.15 };
      const isFreightDesert = freightDeserts.some(fd => destination.toLowerCase().includes(fd.toLowerCase()));
      const deadheadMiles = isFreightDesert ? Math.floor(miles * 0.4) : Math.floor(miles * 0.15);
      const deadheadCost = (deadheadMiles / mpg) * fuelPricePerGallon;
      
      // Other costs
      const tollsCost = Math.floor(miles * 0.05);
      const maintenanceCost = miles * 0.12;
      const insuranceCost = miles * 0.08;
      
      // Total costs
      const totalCosts = fuelCost + deadheadCost + tollsCost + maintenanceCost + insuranceCost;
      const trueNetProfit = rate - totalCosts;
      const profitMargin = (trueNetProfit / rate) * 100;
      
      // Market comparison
      const marketRate = destMarket.avgRate * miles;
      const rateVsMarket = ((rate - marketRate) / marketRate) * 100;
      
      // Calculate True Net Profit Score (0-100)
      let score = 50;
      if (profitMargin > 30) score += 25;
      else if (profitMargin > 20) score += 15;
      else if (profitMargin > 10) score += 5;
      else if (profitMargin < 0) score -= 30;
      
      if (rateVsMarket > 10) score += 15;
      else if (rateVsMarket < -10) score -= 15;
      
      if (destMarket.demand === 'high') score += 10;
      else if (destMarket.demand === 'low') score -= 10;
      
      if (isFreightDesert) score -= 20;
      
      score = Math.max(0, Math.min(100, score));
      
      // Determine verdict
      let verdict, verdictColor, verdictIcon;
      if (score >= 70) {
        verdict = 'TAKE IT';
        verdictColor = 'green';
        verdictIcon = CheckCircleSolidIcon;
      } else if (score >= 45) {
        verdict = 'NEGOTIATE';
        verdictColor = 'yellow';
        verdictIcon = ExclamationTriangleIcon;
      } else {
        verdict = 'WALK AWAY';
        verdictColor = 'red';
        verdictIcon = XCircleSolidIcon;
      }

      // Risk factors
      const risks = [];
      if (isFreightDesert) risks.push({ type: 'critical', text: 'Freight Desert - High deadhead risk' });
      if (destMarket.demand === 'low') risks.push({ type: 'warning', text: 'Low demand at destination' });
      if (ratePerMile < 2.0) risks.push({ type: 'warning', text: 'Below market rate per mile' });
      if (deadheadMiles > miles * 0.25) risks.push({ type: 'critical', text: `${deadheadMiles} estimated deadhead miles` });
      if (profitMargin < 15) risks.push({ type: 'warning', text: 'Thin profit margin' });

      // Opportunities
      const opportunities = [];
      if (destMarket.demand === 'high') opportunities.push('High demand at destination - easy reload');
      if (rateVsMarket > 5) opportunities.push('Rate is above market average');
      if (destMarket.trend === 'up') opportunities.push('Market rates trending upward');

      setAnalysisResult({
        // Extracted/Input data
        origin,
        destination,
        miles,
        rate,
        ratePerMile: ratePerMile.toFixed(2),
        
        // Costs breakdown
        fuelCost: fuelCost.toFixed(2),
        deadheadMiles,
        deadheadCost: deadheadCost.toFixed(2),
        tollsCost: tollsCost.toFixed(2),
        maintenanceCost: maintenanceCost.toFixed(2),
        insuranceCost: insuranceCost.toFixed(2),
        totalCosts: totalCosts.toFixed(2),
        
        // Profit analysis
        trueNetProfit: trueNetProfit.toFixed(2),
        profitMargin: profitMargin.toFixed(1),
        
        // Market analysis
        marketRate: marketRate.toFixed(2),
        rateVsMarket: rateVsMarket.toFixed(1),
        destMarketDemand: destMarket.demand,
        destMarketTrend: destMarket.trend,
        isFreightDesert,
        
        // Score and verdict
        score,
        verdict,
        verdictColor,
        verdictIcon,
        
        // Risks and opportunities
        risks,
        opportunities,
      });
      
      setIsAnalyzing(false);
    }, 2500);
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setLoadDetails({
      origin: '',
      destination: '',
      miles: '',
      rate: '',
      weight: '',
      pickupDate: '',
      deliveryDate: '',
      brokerName: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <EyeIcon className="h-7 w-7 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">The Load Oracle</h1>
              <p className="text-sm text-gray-500">AI-Powered Load Profitability Analyzer</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
          <ShieldExclamationIcon className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">Bullshit Detector Active</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Upload/Input */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <PhotoIcon className="h-5 w-5 mr-2 text-purple-600" />
              Upload Load Offer Screenshot
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Drop a screenshot from DAT, Truckstop, or any load board
            </p>

            <div
              className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                uploadedImage ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div>
                  <img
                    src={uploadedImage}
                    alt="Uploaded load"
                    loading="lazy"
                    decoding="async"
                    className="max-h-48 mx-auto rounded-lg shadow"
                  />
                  <p className="mt-3 text-sm text-green-600 font-medium">Screenshot uploaded!</p>
                </div>
              ) : (
                <>
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop or click to upload
                  </p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Manual Entry Toggle */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
                Or Enter Details Manually
              </h2>
              <button
                onClick={() => setManualEntry(!manualEntry)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {manualEntry ? 'Hide' : 'Show'}
              </button>
            </div>

            {manualEntry && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin</label>
                  <input
                    type="text"
                    placeholder="Dallas, TX"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                    value={loadDetails.origin}
                    onChange={(e) => setLoadDetails({ ...loadDetails, origin: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <input
                    type="text"
                    placeholder="Phoenix, AZ"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                    value={loadDetails.destination}
                    onChange={(e) => setLoadDetails({ ...loadDetails, destination: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Miles</label>
                  <input
                    type="number"
                    placeholder="850"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                    value={loadDetails.miles}
                    onChange={(e) => setLoadDetails({ ...loadDetails, miles: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate ($)</label>
                  <input
                    type="number"
                    placeholder="1850"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                    value={loadDetails.rate}
                    onChange={(e) => setLoadDetails({ ...loadDetails, rate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Broker Name</label>
                  <input
                    type="text"
                    placeholder="Optional"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                    value={loadDetails.brokerName}
                    onChange={(e) => setLoadDetails({ ...loadDetails, brokerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
                  <input
                    type="number"
                    placeholder="42000"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                    value={loadDetails.weight}
                    onChange={(e) => setLoadDetails({ ...loadDetails, weight: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <button
                    onClick={handleManualAnalysis}
                    disabled={!loadDetails.origin || !loadDetails.destination || !loadDetails.miles || !loadDetails.rate}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Analyze This Load
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Market Heatmap Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
              Live Market Heatmap
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {Object.entries(marketHeatmapData).slice(0, 6).map(([city, data]) => (
                <div key={city} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{city.split(',')[0]}</p>
                    <p className="text-xs text-gray-500">${data.avgRate}/mi</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    data.demand === 'high' ? 'bg-green-100 text-green-700' :
                    data.demand === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {data.demand}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Analysis Results */}
        <div className="space-y-6">
          {isAnalyzing ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="relative">
                <div className="h-24 w-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                  <ArrowPathIcon className="h-12 w-12 text-purple-600 animate-spin" />
                </div>
                <SparklesIcon className="absolute top-0 right-1/3 h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">The Oracle is Analyzing...</h3>
              <p className="mt-2 text-sm text-gray-500">Cross-referencing market data, fuel prices, and deadhead risks</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Extracting load details...
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <ArrowPathIcon className="h-4 w-4 text-purple-500 mr-2 animate-spin" />
                  Calculating true costs...
                </div>
              </div>
            </div>
          ) : analysisResult ? (
            <>
              {/* Verdict Card */}
              <div className={`rounded-xl shadow-lg p-6 ${
                analysisResult.verdictColor === 'green' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                analysisResult.verdictColor === 'yellow' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                'bg-gradient-to-br from-red-500 to-rose-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">THE ORACLE SAYS</p>
                    <h2 className="text-4xl font-bold text-white mt-1">{analysisResult.verdict}</h2>
                  </div>
                  <div className="text-right">
                    <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{analysisResult.score}</span>
                    </div>
                    <p className="text-white/80 text-xs mt-1">True Net Score</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white/70 text-xs">Offered Rate</p>
                    <p className="text-white font-bold text-lg">${analysisResult.rate}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">True Net Profit</p>
                    <p className="text-white font-bold text-lg">${analysisResult.trueNetProfit}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Profit Margin</p>
                    <p className="text-white font-bold text-lg">{analysisResult.profitMargin}%</p>
                  </div>
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Route Analysis
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-center">
                    <MapPinIcon className="h-6 w-6 text-green-500 mx-auto" />
                    <p className="mt-1 font-medium text-gray-900">{analysisResult.origin}</p>
                    <p className="text-xs text-gray-500">Origin</p>
                  </div>
                  <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-300 relative">
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm font-medium text-gray-600">
                      {analysisResult.miles} mi
                    </span>
                  </div>
                  <div className="text-center">
                    <FlagIcon className="h-6 w-6 text-red-500 mx-auto" />
                    <p className="mt-1 font-medium text-gray-900">{analysisResult.destination}</p>
                    <p className="text-xs text-gray-500">Destination</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500">Rate/Mile</p>
                    <p className="font-semibold text-gray-900">${analysisResult.ratePerMile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Market Demand</p>
                    <p className={`font-semibold ${
                      analysisResult.destMarketDemand === 'high' ? 'text-green-600' :
                      analysisResult.destMarketDemand === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysisResult.destMarketDemand.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">vs Market</p>
                    <p className={`font-semibold ${parseFloat(analysisResult.rateVsMarket) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(analysisResult.rateVsMarket) >= 0 ? '+' : ''}{analysisResult.rateVsMarket}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Hidden Cost Breakdown
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Fuel Cost ({analysisResult.miles} mi)</span>
                    <span className="font-medium text-gray-900">-${analysisResult.fuelCost}</span>
                  </div>
                  <div className={`flex items-center justify-between py-2 border-b border-gray-100 ${
                    analysisResult.isFreightDesert ? 'bg-red-50 -mx-2 px-2 rounded' : ''
                  }`}>
                    <span className="text-sm text-gray-600 flex items-center">
                      Deadhead Risk ({analysisResult.deadheadMiles} mi)
                      {analysisResult.isFreightDesert && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Freight Desert!</span>
                      )}
                    </span>
                    <span className="font-medium text-red-600">-${analysisResult.deadheadCost}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Tolls (estimated)</span>
                    <span className="font-medium text-gray-900">-${analysisResult.tollsCost}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Maintenance Reserve</span>
                    <span className="font-medium text-gray-900">-${analysisResult.maintenanceCost}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Insurance/Mile</span>
                    <span className="font-medium text-gray-900">-${analysisResult.insuranceCost}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 bg-gray-100 -mx-2 px-4 rounded-lg mt-2">
                    <span className="font-semibold text-gray-900">Total Hidden Costs</span>
                    <span className="font-bold text-red-600 text-lg">-${analysisResult.totalCosts}</span>
                  </div>
                </div>
              </div>

              {/* Risks & Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.risks.length > 0 && (
                  <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                    <h4 className="font-semibold text-red-800 flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                      Risk Factors
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {analysisResult.risks.map((risk, i) => (
                        <li key={i} className={`text-sm flex items-start ${
                          risk.type === 'critical' ? 'text-red-700' : 'text-red-600'
                        }`}>
                          <XCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {risk.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResult.opportunities.length > 0 && (
                  <div className="bg-green-50 rounded-xl border border-green-200 p-4">
                    <h4 className="font-semibold text-green-800 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Opportunities
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {analysisResult.opportunities.map((opp, i) => (
                        <li key={i} className="text-sm text-green-700 flex items-start">
                          <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Analyze Another Load
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Save Analysis
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                <EyeIcon className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">Ready to Analyze</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                Upload a screenshot of any load offer or enter the details manually. The Oracle will reveal the true profitability.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600 mx-auto" />
                  <p className="mt-1 text-xs text-gray-600">Market Analysis</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <FireIcon className="h-6 w-6 text-orange-500 mx-auto" />
                  <p className="mt-1 text-xs text-gray-600">Deadhead Risk</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600 mx-auto" />
                  <p className="mt-1 text-xs text-gray-600">True Profit</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
