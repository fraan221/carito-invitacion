'use client';

import gsap from 'gsap';
import { useState as useInViewState } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { toRoman } from '../utils/roman';
import styles from './CountUp.module.css';

type Easing = 'easeOut' | 'linear' | 'expo' | 'spring';

export interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  startWhen?: boolean;
  separator?: string;
  prefix?: string;
  suffix?: string;
  mode?: 'count' | 'roll';
  easing?: Easing;
  decimals?: number;
  format?: 'standard' | 'compact' | 'roman';
  customFormatter?: (value: number) => string;
  trigger?: 'view' | 'load';
  replayOnHover?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

type Column = {
  slot: number;
  index: number;
  place: number;
  from: number;
  to: number;
  enter: boolean;
  leave: boolean;
  delta: number;
};

type Mark = { char: string; enter?: boolean; leave?: boolean; follow?: number };

type Slot = Column | Mark;

type Roll = { slots: Slot[]; columns: Column[]; label: string };

type Play = { id: number; from: number; to: number; spin: boolean; wait?: boolean };

type Live = {
  formatValue: (value: number) => string;
  onStart?: () => void;
  onEnd?: () => void;
  model: Roll | null;
  mode: 'count' | 'roll';
  easing: Easing;
  duration: number;
  delay: number;
};

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (t: number): number => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    let u = t;
    for (let i = 0; i < 5; i++) {
      const currentX = ((ax * u + bx) * u + cx) * u;
      const currentSlope = (3 * ax * u + 2 * bx) * u + cx;
      if (Math.abs(currentSlope) < 1e-6) break;
      u -= (currentX - t) / currentSlope;
    }
    return ((ay * u + by) * u + cy) * u;
  };
}

const useSafeInView = (
  targetRef: React.RefObject<Element | null>,
  options?: { once?: boolean; margin?: string }
) => {
  const [inView, setInView] = useInViewState(() => {
    return typeof window === "undefined" || typeof window.IntersectionObserver === "undefined";
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") {
      return undefined;
    }
    const el = targetRef.current;
    if (!el) return undefined;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setInView(true);
          if (options?.once) observer.disconnect();
        }
      },
      { rootMargin: options?.margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetRef, options?.once, options?.margin, setInView]);

  return inView;
};

const CELL = 1.2;
const ROMAN_CELL = 1.15;
const STAGGER = 0.07;
const UNITS: [number, string][] = [
  [1e12, 'T'],
  [1e9, 'B'],
  [1e6, 'M'],
  [1e3, 'K']
];
const SLOT_STYLE: CSSProperties = { display: 'inline-block', height: `${CELL}em`, lineHeight: `${CELL}em` };
const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mod10 = (value: number) => ((value % 10) + 10) % 10;

const makeSpring = (overshoot: number) => {
  const log = Math.log(Math.min(0.5, Math.max(0.001, overshoot)));
  const zeta = -log / Math.sqrt(Math.PI * Math.PI + log * log);
  const damped = Math.PI / 0.52;
  const natural = damped / Math.sqrt(1 - zeta * zeta);
  const raw = (t: number) =>
    1 - Math.exp(-zeta * natural * t) * (Math.cos(damped * t) + ((zeta * natural) / damped) * Math.sin(damped * t));
  const residual = 1 - raw(1);
  return (t: number) => (t >= 1 ? 1 : raw(t) + residual * t * t * t);
};

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: t => t,
  easeOut: cubicBezier(0.33, 1, 0.68, 1),
  expo: t => (t >= 1 ? 1 : (1 - Math.pow(2, -10 * t)) / (1 - Math.pow(2, -10))),
  spring: makeSpring(0.06)
};

const getDecimalPlaces = (num: number): number => {
  const str = num.toString();

  if (str.includes('.')) {
    const decimals = str.split('.')[1];

    if (parseInt(decimals) !== 0) {
      return decimals.length;
    }
  }

  return 0;
};

const unitFor = (value: number): [number, string] =>
  UNITS.find(([size]) => Math.abs(value) >= size * 0.9995) || [1, ''];

const scaleFor = (value: number, compact: boolean, decimals: number | undefined, places: number) => {
  if (!compact) return { size: 1, label: '', digits: places };
  const [size, label] = unitFor(value);
  const digits = decimals ?? (label ? (Math.abs(value) / size < 100 ? 1 : 0) : places);
  return { size, label, digits };
};

const splitNumber = (value: number, digits: number, size: number) => {
  const fixed = (Math.abs(value) / size).toFixed(digits);
  const [int, frac = ''] = fixed.split('.');
  return { negative: value < 0 && Number(fixed) !== 0, int, frac };
};

const group = (int: string, separator: string) => (separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int);

const buildRoll = (
  a: number,
  b: number,
  spin: boolean,
  {
    compact,
    decimals,
    places,
    separator
  }: { compact: boolean; decimals: number | undefined; places: number; separator: string }
): Roll => {
  const { size, label, digits } = scaleFor(b, compact, decimals, places);
  const pa = splitNumber(a, digits, size);
  const pb = splitNumber(b, digits, size);
  const length = Math.max(pa.int.length, pb.int.length);
  const slots: Slot[] = [];
  const columns: Column[] = [];
  if (pa.negative || pb.negative) slots.push({ char: '-', enter: !pa.negative, leave: !pb.negative });
  const digitAt = (parts: { int: string; frac: string }, place: number) => {
    if (place < 0) return Number(parts.frac[-place - 1]);
    const index = parts.int.length - 1 - place;
    return index >= 0 ? Number(parts.int[index]) : null;
  };
  for (let place = length - 1; place >= -digits; place--) {
    if (place === -1) slots.push({ char: '.' });
    const start = digitAt(pa, place);
    const end = digitAt(pb, place);
    const column: Column = {
      slot: slots.length,
      index: columns.length,
      place,
      from: start ?? 0,
      to: end ?? 0,
      enter: start === null,
      leave: end === null,
      delta: 0
    };
    slots.push(column);
    columns.push(column);
    if (separator && place > 0 && place % 3 === 0) slots.push({ char: separator, follow: column.index });
  }
  const up = spin || b >= a;
  columns.forEach((column, index) => {
    const rank = columns.length - 1 - index;
    const base = up ? mod10(column.to - column.from) : -mod10(column.from - column.to);
    const turns = spin
      ? Math.max(1, 3 - rank)
      : Math.min(Math.floor(Math.abs(b - a) / (size * 10 ** (column.place + 1))), Math.max(0, 3 - rank));
    column.delta = base + (up ? 10 : -10) * turns;
  });
  return { slots, columns, label };
};

/**
 * Purpose-built upward ascending Roman numeral reel.
 * Crafts a cinematic, deliberate upward transit from starting numeral to target numeral,
 * featuring celestial vertical gradient masking, velocity-based motion blur, and a majestic
 * settling cushion with radiant liquid silver shimmer.
 */
export function RomanReel({
  to,
  from = 1,
  direction = 'up',
  delay = 0.3,
  duration = 3.4,
  className = '',
  style,
  startWhen = true,
  trigger = 'load',
  replayOnHover = true,
  prefix = '',
  suffix = '',
  onStart,
  onEnd
}: CountUpProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLSpanElement>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [isSettled, setIsSettled] = useState(() => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true
    );
  });
  const runningRef = useRef(false);

  const startNum = direction === 'down' ? to : from;
  const endNum = direction === 'down' ? from : to;
  const targetRoman = toRoman(endNum);

  const romanList = useMemo(() => {
    const list: string[] = [];
    if (startNum <= endNum) {
      for (let i = startNum; i <= endNum; i++) {
        list.push(toRoman(i));
      }
    } else {
      for (let i = startNum; i >= endNum; i--) {
        list.push(toRoman(i));
      }
    }
    return list;
  }, [startNum, endNum]);

  const targetIndex = Math.max(0, romanList.length - 1);
  const isInView = useSafeInView(containerRef, { once: true, margin: '0px' });
  const active = trigger === 'load' || typeof IntersectionObserver === 'undefined' || isInView;

  useEffect(() => {
    if (!active || !startWhen) return undefined;
    const strip = stripRef.current;
    if (!strip) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    if (prefersReducedMotion) {
      strip.style.transform = `translate3d(0, ${(-targetIndex * ROMAN_CELL).toFixed(3)}em, 0)`;
      strip.style.filter = 'none';
      onEnd?.();
      return undefined;
    }

    // oxlint-disable-next-line react/set-state-in-effect
    setIsSettled(false);
    runningRef.current = true;
    onStart?.();

    // Reset position to index 0 at start of play
    strip.style.transform = 'translate3d(0, 0, 0)';
    strip.style.filter = 'none';

    // Cinematic easing curve for Roman ascension:
    // Starts with smooth anticipation ramp (I -> II -> III),
    // accelerates into fluid upward ascension (IV -> XI) with velocity streak,
    // then enters a dramatic, regal deceleration (XII -> XIII -> XIV),
    // and smoothly glides to settle on XV with a tiny tactile cushion.
    const baseEase = cubicBezier(0.18, 0.88, 0.2, 1.0);
    const ease = (p: number) => {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      const b = baseEase(p);
      if (p > 0.85) {
        const settlePhase = (p - 0.85) / 0.15;
        const overshoot = Math.sin(settlePhase * Math.PI) * 0.008;
        return Math.min(1.01, b + overshoot);
      }
      return b;
    };

    const total = Math.max(0.1, duration);

    const progressObj = { t: 0 };
    const tween = gsap.to(progressObj, {
      t: total,
      duration: total,
      delay: replayKey === 0 ? delay : 0,
      ease: 'none',
      onUpdate: () => {
        const t = progressObj.t;
        const p = clamp01(t / total);
        const easedP = ease(p);
        const currentStep = targetIndex * easedP;
        const yOffset = -(currentStep * ROMAN_CELL);

        strip.style.transform = `translate3d(0, ${yOffset.toFixed(3)}em, 0)`;

        // Calculate velocity for directional streak blur
        const p0 = Math.max(0, p - 0.006);
        const p1 = Math.min(1, p + 0.006);
        const speed = (targetIndex * (baseEase(p1) - baseEase(p0))) / (p1 - p0) / total;
        const blurY = p > 0.04 && p < 0.92 ? Math.min(2.5, speed * 0.16) : 0;

        if (blurY > 0.25) {
          strip.style.filter = `blur(0px ${blurY.toFixed(2)}px)`;
        } else {
          strip.style.filter = 'none';
        }
      },
      onComplete: () => {
        strip.style.transform = `translate3d(0, ${(-targetIndex * ROMAN_CELL).toFixed(3)}em, 0)`;
        strip.style.filter = 'none';
        setIsSettled(true);
        runningRef.current = false;
        onEnd?.();
      },
    });

    return () => {
      tween.kill();
      runningRef.current = false;
    };
  }, [active, startWhen, replayKey, targetIndex, duration, delay, onStart, onEnd]);

  const replay = () => {
    if (!replayOnHover || runningRef.current) return;
    setReplayKey(k => k + 1);
  };

  return (
    <span
      ref={containerRef}
      className={`${styles.romanContainer} ${className}`}
      style={style}
      onPointerEnter={replayOnHover ? replay : undefined}
      title={replayOnHover ? 'Toca o pasa el cursor para revivir la animación' : undefined}
    >
      {/* Ghost/settled numeral: displays cleanly when settled with full text-shadow */}
      <span
        className={`${styles.ghost} ${isSettled ? `${styles.ghostVisible} ${styles.settledNumeral}` : ''}`}
        aria-hidden="true"
      >
        {prefix}{targetRoman}{suffix}
      </span>

      {/* Screen reader announcement */}
      <span style={SR_ONLY}>
        {prefix}{targetRoman}{suffix}
      </span>

      {/* Vertical celestial reel viewport - active during roll, cleanly hidden when settled */}
      <span
        ref={viewportRef}
        aria-hidden="true"
        className={`${styles.viewport} ${isSettled ? styles.viewportSettled : ''}`}
      >
        <span ref={stripRef} className={styles.strip}>
          {romanList.map((item, index) => {
            const isLast = index === targetIndex;
            return (
              <span
                key={index}
                className={styles.cell}
                style={isSettled && !isLast ? { visibility: 'hidden' } : undefined}
              >
                {prefix}{item}{suffix}
              </span>
            );
          })}
        </span>
      </span>
    </span>
  );
}

function StandardCountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  style,
  startWhen = true,
  separator = '',
  prefix = '',
  suffix = '',
  mode = 'count',
  easing = 'easeOut',
  decimals,
  format = 'standard',
  customFormatter,
  trigger = 'view',
  replayOnHover = false,
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const filterRefs = useRef<(SVGFEGaussianBlurElement | null)[]>([]);
  const uid = useId().replace(/[^\w-]/g, '');
  const startValue = direction === 'down' ? to : from;
  const endValue = direction === 'down' ? from : to;
  const valueRef = useRef(startValue);
  const startedRef = useRef(false);
  const runningRef = useRef(false);
  const [play, setPlay] = useState<Play | null>(null);
  const isInView = useSafeInView(ref, { once: true, margin: '0px' });
  const active = trigger === 'load' || typeof IntersectionObserver === 'undefined' || isInView;
  const compact = format === 'compact';
  const places = decimals ?? Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      if (customFormatter) {
        return `${prefix}${customFormatter(latest)}${suffix}`;
      }
      const { size, label, digits } = scaleFor(latest, compact, decimals, places);
      const parts = splitNumber(latest, digits, size);
      const body = `${parts.negative ? '-' : ''}${group(parts.int, separator)}${parts.frac ? `.${parts.frac}` : ''}`;
      return `${prefix}${body}${label}${suffix}`;
    },
    [customFormatter, compact, decimals, places, separator, prefix, suffix]
  );

  const model = useMemo(() => {
    if (mode !== 'roll') return null;
    const a = play ? play.from : startValue;
    const b = play ? play.to : endValue;
    return buildRoll(a, b, !!play?.spin, { compact, decimals, places, separator });
  }, [mode, play, startValue, endValue, compact, decimals, places, separator]);

  const [initialText] = useState(() => formatValue(startValue));
  const latestRef = useRef<Live | null>(null);

  useIsoLayoutEffect(() => {
    latestRef.current = {
      formatValue,
      onStart,
      onEnd,
      model,
      mode,
      easing,
      duration: Math.max(0, duration),
      delay
    };
  });

  useIsoLayoutEffect(() => {
    if (!startedRef.current) valueRef.current = startValue;
    if (mode === 'count' && !runningRef.current && textRef.current) {
      textRef.current.textContent = formatValue(valueRef.current);
    }
  }, [mode, startValue, formatValue]);

  useEffect(() => {
    if (!active || !startWhen) return;
    startedRef.current = true;
    // oxlint-disable-next-line react/set-state-in-effect
    setPlay(previous => ({
      id: (previous?.id || 0) + 1,
      from: valueRef.current,
      to: endValue,
      spin: false,
      wait: true
    }));
  }, [active, startWhen, endValue]);

  useEffect(() => {
    const live = latestRef.current;
    if (!play || !live) return undefined;
    const ease = EASINGS[live.easing] || EASINGS.easeOut;
    const total = live.duration;
    const progress = (t: number) => (total > 0 ? clamp01(t / total) : 1);
    let render: (t: number) => void;

    if (live.mode === 'roll' && live.model && ref.current) {
      const { columns: layout, slots } = live.model;
      const fontSize = parseFloat(getComputedStyle(ref.current).fontSize) || 16;
      const cell = CELL * fontSize;
      const stagger = layout.length > 1 ? Math.min(STAGGER, (total * 0.4) / (layout.length - 1)) : 0;
      const span = Math.max(0.001, total - stagger * (layout.length - 1));
      const columns = layout.map(column => {
        const box = slotRefs.current[column.slot];
        const strip = box?.firstChild as HTMLSpanElement | null;
        return {
          ...column,
          box,
          strip,
          blur: filterRefs.current[column.index],
          cells: strip ? Array.from(strip.childNodes, node => node.firstChild) : ([] as (ChildNode | null)[]),
          width: box ? box.scrollWidth : 0,
          ease:
            live.easing === 'spring'
              ? makeSpring(Math.min(0.12, Math.max(0.01, 0.35 / Math.max(1, Math.abs(column.delta)))))
              : ease,
          base: Math.floor(column.from),
          sigma: 0,
          presence: column.enter ? 0 : 1
        };
      });
      const marks = slots
        .map((slot, index) => ({ ...slot, node: slotRefs.current[index] }))
        .filter(
          (slot): slot is Mark & { node: HTMLSpanElement } =>
            'char' in slot && !!slot.node && (!!slot.enter || !!slot.leave || slot.follow !== undefined)
        )
        .map(slot => ({ ...slot, width: slot.node.scrollWidth }));

      const fade = (node: HTMLSpanElement | null | undefined, width: number, presence: number, settled: boolean) => {
        if (!node) return;
        node.style.width = settled ? '' : `${(presence * width).toFixed(2)}px`;
        node.style.opacity = settled ? '' : presence.toFixed(3);
      };

      render = (t: number) => {
        columns.forEach((column, index) => {
          if (!column.strip) return;
          const u = clamp01((t - index * stagger) / span);
          const pos = column.from + column.delta * column.ease(u);
          const base = Math.floor(pos);
          if (base !== column.base) {
            column.base = base;
            column.cells.forEach((node, offset) => {
              if (node) node.nodeValue = String(mod10(base + offset - 1));
            });
          }
          column.strip.style.transform = `translateY(${(-(1 + pos - base) * CELL).toFixed(4)}em)`;

          const u0 = Math.max(0, u - 0.004);
          const u1 = Math.min(1, u + 0.004);
          const speed =
            u1 > u0 ? (Math.abs(column.delta) * Math.abs(column.ease(u1) - column.ease(u0))) / (u1 - u0) / span : 0;
          const sigma = u > 0 && u < 1 ? Math.min(cell * 0.05, (speed * cell) / 600) : 0;
          if (Math.abs(sigma - column.sigma) > 0.05 || (sigma === 0 && column.sigma !== 0)) {
            column.sigma = sigma;
            if (sigma > 0.2 && column.blur) {
              column.blur.setAttribute('stdDeviation', `0 ${sigma.toFixed(2)}`);
              column.strip.style.filter = `url(#${uid}-${index})`;
            } else {
              column.strip.style.filter = '';
            }
          }

          if (column.enter || column.leave) {
            column.presence = column.enter ? smooth(0, 0.45, u) : 1 - smooth(0.55, 1, u);
            fade(column.box, column.width, column.presence, column.enter && u >= 1);
          }
        });

        const overall = progress(t);
        marks.forEach(mark => {
          if (mark.follow !== undefined) {
            const column = columns[mark.follow];
            if (column && (column.enter || column.leave))
              fade(mark.node, mark.width, column.presence, column.enter && column.presence >= 1);
          } else {
            const presence = mark.enter ? smooth(0, 0.3, overall) : 1 - smooth(0.7, 1, overall);
            fade(mark.node, mark.width, presence, !!mark.enter && overall >= 1);
          }
        });

        valueRef.current = play.from + (play.to - play.from) * ease(overall);
      };
    } else {
      render = (t: number) => {
        const value = play.from + (play.to - play.from) * ease(progress(t));
        valueRef.current = value;
        if (textRef.current) textRef.current.textContent = latestRef.current?.formatValue(value) ?? '';
      };
    }

    runningRef.current = true;
    if (typeof live.onStart === 'function') live.onStart();

    const finish = () => {
      render(Infinity);
      valueRef.current = play.to;
      runningRef.current = false;
      latestRef.current?.onEnd?.();
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return undefined;
    }

    const progressObj = { t: 0 };
    const tween = gsap.to(progressObj, {
      t: total,
      duration: total,
      delay: play.wait ? live.delay : 0,
      ease: 'none',
      onUpdate: () => render(progressObj.t),
      onComplete: finish,
    });

    return () => {
      tween.kill();
      runningRef.current = false;
    };
  }, [play, uid]);

  const replay = () => {
    if (!replayOnHover || runningRef.current || !startedRef.current) return;
    setPlay(previous =>
      mode === 'roll'
        ? { id: (previous?.id || 0) + 1, from: valueRef.current, to: valueRef.current, spin: true }
        : { id: (previous?.id || 0) + 1, from: startValue, to: endValue, spin: false }
    );
  };

  const finalText = formatValue(play ? play.to : endValue);

  return (
    <span
      className={className}
      ref={ref}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
      onPointerEnter={replayOnHover ? replay : undefined}
    >
      {model ? (
        <>
          <span
            key={`roll-${play?.id || 0}`}
            aria-hidden="true"
            style={{ display: 'inline-flex', whiteSpace: 'pre', userSelect: 'none' }}
          >
            {prefix && <span style={SLOT_STYLE}>{prefix}</span>}
            {model.slots.map((slot, index) => {
              const hidden =
                'char' in slot
                  ? slot.enter || (slot.follow !== undefined && model.columns[slot.follow].enter)
                  : slot.enter;
              const collapsed = hidden ? { width: 0, opacity: 0 } : null;
              if ('char' in slot) {
                return (
                  <span
                    key={index}
                    ref={node => {
                      slotRefs.current[index] = node;
                    }}
                    style={{ ...SLOT_STYLE, overflow: 'hidden', ...collapsed }}
                  >
                    {slot.char}
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  ref={node => {
                    slotRefs.current[index] = node;
                  }}
                  style={{ ...SLOT_STYLE, position: 'relative', overflow: 'hidden', ...collapsed }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      transform: `translateY(${-CELL}em)`
                    }}
                  >
                    {[-1, 0, 1, 2].map(offset => (
                      <span key={offset} style={{ height: `${CELL}em` }}>
                        {mod10(slot.from + offset)}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
            {model.label && <span style={SLOT_STYLE}>{model.label}</span>}
            {suffix && <span style={SLOT_STYLE}>{suffix}</span>}
          </span>
          <span style={SR_ONLY}>{finalText}</span>
          <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              {model.columns.map(column => (
                <filter
                  key={column.index}
                  id={`${uid}-${column.index}`}
                  x="-20%"
                  y="-50%"
                  width="140%"
                  height="200%"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur
                    ref={node => {
                      filterRefs.current[column.index] = node;
                    }}
                    stdDeviation="0 0"
                  />
                </filter>
              ))}
            </defs>
          </svg>
        </>
      ) : (
        <span key="count" ref={textRef}>
          {initialText}
        </span>
      )}
    </span>
  );
}

export default function CountUp(props: CountUpProps) {
  if (props.format === 'roman') {
    return <RomanReel {...props} />;
  }
  return <StandardCountUp {...props} />;
}
