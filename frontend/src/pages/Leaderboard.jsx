import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { leaderboardData } from '@/context/AppContext';

const PERIOD_TABS = ['Today', 'Week', 'Month'];

const RANK_STYLES = {
  1: {
    border: '1px solid hsl(43 77% 52% / 0.5)',
    bg: 'hsl(43 77% 52% / 0.06)',
    topLine: 'hsl(43 77% 52% / 0.8)',
    rankColor: 'hsl(43 77% 60%)',
    label: 'Gold',
  },
  2: {
    border: '1px solid hsl(0 0% 65% / 0.4)',
    bg: 'hsl(0 0% 65% / 0.04)',
    topLine: 'hsl(0 0% 65% / 0.6)',
    rankColor: 'hsl(0 0% 72%)',
    label: 'Silver',
  },
  3: {
    border: '1px solid hsl(25 55% 45% / 0.4)',
    bg: 'hsl(25 55% 45% / 0.05)',
    topLine: 'hsl(25 55% 55% / 0.5)',
    rankColor: 'hsl(25 55% 60%)',
    label: 'Bronze',
  },
};

export default function Leaderboard() {
  const [period, setPeriod] = useState('Today');
  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-12" />

      {/* Header */}
      <motion.header
        className="px-5 pb-5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-[1.8rem] text-foreground font-medium">Leaderboard</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {leaderboardData.length} active drivers
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'hsl(43 77% 52% / 0.1)', border: '1px solid hsl(43 77% 52% / 0.2)' }}
          >
            <Trophy size={18} style={{ color: 'hsl(43 77% 52%)' }} />
          </div>
        </div>
      </motion.header>

      {/* Period Filter */}
      <div className="px-5 mb-5">
        <div className="flex bg-secondary rounded-pill p-1">
          {PERIOD_TABS.map((p) => (
            <button
              key={p}
              className="flex-1 py-2 rounded-pill text-[11px] font-medium tracking-wider"
              style={{
                background: period === p ? 'hsl(0 0% 96%)' : 'transparent',
                color: period === p ? 'hsl(0 0% 4%)' : 'hsl(0 0% 50%)',
                transition: 'background 0.2s, color 0.2s',
              }}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pb-24 overflow-y-auto">
        {/* Top 3 */}
        <div className="space-y-3 mb-6">
          {topThree.map((d, i) => {
            const style = RANK_STYLES[d.rank];
            return (
              <motion.div
                key={d.id}
                className="rounded-2xl px-5 py-4 relative overflow-hidden"
                style={{ background: style.bg, border: style.border }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${style.topLine}, transparent)` }}
                />
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 flex flex-col items-center flex-shrink-0">
                    <span
                      className="text-[1.6rem] font-black tabular leading-none"
                      style={{ color: style.rankColor }}
                    >
                      #{d.rank}
                    </span>
                    <span className="text-[9px] font-semibold tracking-wider uppercase mt-0.5"
                      style={{ color: style.rankColor, opacity: 0.7 }}
                    >
                      {style.label}
                    </span>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {d.name}
                        {d.isCurrentUser && (
                          <span
                            className="ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                            style={{
                              background: 'hsl(43 77% 52% / 0.15)',
                              color: 'hsl(43 77% 60%)',
                            }}
                          >
                            You
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{d.id}</p>
                  </div>
                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-foreground tabular">{d.trips} trips</p>
                    <p className="text-[11px] text-muted-foreground tabular">{d.activeTime}% active</p>
                  </div>
                </div>
                {/* SLA bar */}
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">SLA</span>
                    <span className="text-[10px] font-semibold tabular" style={{ color: style.rankColor }}>
                      {d.sla}%
                    </span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: style.rankColor }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${d.sla}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase">All Drivers</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Rest */}
        <div className="space-y-2">
          {rest.map((d, i) => (
            <motion.div
              key={d.id}
              className="bg-card rounded-xl px-4 py-3.5 border border-border flex items-center gap-4"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.04 }}
            >
              <span className="text-sm font-bold text-muted-foreground w-6 text-center tabular flex-shrink-0">
                {d.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground tabular">{d.trips}</p>
                <p className="text-[10px] text-muted-foreground">trips</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
