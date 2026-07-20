import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Award, BookOpen, Boxes, Brain, Building, Building2, Check, Compass, Cpu, Crown, Download, ExternalLink, Github, GraduationCap, Home, Images, Layers, Loader2, Mail, MapPin, Megaphone, Menu, Moon, Palette, PenLine, Phone, Quote, School, Send, ShieldAlert, ShieldCheck, Sparkles, Sun, TrendingUp, Users, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const QUIZ_URL = 'https://mku.name.np/quiz';

// ==================== images.ts ====================
/**
 * Curated civil-engineering stock photography from Pexels (free to use).
 * Only direct images.pexels.com URLs are referenced — no downloads.
 */

export const IMG = {
  // Hero portrait-adjacent: engineers examining blueprints against steel structures
  heroEngineer:
    'https://images.pexels.com/photos/8961134/pexels-photo-8961134.jpeg?auto=compress&cs=tinysrgb&w=1200',
  // Featured work: city construction site with workers, cranes, and high-rise buildings
  highRise:
    'https://images.pexels.com/photos/33689718/pexels-photo-33689718.jpeg?auto=compress&cs=tinysrgb&w=1400',
  // Rebar / structural detail: workers laying out concrete reinforcements
  rebar:
    'https://images.pexels.com/photos/18283441/pexels-photo-18283441.jpeg?auto=compress&cs=tinysrgb&w=900',
  // Engineers reviewing plans at an active site under open sky
  engineersPlans:
    'https://images.pexels.com/photos/29197533/pexels-photo-29197533.jpeg?auto=compress&cs=tinysrgb&w=900',
  // Wide-angle tower cranes against blue sky
  cranes:
    'https://images.pexels.com/photos/12109677/pexels-photo-12109677.jpeg?auto=compress&cs=tinysrgb&w=900',
  // Concrete columns / structure at an industrial construction site
  concrete:
    'https://images.pexels.com/photos/29152268/pexels-photo-29152268.jpeg?auto=compress&cs=tinysrgb&w=900',
  // Theodolite surveyor
  surveyor:
    'https://images.pexels.com/photos/8961071/pexels-photo-8961071.jpeg?auto=compress&cs=tinysrgb&w=900',
  // Steel framework: engineer in safety gear examining steel structures
  steel:
    'https://images.pexels.com/photos/8960943/pexels-photo-8960943.jpeg?auto=compress&cs=tinysrgb&w=900',
};

export type GalleryItem = {
  src: string;
  title: string;
  caption: string;
  tag: string;
};

export const galleryItems: GalleryItem[] = [
  {
    src: IMG.highRise,
    title: 'High-Rise Construction',
    caption: 'Multi-story structural framework with tower crane integration.',
    tag: 'Structural',
  },
  {
    src: IMG.rebar,
    title: 'Reinforcement Detailing',
    caption: 'Rebar grids for seismic-resistant RCC element design.',
    tag: 'Detailing',
  },
  {
    src: IMG.engineersPlans,
    title: 'Site Coordination',
    caption: 'On-site plan review with the execution team.',
    tag: 'Leadership',
  },
  {
    src: IMG.concrete,
    title: 'Concrete Structures',
    caption: 'Cast-in-place columns and beam-column joints.',
    tag: 'RCC',
  },
  {
    src: IMG.surveyor,
    title: 'Precision Survey',
    caption: 'Theodolite-based geometric verification on site.',
    tag: 'Geomatics',
  },
  {
    src: IMG.steel,
    title: 'Steel Framework',
    caption: 'Structural steel erection and load-path verification.',
    tag: 'Steel',
  },
];

// ==================== supabase.ts ====================
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

// createClient throws synchronously if given an empty URL/key. Since this
// module is imported at the top of the component tree, that throw would
// crash the entire app (blank page) whenever env vars aren't set — not
// just the contact form. Only construct a real client when configured;
// otherwise callers get a clear, catchable error instead of a dead site.
export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, { auth: { persistSession: false } })
  : null;

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  quiz_interest?: boolean;
};

export type Lead = {
  email: string;
  source?: string;
};

export async function submitContact(msg: ContactMessage) {
  if (!supabase) {
    throw new Error('Could not send. Please email directly at upadhyaymohit0412@gmail.com');
  }
  return supabase.from('contact_messages').insert({
    name: msg.name,
    email: msg.email,
    message: msg.message,
    quiz_interest: msg.quiz_interest ?? false,
  });
}

export async function subscribeLead(email: string, source = 'portfolio') {
  if (!supabase) {
    throw new Error('Could not subscribe right now. Please email directly at upadhyaymohit0412@gmail.com');
  }
  return supabase.from('leads').insert({ email, source });
}

// ==================== useReveal.ts ====================
/**
 * Adds `.in-view` class to every `.reveal` element when it enters the viewport.
 * One-shot observer — once revealed, it stays revealed.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ==================== useThemeMode.ts ====================
export type ThemeMode = 'dark' | 'light' | 'aurora';

const STORAGE_KEY = 'mku-theme';

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === 'dark' || saved === 'light' || saved === 'aurora') return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('blueprint-mode', 'light-mode');
    if (mode === 'aurora') root.classList.add('blueprint-mode');
    if (mode === 'light') root.classList.add('light-mode');
    root.style.colorScheme = mode === 'light' ? 'light' : 'dark';
    try { window.localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
  }, [mode]);

  const cycle = useCallback(() => {
    setMode((m) => (m === 'dark' ? 'light' : m === 'light' ? 'aurora' : 'dark'));
  }, []);

  const set = useCallback((m: ThemeMode) => setMode(m), []);

  return { mode, cycle, set };
}

// ==================== MagneticButton.tsx ====================
type MagneticButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
  ariaLabel?: string;
};

/**
 * Magnetic button: translates slightly toward the cursor while hovering,
 * expands with a sheen sweep, and snaps back on leave.
 */
function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * 0.25, y: y * 0.35 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const base =
    'magnetic-btn group relative inline-flex items-center justify-center gap-2 rounded-full font-mono uppercase tracking-[0.18em] text-xs sm:text-sm transition-transform duration-500 ease-premium';
  const variants = {
    primary:
      'bg-amber-500 text-slatey-950 px-7 py-3.5 sm:px-9 sm:py-4 glow-amber hover:bg-amber-400',
    ghost:
      'border border-white/20 text-white/90 px-7 py-3.5 sm:px-9 sm:py-4 hover:border-amber-500 hover:text-amber-500',
  };
  const blueprintOverride = document.documentElement.classList.contains('blueprint-mode')
    ? variant === 'primary'
      ? 'bg-teal-500 text-slatey-950 hover:bg-teal-400'
      : 'border-teal-300/40 text-teal-100 hover:border-teal-300 hover:text-teal-300'
    : '';

  return (
    <button
      ref={ref}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className={`${base} ${variants[variant]} ${blueprintOverride} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

// ==================== ThemeToggle.tsx ====================
type ThemeToggleProps = {
  mode: ThemeMode;
  onCycle: () => void;
};

const labels: Record<ThemeMode, string> = {
  dark: 'Dark',
  light: 'Light',
  aurora: 'Aurora',
};

const icons: Record<ThemeMode, typeof Moon> = {
  dark: Moon,
  light: Sun,
  aurora: Sparkles,
};

const dotPos: Record<ThemeMode, string> = {
  dark: 'left-0.5 bg-amber-500',
  light: 'left-1/2 -translate-x-1/2 bg-amber-500',
  aurora: 'left-[1.625rem] bg-teal-500',
};

function ThemeToggle({ mode, onCycle }: ThemeToggleProps) {
  const Icon = icons[mode];
  return (
    <button
      onClick={onCycle}
      aria-label={`Switch theme (current: ${labels[mode]})`}
      className="group relative flex items-center gap-2 rounded-full border border-white/15 hover:border-amber-500/70 transition-colors duration-300 px-3 py-2"
    >
      <span className="relative flex h-5 w-9 items-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white/15">
        <span className={`absolute h-4 w-4 rounded-full transition-all duration-500 ease-premium ${dotPos[mode]}`} />
      </span>
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 group-hover:text-white transition-colors">
        <Icon size={12} />
        {labels[mode]}
      </span>
    </button>
  );
}

// ==================== NodalGrid.tsx ====================
type NodalGridProps = {
  mode: ThemeMode;
  /** Boost node density / connection radius when active (e.g. project hover) */
  intense?: boolean;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
};

/**
 * Interactive 3D-feeling nodal grid: particles drift in a space-frame lattice,
 * connecting to nearby nodes like a structural truss. Cursor proximity displaces
 * nodes and brightens their connections.
 */
function NodalGrid({ mode, intense = false }: NodalGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intenseRef = useRef(intense);
  const modeRef = useRef(mode);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number>(0);

  useEffect(() => { intenseRef.current = intense; }, [intense]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let connectDist = 160;

    const palette = () => {
      const m = modeRef.current;
      if (m === 'aurora') {
        return {
          node: 'rgba(0, 194, 168, 0.85)',
          nodeGlow: 'rgba(51, 217, 196, 0.95)',
          line: (a: number) => `rgba(0, 194, 168, ${a})`,
          lineHot: (a: number) => `rgba(139, 92, 246, ${a})`,
        };
      }
      if (m === 'light') {
        return {
          node: 'rgba(26, 26, 26, 0.35)',
          nodeGlow: 'rgba(212, 136, 15, 0.95)',
          line: (a: number) => `rgba(26, 26, 26, ${a * 0.5})`,
          lineHot: (a: number) => `rgba(245, 166, 35, ${a})`,
        };
      }
      return {
        node: 'rgba(238, 242, 255, 0.5)',
        nodeGlow: 'rgba(245, 166, 35, 0.95)',
        line: (a: number) => `rgba(238, 242, 255, ${a})`,
        lineHot: (a: number) => `rgba(245, 166, 35, ${a})`,
      };
    };

    const buildNodes = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with viewport area, capped for perf
      const target = Math.min(140, Math.floor((width * height) / 14000));
      nodes = [];
      for (let i = 0; i < target; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
        });
      }
      connectDist = width < 640 ? 130 : 170;
    };

    buildNodes();

    const onResize = () => buildNodes();
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });

    const draw = () => {
      const colors = palette();
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;
      const boost = intenseRef.current ? 1.25 : 1;
      const linkDist = connectDist * boost;

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Soft pull back to base position (structural memory)
        n.x += (n.baseX - n.x) * 0.0012;
        n.y += (n.baseY - n.y) * 0.0012;

        // Cursor displacement
        if (mouseActive) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const d2 = dx * dx + dy * dy;
          const r = 180 * 180;
          if (d2 < r) {
            const d = Math.sqrt(d2) || 0.0001;
            const force = (1 - d / 180) * 0.9;
            n.x += (dx / d) * force * 2.4;
            n.y += (dy / d) * force * 2.4;
          }
        }

        // Wrap softly within bounds
        if (n.x < -40) n.x = width + 40;
        if (n.x > width + 40) n.x = -40;
        if (n.y < -40) n.y = height + 40;
        if (n.y > height + 40) n.y = -40;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / linkDist) * 0.55;
            let hot = 0;
            if (mouseActive) {
              const midX = (a.x + b.x) * 0.5;
              const midY = (a.y + b.y) * 0.5;
              const mdx = midX - mx;
              const mdy = midY - my;
              const md = Math.sqrt(mdx * mdx + mdy * mdy);
              hot = Math.max(0, 1 - md / 220);
            }
            ctx.strokeStyle = hot > 0.05 ? colors.lineHot(alpha * (0.4 + hot)) : colors.line(alpha * 0.55);
            ctx.lineWidth = 0.6 + hot * 1.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        let glow = 0;
        if (mouseActive) {
          const dx = n.x - mx;
          const dy = n.y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          glow = Math.max(0, 1 - d / 220);
        }
        ctx.beginPath();
        ctx.fillStyle = glow > 0.1 ? colors.nodeGlow : colors.node;
        ctx.arc(n.x, n.y, 1.2 + glow * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
    />
  );
}

// ==================== WireframeBuilding.tsx ====================
/**
 * SVG wireframe of a multi-story building — simulates an ETABS structural
 * rendering. All lines are stroke-only so they morph cleanly from the grid.
 */
function WireframeBuilding({ visible }: { visible: boolean }) {
  const stories = 6;
  const bays = 4;
  const w = 360;
  const h = 360;
  const padX = 40;
  const padY = 30;
  const storyH = (h - padY * 2) / stories;
  const bayW = (w - padX * 2) / bays;

  const cols: { x: number; y1: number; y2: number }[] = [];
  for (let b = 0; b <= bays; b++) {
    cols.push({ x: padX + b * bayW, y1: padY, y2: h - padY });
  }
  const beams: { y: number; x1: number; x2: number }[] = [];
  for (let s = 0; s <= stories; s++) {
    beams.push({ y: padY + s * storyH, x1: padX, x2: w - padX });
  }

  // diagonals (X-bracing) for seismic resistance — middle bay
  const diagBay = 1;
  const dx = padX + diagBay * bayW;
  const diagLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let s = 0; s < stories; s++) {
    const y1 = padY + s * storyH;
    const y2 = padY + (s + 1) * storyH;
    diagLines.push({ x1: dx, y1, x2: dx + bayW, y2 });
    diagLines.push({ x1: dx + bayW, y1, x2: dx, y2 });
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={`h-full w-full transition-opacity duration-700 ease-premium ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      fill="none"
      stroke="currentColor"
    >
      {/* Footing */}
      <line x1={padX - 10} y1={h - padY} x2={w - padX + 10} y2={h - padY} strokeWidth={2.5} />
      {Array.from({ length: bays + 1 }).map((_, i) => (
        <line
          key={`foot-${i}`}
          x1={padX + i * bayW}
          y1={h - padY}
          x2={padX + i * bayW}
          y2={h - padY + 8}
          strokeWidth={1.5}
        />
      ))}

      {/* Columns */}
      {cols.map((c, i) => (
        <line
          key={`col-${i}`}
          x1={c.x}
          y1={c.y1}
          x2={c.x}
          y2={c.y2}
          strokeWidth={2}
          className="transition-all duration-700"
          style={{ transitionDelay: `${i * 60}ms` }}
        />
      ))}

      {/* Beams */}
      {beams.map((b, i) => (
        <line
          key={`beam-${i}`}
          x1={b.x1}
          y1={b.y}
          x2={b.x2}
          y2={b.y}
          strokeWidth={1.5}
          className="transition-all duration-700"
          style={{ transitionDelay: `${i * 60 + 200}ms` }}
        />
      ))}

      {/* X-bracing */}
      {diagLines.map((d, i) => (
        <line
          key={`diag-${i}`}
          x1={d.x1}
          y1={d.y1}
          x2={d.x2}
          y2={d.y2}
          strokeWidth={1}
          strokeDasharray="3 3"
          className="transition-all duration-700"
          style={{ transitionDelay: `${i * 40 + 500}ms` }}
        />
      ))}

      {/* Nodes */}
      {cols.map((c) =>
        beams.map((b) => (
          <circle
            key={`node-${c.x}-${b.y}`}
            cx={c.x}
            cy={b.y}
            r={2.4}
            fill="currentColor"
            stroke="none"
          />
        ))
      )}

      {/* Labels */}
      <text x={padX} y={padY - 8} fontSize={9} fill="currentColor" className="font-mono">
        ROOF L6
      </text>
      <text x={padX} y={h - padY + 18} fontSize={9} fill="currentColor" className="font-mono">
        FOUNDATION
      </text>
      <text x={w - padX} y={padY - 8} fontSize={9} fill="currentColor" textAnchor="end" className="font-mono">
        ETABS · WF-01
      </text>
    </svg>
  );
}

// ==================== Nav.tsx ====================
type NavProps = {
  mode: ThemeMode;
  onCycleTheme: () => void;
};

const links = [
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'work', label: 'Featured Work' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'academic', label: 'Academic' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'quiz', label: 'Quiz Hub' },
  { id: 'contact', label: 'Contact' },
];


function Nav({ mode, onCycleTheme }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-premium ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <div className="section-pad flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3"
          aria-label="Back to top"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-amber-600 font-display font-bold text-slatey-950">
            M
            <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-teal-500 animate-gridPulse" />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-sm font-semibold tracking-tightest ink">
              Mohit Kumar Upadhyaya
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
              Civil Engineer & Leader
            </span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="group relative px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] ink-soft hover:text-amber-600 transition-colors"
            >
              {l.label}
              <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-amber-500 transition-all duration-500 ease-premium group-hover:w-6" />
            </button>
          ))}
          <a
            href={QUIZ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 group relative inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-amber-600 hover:bg-amber-500 hover:text-slatey-950 transition-colors"
          >
            <GraduationCap size={13} />
            Open Quiz
            <ExternalLink size={11} className="opacity-70" />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <a
              href="mailto:upadhyaymohit0412@gmail.com"
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 ink-soft hover:text-amber-600 hover:border-amber-500 transition-colors"
            >
              <Mail size={15} />
            </a>
            <a
              href={QUIZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Quiz hub"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/40 text-amber-600 hover:bg-amber-500 hover:text-slatey-950 transition-colors"
            >
              <GraduationCap size={15} />
            </a>
          </div>
          <ThemeToggle mode={mode} onCycle={onCycleTheme} />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/10 ink"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-premium ${
          open ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="section-pad mt-3 flex flex-col gap-1 glass rounded-2xl py-4">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="flex items-center justify-between px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] ink-soft hover:text-amber-600 transition-colors"
            >
              {l.label}
              <span className="text-amber-600">→</span>
            </button>
          ))}
          <a
            href={QUIZ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-between rounded-xl bg-amber-500/15 border border-amber-500/40 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-amber-600"
          >
            <span className="flex items-center gap-2">
              <GraduationCap size={14} /> Open Quiz Hub
            </span>
            <ExternalLink size={12} />
          </a>
        </nav>
      </div>
    </header>
  );
}

// ==================== Hero.tsx ====================
const floatingVars = [
  'NBC 105:2020 Compliant',
  'Fe 500 Steel',
  'Concrete Grade M25',
  'ETABS v19 · Analysis',
  'AutoCAD 2024',
  'Seismic Zone V',
  'Live Load 3.0 kN/m²',
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function downloadCV() {
  const header = 'MOHIT KUMAR UPADHYAYA — CIVIL ENGINEER & LEADER';
  const lines = [
    'Contact: upadhyaymohit0412@gmail.com | +977-9863200285',
    'Base: Kalanki-9, Kathmandu (Temporary) | Roots: Raskot-8, Kalikot (Permanent)',
    'Quiz Hub: https://mku.name.np/quiz',
    '',
    'PROFILE',
    'Civil Engineering Graduate from IOE Purwanchal Campus (74.69% Aggregate).',
    'Bridging precise structural analysis with data-driven project coordination.',
    '',
    'CORE STRUCTURAL & TECHNICAL COMPETENCIES',
    '  - Structural Modeling & Analysis (ETABS)',
    '  - Engineering Drafting & Detailing (AutoCAD)',
    '  - Code Compliance & Seismic Design (Nepal National Building Code — NBC)',
    '',
    'EXECUTIVE & MANAGEMENT COMPETENCIES',
    '  - Public Relations & Strategic Marketing (Proven at DELTA 4.0)',
    '  - Campus Leadership & Project Coordination (Former CESS-Nepal President)',
    '  - Strategic Negotiation & Critical Thinking',
    '  - Visual Design & Brand Architecture (Canva)',
    '',
    'FEATURED STRUCTURAL WORK',
    '  Title: Seismic Analysis & Structural Design — Extension Building at IOEPC',
    '  Scope: Multi-story educational facility design',
    '  Framework: Full seismic and gravity load analysis executing precise element design',
    '  Codes: Complete enforcement of Nepal National Building Codes (NBC)',
    '  Pipeline: AutoCAD geometry modeling → ETABS structural verification',
    '',
    'LEADERSHIP TRAJECTORY',
    '  2081-2082  President | CESS-Nepal, IOE Purwanchal Campus',
    '    Led executive committee; ran national engineering exhibitions;',
    '    optimized inter-departmental workflows; mentored 500+ student engineers.',
    '  2080-2081  PR & Marketing Co-ordinator | DELTA 4.0',
    '    Scaled event visibility via data analytics; executed targeted digital marketing;',
    '    coordinated national press networks to maximize retention and engagement.',
    '',
    'ACADEMIC FOUNDATION',
    '  B.E. Civil Engineering | IOE Purwanchal Campus | 74.69% Aggregate | 2082',
    '  +2 Science | National Examination Board | 3.59 GPA | 2077',
    '  SEE | National Examination Board | 3.53 GPA | 2074',
    '',
    'OPERATIONAL NODES',
    '  Current Base: Kalanki-9, Kathmandu (Temporary)',
    '  Roots:        Raskot-8, Kalikot (Permanent)',
  ];
  const text = [header, ...lines].join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Mohit_Kumar_Upadhyaya_CV.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Hero() {
  const [varIndex, setVarIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setVarIndex((i) => (i + 1) % floatingVars.length);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 section-pad">
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 w-full">
        {/* LEFT */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="reveal flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-amber-500" />
            <span className="section-label">[ 01 / Civil Engineer & Leader ]</span>
          </div>

          <h1 className="reveal reveal-delay-1 font-display font-bold tracking-tightest text-white text-5xl sm:text-6xl lg:text-7xl xl:text-[5.6rem] leading-[0.95]">
            Engineering
            <br />
            <span className="text-gradient-amber">Structural Integrity.</span>
            <br />
            Leading Community
            <br />
            <span className="relative inline-block">
              Innovation.
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-amber-500 via-teal-500 to-violetx-500" />
            </span>
          </h1>

          <p className="reveal reveal-delay-2 mt-8 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed">
            Civil Engineering Graduate from IOE Purwanchal Campus. Bridging
            precise structural analysis with data-driven project coordination.
          </p>

          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              variant="primary"
              onClick={() => scrollToId('work')}
              ariaLabel="Explore engineering matrix"
            >
              Explore Engineering Matrix
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={downloadCV}
              ariaLabel="Download CV"
            >
              <Download size={16} />
              Retrieve CV
            </MagneticButton>
            <a
              href={QUIZ_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-amber-500 hover:bg-amber-500 hover:text-slatey-950 transition-all duration-500 ease-premium glow-amber"
            >
              <GraduationCap size={16} />
              Quiz Hub
              <ExternalLink size={12} className="opacity-70 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="reveal reveal-delay-4 mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-xs text-white/55">
            <a href="mailto:upadhyaymohit0412@gmail.com" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
              <Mail size={13} /> upadhyaymohit0412@gmail.com
            </a>
            <a href="tel:+9779863200285" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
              <Phone size={13} /> +977-9863200285
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={13} /> Kathmandu · Kalikot, Nepal
            </span>
          </div>
        </div>

        {/* RIGHT — portrait card */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="reveal reveal-delay-3 relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden glass">
            {/* Civil engineering backdrop image */}
            <img
              src={IMG.heroEngineer}
              alt="Civil engineer reviewing structural blueprints on site"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slatey-950 via-slatey-950/55 to-slatey-950/20" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Stylized portrait mark */}
                <div className="relative h-44 w-44 rounded-full border border-white/20 flex items-center justify-center animate-floatY backdrop-blur-md bg-slatey-950/40">
                  <div className="absolute inset-4 rounded-full border border-amber-500/50" />
                  <div className="absolute inset-10 rounded-full border border-teal-500/50" />
                  <div className="font-display text-6xl font-bold tracking-tightest text-white">M</div>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-amber-400">
                    MOHIT
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-teal-400">
                    UPADHYAYA
                  </div>
                </div>
              </div>
            </div>

            {/* Floating structural variables */}
            <div className="absolute inset-0 pointer-events-none">
              {floatingVars.map((v, i) => {
                const positions = [
                  'top-[14%] left-6',
                  'top-[28%] right-6',
                  'top-[52%] left-8',
                  'top-[68%] right-8',
                  'bottom-[14%] left-6',
                  'bottom-[28%] right-6',
                  'top-[40%] left-1/2 -translate-x-1/2',
                ];
                const isActive = i === varIndex;
                return (
                  <span
                    key={v}
                    className={`absolute ${positions[i]} font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] transition-all duration-700 ease-premium ${
                      isActive
                        ? 'opacity-100 translate-y-0 text-amber-500'
                        : 'opacity-0 -translate-y-2 text-white/50'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 glass">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-gridPulse" />
                      {v}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Corner HUD */}
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
              <Cpu size={11} className="text-amber-500" /> IOEPC // 2026
            </div>
            <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
              ID · 074 / CE
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
              <span className="flex items-center gap-1.5">
                <Layers size={11} className="text-teal-500" /> Structural Vector
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 size={11} className="text-amber-500" /> Live
              </span>
            </div>

            {/* Scanline */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/70 to-transparent animate-scanline" />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-amber-500 to-transparent" />
      </div>
    </section>
  );
}

// ==================== StatsBand.tsx ====================
type Stat = {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Users;
};

const stats: Stat[] = [
  { value: 500, suffix: '+', label: 'Student Engineers Mentored', icon: Users },
  { value: 74.69, suffix: '%', label: 'B.E. Civil Aggregate', icon: Award },
  { value: 2, suffix: '', label: 'National Exhibitions Led', icon: Building2 },
  { value: 3, suffix: '', label: 'Engineering Software Stack', icon: BookOpen },
];

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const isFloat = !Number.isInteger(target);

  useEffect(() => {
    if (!run || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [run, target, duration]);

  return isFloat ? val.toFixed(2) : Math.round(val).toString();
}

function StatItem({ stat, run }: { stat: Stat; run: boolean }) {
  const Icon = stat.icon;
  const v = useCountUp(stat.value, run);
  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 mb-3">
        <Icon size={18} />
      </span>
      <div className="font-display text-3xl sm:text-4xl font-bold tracking-tightest text-gradient-amber">
        {v}
        <span className="text-amber-500">{stat.suffix}</span>
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] ink-faint text-center max-w-[12rem]">
        {stat.label}
      </div>
    </div>
  );
}

function StatsBand() {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative section-pad py-16 md:py-20">
      <div className="reveal rounded-3xl glass overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/8">
          {stats.map((s) => (
            <StatItem key={s.label} stat={s} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== Capabilities.tsx ====================
type Tech = {
  name: string;
  tool: string;
  level: number;
  icon: typeof Boxes;
  blurb: string;
};

const trackA: Tech[] = [
  {
    name: 'Structural Modeling & Analysis',
    tool: 'ETABS',
    level: 92,
    icon: Boxes,
    blurb: '3D modeling, gravity + seismic load path, dynamic analysis & element verification.',
  },
  {
    name: 'Engineering Drafting & Detailing',
    tool: 'AutoCAD',
    level: 88,
    icon: PenLine,
    blurb: 'Precise geometry, structural layouts, reinforcement detailing & drawing sets.',
  },
  {
    name: 'Code Compliance & Seismic Design',
    tool: 'NBC 105:2020',
    level: 85,
    icon: ShieldAlert,
    blurb: 'Nepal National Building Code enforcement for earthquake-resistant design.',
  },
];

const trackB: Tech[] = [
  {
    name: 'Public Relations & Strategic Marketing',
    tool: 'DELTA 4.0',
    level: 90,
    icon: Megaphone,
    blurb: 'Data-driven visibility pipelines, press coordination & retention strategy.',
  },
  {
    name: 'Campus Leadership & Project Coordination',
    tool: 'CESS-Nepal',
    level: 95,
    icon: Users,
    blurb: 'Led national engineering exhibitions; mentored 500+ student engineers.',
  },
  {
    name: 'Strategic Negotiation & Critical Thinking',
    tool: 'Executive',
    level: 88,
    icon: Brain,
    blurb: 'Stakeholder alignment, conflict resolution & decision-making under constraint.',
  },
  {
    name: 'Visual Design & Brand Architecture',
    tool: 'Canva',
    level: 84,
    icon: Palette,
    blurb: 'Brand systems, marketing collateral & visual identity for engineering events.',
  },
];

function TrackACard({ t, idx }: { t: Tech; idx: number }) {
  const [hover, setHover] = useState(false);
  const Icon = t.icon;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`reveal reveal-delay-${idx + 1} group relative rounded-2xl glass p-6 transition-all duration-500 ease-premium ${
        hover ? 'border-amber-500/60 -translate-y-1' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-slatey-950 transition-colors duration-500">
            <Icon size={18} />
          </span>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              {t.tool}
            </div>
            <div className="font-display text-base font-semibold text-white">
              {t.name}
            </div>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className={`text-white/30 transition-all duration-500 ${hover ? 'text-amber-500 -translate-y-0.5 translate-x-0.5' : ''}`}
        />
      </div>

      <p className="mt-4 text-sm text-white/65 leading-relaxed">{t.blurb}</p>

      {/* Hexagonal vector meter */}
      <div className="mt-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
          <span>Proficiency Vector</span>
          <span className="text-amber-500">{t.level}%</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-teal-500 transition-all duration-1000 ease-premium"
            style={{ width: hover ? `${t.level}%` : '0%' }}
          />
        </div>
      </div>

      {/* Corner mark */}
      <span className="absolute top-3 right-3 font-mono text-[10px] text-white/30">
        0{idx + 1}
      </span>
    </div>
  );
}

function TrackBBadge({ t, idx }: { t: Tech; idx: number }) {
  const [hover, setHover] = useState(false);
  const Icon = t.icon;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`reveal reveal-delay-${idx + 1} group relative rounded-2xl p-5 transition-all duration-500 ease-premium ${
        hover
          ? 'glass border-amber-500/60 -translate-y-1'
          : 'border border-white/8 hover:border-white/15'
      }`}
      style={{ background: hover ? 'rgba(255,87,34,0.06)' : 'transparent' }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
          <Icon size={16} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-teal-500">
            {t.tool}
          </div>
          <div className="font-display text-sm font-semibold text-white truncate">
            {t.name}
          </div>
        </div>
        <span className="font-mono text-xs text-white/40 group-hover:text-amber-500 transition-colors">
          {t.level}%
        </span>
      </div>
      <p className="mt-3 text-xs text-white/55 leading-relaxed">{t.blurb}</p>
    </div>
  );
}

function Capabilities() {
  return (
    <section id="capabilities" className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 02 / Core Capabilities ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest text-white max-w-3xl">
        The <span className="text-amber-500">Dual-Core</span> Engineering Vector Grid
      </h2>
      <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-white/65 text-lg">
        Two parallel tracks — rigorous structural engineering and high-impact
        executive leadership — fused into a single operating system.
      </p>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Track A */}
        <div className="lg:col-span-7">
          <div className="reveal flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-slatey-950 font-mono text-[10px]">A</span>
              <h3 className="font-display text-lg font-semibold text-white">
                Core Structural & Technical
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Track A · Engineering
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trackA.map((t, i) => (
              <TrackACard key={t.name} t={t} idx={i} />
            ))}
          </div>
        </div>

        {/* Track B */}
        <div className="lg:col-span-5">
          <div className="reveal flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500 text-slatey-950 font-mono text-[10px]">B</span>
              <h3 className="font-display text-lg font-semibold text-white">
                Executive & Management
              </h3>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Track B · Leadership
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {trackB.map((t, i) => (
              <TrackBBadge key={t.name} t={t} idx={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== FeaturedWork.tsx ====================
const metrics = [
  {
    label: 'Project Scope',
    value: 'Multi-story educational facility design',
    icon: Building2,
  },
  {
    label: 'Design Framework',
    value: 'Full seismic + gravity load analysis with precise element design',
    icon: Compass,
  },
  {
    label: 'Structural Codes',
    value: 'Complete enforcement of Nepal National Building Codes (NBC)',
    icon: ShieldCheck,
  },
  {
    label: 'Software Pipeline',
    value: 'AutoCAD geometry modeling → ETABS structural verification',
    icon: Cpu,
  },
];

function FeaturedWork() {
  const [hover, setHover] = useState(false);

  return (
    <section id="work" className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 02 / Featured Structural Work ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest text-white max-w-3xl">
        Capstone <span className="text-amber-500">Engineering</span> Case Study
      </h2>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="reveal reveal-delay-2 mt-12 relative rounded-3xl overflow-hidden glass"
      >
        {/* Background site image */}
        <img
          src={IMG.highRise}
          alt="Multi-story educational facility under construction"
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-premium ${
            hover ? 'opacity-20 scale-105' : 'opacity-30'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slatey-950/90 via-slatey-950/70 to-slatey-950/40" />
        {/* Background grid morphs to wireframe on hover */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${
            hover ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-[420px] w-[420px] sm:h-[480px] sm:w-[480px] text-amber-500/90">
            <WireframeBuilding visible={hover} />
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-10 lg:p-14">
          {/* Left: title */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-500">
                <Layers size={11} /> Featured · Capstone
              </div>
              <h3 className="mt-6 font-display text-3xl sm:text-4xl font-bold tracking-tightest text-white leading-[1.05]">
                Seismic Analysis & Structural Design:
                <span className="block text-amber-500 mt-1">
                  Extension Building at IOEPC
                </span>
              </h3>
              <p className="mt-5 text-white/65 leading-relaxed max-w-md">
                A multi-story educational facility designed end-to-end — from
                architectural geometry to verified structural elements — under
                full Nepal National Building Code compliance.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 hover:border-amber-500 hover:text-amber-500 transition-colors"
              >
                Request Brief
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                IOEPC · 2082
              </span>
            </div>
          </div>

          {/* Right: metrics grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    className={`reveal reveal-delay-${i + 1} group relative rounded-2xl border border-white/8 p-5 transition-all duration-500 ease-premium hover:border-amber-500/60 hover:bg-white/[0.03]`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-slatey-950 transition-colors duration-500">
                        <Icon size={14} />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                        {m.label}
                      </span>
                    </div>
                    <p className="text-sm text-white/85 leading-relaxed">{m.value}</p>
                    <span className="absolute top-3 right-3 font-mono text-[10px] text-white/30">
                      0{i + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pipeline visualization */}
            <div className="mt-6 rounded-2xl border border-white/8 p-5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-4">
                <span>Software Pipeline</span>
                <span className="text-amber-500">AutoCAD → ETABS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/8 px-3 py-2 text-center font-mono text-[11px] text-white/80">
                  AutoCAD
                </div>
                <span className="text-amber-500">→</span>
                <div className="flex-1 rounded-lg bg-white/[0.03] border border-white/8 px-3 py-2 text-center font-mono text-[11px] text-white/80">
                  Geometry Model
                </div>
                <span className="text-amber-500">→</span>
                <div className="flex-1 rounded-lg bg-amber-500/15 border border-amber-500/40 px-3 py-2 text-center font-mono text-[11px] text-amber-500">
                  ETABS Verify
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover hint */}
        <div className="absolute bottom-4 right-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${hover ? 'bg-amber-500' : 'bg-white/30'}`} />
          {hover ? 'Wireframe active' : 'Hover to render wireframe'}
        </div>
      </div>
    </section>
  );
}

// ==================== Manifesto.tsx ====================
function Manifesto() {
  return (
    <section className="relative section-pad py-20 md:py-28">
      <div className="reveal relative rounded-3xl glass p-10 sm:p-14 lg:p-20 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative">
          <Quote className="text-amber-500/60" size={40} />
          <blockquote className="mt-6 font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tightest ink leading-[1.2] max-w-4xl">
            "One who creates what nature forgot to do — is a civil engineer.
            I build structures that stand, teams that ship, and communities
            that <span className="text-gradient-amber">compound</span>."
          </blockquote>
          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-10 bg-amber-500" />
            <div>
              <div className="font-display text-sm font-semibold ink">
                Mohit Kumar Upadhyaya
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                Civil Engineer · CESS-Nepal President · Founder, HAMRO AFNAI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== LeadershipTimeline.tsx ====================
type Entry = {
  period: string;
  role: string;
  org: string;
  description: string;
  icon: typeof Crown;
  highlights: string[];
};

const entries: Entry[] = [
  {
    period: '2081 — 2082',
    role: 'President',
    org: 'CESS-Nepal, IOE Purwanchal Campus',
    icon: Crown,
    description:
      'Led a high-performance executive committee to run national engineering exhibitions, optimized inter-departmental workflows, and mentored 500+ student engineers.',
    highlights: ['500+ engineers mentored', 'National exhibitions', 'Inter-dept workflows'],
  },
  {
    period: '2080 — 2081',
    role: 'PR & Marketing Co-ordinator',
    org: 'DELTA 4.0',
    icon: Megaphone,
    description:
      'Scaled event visibility using data analytics, executed targeted digital marketing pipelines, and coordinated national press networks to maximize retention and event engagement.',
    highlights: ['Data-driven visibility', 'Digital marketing pipelines', 'National press networks'],
  },
];

function LeadershipTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → 1
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start when section top reaches ~70% viewport, end when bottom passes ~30%
      const start = vh * 0.7;
      const end = vh * 0.3;
      const total = rect.height - (start - end);
      const scrolled = start - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);

      // Determine active node
      const nodes = el.querySelectorAll('[data-node]');
      let active = -1;
      nodes.forEach((n, i) => {
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.55) active = i;
      });
      setActiveIdx(active);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="leadership" ref={sectionRef} className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 03 / Leadership in Action ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest text-white max-w-3xl">
        Trajectory <span className="text-amber-500">Beam</span> — welded node by node.
      </h2>
      <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-white/65 text-lg">
        A scroll-triggered structural beam. As you scroll, a weld spark follows
        each node — marking each leadership milestone.
      </p>

      <div className="mt-16 relative max-w-4xl mx-auto">
        {/* Vertical beam */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10" />
        {/* Progress fill */}
        <div
          className="absolute left-4 sm:left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-amber-500 via-amber-400 to-teal-500"
          style={{ height: `${progress * 100}%` }}
        />

        {/* Travelling weld spark */}
        <div
          className="absolute left-4 sm:left-1/2 -translate-x-1/2 transition-transform duration-200 ease-out"
          style={{ top: `${progress * 100}%` }}
        >
          <span className="relative flex h-3 w-3 -translate-y-1/2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
          </span>
        </div>

        <div className="space-y-16 sm:space-y-24">
          {entries.map((e, i) => {
            const Icon = e.icon;
            const isActive = activeIdx >= i;
            const isLeft = i % 2 === 0;
            return (
              <div
                key={e.role}
                className={`relative grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 items-center`}
              >
                {/* Node */}
                <div
                  data-node
                  className={`absolute left-4 sm:left-1/2 -translate-x-1/2 z-10`}
                >
                  <div
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ease-premium ${
                      isActive
                        ? 'bg-amber-500 text-slatey-950 scale-110'
                        : 'bg-slatey-900 border border-white/15 text-white/50'
                    }`}
                  >
                    <Icon size={14} />
                    {isActive && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-amber-500 animate-spark" />
                        <Sparkles size={10} className="absolute -top-1 -right-1 text-amber-300" />
                      </>
                    )}
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`reveal pl-12 sm:pl-0 ${
                    isLeft ? 'sm:pr-12 sm:text-right' : 'sm:col-start-2 sm:pl-12'
                  }`}
                >
                  <div className="glass rounded-2xl p-6 transition-all duration-500 ease-premium hover:border-amber-500/60 hover:-translate-y-1">
                    <div className={`flex items-center gap-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-amber-500">
                        {e.period}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold text-white">
                      {e.role}
                    </h3>
                    <div className="font-mono text-xs text-teal-400">{e.org}</div>
                    <p className="mt-3 text-sm text-white/65 leading-relaxed">
                      {e.description}
                    </p>
                    <div className={`mt-4 flex flex-wrap gap-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                      {e.highlights.map((h) => (
                        <span
                          key={h}
                          className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==================== AcademicRecord.tsx ====================
type AcademicRecordEntry = {
  degree: string;
  institution: string;
  score: string;
  scoreLabel: string;
  year: string;
  icon: typeof GraduationCap;
  accent: boolean;
};

const records: AcademicRecordEntry[] = [
  {
    degree: 'B.E. Civil Engineering',
    institution: 'IOE Purwanchal Campus',
    score: '74.69',
    scoreLabel: '% Aggregate',
    year: '2082',
    icon: GraduationCap,
    accent: true,
  },
  {
    degree: '+2 Science',
    institution: 'National Examination Board',
    score: '3.59',
    scoreLabel: 'GPA',
    year: '2077',
    icon: BookOpen,
    accent: false,
  },
  {
    degree: 'SEE',
    institution: 'National Examination Board',
    score: '3.53',
    scoreLabel: 'GPA',
    year: '2074',
    icon: School,
    accent: false,
  },
];

function AcademicRecord() {
  return (
    <section id="academic" className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 04 / Academic Foundation ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest text-white max-w-3xl">
        A Metric-Based <span className="text-amber-500">Academic</span> Record
      </h2>
      <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-white/65 text-lg">
        A clean, verifiable data grid — from secondary education to a civil
        engineering degree.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {records.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={r.degree}
              className={`reveal reveal-delay-${i + 1} group relative rounded-2xl overflow-hidden glass p-6 transition-all duration-500 ease-premium hover:-translate-y-1 ${
                r.accent ? 'border-amber-500/50' : 'hover:border-white/20'
              }`}
            >
              {/* Accent corner */}
              {r.accent && (
                <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/15 blur-2xl rounded-full" />
              )}

              <div className="relative flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-500 ${
                    r.accent
                      ? 'bg-amber-500 text-slatey-950'
                      : 'bg-white/5 text-white/70 group-hover:bg-amber-500 group-hover:text-slatey-950'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                  {r.year}
                </span>
              </div>

              <h3 className="relative mt-5 font-display text-lg font-semibold text-white">
                {r.degree}
              </h3>
              <div className="relative font-mono text-xs text-teal-400">
                {r.institution}
              </div>

              <div className="relative mt-6 flex items-end justify-between">
                <div>
                  <div
                    className={`font-display text-4xl font-bold tracking-tightest ${
                      r.accent ? 'text-amber-500' : 'text-white'
                    }`}
                  >
                    {r.score}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                    {r.scoreLabel}
                  </div>
                </div>
                <TrendingUp
                  size={16}
                  className="text-white/30 group-hover:text-amber-500 transition-colors"
                />
              </div>

              {/* Bottom bar */}
              <div className="relative mt-5 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    r.accent
                      ? 'bg-gradient-to-r from-amber-500 to-teal-500'
                      : 'bg-white/30'
                  }`}
                  style={{
                    width: r.accent ? '92%' : `${(parseFloat(r.score) / 4) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ==================== Gallery.tsx ====================
function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 05 / Field Gallery ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest ink max-w-3xl">
        From <span className="text-gradient-amber">Blueprint</span> to Built Form
      </h2>
      <p className="reveal reveal-delay-2 mt-5 max-w-2xl ink-soft text-lg">
        A visual field-log across structural sites — reinforcement, formwork,
        survey, and execution. Engineering is not just analysis; it's what
        stands at the end.
      </p>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {galleryItems.map((g, i) => (
          <figure
            key={g.title}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`reveal reveal-delay-${(i % 4) + 1} group relative rounded-2xl overflow-hidden glass img-zoom ${
              i === 0 ? 'col-span-2 md:col-span-2 row-span-2 md:row-span-2' : ''
            }`}
          >
            <img
              src={g.src}
              alt={`${g.title} — ${g.caption}`}
              loading="lazy"
              className={`w-full h-full object-cover ${i === 0 ? 'aspect-square md:aspect-[4/3]' : 'aspect-[4/3]'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slatey-950/85 via-slatey-950/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400">
                  {g.tag}
                </span>
                <ArrowUpRight
                  size={16}
                  className={`text-white transition-all duration-500 ${
                    active === i ? 'opacity-100 -translate-y-0.5 translate-x-0.5' : 'opacity-0'
                  }`}
                />
              </div>
              <h3 className="mt-2 font-display text-base sm:text-lg font-semibold text-white">
                {g.title}
              </h3>
              <p
                className={`mt-1 text-xs sm:text-sm text-white/70 leading-relaxed transition-all duration-500 ${
                  active === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                }`}
              >
                {g.caption}
              </p>
            </figcaption>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
              <Images size={11} /> 0{i + 1}
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

// ==================== QuizHub.tsx ====================
const features = [
  {
    icon: BookOpen,
    title: 'License Preparation',
    desc: 'Structured MCQ practice for the Nepal Engineering Council license exam.',
  },
  {
    icon: Award,
    title: 'Loksewa Exam Guidance',
    desc: 'Targeted tracks for civil engineering public-service examinations.',
  },
  {
    icon: Layers,
    title: 'Smart Study Hub',
    desc: 'Curated study materials, quizzes, and progress tracking in one place.',
  },
  {
    icon: Users,
    title: 'Built for Nepal Engineers',
    desc: 'A growing community of engineering students preparing together.',
  },
];

function QuizHub() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setStatus('error');
      setError('Enter a valid email address.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const { error: err } = await subscribeLead(email.trim(), 'quiz-hub-section');
      if (err) throw err;
      setStatus('done');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Could not subscribe. Try the Quiz Hub directly.'
      );
    }
  };

  return (
    <section id="quiz" className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 06 / HAMRO AFNAI · Quiz Hub ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest ink max-w-4xl">
        A <span className="text-gradient-amber">Smart Study Hub</span> for Nepal's
        Next Generation of Engineers.
      </h2>
      <p className="reveal reveal-delay-2 mt-5 max-w-2xl ink-soft text-lg">
        Beyond structural design, I operate <span className="text-amber-500 font-medium">HAMRO AFNAI</span> —
        a platform dedicated to License Preparation & Loksewa Exam guidance for
        civil engineering students across Nepal.
      </p>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`reveal reveal-delay-${i + 1} group relative rounded-2xl glass p-6 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-amber-500/50`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-slatey-950 transition-colors duration-500">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-display text-base font-semibold ink">
                    {f.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm ink-soft leading-relaxed">{f.desc}</p>
                <span className="absolute top-3 right-3 font-mono text-[10px] ink-faint">
                  0{i + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA card */}
        <div className="lg:col-span-5">
          <div className="reveal reveal-delay-3 relative h-full rounded-3xl overflow-hidden glass p-8 sm:p-10 flex flex-col justify-between">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-500">
                <Sparkles size={11} /> Live Platform
              </div>
              <h3 className="mt-6 font-display text-3xl font-bold tracking-tightest ink leading-tight">
                HAMRO AFNAI
                <span className="block text-gradient-amber mt-1">Smart Study Hub</span>
              </h3>
              <p className="mt-4 ink-soft leading-relaxed">
                Sign in, take quizzes, track progress, and unlock permanent
                access — built for engineering students preparing for license
                and Loksewa exams.
              </p>

              <div className="mt-6 flex items-center gap-2 font-mono text-xs text-teal-500">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-gridPulse" />
                mku.name.np/quiz
              </div>
            </div>

            <div className="relative mt-8">
              <a
                href={QUIZ_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn group inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 px-7 py-4 font-mono text-xs uppercase tracking-[0.18em] text-slatey-950 hover:bg-amber-400 transition-colors glow-amber"
              >
                <GraduationCap size={16} />
                Launch Quiz Hub
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={QUIZ_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] ink-soft hover:border-amber-500 hover:text-amber-500 transition-colors"
              >
                Visit mku.name.np/quiz
                <ExternalLink size={12} />
              </a>

              {/* Subscribe form */}
              <form onSubmit={subscribe} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint mb-2">
                  Get Quiz Updates
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 ink-faint" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      disabled={status === 'loading'}
                      className="w-full rounded-lg bg-white/[0.04] border border-white/10 pl-9 pr-3 py-2.5 text-sm ink placeholder-white/30 outline-none focus:border-amber-500/60 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'done'}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-slatey-950 hover:bg-teal-400 transition-colors disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : status === 'done' ? (
                      <Check size={13} />
                    ) : (
                      'Join'
                    )}
                  </button>
                </div>
                {status === 'done' && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-400">
                    <Check size={12} /> Subscribed — welcome aboard!
                  </div>
                )}
                {status === 'error' && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                    <AlertCircle size={12} /> {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== Contact.tsx ====================
type FormState = {
  name: string;
  email: string;
  message: string;
  quizInterest: boolean;
};

type FieldStatus = 'idle' | 'valid' | 'invalid';

type Status = 'idle' | 'submitting' | 'success' | 'error';

function Contact() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    quizInterest: false,
  });
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; message?: boolean }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);
  const nameValid = form.name.trim().length >= 2;
  const messageValid = form.message.trim().length >= 10;

  const statusOf = (field: keyof FormState): FieldStatus => {
    if (!touched[field as 'name' | 'email' | 'message']) return 'idle';
    if (field === 'name') return nameValid ? 'valid' : 'invalid';
    if (field === 'email') return emailValid ? 'valid' : 'invalid';
    if (field === 'message') return messageValid ? 'valid' : 'invalid';
    return 'idle';
  };

  const completion = [nameValid, emailValid, messageValid].filter(Boolean).length;
  const completionPct = (completion / 3) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!(nameValid && emailValid && messageValid)) return;

    setStatus('submitting');
    setErrorMsg('');

    try {
      const { error } = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        quiz_interest: form.quizInterest,
      });

      if (error) throw error;

      if (form.quizInterest) {
        await subscribeLead(form.email.trim(), 'portfolio-contact');
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '', quizInterest: false });
      setTouched({});
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not send. Please email directly at upadhyaymohit0412@gmail.com'
      );
    }
  };

  const fieldClass = (s: FieldStatus) =>
    `w-full rounded-xl bg-white/[0.03] border px-4 py-3 text-sm ink placeholder-white/30 outline-none transition-all duration-300 ${
      s === 'invalid'
        ? 'border-rose-500/60'
        : s === 'valid'
        ? 'border-amber-500/60'
        : 'border-white/10 focus:border-amber-500/60'
    }`;

  return (
    <section id="contact" className="relative section-pad section-pad-y">
      <div className="reveal flex items-center gap-3 mb-3">
        <span className="h-px w-10 bg-amber-500" />
        <span className="section-label">[ 07 / The Pipeline Terminal ]</span>
      </div>
      <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tightest ink">
        Let's Build the <span className="text-gradient-amber">Future.</span>
      </h2>
      <p className="reveal reveal-delay-2 mt-5 max-w-2xl ink-soft text-lg">
        Open to civil engineering roles, structural design collaborations, and
        leadership-driven project coordination. Send a transmission — every
        field gives live feedback and is stored securely.
      </p>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="reveal reveal-delay-2 relative rounded-3xl glass p-7 sm:p-9"
          >
            {/* Completion bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                <span>Transmission Integrity</span>
                <span className="text-amber-500">{completionPct.toFixed(0)}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-500 ease-premium"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {status === 'error' && (
              <div role="status" aria-live="polite" className="mb-4 flex items-start gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {status === 'success' && (
              <div role="status" aria-live="polite" className="mb-4 flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-500/10 px-4 py-3 text-sm text-teal-300">
                <Check size={16} /> Transmission received — I'll respond within 24h.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                  Name
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    placeholder="Your name"
                    disabled={status === 'submitting'}
                    className={fieldClass(statusOf('name'))}
                  />
                  {statusOf('name') === 'valid' && (
                    <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  )}
                  {statusOf('name') === 'invalid' && (
                    <AlertCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="contact-email" className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                  Email
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    placeholder="you@email.com"
                    disabled={status === 'submitting'}
                    className={fieldClass(statusOf('email'))}
                  />
                  {statusOf('email') === 'valid' && (
                    <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  )}
                  {statusOf('email') === 'invalid' && (
                    <AlertCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                Message
              </label>
              <div className="relative mt-1.5">
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onBlur={() => setTouched({ ...touched, message: true })}
                  placeholder="Tell me about the project, role, or collaboration…"
                  disabled={status === 'submitting'}
                  className={`${fieldClass(statusOf('message'))} resize-none`}
                />
                {statusOf('message') === 'valid' && (
                  <Check size={14} className="absolute right-3 top-3 text-amber-500" />
                )}
              </div>
              <div className="mt-1.5 font-mono text-[10px] ink-faint">
                {form.message.length} chars · min 10
              </div>
            </div>

            <label className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 cursor-pointer hover:border-amber-500/40 transition-colors">
              <input
                type="checkbox"
                checked={form.quizInterest}
                onChange={(e) => setForm({ ...form, quizInterest: e.target.checked })}
                className="mt-0.5 h-4 w-4 accent-amber-500"
              />
              <span className="text-sm ink-soft">
                Also subscribe me to <span className="text-amber-500 font-medium">HAMRO AFNAI Quiz Hub</span> updates —
                new Loksewa & license prep material.
              </span>
            </label>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                {status === 'submitting'
                  ? 'Transmitting…'
                  : status === 'success'
                  ? 'Transmission sent'
                  : 'Encrypted · stored securely'}
              </div>
              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="magnetic-btn group inline-flex items-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-slatey-950 hover:bg-amber-400 transition-colors glow-amber disabled:opacity-60"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Sending
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check size={15} /> Sent
                  </>
                ) : (
                  <>
                    Send Transmission
                    <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Operational nodes */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="reveal reveal-delay-3 rounded-3xl glass p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint mb-4">
              Operational Nodes
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-slatey-950 transition-colors">
                  <Building size={16} />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                    Current Base
                  </div>
                  <div className="text-sm ink font-medium">
                    Kalanki-9, Kathmandu
                  </div>
                  <div className="font-mono text-[10px] ink-faint">Temporary</div>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-500 group-hover:bg-teal-500 group-hover:text-slatey-950 transition-colors">
                  <Home size={16} />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint">
                    Roots
                  </div>
                  <div className="text-sm ink font-medium">
                    Raskot-8, Kalikot
                  </div>
                  <div className="font-mono text-[10px] ink-faint">Permanent</div>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-4 rounded-3xl glass p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] ink-faint mb-4">
              Direct Channels
            </div>
            <div className="space-y-3">
              <a
                href="mailto:upadhyaymohit0412@gmail.com"
                className="group flex items-center gap-3 text-sm ink-soft hover:text-amber-500 transition-colors"
              >
                <Mail size={15} className="text-amber-500" />
                upadhyaymohit0412@gmail.com
              </a>
              <a
                href="tel:+9779863200285"
                className="group flex items-center gap-3 text-sm ink-soft hover:text-amber-500 transition-colors"
              >
                <Phone size={15} className="text-amber-500" />
                +977-9863200285
              </a>
              <div className="flex items-center gap-3 text-sm ink-soft">
                <MapPin size={15} className="text-amber-500" />
                Nepal · GMT+5:45
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== Footer.tsx ====================
function Footer() {
  return (
    <footer className="relative section-pad pt-10 pb-12 border-t border-white/8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500 font-display font-bold text-slatey-950">
            M
          </span>
          <div>
            <div className="font-display text-sm font-semibold tracking-tightest text-white">
              Mohit Kumar Upadhyaya
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Civil Engineer & Leader
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <a href="mailto:upadhyaymohit0412@gmail.com" aria-label="Email" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-amber-500 hover:border-amber-500 transition-colors">
            <Mail size={14} />
          </a>
          <a href="tel:+9779863200285" aria-label="Phone" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-amber-500 hover:border-amber-500 transition-colors">
            <Phone size={14} />
          </a>
          <a href="#" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-amber-500 hover:border-amber-500 transition-colors">
            <Github size={14} />
          </a>
          <a href={QUIZ_URL} target="_blank" rel="noopener noreferrer" aria-label="Quiz Hub" className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/40 text-amber-500 hover:bg-amber-500 hover:text-slatey-950 transition-colors">
            <GraduationCap size={14} />
          </a>
        </div>

        <div className="flex md:justify-end items-center gap-3">
          <a
            href={QUIZ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-500 hover:bg-amber-500 hover:text-slatey-950 transition-colors"
          >
            Open Quiz Hub
            <ExternalLink size={11} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 hover:text-amber-500 hover:border-amber-500 transition-colors"
          >
            Back to Top
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          © 2082 Mohit Kumar Upadhyaya · IOE Purwanchal Campus
        </div>
        <a href={QUIZ_URL} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-amber-500 transition-colors">
          mku.name.np/quiz
        </a>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Built with structural precision · Industrial Cyber-Minimalism
        </div>
      </div>
    </footer>
  );
}

// ==================== App.tsx ====================
function App() {
  const { mode, cycle } = useThemeMode();
  useReveal();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <NodalGrid mode={mode} />
      <Nav mode={mode} onCycleTheme={cycle} />

      <main className="relative z-10">
        <Hero />
        <StatsBand />
        <Capabilities />
        <FeaturedWork />
        <Manifesto />
        <LeadershipTimeline />
        <AcademicRecord />
        <Gallery />
        <QuizHub />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
