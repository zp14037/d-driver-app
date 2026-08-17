import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Zap, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';
import BottomNav from '@/components/BottomNav';
import { fleetQueue } from '@/context/AppContext';
import { toast } from 'sonner';

const LOCATIONS = ['Pool', 'Lobby', 'Cafe 24', 'Villas', 'Spa', 'Temple Bells', 'Club Della', 'Aqua Park'];

export default function FleetDashboard() {
  const navigate = useNavigate();
  const [showPickup, setShowPickup] = useState(false);
  const [pickupStep, setPickupStep] = useState(1);
  const [fromLoc, setFromLoc] = useState('');
  const [toLoc, setToLoc] = useState('');
  const [queue, setQueue] = useState(fleetQueue);
  const [activeTrip, setActiveTrip] = useState(null);

  const resetPickup = () => {
    setPickupStep(1); setFromLoc(''); setToLoc('');
  };

  const handlePickupClose = () => {
    setShowPickup(false);
    setTimeout(resetPickup, 400);
  };

  const handleStartTrip = () => {
    setActiveTrip({ from: fromLoc, to: toLoc, type: 'instant' });
    setShowPickup(false);
    setTimeout(resetPickup, 400);
    toast.success('Trip started', {
      description: `${fromLoc} → ${toLoc}`,
    });
  };

  const handleAccept = (item) => {
    setActiveTrip({ from: item.from, to: item.to, guest: item.guest, type: 'dispatch' });
    setQueue((q) => q.filter((x) => x.id !== item.id));
    toast.success('Dispatch accepted', {
      description: `${item.from} → ${item.to} · ${item.guest}`,
    });
  };

  const handleEndTrip = () => {
    toast.success('Trip completed', {
      description: `${activeTrip.from} → ${activeTrip.to}`,
    });
    setActiveTrip(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* HEADER */}
      <header
        className="sticky top-0 z-20 px-5 pt-12 pb-4 border-b border-border"
        style={{ background: 'hsl(0 0% 4% / 0.96)', backdropFilter: 'blur(16px)' }}
      >
        {/* Mode Toggle */}
        <div className="flex bg-secondary rounded-pill p-1 mb-4">
          <button
            className="flex-1 py-2.5 rounded-pill text-center text-[11px] font-medium text-muted-foreground tracking-[0.22em] uppercase"
            style={{ transition: 'color 0.2s ease' }}
            onClick={() => navigate('/valet')}
          >
            Valet
          </button>
          <div className="flex-1 py-2.5 rounded-pill bg-foreground text-center text-[11px] font-semibold text-background tracking-[0.22em] uppercase">
            Fleet
          </div>
        </div>

        {/* Status + Active Trip */}
        {activeTrip ? (
          <motion.div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background: 'hsl(142 70% 42% / 0.1)',
              border: '1px solid hsl(142 70% 42% / 0.3)',
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-2 h-2 rounded-full bg-success animate-status-pulse" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">
                Active: {activeTrip.from} → {activeTrip.to}
              </p>
              {activeTrip.guest && (
                <p className="text-[11px] text-muted-foreground">{activeTrip.guest}</p>
              )}
            </div>
            <button
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: 'hsl(142 70% 42% / 0.15)',
                color: 'hsl(142 70% 55%)',
                border: '1px solid hsl(142 70% 42% / 0.25)',
              }}
              onClick={handleEndTrip}
            >
              End Trip
            </button>
          </motion.div>
        ) : (
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{
              background: 'hsl(142 70% 42% / 0.08)',
              border: '1px solid hsl(142 70% 42% / 0.2)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-success animate-status-pulse" />
            <span
              className="text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'hsl(142 70% 55%)' }}
            >
              Available
            </span>
            <span className="text-muted-foreground text-[11px] ml-auto">Awaiting Dispatch</span>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-5 pt-6 pb-40 overflow-y-auto">

        {/* Queue */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em]">
              Dispatch Queue
            </h2>
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full tabular"
              style={{
                background: 'hsl(0 0% 15%)',
                color: 'hsl(0 0% 70%)',
              }}
            >
              {queue.length} pending
            </span>
          </div>

          <AnimatePresence>
            {queue.length === 0 ? (
              <motion.div
                className="bg-card rounded-2xl p-8 border border-border text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Check size={28} className="text-success mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Queue cleared</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {queue.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="bg-card rounded-2xl px-5 py-4 border border-border"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {item.priority === 'high' && (
                            <div
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: 'hsl(38 85% 52%)' }}
                            />
                          )}
                          <p className="text-sm font-semibold text-foreground">
                            {item.from}
                            <ArrowRight size={12} className="inline mx-1.5 text-muted-foreground" />
                            {item.to}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{item.guest}</span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: 'hsl(0 0% 14%)',
                              color: 'hsl(0 0% 60%)',
                            }}
                          >
                            ETA {item.eta}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="h-9 px-4 rounded-pill bg-foreground text-background text-xs font-semibold tracking-wide ml-3 flex-shrink-0"
                        onClick={() => handleAccept(item)}
                      >
                        Accept
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Stats row */}
        <motion.div
          className="mt-8 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {[
            { label: 'Trips Today', value: '12' },
            { label: 'Active Time', value: '82%' },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl px-4 py-4 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1.5">{s.label}</p>
              <p className="text-2xl font-bold text-foreground tabular">{s.value}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* INSTANT PICKUP BUTTON */}
      <div
        className="fixed bottom-16 inset-x-0 max-w-[430px] mx-auto px-5 py-3"
        style={{ background: 'linear-gradient(to top, hsl(0 0% 4%) 55%, transparent)' }}
      >
        <motion.button
          className="w-full h-16 rounded-pill bg-foreground text-background font-bold text-sm tracking-[0.12em] uppercase flex items-center justify-center gap-2.5"
          whileTap={{ scale: 0.975 }}
          onClick={() => { resetPickup(); setShowPickup(true); }}
          style={{ transition: 'opacity 0.15s' }}
        >
          <Zap size={17} fill="currentColor" />
          Instant Pickup
        </motion.button>
      </div>

      {/* INSTANT PICKUP DRAWER */}
      <Drawer open={showPickup} onOpenChange={handlePickupClose} shouldScaleBackground={false}>
        <DrawerContent
          className="bg-card border-t border-border rounded-t-3xl pb-8"
          style={{ maxWidth: '430px', margin: '0 auto' }}
        >
          <div className="px-6">
            <DrawerHeader className="px-0 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="font-serif text-xl text-foreground font-medium">
                    {pickupStep === 1 ? 'Pickup Location' : 'Drop Location'}
                  </DrawerTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Step {pickupStep} of 2
                    {pickupStep === 2 && ` · From: ${fromLoc}`}
                  </p>
                </div>
                {/* Step indicator */}
                <div className="flex gap-1.5">
                  <div className="w-6 h-1.5 rounded-full bg-foreground" />
                  <div
                    className="w-6 h-1.5 rounded-full"
                    style={{ background: pickupStep === 2 ? 'hsl(0 0% 96%)' : 'hsl(0 0% 20%)' }}
                  />
                </div>
              </div>
            </DrawerHeader>

            {/* Location Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {LOCATIONS.filter((l) => pickupStep === 1 || l !== fromLoc).map((loc) => (
                <motion.button
                  key={loc}
                  className="rounded-xl py-4 px-3 text-sm font-medium text-left relative overflow-hidden"
                  style={{
                    background: (
                      pickupStep === 1 && fromLoc === loc
                      || pickupStep === 2 && toLoc === loc
                    )
                      ? 'hsl(0 0% 96%)'
                      : 'hsl(0 0% 12%)',
                    color: (
                      pickupStep === 1 && fromLoc === loc
                      || pickupStep === 2 && toLoc === loc
                    )
                      ? 'hsl(0 0% 4%)'
                      : 'hsl(0 0% 75%)',
                    border: '1px solid hsl(0 0% 18%)',
                    transition: 'background 0.2s ease, color 0.2s ease',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (pickupStep === 1) {
                      setFromLoc(loc);
                      setTimeout(() => setPickupStep(2), 180);
                    } else {
                      setToLoc(loc);
                    }
                  }}
                >
                  {loc}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            {pickupStep === 2 && toLoc && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-secondary rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{fromLoc}</span>
                  <ArrowRight size={14} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{toLoc}</span>
                </div>
                <Button
                  className="w-full h-14 rounded-pill bg-foreground text-background font-semibold tracking-wide"
                  onClick={handleStartTrip}
                >
                  Start Trip
                </Button>
              </motion.div>
            )}

            {pickupStep === 2 && !toLoc && (
              <button
                className="text-xs text-muted-foreground underline-offset-2 underline"
                onClick={() => setPickupStep(1)}
              >
                ← Change pickup
              </button>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <BottomNav />
    </div>
  );
}
