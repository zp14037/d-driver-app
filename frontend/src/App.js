import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import SplashScreen from './pages/SplashScreen';
import ModeSelection from './pages/ModeSelection';
import ValetDashboard from './pages/ValetDashboard';
import FleetDashboard from './pages/FleetDashboard';
import ActivityLogs from './pages/ActivityLogs';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="bg-background min-h-screen flex justify-center">
          <div className="w-full max-w-[430px] bg-background min-h-screen relative">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/home" element={<ModeSelection />} />
              <Route path="/valet" element={<ValetDashboard />} />
              <Route path="/fleet" element={<FleetDashboard />} />
              <Route path="/logs" element={<ActivityLogs />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'hsl(0 0% 12%)',
              border: '1px solid hsl(0 0% 18%)',
              color: 'hsl(0 0% 96%)',
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
