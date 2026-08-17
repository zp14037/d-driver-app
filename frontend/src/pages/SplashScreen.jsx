import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LOGO_URL = 'https://customer-assets-cm19k8pv.emergentagent.net/job_469f4390-422f-4de4-915e-f8fd9352202f/artifacts/tilcwphk_della-resorts-logo.png';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Radial gold glow behind logo */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          background: 'radial-gradient(ellipse 55% 35% at 50% 46%, hsl(43 77% 52% / 0.07) 0%, transparent 70%)',
        }}
      />

      {/* Outer grain overlay for texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      <motion.div
        className="flex flex-col items-center gap-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={LOGO_URL}
            alt="Della Resorts"
            className="w-56 h-auto object-contain select-none"
            draggable={false}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div
            className="h-px w-16 mb-3"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(43 77% 52% / 0.5), transparent)' }}
          />
          <p className="text-muted-foreground text-[10px] tracking-[0.38em] uppercase font-medium">
            Driver Operations
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="w-60"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.3 }}
        >
          <motion.button
            className="w-full h-[54px] rounded-pill border border-foreground/18 bg-transparent text-foreground/75 text-xs tracking-[0.25em] uppercase font-medium"
            style={{ borderColor: 'hsl(0 0% 96% / 0.18)' }}
            whileHover={{ borderColor: 'hsl(0 0% 96% / 0.4)', color: 'hsl(0 0% 96%)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/home')}
            transition={{ duration: 0.2 }}
          >
            Start Shift
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom meta */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        <p className="text-foreground/20 text-[10px] tracking-widest">v2.4.1 · Della Driver OS</p>
      </motion.div>
    </div>
  );
}
