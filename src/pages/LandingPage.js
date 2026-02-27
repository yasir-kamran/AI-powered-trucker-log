import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import {
  TruckIcon,
  SparklesIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  UserGroupIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const painPoints = [
  {
    icon: ClockIcon,
    title: 'Wasting Hours on Paperwork',
    description: 'Manually organizing receipts, BOLs, and rate confirmations takes time away from driving and earning.',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'Broker Payment Issues',
    description: 'Chasing down late payments and dealing with unreliable brokers costs you money and peace of mind.',
  },
  {
    icon: DocumentTextIcon,
    title: 'IFTA & Tax Headaches',
    description: 'Tracking fuel purchases across states and calculating quarterly IFTA taxes is confusing and error-prone.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Missing Deductions',
    description: 'Without proper expense tracking, you\'re likely overpaying on taxes and missing legitimate deductions.',
  },
];

const features = [
  {
    icon: BoltIcon,
    title: 'The Load Oracle - AI Profitability Analyzer',
    description: 'Upload any load offer screenshot and instantly see the TRUE net profit. Our AI detects hidden costs, freight deserts, and deadhead risks. Never accept a bad load again.',
    keywords: ['load profitability', 'trucker AI', 'freight calculator'],
    badge: 'NEW',
  },
  {
    icon: SparklesIcon,
    title: 'AI-Powered Document Organization',
    description: 'Upload any document and our AI instantly categorizes, tags, and extracts key data. Rate confirmations, insurance, permits - all organized in one click.',
    keywords: ['truckerlog', 'trucker app', 'document management'],
  },
  {
    icon: ChartBarIcon,
    title: 'Smart IFTA with Receipt Sync',
    description: 'Add fuel receipts with state/province selection and they auto-sync to your IFTA report. AI calculates tax owed/credit per jurisdiction with real tax rates for all 50 US states and Canadian provinces.',
    keywords: ['IFTA calculator', 'trucker tax', 'fuel tax'],
    badge: 'ENHANCED',
  },
  {
    icon: UserGroupIcon,
    title: 'Smart Broker Management',
    description: 'AI scores every broker based on payment history, reliability, and rates. Get warnings about risky brokers before you accept their loads.',
    keywords: ['broker management', 'trucker AI', 'freight broker'],
  },
  {
    icon: ShieldCheckIcon,
    title: 'Broker Battler - Dispute Resolution',
    description: 'AI generates professional demand letters for detention, TONU, and payment disputes. Select dispute type, enter details, and get a legally-sound letter in seconds.',
    keywords: ['broker disputes', 'trucking disputes', 'detention pay'],
  },
  {
    icon: LightBulbIcon,
    title: "Mechanic's Eye - Visual Diagnostics",
    description: 'Snap a photo of your dashboard warning light, error code, or suspicious part. AI explains the issue, severity level, and whether it\'s safe to keep driving.',
    keywords: ['truck diagnostics', 'trucker help', 'truck repair'],
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Expense Tracking & Tax Reports',
    description: 'Every expense categorized for maximum deductions. Generate tax-ready reports that your accountant will love.',
    keywords: ['trucker expenses', 'trucking tax deductions', 'owner operator'],
  },
  {
    icon: DocumentTextIcon,
    title: 'Receipt Scanner with IFTA Auto-Sync',
    description: 'Scan fuel receipts, select the state, enter gallons - data automatically flows to your IFTA quarterly report. Export to CSV anytime.',
    keywords: ['receipt scanner', 'trucker receipts', 'fuel tracking'],
    badge: 'NEW',
  },
];

const testimonials = [
  {
    name: 'Mike Rodriguez',
    role: 'Owner Operator, 12 years',
    location: 'Texas',
    quote: 'TruckerLog AI saved me 10+ hours a week on paperwork. The broker scoring feature alone has saved me from 3 bad loads this month.',
    rating: 5,
    feature: 'Broker Management',
  },
  {
    name: 'Sarah Thompson',
    role: 'Fleet Owner, 5 trucks',
    location: 'Ohio',
    quote: 'IFTA reporting used to take my whole weekend. Now it\'s done in minutes. This app pays for itself every quarter.',
    rating: 5,
    feature: 'IFTA Reporting',
  },
  {
    name: 'James Wilson',
    role: 'Independent Driver',
    location: 'California',
    quote: 'The Broker Battler helped me recover $2,400 in detention fees that I would have just written off. Game changer.',
    rating: 5,
    feature: 'Broker Battler',
  },
  {
    name: 'Carlos Martinez',
    role: 'Owner Operator, 8 years',
    location: 'Florida',
    quote: 'The Load Oracle is incredible. I was about to take a load that looked like $2,800 profit but the AI showed me it was actually only $400 after deadhead. Saved my week.',
    rating: 5,
    feature: 'Load Oracle',
  },
  {
    name: 'Linda Chen',
    role: 'Fleet Manager, 12 trucks',
    location: 'Georgia',
    quote: 'Managing receipts for 12 trucks was a nightmare. Now drivers just snap photos and everything syncs to IFTA automatically. Worth every penny.',
    rating: 5,
    feature: 'Receipt Scanner',
  },
  {
    name: 'Robert Johnson',
    role: 'OTR Driver, 15 years',
    location: 'Tennessee',
    quote: 'Mechanic\'s Eye diagnosed my check engine light at 2 AM in the middle of nowhere. Told me it was safe to drive to the next shop. That peace of mind is priceless.',
    rating: 5,
    feature: "Mechanic's Eye",
  },
  {
    name: 'Amanda Foster',
    role: 'Owner Operator, 3 years',
    location: 'Arizona',
    quote: 'As a new owner operator, I was losing money on bad loads constantly. Load Oracle taught me what to look for. My profit margin is up 40% in 2 months.',
    rating: 5,
    feature: 'Load Oracle',
  },
  {
    name: 'David Kim',
    role: 'Small Fleet Owner, 3 trucks',
    location: 'Washington',
    quote: 'The AI document organization is magic. I uploaded 500 documents and it sorted everything perfectly. Found insurance docs I thought I\'d lost.',
    rating: 5,
    feature: 'Document AI',
  },
  {
    name: 'Patricia Williams',
    role: 'Independent Driver',
    location: 'Illinois',
    quote: 'Got stiffed by a broker for $1,800. Broker Battler generated a demand letter and I had my money in 5 days. This app is my secret weapon.',
    rating: 5,
    feature: 'Broker Battler',
  },
];

const stats = [
  { value: '10,000+', label: 'Active Truckers' },
  { value: '$2.4M', label: 'Recovered for Drivers' },
  { value: '50,000+', label: 'Documents Processed' },
  { value: '4.9/5', label: 'App Store Rating' },
];

// Testimonial Carousel Component with navigation buttons
function TestimonialCarousel({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 3;
  const maxIndex = testimonials.length - cardsToShow;

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="mt-12 relative">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
          currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:scale-110'
        }`}
        style={{ left: '-24px' }}
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        disabled={currentIndex >= maxIndex}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
          currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:scale-110'
        }`}
        style={{ right: '-24px' }}
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Cards Container */}
      <div className="overflow-hidden mx-4">
        <div 
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow + 2)}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name} 
              className="w-full md:w-[calc(33.333%-16px)] flex-shrink-0 bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Feature Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  {testimonial.feature}
                </span>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 leading-relaxed min-h-[100px] text-sm">"{testimonial.quote}"</p>
              
              {/* Author */}
              <div className="mt-6 flex items-center border-t border-gray-100 pt-4">
                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
                <p className="text-xs text-gray-400">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dot Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {testimonials.slice(0, maxIndex + 1).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-indigo-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const pricingPlans = [
  {
    name: 'Pro',
    price: '$14.99',
    period: '/month',
    description: 'Built for Owner-Operators',
    features: [
      'AI document processing (100/month)',
      'Load Oracle - 30 analyses/month',
      'Smart broker management & scoring',
      'Automated IFTA reports',
      'Broker Battler - 5 letters/month',
      "Mechanic's Eye - 10 scans/month",
      'Email support',
    ],
    cta: 'Start 10-Day Free Trial',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Fleet',
    price: '$99',
    period: '/month',
    description: 'Includes 3 drivers + $10/driver after',
    features: [
      'Unlimited AI document processing',
      'Unlimited Load Oracle analyses',
      'Unlimited Broker Battler letters',
      "Unlimited Mechanic's Eye scans",
      '3 drivers included (+$10/additional)',
      'Fleet-wide analytics dashboard',
      'API access for integrations',
      'Dedicated account manager',
      'Invoice factoring (Coming Q4)',
      'Instant driver payouts (Coming Soon)',
    ],
    cta: 'Start 10-Day Free Trial',
    highlighted: false,
    badge: 'Best for Growth',
  },
];

export default function LandingPage() {
  const description =
    'AI trucking business software for owner-operators and fleets: IFTA reporting, receipt scanning, expense tracking, document organization, broker tools, and load profitability analysis.';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TruckerLog AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="bg-white">
      <Seo
        title="TruckerLog AI | IFTA, Receipts & Trucking Accounting Software"
        description={description}
        canonicalPath="/"
        structuredData={structuredData}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TruckerLog <span className="text-indigo-600">AI</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-6">
                <SparklesIcon className="h-4 w-4 mr-2" />
                AI-Powered Trucking Software
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI Trucking Accounting & IFTA Reporting —{' '}
                <span className="text-indigo-600">On Autopilot</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
                TruckerLog AI is an AI business manager for owner-operators and fleets: it tracks expenses, organizes documents, scans receipts, and generates IFTA reports.
                <strong className="text-gray-900"> Spend less time on admin, more time earning.</strong>
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition-all hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3.5 text-base font-semibold text-gray-900 shadow-md ring-1 ring-gray-200 hover:bg-gray-50 transition-colors">
                  <PlayIcon className="mr-2 h-5 w-5 text-indigo-600" />
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  14-day free trial
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Dashboard</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">This Week</p>
                    <p className="text-2xl font-bold text-gray-900">$4,280</p>
                    <p className="text-xs text-green-600">↑ 12% vs last week</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500">Miles Driven</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                    <p className="text-xs text-gray-500">Across 4 states</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
                  <SparklesIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">AI Insight</p>
                    <p className="text-xs text-yellow-700">Your insurance expires in 12 days. Upload renewal to stay compliant.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Document Processed</p>
                    <p className="text-xs text-gray-500">Rate confirmation extracted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-indigo-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-indigo-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured: Load Oracle */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-purple-500/20 border border-purple-400/30 px-4 py-1.5 text-sm font-medium text-purple-200 mb-6">
                <BoltIcon className="h-4 w-4 mr-2" />
                NEW FEATURE
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                The Load Oracle
              </h2>
              <p className="mt-2 text-xl text-purple-200 font-medium">
                AI-Powered Bullshit Detector for Load Offers
              </p>
              <p className="mt-6 text-lg text-gray-300 leading-relaxed">
                Stop accepting loads that look profitable but eat your margins. Upload any load offer screenshot and our AI instantly reveals the <span className="text-green-400 font-semibold">TRUE net profit</span> after all hidden costs.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
                  <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">True Profit Score</p>
                    <p className="text-gray-400 text-sm">After ALL costs</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
                  <div className="h-10 w-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Freight Desert Alerts</p>
                    <p className="text-gray-400 text-sm">Deadhead warnings</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
                  <div className="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Hidden Cost Analysis</p>
                    <p className="text-gray-400 text-sm">Fuel, tolls, time</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
                  <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">Market Rate Check</p>
                    <p className="text-gray-400 text-sm">vs. lane averages</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-purple-700 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Try Load Oracle Free
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <p className="text-purple-200 text-sm font-medium">SAMPLE ANALYSIS</p>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Chicago, IL → Dallas, TX</span>
                    <span className="text-white font-medium">920 mi</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Posted Rate</span>
                    <span className="text-white font-medium">$2,450</span>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="text-3xl font-bold text-white">87</span>
                  </div>
                </div>
                <p className="text-center text-green-400 font-bold text-lg mb-4">TAKE IT ✓</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fuel Cost</span>
                    <span className="text-red-400">-$483</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tolls</span>
                    <span className="text-red-400">-$67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operating Cost</span>
                    <span className="text-red-400">-$653</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between">
                    <span className="text-white font-medium">True Net Profit</span>
                    <span className="text-green-400 font-bold">$1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">$/Mile (Net)</span>
                    <span className="text-green-400 font-medium">$1.36</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Sound Familiar?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every trucker faces these challenges. We built TruckerLog AI to solve them.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {painPoints.map((point) => (
              <div key={point.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <point.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{point.title}</h3>
                    <p className="mt-2 text-gray-600">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / Features Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 mb-4">
              <LightBulbIcon className="h-4 w-4 mr-2" />
              The Solution
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              AI That Actually Understands Trucking
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built by truckers, for truckers. Every feature designed to save you time and money.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all group relative">
                {feature.badge && (
                  <span className={`absolute top-4 right-4 px-2 py-1 text-xs font-bold rounded-full ${
                    feature.badge === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {feature.badge}
                  </span>
                )}
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <feature.icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 pr-16">{feature.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              From signup to saving hours - it only takes minutes.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up free in 30 seconds. No credit card required.',
              },
              {
                step: '2',
                title: 'Upload Your Documents',
                description: 'Snap photos or upload PDFs. AI organizes everything automatically.',
              },
              {
                step: '3',
                title: 'Let AI Do The Work',
                description: 'Get insights, reports, and recommendations while you focus on driving.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white text-indigo-600 text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-indigo-100">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Start Your Free Trial
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Trusted by Thousands of Truckers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what owner operators and fleet owners are saying about TruckerLog AI.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
          
          {/* Carousel Container */}
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 mb-4">
              🎉 10-Day Free Trial • No Credit Card Required
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Try everything free for 10 days. No hidden fees, cancel anytime.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-8 shadow-sm border-2 ${
                  plan.highlighted ? 'border-indigo-600 shadow-lg scale-105' : 'border-gray-100'
                }`}
              >
                {plan.badge && (
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mb-4 ${
                    plan.highlighted ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`mt-8 block w-full text-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Take Control of Your Trucking Business?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join 10,000+ truckers who are saving time and making more money with TruckerLog AI.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              Start Your Free Trial
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-400 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
                <TruckIcon className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-white">TruckerLog <span className="text-indigo-400">AI</span></span>
              </div>
              <p className="mt-4 text-gray-400 text-sm max-w-md">
                The #1 AI-powered trucking software for owner operators and fleet owners. 
                Automate your paperwork, track expenses, and grow your business.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white text-sm">Pricing</a></li>
                <li><Link to="/ifta-reporting-software" className="text-gray-400 hover:text-white text-sm">IFTA Reporting Software</Link></li>
                <li><Link to="/trucking-accounting-software" className="text-gray-400 hover:text-white text-sm">Trucking Accounting Software</Link></li>
                <li><Link to="/bookkeeping-for-truckers" className="text-gray-400 hover:text-white text-sm">Bookkeeping for Truckers</Link></li>
                <li><Link to="/receipt-scanner-for-truckers" className="text-gray-400 hover:text-white text-sm">Receipt Scanner for Truckers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm text-center">
              © 2026 TruckerLog AI. All rights reserved. Built for truckers, by truckers.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
