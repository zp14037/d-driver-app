import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Key, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import { ValetMap } from '@/components/ResortMap';
import { toast } from 'sonner';

// ── helpers ────────────────────────────────────────────────────────────
const fmt = s => {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}:${String(s % 60).padStart(2, '0')}`;
};

// ── task constants ──────────────────────────────────────────────────────
// FETCH = the pending retrieval task (Car 1, Guest 1)
const FETCH = {
  plate: 'DL04XY5678',
  carLabel: 'Car 1',
  guestLabel: 'Guest 1',
  location: 'Phase II, Opp V11',
  phase: 'phase2',
  hook: '67',  // locker hook where Car 1's key is stored
};

const SLOT_CHIPS = ['Opp V11', 'Front Row', 'Level B2', 'Near Exit', 'Bay 05', 'Block C'];
const COUNTRY_CODES = ['+91', '+1', '+44', '+971', '+65', '+49'];

// ── slide animation ─────────────────────────────────────────────────────
const slide = {
  initial: { opacity: 0, x: 55 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -55 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

// ── OTP Input — 4 real inputs at module level (stable reference) ─────────
const OtpInput = ({ value, onChange }) => {
  const r0 = useRef(null), r1 = useRef(null), r2 = useRef(null), r3 = useRef(null);
  const refs = [r0, r1, r2, r3];
  const d = [value[0]||'', value[1]||'', value[2]||'', value[3]||''];

  useEffect(() => {
    const idx = d.findIndex(v => !v);
    const t = setTimeout(() => refs[Math.max(0, idx)].current?.focus(), 300);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const upd = (i, v) => {
    const next = [...d]; next[i] = v;
    onChange(next.join(''));
    if (v && i < 3) refs[i + 1].current?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {[0, 1, 2, 3].map(i => (
        <input key={i} ref={refs[i]}
          type="tel" inputMode="numeric" maxLength={1}
          className="w-14 h-16 rounded-2xl text-center text-2xl font-mono font-bold border focus:outline-none"
          style={{ background:'hsl(0 0% 12%)', borderColor:d[i]?'hsl(0 0% 60%)':'hsl(0 0% 20%)', color:'hsl(0 0% 96%)', transition:'border-color 0.15s' }}
          value={d[i]}
          onChange={e => upd(i, e.target.value.replace(/[^0-9]/g,'').slice(-1))}
          onKeyDown={e => {
            if (e.key==='Backspace' && !d[i] && i>0) {
              const next=[...d]; next[i-1]='';
              onChange(next.join('')); refs[i-1].current?.focus();
            }
          }}
        />
      ))}
    </div>
  );
};

// ── shared micro-components ──────────────────────────────────────────────
const ActionBtn = ({ children, onClick, disabled }) => (
  <div className="px-5 pt-3 pb-24 flex-shrink-0" style={{ borderTop:'1px solid hsl(0 0% 11%)' }}>
    <motion.button
      className="w-full h-16 rounded-pill bg-foreground text-background font-bold text-sm tracking-wide disabled:opacity-35"
      whileTap={{ scale: 0.975 }} onClick={onClick} disabled={disabled}
      style={{ transition:'opacity 0.2s' }}
    >{children}</motion.button>
  </div>
);

const HardStopBadge = () => (
  <div className="flex items-center gap-2 mb-7">
    <div className="w-2 h-2 rounded-full bg-destructive animate-status-pulse" />
    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-destructive">Hard Stop</span>
  </div>
);

const StepHdr = ({ tag, back, step, total }) => (
  <div className="flex items-center gap-3 px-5 pt-12 pb-4 flex-shrink-0">
    {back && (
      <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground flex-shrink-0" onClick={back}>
        <ArrowLeft size={15} />
      </button>
    )}
    <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground flex-1">{tag}</p>
    {step && (
      <div className="flex gap-1.5 flex-shrink-0">
        {Array.from({ length: total }).map((_,i) => (
          <div key={i} className="h-1.5 rounded-full"
            style={{ width:i+1===step?'18px':'5px', background:i+1<=step?'hsl(0 0% 96%)':'hsl(0 0% 18%)', transition:'all 0.3s' }} />
        ))}
      </div>
    )}
  </div>
);

const DestHdr = ({ eyebrow, title, sub }) => (
  <div className="px-5 pb-3 flex-shrink-0">
    {eyebrow && <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">{eyebrow}</p>}
    <h2 className="font-serif text-[1.85rem] text-foreground font-medium leading-tight">{title}</h2>
    {sub && <p className="font-mono text-sm text-muted-foreground mt-1 tracking-wider">{sub}</p>}
  </div>
);

const MapBlock = ({ dest, keyBadge }) => (
  <>
    {keyBadge && (
      <div className="mx-5 mb-3 rounded-2xl px-5 py-4 flex-shrink-0 relative"
        style={{ background:'hsl(43 77% 52% / 0.07)', border:'1.5px solid hsl(43 77% 52% / 0.42)' }}>
        <div className="h-px mb-3" style={{ background:'linear-gradient(90deg,transparent,hsl(43 77% 52%/0.7),transparent)' }} />
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color:'hsl(43 77% 62%)' }}>Fetch Key From</p>
        <div className="flex items-center gap-3">
          <Key size={15} style={{ color:'hsl(43 77% 52%)' }} />
          <span className="text-foreground/50 text-sm">Locker</span>
          <span className="font-mono font-black text-[2.5rem] leading-none" style={{ color:'hsl(43 77% 52%)' }}>#{keyBadge}</span>
        </div>
      </div>
    )}
    <div className="mx-5 flex-1 rounded-2xl overflow-hidden border border-border mb-3" style={{ minHeight:'155px', maxHeight:'220px' }}>
      <ValetMap destination={dest} />
    </div>
  </>
);

const keyGateStyle = { background:'hsl(43 77% 52% / 0.09)', border:'1px solid hsl(43 77% 52% / 0.3)' };

// ══ MAIN COMPONENT ══════════════════════════════════════════════════════
export default function ValetDashboard() {
  const navigate = useNavigate();

  // State machine
  // idle | park-form | park-routing | park-confirm | park-key
  // dual-fetch | dual-otp | dual-key
  // fetch-routing | fetch-otp
  const [step, setStep] = useState('idle');

  // Tasks: fetchPending = Car 1 (Guest 1) retrieval is assigned
  const [fetchPending, setFetchPending] = useState(true);

  // Form state
  const [form, setForm]         = useState({ plate: '', phone: '', slot: '' });
  const [countryCode, setCC]    = useState('+91');
  const [showCodes, setShowCodes] = useState(false);
  const [keyHook, setKeyHook]   = useState('');
  const [otp, setOtp]           = useState('');

  // Shift timer
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

  const go = s => setStep(s);
  const clearGates = () => { setKeyHook(''); setOtp(''); };
  const otpFilled = otp.replace(/[^0-9]/g, '').length >= 4;

  // Step totals: 6 steps if fetch task also pending, else 4
  const parkTotal = fetchPending ? 6 : 4;

  const focusStyle = {
    onFocus: e => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.45)'; },
    onBlur:  e => { e.target.style.borderColor = ''; },
    style: { transition: 'border-color 0.2s' },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── MODE TOGGLE ─────────────────────────────────── */}
      <header className="sticky top-0 z-20 px-5 pt-12 pb-3 border-b border-border flex-shrink-0"
        style={{ background:'hsl(0 0% 4% / 0.97)', backdropFilter:'blur(16px)' }}>
        <div className="flex bg-secondary rounded-pill p-1">
          <div className="flex-1 py-2.5 rounded-pill bg-foreground text-center text-[11px] font-bold text-background tracking-[0.22em] uppercase">Valet</div>
          <button className="flex-1 py-2.5 text-center text-[11px] font-medium text-muted-foreground tracking-[0.22em] uppercase"
            style={{ transition:'color 0.2s' }} onClick={() => navigate('/fleet')}>Fleet</button>
        </div>
      </header>

      {/* ── SHIFT TIMER ─────────────────────────────────── */}
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

      {/* ── STATE MACHINE ───────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ═══ IDLE ═══ */}
          {step === 'idle' && (
            <motion.div key="idle" className="absolute inset-0 flex flex-col"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>

              <div className="flex-1 flex items-center justify-center px-5 py-4">
                <AnimatePresence mode="wait">
                  {/* Fetch task card — only when assigned */}
                  {fetchPending && (
                    <motion.div key="fetch-card" className="w-full rounded-3xl overflow-hidden"
                      style={{ border:'1.5px solid hsl(38 85% 52% / 0.4)' }}
                      initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}
                      exit={{ scale:0.95, opacity:0 }} transition={{ type:'spring', stiffness:280, damping:28 }}>
                      <div className="h-px" style={{ background:'linear-gradient(90deg,transparent,hsl(38 85% 52%/0.8),transparent)' }} />
                      <div className="px-6 py-5" style={{ background:'hsl(38 85% 52% / 0.04)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full animate-status-pulse" style={{ backgroundColor:'hsl(38 85% 52%)' }} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color:'hsl(38 85% 65%)' }}>Fetch Assigned</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Vehicle</p>
                            <p className="font-mono text-[1.8rem] font-bold text-foreground tracking-wider leading-none">{FETCH.plate}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{FETCH.carLabel} · {FETCH.guestLabel}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Parked at</p>
                            <p className="text-lg font-semibold text-foreground">{FETCH.location}</p>
                          </div>
                          <div className="rounded-xl px-4 py-3" style={{ background:'hsl(43 77% 52%/0.07)', border:'1px solid hsl(43 77% 52%/0.3)' }}>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color:'hsl(43 77% 62%)' }}>Key</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-foreground/45 text-xs">Locker Hook</span>
                              <span className="font-mono font-black text-[2.2rem] leading-none" style={{ color:'hsl(43 77% 52%)' }}>#{FETCH.hook}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Free / clear state */}
                  {!fetchPending && (
                    <motion.div key="free" className="text-center"
                      initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
                      exit={{ opacity:0 }} transition={{ duration:0.3 }}>
                      <div className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center"
                        style={{ background:'hsl(142 70% 42% / 0.07)', border:'1px solid hsl(142 70% 42% / 0.2)', animation:'goldBreath 3s ease-in-out infinite' }}>
                        <div className="w-3 h-3 rounded-full bg-success" />
                      </div>
                      <p className="font-serif text-[1.7rem] text-foreground font-medium mb-2">You're clear.</p>
                      <p className="text-sm text-muted-foreground">Awaiting assignment.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom buttons */}
              <div className="px-5 pt-3 pb-24 flex-shrink-0 space-y-3" style={{ borderTop:'1px solid hsl(0 0% 11%)' }}>
                {/* Park Arrival — always visible */}
                <motion.button className="w-full h-[60px] rounded-pill bg-foreground text-background font-bold text-sm tracking-wide"
                  whileTap={{ scale:0.975 }} onClick={() => go('park-form')}>Park Arrival</motion.button>
                {/* Fetch Car — only when a retrieval task is assigned */}
                {fetchPending && (
                  <motion.button className="w-full h-[60px] rounded-pill font-bold text-sm tracking-wide text-foreground"
                    style={{ background:'hsl(0 0% 13%)', border:'1px solid hsl(0 0% 21%)' }}
                    whileTap={{ scale:0.975 }} onClick={() => go('fetch-routing')}>Fetch Car</motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ PARK FORM — Step 1 (car # + mobile + Self Assign) ═══ */}
          {step === 'park-form' && (
            <motion.div key="park-form" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park Arrival · Step 1" back={() => go('idle')} step={1} total={parkTotal} />
              <div className="px-5 pb-2 flex-shrink-0">
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium">New Arrival</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Type the plate &amp; guest mobile.</p>
              </div>
              <div className="flex-1 px-5 py-4 overflow-y-auto space-y-5">

                {/* Car Number */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">Car Number</label>
                  <Input
                    className="h-14 bg-secondary border-border text-foreground font-mono text-xl tracking-[0.12em] uppercase placeholder:normal-case placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-muted-foreground/40"
                    {...focusStyle}
                    placeholder="e.g. MH02AH8897"
                    value={form.plate}
                    onChange={e => setForm(f => ({ ...f, plate: e.target.value }))}
                  />
                </div>

                {/* Mobile Number with country code */}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">Guest Mobile</label>
                  <div className="flex gap-2 items-stretch relative">
                    {/* Country code button */}
                    <div className="relative flex-shrink-0">
                      <button
                        className="h-12 px-3 rounded-xl bg-secondary border border-border flex items-center gap-1 text-sm font-mono text-foreground"
                        style={{ transition:'border-color 0.2s', minWidth:'58px' }}
                        onClick={() => setShowCodes(v => !v)}
                      >
                        {countryCode}
                        <ChevronDown size={11} className="text-muted-foreground" />
                      </button>
                      <AnimatePresence>
                        {showCodes && (
                          <motion.div
                            className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden border border-border"
                            style={{ background:'hsl(0 0% 10%)', minWidth:'70px', boxShadow:'0 8px 30px rgba(0,0,0,0.6)' }}
                            initial={{ opacity:0, y:-8, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
                            exit={{ opacity:0, y:-8, scale:0.95 }} transition={{ duration:0.15 }}
                          >
                            {COUNTRY_CODES.map(c => (
                              <button key={c}
                                className="w-full px-3 py-2.5 text-left text-sm font-mono text-foreground"
                                style={{ borderBottom:'1px solid hsl(0 0% 14%)' }}
                                onClick={() => { setCC(c); setShowCodes(false); }}
                              >{c}</button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Phone input */}
                    <Input
                      type="tel"
                      className="flex-1 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground/40"
                      {...focusStyle}
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/[^0-9]/g,'').slice(0,10) }))}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1.5">WhatsApp confirmation sent instantly</p>
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!form.plate.trim() || !form.phone.trim()) { toast.error('Fill all fields'); return; }
                toast(`WhatsApp sent to ${countryCode} ${form.phone}`, { description:'Guest confirmed' });
                go('park-routing');
              }}>Self Assign</ActionBtn>
            </motion.div>
          )}

          {/* ═══ PARK ROUTING — Step 2 ═══ */}
          {step === 'park-routing' && (
            <motion.div key="park-routing" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag={`Park Arrival · Step 2`} step={2} total={parkTotal} />
              <DestHdr eyebrow="Drive to" title="Phase 2" sub={form.plate.toUpperCase()||undefined} />
              {/* Grab key reminder if dual task pending */}
              {fetchPending && (
                <div className="mx-5 mb-3 rounded-xl px-4 py-3 flex-shrink-0 flex items-center gap-3 bg-secondary">
                  <Key size={14} style={{ color:'hsl(43 77% 52%)' }} />
                  <p className="text-xs text-foreground">
                    <span className="font-semibold" style={{ color:'hsl(43 77% 60%)' }}>Grab Key #{FETCH.hook}</span>
                    {' '}from locker before you leave
                  </p>
                </div>
              )}
              <MapBlock dest="phase2" />
              <ActionBtn onClick={() => go('park-confirm')}>Car Parked</ActionBtn>
            </motion.div>
          )}

          {/* ═══ PARK CONFIRM — Step 3 (slot name) ═══ */}
          {step === 'park-confirm' && (
            <motion.div key="park-confirm" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag={`Park Arrival · Step 3`} step={3} total={parkTotal} />
              <div className="px-5 pb-2 flex-shrink-0">
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium">Confirm Slot</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Where exactly is the car?</p>
              </div>
              <div className="flex-1 px-5 py-4 overflow-y-auto">
                <Input
                  className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground/40 mb-4"
                  {...focusStyle}
                  placeholder="e.g. Opp V11"
                  value={form.slot}
                  onChange={e => setForm(f => ({ ...f, slot: e.target.value }))}
                />
                {/* Slot chips */}
                <div className="flex flex-wrap gap-2">
                  {SLOT_CHIPS.map(s => (
                    <button key={s}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: form.slot===s ? 'hsl(0 0% 96%)' : 'hsl(0 0% 14%)',
                        color:      form.slot===s ? 'hsl(0 0% 4%)'  : 'hsl(0 0% 65%)',
                        border:'1px solid hsl(0 0% 20%)',
                        transition:'all 0.15s',
                      }}
                      onClick={() => setForm(f => ({ ...f, slot: s }))}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!form.slot?.trim()) { toast.error('Enter slot name'); return; }
                // If fetch task pending in same zone: continue to dual flow; else simple key gate
                go(fetchPending ? 'dual-fetch' : 'park-key');
              }}>Confirm Park</ActionBtn>
            </motion.div>
          )}

          {/* ═══ PARK KEY GATE (solo flow only) — Step 4 of 4 ═══ */}
          {step === 'park-key' && (
            <motion.div key="park-key" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park Arrival · Step 4 of 4" step={4} total={4} />
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                  style={keyGateStyle} animate={{ scale:[1,1.05,1] }} transition={{ duration:2.5,repeat:Infinity,ease:'easeInOut' }}>
                  <Key size={28} style={{ color:'hsl(43 77% 52%)' }} />
                </motion.div>
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Hang the Key</h2>
                <p className="text-sm text-muted-foreground text-center mb-8">Head to porch. Log the hook you used.</p>
                <div className="w-full">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-3">Locker Hook #</label>
                  <Input type="number" className="h-16 bg-secondary border-border text-foreground font-mono text-3xl text-center tracking-widest placeholder:text-muted-foreground/40"
                    onFocus={e=>{e.target.style.borderColor='hsl(43 77% 52% / 0.5)'}} onBlur={e=>{e.target.style.borderColor=''}}
                    style={{transition:'border-color 0.2s'}} placeholder="00" value={keyHook} onChange={e=>setKeyHook(e.target.value)} />
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!keyHook.trim()) { toast.error('Enter hook number'); return; }
                toast.success('Parked!', { description:`${form.plate.toUpperCase()} · ${form.slot} · Hook #${keyHook}` });
                setForm({plate:'',phone:'',slot:''}); clearGates(); go('idle');
              }}>Complete</ActionBtn>
            </motion.div>
          )}

          {/* ═══ DUAL FETCH — Step 4 of 6 (fetch Car 1 from same zone) ═══ */}
          {step === 'dual-fetch' && (
            <motion.div key="dual-fetch" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park Arrival · Step 4 of 6" step={4} total={6} />
              <DestHdr eyebrow={`Fetch from Phase 2`} title={`${FETCH.carLabel} (${FETCH.guestLabel})`} sub={FETCH.plate} />
              <div className="mx-5 mb-3 rounded-xl px-4 py-3 flex-shrink-0 flex items-center gap-3 bg-secondary">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor:'hsl(43 77% 52%)' }} />
                <p className="text-xs text-muted-foreground">You're already in Phase 2 — use Key #{FETCH.hook}</p>
              </div>
              <MapBlock dest={FETCH.phase} />
              <ActionBtn onClick={() => go('dual-otp')}>Car Picked Up</ActionBtn>
            </motion.div>
          )}

          {/* ═══ DUAL OTP — Step 5 of 6 [HARD STOP] ═══ */}
          {/* INLINED to prevent remount on setOtp */}
          {step === 'dual-otp' && (
            <motion.div key="dual-otp" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park Arrival · Step 5 of 6" step={5} total={6} />
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Handover OTP</h2>
                <p className="text-sm text-muted-foreground text-center mb-10">
                  Get 4-digit code from {FETCH.guestLabel}.
                </p>
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <ActionBtn disabled={!otpFilled} onClick={() => {
                if (!otpFilled) { toast.error('Enter full 4-digit OTP'); return; }
                toast('Handover done.', { description:`${FETCH.guestLabel} · OTP ${otp}` });
                clearGates(); go('dual-key');
              }}>Confirm Handover</ActionBtn>
            </motion.div>
          )}

          {/* ═══ DUAL KEY — Step 6 of 6 [HARD STOP] (hang Car 2's key) ═══ */}
          {step === 'dual-key' && (
            <motion.div key="dual-key" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park Arrival · Step 6 of 6" step={6} total={6} />
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                  style={keyGateStyle} animate={{ scale:[1,1.05,1] }} transition={{ duration:2.5,repeat:Infinity,ease:'easeInOut' }}>
                  <Key size={28} style={{ color:'hsl(43 77% 52%)' }} />
                </motion.div>
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Hang Car 2's Key</h2>
                <p className="text-sm text-muted-foreground text-center mb-2">
                  {form.plate.toUpperCase() || 'Car 2'} · {form.slot}
                </p>
                <p className="text-sm text-muted-foreground text-center mb-8">Log the locker hook number.</p>
                <div className="w-full">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-3">Locker Hook #</label>
                  <Input type="number" className="h-16 bg-secondary border-border text-foreground font-mono text-3xl text-center tracking-widest placeholder:text-muted-foreground/40"
                    onFocus={e=>{e.target.style.borderColor='hsl(43 77% 52% / 0.5)'}} onBlur={e=>{e.target.style.borderColor=''}}
                    style={{transition:'border-color 0.2s'}} placeholder="00" value={keyHook} onChange={e=>setKeyHook(e.target.value)} />
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!keyHook.trim()) { toast.error('Enter hook number'); return; }
                toast.success('All done!', { description:`Car 2 · Hook #${keyHook} · Car 1 handed to ${FETCH.guestLabel}` });
                setFetchPending(false);
                setForm({plate:'',phone:'',slot:''});
                clearGates();
                go('idle');
              }}>Complete</ActionBtn>
            </motion.div>
          )}

          {/* ═══ STANDALONE FETCH ROUTING ═══ */}
          {step === 'fetch-routing' && (
            <motion.div key="fetch-routing" className="absolute inset-0 flex flex-col" {...slide}>
              <div className="px-5 pt-12 pb-3 flex-shrink-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground mb-1">Fetch Task</p>
              </div>
              <DestHdr eyebrow="Head to" title={FETCH.location} sub={`${FETCH.carLabel} · ${FETCH.plate}`} />
              <MapBlock dest={FETCH.phase} keyBadge={FETCH.hook} />
              <ActionBtn onClick={() => go('fetch-otp')}>Car Picked Up</ActionBtn>
            </motion.div>
          )}

          {/* ═══ STANDALONE FETCH OTP [HARD STOP] ═══ */}
          {step === 'fetch-otp' && (
            <motion.div key="fetch-otp" className="absolute inset-0 flex flex-col" {...slide}>
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Handover OTP</h2>
                <p className="text-sm text-muted-foreground text-center mb-10">Get 4-digit code from {FETCH.guestLabel}.</p>
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <ActionBtn disabled={!otpFilled} onClick={() => {
                if (!otpFilled) { toast.error('Enter full 4-digit OTP'); return; }
                toast.success('Handover confirmed!', { description:`${FETCH.guestLabel} · OTP ${otp} verified` });
                setFetchPending(false); clearGates(); go('idle');
              }}>Confirm Handover</ActionBtn>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
