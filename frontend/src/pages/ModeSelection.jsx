import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Car, ChevronRight, Trophy } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { driver } from '@/context/AppContext';

const CircularRing = ({ value, size = 88, stroke = 5 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(0 0% 15%)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="hsl(43 77% 52%)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
      />
    </svg>
  );
};

export default function ModeSelection() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Safe area spacer */}
      <div className="h-12" />

      {/* Greeting */}
      <motion.header
        className="px-6 pb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-muted-foreground text-xs tracking-[0.22em] uppercase mb-2">
          {today}
        </p>
        <h1 className="font-serif text-[2rem] leading-tight text-foreground font-medium">
          Good Morning,
          <br />
          <span className="font-serif italic text-foreground">{driver.name}.</span>
        </h1>
      </motion.header>

      {/* Gamification Card */}
      <motion.div
        className="mx-5 mb-5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div
          className="bg-card rounded-2xl p-5 relative overflow-hidden"
          style={{ border: '1px solid hsl(43 40% 28% / 0.5)' }}
        >
          {/* Top gold shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(43 77% 52% / 0.7), transparent)' }}
          />

          <div className="flex items-center gap-5">
            {/* Circular Ring */}
            <div className="relative flex-shrink-0">
              <CircularRing value={driver.activeTime} size={88} stroke={5} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[1.3rem] font-bold text-foreground tabular">
                  {driver.activeTime}%
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em]">
                  Active
                </span>
              </div>
            </div>

            {/* Stats Right */}
            <div className="flex-1 min-w-0">
              {/* Rank Row */}
              <div className="flex items-center gap-1.5 mb-3">
                <Trophy size={12} className="text-gold flex-shrink-0" />
                <span className="text-gold text-[11px] font-semibold tracking-wider uppercase">
                  Rank
                </span>
                <span className="text-foreground font-bold text-xl tabular leading-none ml-1">
                  #{driver.rank}
                </span>
                <span className="text-muted-foreground text-xs">
                  of {driver.totalDrivers}
                </span>
              </div>

              {/* Streak Badge */}
              <div className="mb-2.5">
                <span
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: 'hsl(38 85% 52% / 0.12)',
                    color: 'hsl(38 85% 65%)',
                    border: '1px solid hsl(38 85% 52% / 0.2)',
                  }}
                >
                  🔥 {driver.streak}-Day Perfect SLA Streak
                </span>
              </div>

              {/* Goal */}
              <p className="text-muted-foreground text-[12px] leading-snug">
                <span className="text-gold font-semibold">{driver.tripsToNextTier} trips</span>
                {' '}to{' '}
                <span className="text-foreground/80">{driver.nextTier} Tier</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mode Cards */}
      <div className="px-5 flex flex-col gap-3.5 flex-1">
        {/* VALET MODE */}
        <motion.button
          className="bg-card rounded-2xl p-6 border border-border text-left w-full group relative overflow-hidden"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => navigate('/valet')}
          whileTap={{ scale: 0.985 }}
        >
          {/* Subtle left accent line on hover */}
          <div
            className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(180deg, transparent, hsl(43 77% 52% / 0.5), transparent)',
              transition: 'opacity 0.3s ease',
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <KeyRound size={17} className="text-foreground/65" />
                </div>
                <span className="text-[10px] text-muted-foreground tracking-[0.28em] uppercase">
                  Mode 01
                </span>
              </div>
              <h2 className="font-serif text-[1.6rem] leading-tight text-foreground font-medium mb-1">
                Valet Mode
              </h2>
              <p className="text-muted-foreground text-sm">Arrivals &amp; Departures</p>
            </div>
            <ChevronRight
              size={18}
              className="text-foreground/25 group-hover:text-foreground/60 flex-shrink-0"
              style={{ transition: 'color 0.25s ease' }}
            />
          </div>
        </motion.button>

        {/* FLEET MODE */}
        <motion.button
          className="bg-card rounded-2xl p-6 border border-border text-left w-full group relative overflow-hidden"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.27 }}
          onClick={() => navigate('/fleet')}
          whileTap={{ scale: 0.985 }}
        >
          <div
            className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(180deg, transparent, hsl(43 77% 52% / 0.5), transparent)',
              transition: 'opacity 0.3s ease',
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Car size={17} className="text-foreground/65" />
                </div>
                <span className="text-[10px] text-muted-foreground tracking-[0.28em] uppercase">
                  Mode 02
                </span>
              </div>
              <h2 className="font-serif text-[1.6rem] leading-tight text-foreground font-medium mb-1">
                Fleet Mode
              </h2>
              <p className="text-muted-foreground text-sm">Guest Transport</p>
            </div>
            <ChevronRight
              size={18}
              className="text-foreground/25 group-hover:text-foreground/60 flex-shrink-0"
              style={{ transition: 'color 0.25s ease' }}
            />
          </div>
        </motion.button>
      </div>

      {/* Bottom nav spacer */}
      <div className="h-24" />
      <BottomNav />
    </div>
  );
}
