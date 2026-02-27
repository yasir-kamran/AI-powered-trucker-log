import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import RequireAuth from './auth/RequireAuth';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Receipts = lazy(() => import('./pages/Receipts'));
const Ifta = lazy(() => import('./pages/Ifta'));
const BrokerBattler = lazy(() => import('./pages/BrokerBattler'));
const MechanicsEye = lazy(() => import('./pages/MechanicsEye'));
const Trips = lazy(() => import('./pages/Trips'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Broker = lazy(() => import('./pages/Broker'));
const Documents = lazy(() => import('./pages/Documents'));
const Settings = lazy(() => import('./pages/Settings'));
const LoadOracle = lazy(() => import('./pages/LoadOracle'));

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

const IftaReportingSoftware = lazy(() => import('./pages/IftaReportingSoftware'));
const TruckingAccountingSoftware = lazy(() => import('./pages/TruckingAccountingSoftware'));
const BookkeepingForTruckers = lazy(() => import('./pages/BookkeepingForTruckers'));
const ReceiptScannerForTruckers = lazy(() => import('./pages/ReceiptScannerForTruckers'));

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Loading…</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ifta-reporting-software" element={<IftaReportingSoftware />} />
        <Route path="/trucking-accounting-software" element={<TruckingAccountingSoftware />} />
        <Route path="/bookkeeping-for-truckers" element={<BookkeepingForTruckers />} />
        <Route path="/receipt-scanner-for-truckers" element={<ReceiptScannerForTruckers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<ResetPassword />} />

        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/ifta" element={<Ifta />} />
          <Route path="/broker-battler" element={<BrokerBattler />} />
          <Route path="/mechanics-eye" element={<MechanicsEye />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/broker" element={<Broker />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/load-oracle" element={<LoadOracle />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
