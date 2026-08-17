import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const driver = {
  id: 'DR-2847',
  name: 'Ravi',
  lastName: 'Sharma',
  fullName: 'Ravi Sharma',
  initials: 'RS',
  tier: 'Gold',
  nextTier: 'Diamond',
  rank: 3,
  totalDrivers: 17,
  activeTime: 82,
  streak: 3,
  tripsToday: 12,
  tripsToNextTier: 2,
  slaCompliance: 99.2,
  totalTripsMonth: 142,
  avgActiveTime: 78,
  shiftStart: '08:30 AM',
  shiftEnd: '06:30 PM',
  joinDate: 'March 2023',
};

export const parkingPhases = [
  { id: 'I', label: 'Phase I', used: 190, capacity: 200 },
  { id: 'II', label: 'Phase II', used: 15, capacity: 200, recommended: true },
  { id: 'III', label: 'Phase III', used: 150, capacity: 200 },
];

export const fleetQueue = [
  { id: 1, from: 'Villa 12', to: 'Lobby', guest: 'Mr. Patel', eta: '4 min', priority: 'normal' },
  { id: 2, from: 'Lobby', to: 'Cafe 24', guest: 'Ms. Sharma', eta: '6 min', priority: 'normal' },
  { id: 3, from: 'Pool Area', to: 'Spa', guest: 'Dr. Mehta', eta: '3 min', priority: 'high' },
];

export const activityLogs = [
  { id: 1, time: '10:14 AM', type: 'fleet', action: 'Dropped guest at Cafe 24', duration: '6 mins', detail: 'Villa 12 → Cafe 24', guest: 'Mr. Patel' },
  { id: 2, time: '09:42 AM', type: 'valet', action: 'Parked MH-12 in Phase II', duration: '4 mins', detail: 'Hook #45', plate: 'MH-12-AB-1234' },
  { id: 3, time: '09:30 AM', type: 'valet', action: 'Retrieved DL-04 from Phase I', duration: '5 mins', detail: 'Returned to guest', plate: 'DL-04-XY-9012' },
  { id: 4, time: '09:15 AM', type: 'fleet', action: 'Guest transport: Lobby → Spa', duration: '8 mins', detail: 'Mr. & Mrs. Kumar' },
  { id: 5, time: '08:52 AM', type: 'valet', action: 'Parked KA-09 in Phase III', duration: '3 mins', detail: 'Hook #22', plate: 'KA-09-MN-5678' },
  { id: 6, time: '08:41 AM', type: 'fleet', action: 'Guest transport: Villa 5 → Lobby', duration: '5 mins', detail: 'Ms. Jain' },
  { id: 7, time: '08:30 AM', type: 'shift', action: 'Shift started', duration: '', detail: 'Good morning shift' },
];

export const leaderboardData = [
  { rank: 1, name: 'Amara Nair', id: 'DR-2234', trips: 18, activeTime: 95, sla: 100.0, isCurrentUser: false },
  { rank: 2, name: 'Priya Singh', id: 'DR-1876', trips: 16, activeTime: 91, sla: 99.8, isCurrentUser: false },
  { rank: 3, name: 'Ravi Sharma', id: 'DR-2847', trips: 14, activeTime: 82, sla: 99.2, isCurrentUser: true },
  { rank: 4, name: 'Kumar Reddy', id: 'DR-3102', trips: 13, activeTime: 79, sla: 98.5, isCurrentUser: false },
  { rank: 5, name: 'Sanjay Mehta', id: 'DR-2956', trips: 12, activeTime: 77, sla: 97.8, isCurrentUser: false },
  { rank: 6, name: 'Deepa Iyer', id: 'DR-3445', trips: 11, activeTime: 74, sla: 97.2, isCurrentUser: false },
  { rank: 7, name: 'Arjun Kaur', id: 'DR-2788', trips: 10, activeTime: 71, sla: 96.8, isCurrentUser: false },
  { rank: 8, name: 'Meena Joshi', id: 'DR-3301', trips: 9, activeTime: 68, sla: 96.1, isCurrentUser: false },
  { rank: 9, name: 'Vikram Das', id: 'DR-3677', trips: 8, activeTime: 65, sla: 95.5, isCurrentUser: false },
  { rank: 10, name: 'Nisha Rao', id: 'DR-4012', trips: 7, activeTime: 61, sla: 94.8, isCurrentUser: false },
];

export function AppProvider({ children }) {
  const [currentMode, setCurrentMode] = useState('valet');
  const [notifications, setNotifications] = useState(1);

  return (
    <AppContext.Provider value={{ driver, currentMode, setCurrentMode, notifications, setNotifications }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
