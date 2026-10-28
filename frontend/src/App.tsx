import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearnPage } from './pages/LearnPage';
import { StrategiesPage } from './pages/StrategiesPage';
import { RadarPage } from './pages/RadarPage';
import { PlannerPage } from './pages/PlannerPage';
import { ExpressionPage } from './pages/ExpressionPage';
import { GrowthPage } from './pages/GrowthPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="strategies" element={<StrategiesPage />} />
            <Route path="radar" element={<RadarPage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="expression" element={<ExpressionPage />} />
            <Route path="growth" element={<GrowthPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
