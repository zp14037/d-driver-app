import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const driver = {
  id: 'DR-2847',
  name: 'Driver',
  lastName: '',
  fullName: 'Driver 03',
  initials: 'D3',
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
  { id: 1, from: 'Villa 12', to: 'Lobby',    guest: 'Guest 1', vehicle: 'SUV 01', eta: '4 min', priority: 'normal' },
  { id: 2, from: 'Lobby',    to: 'Cafe 24',  guest: 'Guest 2', vehicle: 'SUV 01', eta: '6 min', priority: 'normal' },
  { id: 3, from: 'Pool Area',to: 'Spa',      guest: 'Guest 3', vehicle: 'SUV 01', eta: '3 min', priority: 'high' },
];

export const activityLogs = [
  { id: 1, time: '10:14 AM', type: 'fleet',  action: 'Dropped Guest 2 at Cafe 24',      duration: '6 mins', detail: 'Villa 12 → Cafe 24',    guest: 'Guest 2' },
  { id: 2, time: '09:42 AM', type: 'valet',  action: 'Parked Car 1 in Phase II',         duration: '4 mins', detail: 'Hook #45',              plate: 'MH02AH8897' },
  { id: 3, time: '09:30 AM', type: 'valet',  action: 'Retrieved Car 2 from Phase I',     duration: '5 mins', detail: 'Returned to Guest 1',  plate: 'DL04XY5678' },
  { id: 4, time: '09:15 AM', type: 'fleet',  action: 'Guest transport: Lobby → Spa',    duration: '8 mins', detail: 'Guest 1' },
  { id: 5, time: '08:52 AM', type: 'valet',  action: 'Parked Car 3 in Phase III',        duration: '3 mins', detail: 'Hook #22',              plate: 'KA09MN5678' },
  { id: 6, time: '08:41 AM', type: 'fleet',  action: 'Guest transport: Villa 5 → Lobby',duration: '5 mins', detail: 'Guest 4' },
  { id: 7, time: '08:30 AM', type: 'shift',  action: 'Shift started',                    duration: '',       detail: 'Good morning shift' },
];

export const leaderboardData = [
  { rank: 1,  name: 'Driver 01', id: 'DR-2234', trips: 18, activeTime: 95, sla: 100.0, isCurrentUser: false },
  { rank: 2,  name: 'Driver 02', id: 'DR-1876', trips: 16, activeTime: 91, sla: 99.8,  isCurrentUser: false },
  { rank: 3,  name: 'Driver 03', id: 'DR-2847', trips: 14, activeTime: 82, sla: 99.2,  isCurrentUser: true  },
  { rank: 4,  name: 'Driver 04', id: 'DR-3102', trips: 13, activeTime: 79, sla: 98.5,  isCurrentUser: false },
  { rank: 5,  name: 'Driver 05', id: 'DR-2956', trips: 12, activeTime: 77, sla: 97.8,  isCurrentUser: false },
  { rank: 6,  name: 'Driver 06', id: 'DR-3445', trips: 11, activeTime: 74, sla: 97.2,  isCurrentUser: false },
  { rank: 7,  name: 'Driver 07', id: 'DR-2788', trips: 10, activeTime: 71, sla: 96.8,  isCurrentUser: false },
  { rank: 8,  name: 'Driver 08', id: 'DR-3301', trips: 9,  activeTime: 68, sla: 96.1,  isCurrentUser: false },
  { rank: 9,  name: 'Driver 09', id: 'DR-3677', trips: 8,  activeTime: 65, sla: 95.5,  isCurrentUser: false },
  { rank: 10, name: 'Driver 10', id: 'DR-4012', trips: 7,  activeTime: 61, sla: 94.8,  isCurrentUser: false },
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
