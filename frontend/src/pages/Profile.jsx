import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Zap, Star, Bell, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import BottomNav from '@/components/BottomNav';
import { driver } from '@/context/AppContext';

const achievements = [
  { Icon: Zap, name: 'Speed Demon', desc: '10 retrievals under 3 min', earned: true },
  { Icon: Star, name: 'Perfect Arrival', desc: '0 incidents this month', earned: true },
  { Icon: Award, name: 'Top Valet', desc: 'Most efficient this month', earned: true },
  { Icon: Shield, name: 'SLA Champion', desc: '99%+ compliance streak', earned: true },
];

const StatCard = ({ label, value, unit }) => (
  <div className="bg-card rounded-2xl px-4 py-4 border border-border">
    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1.5">{label}</p>
    <p className="text-2xl font-bold text-foreground tabular leading-none">
      {value}
      {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
    </p>
  </div>
);

export default function Profile() {
  const [shiftNotif, setShiftNotif] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [locationShare, setLocationShare] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-12" />

      {/* Header */}
      <motion.header
        className="px-5 pb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-[1.8rem] text-foreground font-medium">Profile</h1>
      </motion.header>

      <div className="flex-1 px-5 pb-24 overflow-y-auto space-y-5">
        {/* Driver Card */}
        <motion.div
          className="bg-card rounded-2xl p-5 border border-border relative overflow-hidden"
          style={{ borderColor: 'hsl(43 40% 28% / 0.4)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(43 77% 52% / 0.6), transparent)' }}
          />
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 20%))',
                border: '2px solid hsl(43 40% 28% / 0.5)',
                color: 'hsl(43 77% 60%)',
              }}
            >
              {driver.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-foreground">{driver.fullName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{driver.id}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'hsl(43 77% 52% / 0.12)',
                    color: 'hsl(43 77% 60%)',
                    border: '1px solid hsl(43 77% 52% / 0.25)',
                  }}
                >
                  {driver.tier} Tier
                </span>
                <span
                  className="text-[10px] text-muted-foreground px-2 py-1 rounded-full"
                  style={{ background: 'hsl(0 0% 12%)' }}
                >
                  Since {driver.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Shift Info */}
          <div
            className="mt-4 pt-4 flex items-center gap-4"
            style={{ borderTop: '1px solid hsl(0 0% 14%)' }}
          >
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {driver.shiftStart} – {driver.shiftEnd}
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-status-pulse" />
              <span className="text-xs" style={{ color: 'hsl(142 70% 55%)' }}>On Shift</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em] mb-3">
            Performance
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Monthly Trips" value={driver.totalTripsMonth} />
            <StatCard label="Active Time" value={`${driver.activeTime}%`} />
            <StatCard label="SLA Compliance" value={`${driver.slaCompliance}%`} />
            <StatCard label="Current Rank" value={`#${driver.rank}`} unit={`/ ${driver.totalDrivers}`} />
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em] mb-3">
            Achievements
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {achievements.map(({ Icon, name, desc, earned }) => (
              <div
                key={name}
                className="bg-card rounded-xl px-3.5 py-3.5 border border-border relative overflow-hidden"
                style={{
                  opacity: earned ? 1 : 0.45,
                  borderColor: earned ? 'hsl(43 40% 28% / 0.35)' : undefined,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                  style={{ background: earned ? 'hsl(43 77% 52% / 0.1)' : 'hsl(0 0% 12%)' }}
                >
                  <Icon size={15} style={{ color: earned ? 'hsl(43 77% 60%)' : 'hsl(0 0% 45%)' }} />
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em] mb-3">
            Settings
          </h2>
          <div className="bg-card rounded-2xl border border-border divide-y divide-border">
            {[
              { Icon: Bell, label: 'Shift Notifications', sub: 'Dispatch & retrieval alerts', val: shiftNotif, setter: setShiftNotif },
              { Icon: Bell, label: 'Sound Alerts', sub: 'Audio cues for new tasks', val: soundAlerts, setter: setSoundAlerts },
              { Icon: MapPin, label: 'Location Sharing', sub: 'Share live location with ops', val: locationShare, setter: setLocationShare },
            ].map(({ Icon, label, sub, val, setter }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-foreground/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <Switch
                  checked={val}
                  onCheckedChange={setter}
                  className="data-[state=checked]:bg-foreground"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          className="w-full py-4 rounded-2xl border border-border text-sm font-medium text-muted-foreground"
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          End Shift & Sign Out
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
