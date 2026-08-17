import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BottomNav from '@/components/BottomNav';
import { activityLogs } from '@/context/AppContext';

const weeklyLogs = [
  { id: 'w1', time: 'Mon 09:30', type: 'fleet', action: 'Guest transport: Lobby → Spa', duration: '7 mins', detail: 'Mr. & Mrs. Patel' },
  { id: 'w2', time: 'Mon 08:45', type: 'valet', action: 'Parked GJ-05 in Phase I', duration: '4 mins', detail: 'Hook #11' },
  { id: 'w3', time: 'Sun 14:20', type: 'fleet', action: 'Villa 8 → Adventure Zone', duration: '9 mins', detail: 'Family Kumar' },
  { id: 'w4', time: 'Sun 12:10', type: 'valet', action: 'Retrieved MH-02 Phase II', duration: '5 mins', detail: 'Returned to guest' },
  { id: 'w5', time: 'Sat 16:55', type: 'fleet', action: 'Cafe 24 → Lobby', duration: '4 mins', detail: 'Ms. Desai' },
];

const monthlyStats = {
  trips: 142,
  activeTime: 78,
  sla: 99.2,
};

const typeIcon = (type) => {
  if (type === 'fleet') return <Users size={13} className="text-muted-foreground" />;
  if (type === 'valet') return <Car size={13} className="text-muted-foreground" />;
  return <Clock size={13} className="text-muted-foreground" />;
};

const typeLabel = (type) => {
  if (type === 'fleet') return 'Fleet';
  if (type === 'valet') return 'Valet';
  return 'Shift';
};

const typeDot = (type) => {
  if (type === 'fleet') return 'hsl(210 80% 55%)';
  if (type === 'valet') return 'hsl(43 77% 52%)';
  return 'hsl(0 0% 45%)';
};

const MetricCard = ({ label, value, unit }) => (
  <div className="flex-1 bg-card rounded-2xl px-4 py-4 border border-border">
    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1.5">{label}</p>
    <p className="text-2xl font-bold text-foreground tabular leading-none">
      {value}
      {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
    </p>
  </div>
);

const LogTimeline = ({ logs }) => (
  <div className="space-y-0">
    {logs.map((log, i) => (
      <motion.div
        key={log.id}
        className="flex gap-4 relative"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05 }}
      >
        {/* Timeline rail */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="w-3 h-3 rounded-full mt-3.5 flex-shrink-0 z-10"
            style={{ backgroundColor: typeDot(log.type), boxShadow: `0 0 8px ${typeDot(log.type)}40` }}
          />
          {i < logs.length - 1 && (
            <div className="w-px flex-1 mt-1" style={{ background: 'hsl(0 0% 14%)' }} />
          )}
        </div>

        {/* Content */}
        <div
          className="flex-1 min-w-0 mb-4 rounded-xl px-4 py-3.5"
          style={{ background: i % 2 === 0 ? 'hsl(0 0% 8%)' : 'hsl(0 0% 10%)' }}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-foreground leading-snug">{log.action}</p>
            {log.duration && (
              <span className="text-[10px] text-muted-foreground tabular flex-shrink-0">{log.duration}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {typeIcon(log.type)}
              <span className="text-[10px] text-muted-foreground">{typeLabel(log.type)}</span>
            </div>
            {log.detail && (
              <span className="text-[10px] text-muted-foreground">· {log.detail}</span>
            )}
            <span className="text-[10px] text-muted-foreground ml-auto tabular">{log.time}</span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default function ActivityLogs() {
  const [tab, setTab] = useState('daily');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-12" />

      {/* Header */}
      <motion.header
        className="px-5 pb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-[1.8rem] text-foreground font-medium">Activity Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">Shift performance & history</p>
      </motion.header>

      {/* Summary Metrics */}
      <motion.div
        className="px-5 mb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="flex gap-3">
          <MetricCard label="Total Trips" value={monthlyStats.trips} />
          <MetricCard label="Active Time" value={`${monthlyStats.activeTime}%`} />
        </div>
        <div className="mt-3">
          <div className="bg-card rounded-2xl px-4 py-4 border border-border relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 77% 52% / 0.5), transparent)' }}
            />
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1.5">SLA Compliance</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-foreground tabular">{monthlyStats.sla}%</p>
              <span
                className="text-[11px] font-semibold mb-0.5 px-2 py-0.5 rounded-full"
                style={{
                  background: 'hsl(142 70% 42% / 0.12)',
                  color: 'hsl(142 70% 55%)',
                  border: '1px solid hsl(142 70% 42% / 0.2)',
                }}
              >
                Excellent
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex-1 px-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full bg-secondary rounded-pill mb-5 h-10">
            <TabsTrigger
              value="daily"
              className="flex-1 rounded-pill text-xs tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="flex-1 rounded-pill text-xs tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="flex-1 rounded-pill text-xs tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-0">
            <LogTimeline logs={activityLogs} />
          </TabsContent>
          <TabsContent value="weekly" className="mt-0">
            <LogTimeline logs={weeklyLogs} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-0">
            <div className="bg-card rounded-2xl p-6 border border-border text-center">
              <p className="text-muted-foreground text-sm">142 trips completed this month</p>
              <p className="text-foreground font-bold text-3xl tabular mt-2">99.2%</p>
              <p className="text-xs text-muted-foreground mt-1">SLA Compliance</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="h-24" />
      <BottomNav />
    </div>
  );
}
