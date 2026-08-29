import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HealthDataProvider } from './context/HealthDataContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { Footer } from './components/layout/Footer';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { AudioAlertPlayer } from './components/common/AudioAlertPlayer';
import { EmergencyCountdownModal } from './components/emergency/EmergencyCountdownModal';
import { DemoControlBar } from './components/dashboard/DemoControlBar';
import { useHealthData } from './context/HealthDataContext';
import { useAuth } from './context/AuthContext';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HealthPage } from './pages/HealthPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { AlertsPage } from './pages/AlertsPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { HistoryPage } from './pages/HistoryPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

const AppLayout: React.FC = () => {
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);
  const { activeScenario, setScenario } = useHealthData();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      <DisclaimerBanner />
      <AudioAlertPlayer />
      <EmergencyCountdownModal />

      {/* Sidebar visible after login on desktop only */}
      <Sidebar onOpenDemoDrawer={() => setIsDemoDrawerOpen(true)} />

      {/* Bottom navbar visible after login on mobile/tablet screens */}
      <BottomNavBar />

      {/* TopBar offsets space left when logged in */}
      <TopBar onOpenDemoDrawer={() => setIsDemoDrawerOpen(true)} />

      <main className={`flex-grow transition-all duration-300 ${isAuthenticated ? 'pl-0 md:pl-16 pb-16 md:pb-0' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><HealthPage /></ProtectedRoute>} />
          <Route path="/environment" element={<ProtectedRoute><EnvironmentPage /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute><EmergencyPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </main>

      <DemoControlBar
        currentScenario={activeScenario}
        onSelectScenario={setScenario}
        isOpenDrawer={isDemoDrawerOpen}
        onCloseDrawer={() => setIsDemoDrawerOpen(false)}
      />

      <div className={`transition-all duration-300 ${isAuthenticated ? 'pl-0 md:pl-16 pb-16 md:pb-0' : ''}`}>
        <Footer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <HealthDataProvider>
        <AppLayout />
      </HealthDataProvider>
    </AuthProvider>
  );
}

export default App;
