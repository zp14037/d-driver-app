import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { FleetMap, normalizeFleetLoc } from '@/components/ResortMap';
import { fleetQueue } from '@/context/AppContext';
import { toast } from 'sonner';

const LOCATIONS = ['Pool', 'Lobby', 'Cafe 24', 'Villas', 'Spa', 'Temple Bells', 'Club Della', 'Aqua Park'];
const SUV_ID = 'SUV 01';

// ── timer helper ────────────────────────────────────────────────────────
const fmt = s => {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}:${String(s % 60).padStart(2, '0')}`;
};

// ── slide animation ─────────────────────────────────────────────────────
const slideProps = {
  initial: { opacity: 0, x: 55 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -55 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

// ── Full-screen direction screen ─────────────────────────────────────────
const DirectionScreen = ({ headingLabel, dirLabel, dest, originLoc, destLoc, guest, onAction, actionLabel }) => (
  <motion.div
    key={`dir-${dest}`}
    className="absolute inset-0 flex flex-col bg-background"
    {...slideProps}
  >
    <div className="px-5 pt-6 pb-3 flex-shrink-0">
      {headingLabel && (
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground mb-1.5">{headingLabel}</p>
      )}
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">{dirLabel}</p>
      <h2 className="font-serif text-[2rem] text-foreground font-medium leading-tight">{dest}</h2>
      {guest && (
        <div className="flex items-center gap-2 mt-2">
          <Users size={12} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{guest}</span>
        </div>
      )}
    </div>
    <div className="mx-5 flex-1 rounded-2xl overflow-hidden border border-border mb-3"
      style={{ minHeight:'200px', maxHeight:'280px' }}>
      <FleetMap origin={originLoc} destination={destLoc} />
    </div>
    <div className="px-5 py-4 pb-24 flex-shrink-0" style={{ borderTop:'1px solid hsl(0 0% 11%)' }}>
      <motion.button
        className="w-full h-16 rounded-pill bg-foreground text-background font-bold text-sm tracking-[0.06em]"
        whileTap={{ scale: 0.975 }}
        onClick={onAction}
      >{actionLabel}</motion.button>
    </div>
  </motion.div>
);

// ══ MAIN COMPONENT ══════════════════════════════════════════════════════
export default function FleetDashboard() {
  const navigate = useNavigate();

  const [step, setStep]   = useState('idle');
  const [queue, setQueue] = useState(fleetQueue);
  const [trip, setTrip]   = useState(null);
  const [pickupFrom, setPickupFrom] = useState('');
  const [pickupTo, setPickupTo]     = useState('');
  const [ipStep, setIpStep]         = useState(1);

  // ── Shift timer ──────────────────────────────────────────────────────
  const [busy, setBusy] = useState(11115);
  const [free, setFree] = useState(4060);
  const isBusy = step !== 'idle';

  useEffect(() => {
    const t = setInterval(() => {
      if (isBusy) setBusy(s => s + 1);
      else setFree(s => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [isBusy]);

  const acceptDispatch = item => {
    setTrip({ from: item.from, to: item.to, guest: item.guest });
    setQueue(q => q.filter(x => x.id !== item.id));
    setStep('routing-pickup');
  };

  const startInstantTrip = () => {
    setTrip({ from: pickupFrom, to: pickupTo, guest: null });
    setStep('routing-pickup');
    setPickupFrom(''); setPickupTo(''); setIpStep(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── MODE TOGGLE ──────────────────────────────────── */}
      <header className="sticky top-0 z-20 px-5 pt-12 pb-3 border-b border-border flex-shrink-0"
        style={{ background:'hsl(0 0% 4% / 0.97)', backdropFilter:'blur(16px)' }}>
        <div className="flex bg-secondary rounded-pill p-1">
          <button className="flex-1 py-2.5 text-center text-[11px] font-medium text-muted-foreground tracking-[0.22em] uppercase"
            style={{ transition:'color 0.2s' }} onClick={() => navigate('/valet')}>Valet</button>
          <div className="flex-1 py-2.5 rounded-pill bg-foreground text-center text-[11px] font-bold text-background tracking-[0.22em] uppercase">Fleet</div>
        </div>
      </header>

      {/* ── SHIFT TIMER (always visible) ─────────────────── */}
      <div className="px-5 py-4 flex-shrink-0" style={{ background:'hsl(0 0% 7%)', borderBottom:'1px solid hsl(0 0% 12%)' }}>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isBusy?'animate-status-pulse':''}`}
                style={{ backgroundColor:isBusy?'hsl(142 70% 42%)':'hsl(0 0% 24%)' }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Busy Time</span>
            </div>
            <p className="font-mono text-[1.65rem] font-bold text-foreground tabular leading-none">{fmt(busy)}</p>
          </div>
          <div className="w-px h-12 bg-border mx-4" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${!isBusy?'animate-status-pulse':''}`}
                style={{ backgroundColor:!isBusy?'hsl(0 72% 51%)':'hsl(0 0% 24%)' }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Free Time</span>
            </div>
            <p className="font-mono text-[1.65rem] font-bold text-foreground tabular leading-none">{fmt(free)}</p>
          </div>
        </div>
      </div>

      {/* ── STATE MACHINE ────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ═══ IDLE ═══ */}
          {step === 'idle' && (
            <motion.div key="fleet-idle" className="absolute inset-0 flex flex-col bg-background overflow-y-auto"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

              {/* Status */}
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{ background:'hsl(142 70% 42% / 0.08)', border:'1px solid hsl(142 70% 42% / 0.22)' }}>
                  <div className="w-2 h-2 rounded-full bg-success animate-status-pulse" />
                  <span className="text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color:'hsl(142 70% 55%)' }}>Available</span>
                  <span className="text-muted-foreground text-[11px] ml-1">· {SUV_ID}</span>
                  <span className="text-muted-foreground text-[11px] ml-auto">Awaiting dispatch</span>
                </div>
              </div>

              {/* Queue */}
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.22em]">Dispatch Queue</h2>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tabular"
                    style={{ background:'hsl(0 0% 14%)', color:'hsl(0 0% 65%)' }}>
                    {queue.length} pending
                  </span>
                </div>
                <AnimatePresence>
                  {queue.length === 0 ? (
                    <motion.div className="bg-card rounded-2xl p-8 border border-border text-center"
                      initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
                      <Check size={26} className="text-success mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Queue cleared</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {queue.map((item, i) => (
                        <motion.div key={item.id} className="bg-card rounded-2xl px-5 py-4 border border-border"
                          initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                          exit={{ opacity:0, x:30, height:0, marginBottom:0 }}
                          transition={{ delay:i*0.04 }}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                {item.priority==='high' && (
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor:'hsl(38 85% 52%)' }} />
                                )}
                                <p className="text-sm font-semibold text-foreground">
                                  {item.from}
                                  <ArrowRight size={11} className="inline mx-1.5 text-muted-foreground" />
                                  {item.to}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">{item.guest}</span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  style={{ background:'hsl(0 0% 14%)', color:'hsl(0 0% 58%)' }}>
                                  ETA {item.eta}
                                </span>
                              </div>
                            </div>
                            <Button
                              className="h-9 px-4 rounded-pill bg-foreground text-background text-xs font-semibold tracking-wide ml-3 flex-shrink-0"
                              onClick={() => acceptDispatch(item)}>Accept</Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 px-5 pb-40">
                {[{ label:'Trips Today', value:'12' },{ label:'Active Time', value:'82%' }].map(s => (
                  <div key={s.label} className="bg-card rounded-2xl px-4 py-4 border border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.18em] mb-1.5">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground tabular">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* INSTANT PICKUP button */}
              <div className="fixed bottom-16 inset-x-0 max-w-[430px] mx-auto px-5 py-3"
                style={{ background:'linear-gradient(to top, hsl(0 0% 4%) 55%, transparent)' }}>
                <motion.button
                  className="w-full h-16 rounded-pill bg-foreground text-background font-bold text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-2.5"
                  whileTap={{ scale:0.975 }}
                  onClick={() => { setIpStep(1); setPickupFrom(''); setPickupTo(''); setStep('instant-select'); }}
                >
                  <Zap size={16} fill="currentColor" />
                  Instant Pickup
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ═══ INSTANT PICKUP SELECTION ═══ */}
          {step === 'instant-select' && (
            <motion.div key="instant-select" className="absolute inset-0 flex flex-col bg-background" {...slideProps}>
              <div className="px-5 pt-6 pb-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                    {ipStep===1 ? 'Step 1 of 2 · Pickup Location' : 'Step 2 of 2 · Drop Location'}
                  </p>
                  <button className="text-xs text-muted-foreground underline underline-offset-2" onClick={() => setStep('idle')}>Cancel</button>
                </div>
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium">
                  {ipStep===1 ? 'Where to pick up?' : 'Drop at?'}
                </h2>
                {ipStep===2 && <p className="text-sm text-muted-foreground mt-0.5">From: {pickupFrom}</p>}
              </div>
              <div className="flex-1 px-5 pb-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2.5">
                  {LOCATIONS.filter(l => ipStep===1 || l!==pickupFrom).map(loc => {
                    const sel = ipStep===1 ? pickupFrom===loc : pickupTo===loc;
                    return (
                      <motion.button key={loc}
                        className="rounded-xl py-5 px-3 text-sm font-semibold text-left"
                        style={{
                          background: sel?'hsl(0 0% 96%)':'hsl(0 0% 12%)',
                          color:      sel?'hsl(0 0% 4%)' :'hsl(0 0% 72%)',
                          border:`1px solid ${sel?'transparent':'hsl(0 0% 18%)'}`,
                          transition:'background 0.18s, color 0.18s',
                        }}
                        whileTap={{ scale:0.94 }}
                        onClick={() => {
                          if (ipStep===1) { setPickupFrom(loc); setTimeout(()=>setIpStep(2),180); }
                          else setPickupTo(loc);
                        }}
                      >{loc}</motion.button>
                    );
                  })}
                </div>
              </div>
              {ipStep===2 && pickupTo && (
                <motion.div className="px-5 py-4 pb-24 flex-shrink-0"
                  style={{ borderTop:'1px solid hsl(0 0% 11%)' }}
                  initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
                  <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-3 mb-4">
                    <span className="text-sm font-semibold text-foreground">{pickupFrom}</span>
                    <ArrowRight size={13} className="text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{pickupTo}</span>
                  </div>
                  <motion.button
                    className="w-full h-14 rounded-pill bg-foreground text-background font-bold text-sm tracking-wide"
                    whileTap={{ scale:0.975 }} onClick={startInstantTrip}>Start Trip</motion.button>
                </motion.div>
              )}
              {ipStep===2 && !pickupTo && (
                <div className="px-5 pb-24">
                  <button className="text-xs text-muted-foreground underline underline-offset-2" onClick={()=>setIpStep(1)}>← Change pickup</button>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ ROUTING: HEAD TO PICKUP ═══ */}
          {step==='routing-pickup' && trip && (
            <DirectionScreen
              key="routing-pickup"
              headingLabel={`Active Trip · Step 1 of 2 · ${SUV_ID}`}
              dirLabel="Head to pickup"
              dest={trip.from}
              originLoc="lobby"
              destLoc={trip.from}
              guest={trip.guest || 'Walk-in'}
              actionLabel="Passenger On Board"
              onAction={() => setStep('routing-drop')}
            />
          )}

          {/* ═══ ROUTING: DRIVE TO DROP ═══ */}
          {step==='routing-drop' && trip && (
            <DirectionScreen
              key="routing-drop"
              headingLabel={`Active Trip · Step 2 of 2 · ${SUV_ID}`}
              dirLabel="Drive to"
              dest={trip.to}
              originLoc={trip.from}
              destLoc={trip.to}
              guest={trip.guest || 'Walk-in'}
              actionLabel="Trip Complete"
              onAction={() => {
                toast.success('Trip complete!', { description:`${trip.from} → ${trip.to}` });
                setTrip(null); setStep('idle');
              }}
            />
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
