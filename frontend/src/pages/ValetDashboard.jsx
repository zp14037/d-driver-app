import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BottomNav from '@/components/BottomNav';
import { ValetMap } from '@/components/ResortMap';
import { toast } from 'sonner';

// ── Helpers ────────────────────────────────────────────────────────────
const fmt = s => {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}:${String(s % 60).padStart(2, '0')}`;
};

// ── Task constants ──────────────────────────────────────────────────────
const FETCH = { plate: 'MH-12-AB-1234', location: 'Phase II, Opp V11', phase: 'phase2', hook: '45' };
const DUAL  = {
  keyHook: '67', parkPhase: 'phase2', fetchPhase: 'phase2',
  patelPlate: 'GJ-01-KA-4523',
  nareshPlate: 'MH-09-NR-7890', guestName: 'Mr. Naresh', guestPhone: '9833468743',
};

// ── Shared slide ────────────────────────────────────────────────────────
const slide = {
  initial: { opacity: 0, x: 55 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -55 },
  transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
};

// ── OTP Input — 4 real focusable inputs (module-level: stable reference)
// CRITICAL: Must be defined OUTSIDE ValetDashboard to prevent remount on every
// parent render (which would kill focus/value on every keystroke).
const OtpInput = ({ value, onChange }) => {
  const r0 = useRef(null), r1 = useRef(null), r2 = useRef(null), r3 = useRef(null);
  const refs = [r0, r1, r2, r3];
  const d = [value[0] || '', value[1] || '', value[2] || '', value[3] || ''];

  // Focus first empty box after slide animation settles
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
          style={{
            background: 'hsl(0 0% 12%)',
            borderColor: d[i] ? 'hsl(0 0% 60%)' : 'hsl(0 0% 20%)',
            color: 'hsl(0 0% 96%)',
            transition: 'border-color 0.15s',
          }}
          value={d[i]}
          onChange={e => upd(i, e.target.value.replace(/[^0-9]/g, '').slice(-1))}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !d[i] && i > 0) {
              const next = [...d]; next[i - 1] = '';
              onChange(next.join('')); refs[i - 1].current?.focus();
            }
          }}
        />
      ))}
    </div>
  );
};

// ── Shared micro-components (pure presentational, no inner state/hooks) ─
const ActionBtn = ({ children, onClick, disabled }) => (
  <div className="px-5 pt-3 pb-24 flex-shrink-0" style={{ borderTop: '1px solid hsl(0 0% 11%)' }}>
    <motion.button
      className="w-full h-16 rounded-pill bg-foreground text-background font-bold text-sm tracking-wide disabled:opacity-35"
      whileTap={{ scale: 0.975 }} onClick={onClick} disabled={disabled}
      style={{ transition: 'opacity 0.2s' }}
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
      <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground flex-shrink-0"
        onClick={back}><ArrowLeft size={15} /></button>
    )}
    <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground flex-1">{tag}</p>
    {step && (
      <div className="flex gap-1.5 flex-shrink-0">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full"
            style={{ width: i + 1 === step ? '18px' : '5px', background: i + 1 <= step ? 'hsl(0 0% 96%)' : 'hsl(0 0% 18%)', transition: 'all 0.3s' }} />
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
        style={{ background: 'hsl(43 77% 52% / 0.07)', border: '1.5px solid hsl(43 77% 52% / 0.42)' }}>
        <div className="h-px mb-3" style={{ background: 'linear-gradient(90deg,transparent,hsl(43 77% 52%/0.7),transparent)' }} />
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: 'hsl(43 77% 62%)' }}>Fetch Key From</p>
        <div className="flex items-center gap-3">
          <Key size={15} style={{ color: 'hsl(43 77% 52%)' }} />
          <span className="text-foreground/50 text-sm">Locker</span>
          <span className="font-mono font-black text-[2.5rem] leading-none" style={{ color: 'hsl(43 77% 52%)' }}>#{keyBadge}</span>
        </div>
      </div>
    )}
    <div className="mx-5 flex-1 rounded-2xl overflow-hidden border border-border mb-3" style={{ minHeight: '155px', maxHeight: '220px' }}>
      <ValetMap destination={dest} />
    </div>
  </>
);

// Key gate inlined helper to avoid inner-component remount issues
const keyGateStyle = { background: 'hsl(43 77% 52% / 0.09)', border: '1px solid hsl(43 77% 52% / 0.3)' };

// ══ MAIN COMPONENT ══════════════════════════════════════════════════════
export default function ValetDashboard() {
  const navigate = useNavigate();

  // State machine
  // idle | park-capture | park-routing | park-key-gate
  // fetch-routing | fetch-otp-gate
  // dual-step1 | dual-step2-routing | dual-step3-routing
  // dual-step4-otp | dual-step5-key
  const [step, setStep]                 = useState('idle');
  const [fetchPending, setFetchPending] = useState(true);
  const [dualPending, setDualPending]   = useState(true);
  const [form, setForm]     = useState({ plate: '', phone: '' });
  const [keyHook, setKeyHook] = useState('');
  const [otp, setOtp]         = useState('');

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
  const otpFilled  = otp.replace(/[^0-9]/g, '').length >= 4;

  // ── shared focused-input style ──────────────────────────────────────
  const inputFocus = e => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.45)'; };
  const inputBlur  = e => { e.target.style.borderColor = ''; };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">

      {/* ── MODE TOGGLE ──────────────────────────────────────── */}
      <header className="sticky top-0 z-20 px-5 pt-12 pb-3 border-b border-border flex-shrink-0"
        style={{ background: 'hsl(0 0% 4% / 0.97)', backdropFilter: 'blur(16px)' }}>
        <div className="flex bg-secondary rounded-pill p-1">
          <div className="flex-1 py-2.5 rounded-pill bg-foreground text-center text-[11px] font-bold text-background tracking-[0.22em] uppercase">Valet</div>
          <button className="flex-1 py-2.5 text-center text-[11px] font-medium text-muted-foreground tracking-[0.22em] uppercase"
            style={{ transition: 'color 0.2s' }} onClick={() => navigate('/fleet')}>Fleet</button>
        </div>
      </header>

      {/* ── SHIFT TIMER ──────────────────────────────────────── */}
      <div className="px-5 py-4 flex-shrink-0" style={{ background: 'hsl(0 0% 7%)', borderBottom: '1px solid hsl(0 0% 12%)' }}>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isBusy ? 'animate-status-pulse' : ''}`}
                style={{ backgroundColor: isBusy ? 'hsl(142 70% 42%)' : 'hsl(0 0% 24%)' }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Busy Time</span>
            </div>
            <p className="font-mono text-[1.65rem] font-bold text-foreground tabular leading-none">{fmt(busy)}</p>
          </div>
          <div className="w-px h-12 bg-border mx-4" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${!isBusy ? 'animate-status-pulse' : ''}`}
                style={{ backgroundColor: !isBusy ? 'hsl(0 72% 51%)' : 'hsl(0 0% 24%)' }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Free Time</span>
            </div>
            <p className="font-mono text-[1.65rem] font-bold text-foreground tabular leading-none">{fmt(free)}</p>
          </div>
        </div>
      </div>

      {/* ── STATE MACHINE ────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ═══════ IDLE ═══════ */}
          {step === 'idle' && (
            <motion.div key="idle" className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

              <div className="flex-1 flex items-center justify-center px-5 py-4">
                <AnimatePresence mode="wait">
                  {/* Dual task card */}
                  {dualPending && (
                    <motion.div key="dual-card" className="w-full rounded-3xl overflow-hidden"
                      style={{ border: '1.5px solid hsl(43 77% 52% / 0.42)' }}
                      initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}>
                      <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,hsl(43 77% 52%/0.8),transparent)' }} />
                      <div className="px-6 py-5" style={{ background: 'hsl(43 77% 52% / 0.04)' }}>
                        <div className="flex items-center gap-2 mb-5">
                          <span style={{ color: 'hsl(43 77% 52%)', fontSize: '11px' }}>✦</span>
                          <span className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: 'hsl(43 77% 60%)' }}>Smart Dual-Task</span>
                        </div>
                        {[
                          { n:'1', text:`Grab Key #${DUAL.keyHook} — Mr. Naresh's car (Phase 2).` },
                          { n:'2', text:`Drive Mr. Patel's car to Phase 2. Park it.` },
                          { n:'3', text:`Fetch Mr. Naresh's car (${DUAL.guestPhone}) — same zone.` },
                          { n:'4', text:`Return to porch. OTP handover to Mr. Naresh.` },
                          { n:'5', text:`Hang Mr. Patel's key in locker.` },
                        ].map(({ n, text }) => (
                          <div key={n} className="flex items-start gap-3.5 mb-3.5 last:mb-0">
                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-muted-foreground">{n}</span>
                            </div>
                            <p className="text-sm text-foreground/80 leading-snug">{text}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Fetch task card */}
                  {!dualPending && fetchPending && (
                    <motion.div key="fetch-card" className="w-full rounded-3xl overflow-hidden"
                      style={{ border: '1.5px solid hsl(38 85% 52% / 0.4)' }}
                      initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}>
                      <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,hsl(38 85% 52%/0.8),transparent)' }} />
                      <div className="px-6 py-5" style={{ background: 'hsl(38 85% 52% / 0.04)' }}>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full animate-status-pulse" style={{ backgroundColor: 'hsl(38 85% 52%)' }} />
                          <span className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: 'hsl(38 85% 65%)' }}>Fetch Assigned</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Vehicle</p>
                            <p className="font-mono text-[1.8rem] font-bold text-foreground tracking-wider leading-none">{FETCH.plate}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Parked at</p>
                            <p className="text-lg font-semibold text-foreground">{FETCH.location}</p>
                          </div>
                          <div className="rounded-xl px-4 py-3" style={{ background: 'hsl(43 77% 52%/0.07)', border: '1px solid hsl(43 77% 52%/0.3)' }}>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: 'hsl(43 77% 62%)' }}>Key</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-foreground/45 text-xs">Locker Hook</span>
                              <span className="font-mono font-black text-[2.2rem] leading-none" style={{ color: 'hsl(43 77% 52%)' }}>#{FETCH.hook}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Free / clear state */}
                  {!dualPending && !fetchPending && (
                    <motion.div key="free" className="text-center"
                      initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center"
                        style={{ background: 'hsl(142 70% 42% / 0.07)', border: '1px solid hsl(142 70% 42% / 0.2)', animation: 'goldBreath 3s ease-in-out infinite' }}>
                        <div className="w-3 h-3 rounded-full bg-success" />
                      </div>
                      <p className="font-serif text-[1.7rem] text-foreground font-medium mb-2">You're clear.</p>
                      <p className="text-sm text-muted-foreground">Awaiting assignment.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Two big buttons (or single Begin button for dual task) */}
              <div className="px-5 pt-3 pb-24 flex-shrink-0 space-y-3" style={{ borderTop: '1px solid hsl(0 0% 11%)' }}>
                {dualPending ? (
                  <motion.button className="w-full h-16 rounded-pill bg-foreground text-background font-bold text-sm tracking-wide"
                    whileTap={{ scale: 0.975 }} onClick={() => go('dual-step1')}>Begin Dual Task</motion.button>
                ) : (
                  <>
                    <motion.button className="w-full h-[60px] rounded-pill bg-foreground text-background font-bold text-sm tracking-wide"
                      whileTap={{ scale: 0.975 }} onClick={() => go('park-capture')}>Park Arrival</motion.button>
                    <motion.button className="w-full h-[60px] rounded-pill font-bold text-sm tracking-wide text-foreground"
                      style={{ background: 'hsl(0 0% 13%)', border: '1px solid hsl(0 0% 21%)' }}
                      whileTap={{ scale: 0.975 }} onClick={() => go('fetch-routing')}>Fetch Car</motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════ PARK STEP 1 — CAPTURE ═══════ */}
          {step === 'park-capture' && (
            <motion.div key="park-capture" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park · Step 1 of 3" back={() => go('idle')} step={1} total={3} />
              <div className="px-5 pb-1 flex-shrink-0">
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium">Plate &amp; Number</h2>
              </div>
              <div className="flex-1 px-5 py-4 overflow-y-auto space-y-5">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">Car Plate</label>
                  <Input className="h-14 bg-secondary border-border text-foreground font-mono text-2xl tracking-[0.22em] uppercase placeholder:normal-case placeholder:font-sans placeholder:text-base placeholder:tracking-normal placeholder:text-muted-foreground/40"
                    style={{ transition: 'border-color 0.2s' }} onFocus={inputFocus} onBlur={inputBlur}
                    placeholder="MH-12-AB-1234" value={form.plate}
                    onChange={e => setForm(f => ({ ...f, plate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-2">Guest WhatsApp</label>
                  <Input type="tel" className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground/40"
                    style={{ transition: 'border-color 0.2s' }} onFocus={inputFocus} onBlur={inputBlur}
                    placeholder="+91 98765 43210" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  <p className="text-[10px] text-muted-foreground mt-1.5">Guest gets instant valet ticket</p>
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!form.plate.trim() || !form.phone.trim()) { toast.error('Fill all fields'); return; }
                toast('Notifying guest…', { description: 'Ticket sending' });
                go('park-routing');
              }}>Self Assign &amp; Notify Guest</ActionBtn>
            </motion.div>
          )}

          {/* ═══════ PARK STEP 2 — ROUTING ═══════ */}
          {step === 'park-routing' && (
            <motion.div key="park-routing" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Park · Step 2 of 3" step={2} total={3} />
              <DestHdr eyebrow="Drive to" title="Parking Phase 2" sub={form.plate.toUpperCase() || undefined} />
              <MapBlock dest="phase2" />
              <ActionBtn onClick={() => go('park-key-gate')}>Car Parked at Phase 2</ActionBtn>
            </motion.div>
          )}

          {/* ═══════ PARK KEY GATE — HARD STOP ═══════ */}
          {step === 'park-key-gate' && (
            <motion.div key="park-key-gate" className="absolute inset-0 flex flex-col" {...slide}>
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                  style={keyGateStyle} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Key size={28} style={{ color: 'hsl(43 77% 52%)' }} />
                </motion.div>
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Hang the Key</h2>
                <p className="text-sm text-muted-foreground text-center mb-8">Log the locker hook you used.</p>
                <div className="w-full">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-3">Locker Hook #</label>
                  <Input type="number" className="h-16 bg-secondary border-border text-foreground font-mono text-3xl text-center tracking-widest placeholder:text-muted-foreground/40"
                    style={{ transition: 'border-color 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.5)'; }}
                    onBlur={e => { e.target.style.borderColor = ''; }}
                    placeholder="00" value={keyHook} onChange={e => setKeyHook(e.target.value)} />
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!keyHook.trim()) { toast.error('Enter hook number'); return; }
                toast.success('Task complete!', { description: `${form.plate.toUpperCase() || 'Car'} · Hook #${keyHook}` });
                setForm({ plate: '', phone: '' }); clearGates(); go('idle');
              }}>Key Secured ✓</ActionBtn>
            </motion.div>
          )}

          {/* ═══════ FETCH ROUTING ═══════ */}
          {step === 'fetch-routing' && (
            <motion.div key="fetch-routing" className="absolute inset-0 flex flex-col" {...slide}>
              <div className="px-5 pt-12 pb-3 flex-shrink-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground mb-1">Fetch Task</p>
              </div>
              <DestHdr eyebrow="Head to" title={FETCH.location} sub={FETCH.plate} />
              <MapBlock dest={FETCH.phase} keyBadge={FETCH.hook} />
              <ActionBtn onClick={() => go('fetch-otp-gate')}>Car Picked Up</ActionBtn>
            </motion.div>
          )}

          {/* ═══════ FETCH OTP GATE — HARD STOP ═══════ */}
          {/* INLINED — no wrapper component to avoid remount killing OtpInput focus */}
          {step === 'fetch-otp-gate' && (
            <motion.div key="fetch-otp-gate" className="absolute inset-0 flex flex-col" {...slide}>
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Handover OTP</h2>
                <p className="text-sm text-muted-foreground text-center mb-10">
                  Get the 4-digit code from the guest.
                </p>
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <ActionBtn
                disabled={!otpFilled}
                onClick={() => {
                  if (!otpFilled) { toast.error('Enter full 4-digit OTP'); return; }
                  toast.success('Handover confirmed!', { description: `OTP ${otp} verified` });
                  setFetchPending(false); clearGates(); go('idle');
                }}
              >Confirm Handover</ActionBtn>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════
              DUAL TASK — 5-step "zero deadheading" flow
              One trip, two jobs, same parking zone (Phase 2):
              1. Grab Naresh's key (#67) at porch before leaving
              2. Drive Patel's car to Phase 2, park it
              3. Walk to Naresh's car (same Phase 2), get in
              4. Drive back to porch → OTP handover to Naresh [HARD STOP]
              5. Hang Patel's key in locker [HARD STOP]
          ════════════════════════════════════════════════════════ */}

          {/* DUAL STEP 1 — Grab Naresh's key from locker */}
          {step === 'dual-step1' && (
            <motion.div key="dual-step1" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Dual Task · Step 1 of 5" back={() => go('idle')} step={1} total={5} />
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-4">
                <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                  style={keyGateStyle} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Key size={28} style={{ color: 'hsl(43 77% 52%)' }} />
                </motion.div>
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Grab the Key</h2>
                <p className="text-sm text-muted-foreground text-center mb-8">
                  Pick up Mr. Naresh's key before leaving the porch.
                </p>
                <div className="w-full rounded-2xl px-6 py-5 text-center"
                  style={{ background: 'hsl(43 77% 52% / 0.07)', border: '1.5px solid hsl(43 77% 52% / 0.42)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.26em] mb-2" style={{ color: 'hsl(43 77% 62%)' }}>Locker Hook</p>
                  <p className="font-mono font-black text-[4.5rem] leading-none tabular" style={{ color: 'hsl(43 77% 52%)' }}>
                    #{DUAL.keyHook}
                  </p>
                </div>
              </div>
              <ActionBtn onClick={() => go('dual-step2-routing')}>Got the Key</ActionBtn>
            </motion.div>
          )}

          {/* DUAL STEP 2 — Drive Patel's car to Phase 2, park it */}
          {step === 'dual-step2-routing' && (
            <motion.div key="dual-step2-routing" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Dual Task · Step 2 of 5" step={2} total={5} />
              <DestHdr eyebrow="Drive to" title="Phase 2" sub="Park Mr. Patel's car here" />
              <MapBlock dest={DUAL.parkPhase} />
              <ActionBtn onClick={() => go('dual-step3-routing')}>Mr. Patel's Car Parked</ActionBtn>
            </motion.div>
          )}

          {/* DUAL STEP 3 — Fetch Naresh's car (already in Phase 2 — no extra drive) */}
          {step === 'dual-step3-routing' && (
            <motion.div key="dual-step3-routing" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Dual Task · Step 3 of 5" step={3} total={5} />
              <DestHdr eyebrow="Fetch from Phase 2" title={`${DUAL.guestName}'s Car`} sub={DUAL.nareshPlate} />
              <div className="mx-5 mb-3 rounded-xl px-4 py-3 flex-shrink-0 flex items-center gap-3 bg-secondary">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'hsl(43 77% 52%)' }} />
                <p className="text-xs text-muted-foreground">You're already in Phase 2 — walk to the car</p>
              </div>
              <MapBlock dest={DUAL.fetchPhase} />
              <ActionBtn onClick={() => go('dual-step4-otp')}>Car Picked Up</ActionBtn>
            </motion.div>
          )}

          {/* DUAL STEP 4 — OTP Handover at porch — HARD STOP */}
          {/* INLINED — no wrapper component, keeps OtpInput stable on setOtp */}
          {step === 'dual-step4-otp' && (
            <motion.div key="dual-step4-otp" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Dual Task · Step 4 of 5" step={4} total={5} />
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">Handover OTP</h2>
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Get 4-digit code from {DUAL.guestName}.
                </p>
                <p className="font-mono text-sm text-muted-foreground mb-10 tracking-wider">{DUAL.guestPhone}</p>
                <OtpInput value={otp} onChange={setOtp} />
              </div>
              <ActionBtn
                disabled={!otpFilled}
                onClick={() => {
                  if (!otpFilled) { toast.error('Enter full 4-digit OTP'); return; }
                  toast('Handover done.', { description: `${DUAL.guestName} · OTP ${otp}` });
                  clearGates(); go('dual-step5-key');
                }}
              >Confirm Handover</ActionBtn>
            </motion.div>
          )}

          {/* DUAL STEP 5 — Hang Patel's key in locker — HARD STOP */}
          {step === 'dual-step5-key' && (
            <motion.div key="dual-step5-key" className="absolute inset-0 flex flex-col" {...slide}>
              <StepHdr tag="Dual Task · Step 5 of 5" step={5} total={5} />
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
                <HardStopBadge />
                <motion.div className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                  style={keyGateStyle} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <Key size={28} style={{ color: 'hsl(43 77% 52%)' }} />
                </motion.div>
                <h2 className="font-serif text-[1.6rem] text-foreground font-medium text-center mb-2">
                  Hang Mr. Patel's Key
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-8">Log the locker hook number.</p>
                <div className="w-full">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-3">Locker Hook #</label>
                  <Input type="number" className="h-16 bg-secondary border-border text-foreground font-mono text-3xl text-center tracking-widest placeholder:text-muted-foreground/40"
                    style={{ transition: 'border-color 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = 'hsl(43 77% 52% / 0.5)'; }}
                    onBlur={e => { e.target.style.borderColor = ''; }}
                    placeholder="00" value={keyHook} onChange={e => setKeyHook(e.target.value)} />
                </div>
              </div>
              <ActionBtn onClick={() => {
                if (!keyHook.trim()) { toast.error('Enter hook number'); return; }
                toast.success('Dual task complete!', { description: `All done · Hook #${keyHook}` });
                setDualPending(false); clearGates(); go('idle');
              }}>Key Secured ✓</ActionBtn>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
