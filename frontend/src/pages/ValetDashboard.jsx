import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, ChevronRight, X, Key, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Drawer, DrawerContent, DrawerHeader,
  DrawerTitle, DrawerClose,
} from '@/components/ui/drawer';
import BottomNav from '@/components/BottomNav';
import { parkingPhases } from '@/context/AppContext';
import { toast } from 'sonner';

const ParkingBar = ({ used, capacity }) => {
  const pct = (used / capacity) * 100;
  const color = pct > 90
    ? 'hsl(38 85% 52%)'
    : pct < 20
    ? 'hsl(142 70% 42%)'
    : 'hsl(0 0% 30%)';
  return (
    <div className="w-full h-[5px] bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: '0%' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.3, ease: 'easeOut', delay: 0.25 }}
      />
    </div>
  );
};

export default function ValetDashboard() {
  const navigate = useNavigate();
  const [showArrival, setShowArrival] = useState(false);
  const [showRetrieval, setShowRetrieval] = useState(false);
  const [plate, setPlate] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [phase, setPhase] = useState('');
  const [hookNum, setHookNum] = useState('');

  const recentArrivals = [
    { plate: 'MH-01-BC-5678', phase: 'Phase II', hook: '32', time: '10:45 AM' },
    { plate: 'DL-04-XY-9012', phase: 'Phase III', hook: '18', time: '10:22 AM' },
    { plate: 'KA-02-MN-3456', phase: 'Phase I', hook: '67', time: '09:55 AM' },
  ];

  const handleComplete = () => {
    if (!plate.trim() || !guestPhone.trim() || !phase || !hookNum.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    setShowArrival(false);
    toast.success(`${plate.toUpperCase()} secured`, {
      description: `${phase} · Hook #${hookNum} · Ticket sent`,
    });
    setPlate(''); setGuestPhone(''); setPhase(''); setHookNum('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-background/96 px-5 pt-12 pb-3 border-b border-border"
        style={{ backdropFilter: 'blur(16px)' }}>

        {/* Mode Toggle */}
        <div className="flex bg-secondary rounded-pill p-1 mb-4">
          <div className="flex-1 py-2.5 rounded-pill bg-foreground text-center text-[11px] font-semibold text-background tracking-[0.22em] uppercase">
            Valet
          </div>
          <button
            className="flex-1 py-2.5 rounded-pill text-center text-[11px] font-medium text-muted-foreground tracking-[0.22em] uppercase"
            style={{ transition: 'color 0.2s ease' }}
            onClick={() => navigate('/fleet')}
          >
            Fleet
          </button>
        </div>

        {/* Retrieval Alert Banner */}
        <motion.button
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 relative overflow-hidden"
          style={{
            background: 'hsl(38 85% 52% / 0.07)',
            border: '1px solid hsl(38 85% 52% / 0.35)',
          }}
          onClick={() => setShowRetrieval(true)}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 animate-status-pulse"
            style={{ backgroundColor: 'hsl(38 85% 52%)' }}
          />
          <span className="text-sm font-medium" style={{ color: 'hsl(38 85% 65%)' }}>
            1 Retrieval Pending
          </span>
          <span className="text-xs text-muted-foreground ml-auto font-mono">MH-12-AB-1234</span>
          <ChevronRight size={13} className="text-muted-foreground" />
        </motion.button>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-5 pt-6 pb-36 overflow-y-auto">

        {/* Parking Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em]">
              Parking Availability
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-status-pulse" />
              <span className="text-[10px] text-muted-foreground">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            {parkingPhases.map((p, i) => {
              const pct = Math.round((p.used / p.capacity) * 100);
              const remaining = p.capacity - p.used;
              return (
                <motion.div
                  key={p.id}
                  className="bg-card rounded-2xl px-5 py-4 border border-border relative overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  {p.recommended && (
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, hsl(142 70% 42% / 0.6), transparent)' }}
                    />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-semibold text-foreground">{p.label}</span>
                      {p.recommended && (
                        <span
                          className="text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 rounded-full"
                          style={{
                            color: 'hsl(142 70% 55%)',
                            background: 'hsl(142 70% 42% / 0.12)',
                            border: '1px solid hsl(142 70% 42% / 0.2)',
                          }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground tabular">
                      {p.used}/{p.capacity}
                    </span>
                  </div>
                  <ParkingBar used={p.used} capacity={p.capacity} />
                  <div className="flex justify-between mt-2.5">
                    <span className="text-[11px] text-muted-foreground">
                      {remaining} spots free
                    </span>
                    <span
                      className="text-[11px] font-semibold tabular"
                      style={{
                        color: pct > 90
                          ? 'hsl(38 85% 60%)'
                          : pct < 20
                          ? 'hsl(142 70% 55%)'
                          : 'hsl(0 0% 45%)',
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Recent Arrivals */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em] mb-3">
            Recent Arrivals
          </h2>
          <div className="space-y-2">
            {recentArrivals.map((car, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-card rounded-xl px-4 py-3.5 border border-border"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Car size={13} className="text-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground font-mono tracking-wider">{car.plate}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{car.phase} · Hook #{car.hook}</p>
                </div>
                <span className="text-xs text-muted-foreground tabular">{car.time}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* BOTTOM CTA */}
      <div
        className="fixed bottom-16 inset-x-0 max-w-[430px] mx-auto px-5 py-3"
        style={{ background: 'linear-gradient(to top, hsl(0 0% 4%) 55%, transparent)' }}
      >
        <Button
          className="w-full h-14 rounded-pill bg-foreground text-background font-semibold text-sm tracking-wide active:scale-[0.98]"
          style={{ transition: 'opacity 0.2s ease, transform 0.15s ease' }}
          onClick={() => setShowArrival(true)}
        >
          Handover Arrival
        </Button>
      </div>

      {/* ARRIVAL DRAWER */}
      <Drawer open={showArrival} onOpenChange={setShowArrival} shouldScaleBackground={false}>
        <DrawerContent
          className="bg-card border-t border-border rounded-t-3xl pb-8"
          style={{ maxWidth: '430px', margin: '0 auto' }}
        >
          <div className="px-6">
            <DrawerHeader className="px-0 pt-6 pb-2">
              <DrawerTitle className="font-serif text-xl text-foreground text-left font-medium">
                New Arrival
              </DrawerTitle>
              <p className="text-xs text-muted-foreground text-left mt-1">
                Guest receives instant digital valet ticket
              </p>
            </DrawerHeader>

            <div className="space-y-4 mt-3">
              {/* Plate */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">
                  Car License Plate
                </label>
                <Input
                  className="h-12 bg-secondary border-border text-foreground font-mono text-base tracking-[0.2em] uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground/50"
                  style={{ transition: 'border-color 0.2s ease' }}
                  onFocus={(e) => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.4)'; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                  placeholder="MH-12-AB-1234"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">
                  Guest WhatsApp Number
                </label>
                <Input
                  type="tel"
                  className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground/50"
                  style={{ transition: 'border-color 0.2s ease' }}
                  onFocus={(e) => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.4)'; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                />
              </div>

              {/* Phase Select */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">
                  Parked Location
                </label>
                <Select onValueChange={setPhase}>
                  <SelectTrigger className="h-12 bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Select Phase" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="Phase I">Phase I</SelectItem>
                    <SelectItem value="Phase II">Phase II — Recommended</SelectItem>
                    <SelectItem value="Phase III">Phase III</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hook Number */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">
                  Key Locker Hook #
                </label>
                <Input
                  type="number"
                  className="h-14 bg-secondary border-border text-foreground font-mono text-2xl text-center tracking-[0.2em] placeholder:text-muted-foreground/50"
                  style={{ transition: 'border-color 0.2s ease' }}
                  onFocus={(e) => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.4)'; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                  placeholder="00"
                  value={hookNum}
                  onChange={(e) => setHookNum(e.target.value)}
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full h-14 rounded-pill bg-foreground text-background font-semibold tracking-wide"
                onClick={handleComplete}
              >
                Secure &amp; Complete
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* RETRIEVAL ALERT MODAL */}
      <AnimatePresence>
        {showRetrieval && (
          <motion.div
            className="fixed inset-0 z-50 bg-background flex flex-col max-w-[430px] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 40% at 50% 30%, hsl(38 85% 52% / 0.06) 0%, transparent 70%)',
              }}
            />

            <div className="flex-1 flex flex-col px-6 pt-14 pb-8 relative z-10">
              {/* Top */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.28em] mb-2">
                    Departure Retrieval
                  </p>
                  <h2 className="font-serif text-[2rem] leading-tight text-foreground font-medium">
                    Retrieval
                    <br />Assigned
                  </h2>
                </div>
                <button
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
                  style={{ color: 'hsl(0 0% 60%)' }}
                  onClick={() => setShowRetrieval(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Detail Cards */}
              <div className="space-y-3 flex-1">
                {/* Vehicle */}
                <div className="bg-card rounded-2xl px-5 py-4 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.22em] mb-2">Vehicle</p>
                  <p className="font-mono text-[1.9rem] font-bold text-foreground tracking-[0.12em] leading-none">
                    MH-12-AB-1234
                  </p>
                </div>

                {/* Location */}
                <div className="bg-card rounded-2xl px-5 py-4 border border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.22em] mb-2">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-muted-foreground" />
                    <p className="text-xl font-semibold text-foreground">Phase II, Opp V11</p>
                  </div>
                </div>

                {/* KEY HOOK — CRITICAL */}
                <div
                  className="rounded-2xl px-5 py-5 relative overflow-hidden"
                  style={{
                    background: 'hsl(43 77% 52% / 0.07)',
                    border: '1.5px solid hsl(43 77% 52% / 0.45)',
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, hsl(43 77% 52% / 0.8), transparent)' }}
                  />
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.28em] mb-2"
                    style={{ color: 'hsl(43 77% 60%)' }}
                  >
                    Fetch Key From
                  </p>
                  <div className="flex items-end gap-3">
                    <Key size={20} style={{ color: 'hsl(43 77% 52%)' }} />
                    <span className="text-lg font-semibold text-foreground">Locker Hook</span>
                  </div>
                  <p
                    className="font-mono font-black leading-none mt-1 tabular"
                    style={{ fontSize: '4.5rem', color: 'hsl(43 77% 52%)' }}
                  >
                    #45
                  </p>
                </div>
              </div>

              {/* Accept Button */}
              <div className="mt-8">
                <Button
                  className="w-full h-16 rounded-pill bg-foreground text-background font-semibold text-base tracking-wide active:scale-[0.98]"
                  style={{ transition: 'opacity 0.2s, transform 0.15s' }}
                  onClick={() => {
                    setShowRetrieval(false);
                    toast.success('Retrieval accepted', {
                      description: 'Heading to Phase II · Hook #45',
                    });
                  }}
                >
                  Accept Task
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
