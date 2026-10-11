/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import {
  Clock,
  Shirt,
  MapPin,
  Navigation,
  Phone,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  ChevronDown,
  Music,
  VolumeX,
  Heart,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';

// ============================================================================
// 1. TYPES & CONFIGURATION INTERFACES
// ============================================================================

export type BlessingIconType =
  | 'none'
  | 'hinduism'
  | 'buddhism'
  | 'islam'
  | 'christianity'
  | 'sikhism'
  | 'jainism';

export type EventsLayoutType = 'accordion' | 'timeline' | 'grid' | 'minimal';

export type TimezoneKey =
  | 'IST'
  | 'GST'
  | 'GMT'
  | 'ET'
  | 'CT'
  | 'PT'
  | 'SGT'
  | 'AEST';

export interface ContactPerson {
  name: string;
  phone: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venueAddress: string;
  dressCode: string;
  mapLink: string;
}

export interface InviteConfig {
  couple: {
    partner1Name: string;
    partner1Parents: string;
    partner2Name: string;
    partner2Parents: string;
    partner1Role: string;
    partner2Role: string;
    partner1Photo: string;
    partner1SecondaryPhoto: string;
    partner2Photo: string;
    partner2SecondaryPhoto: string;
    coverPhoto: string;
  };
  blessing: {
    headerIcon: BlessingIconType;
    invocationPreset: string;
    invocationText: string;
  };
  reveal: {
    topLine: string;
    innerLine: string;
    innerSubhead: string;
    innerFootnote: string;
    coverLabel: string;
    promptHeadline: string;
    sealPrompt: string;
  };
  wedding: {
    date: string;
    isoDate: string;
    venue: string;
    timezone: TimezoneKey;
    musicUrl: string;
  };
  story: {
    storyText: string;
    signatureQuote: string;
  };
  stay: {
    accommodation: string[];
    accommodationContacts: ContactPerson[];
    transportation: string[];
    transportationContacts: ContactPerson[];
  };
  labels: {
    heroSubtitle: string;
    heroInvitationLine: string;
    saveTheDateTag: string;
    storyTitle: string;
    storySubline: string;
    eventsKicker: string;
    eventsTitle: string;
    eventsSubtitle: string;
    venueTag: string;
    stayTitle: string;
    staySubtitle: string;
    galleryTitle: string;
    gallerySubtitle: string;
    countdownTitle: string;
    rsvpKicker: string;
    rsvpTitle: string;
    rsvpQuestion: string;
    rsvpSuccessTitle: string;
    rsvpSuccessMessage: string;
    songTitle: string;
    footerWelcome: string;
    footerBrand: string;
    scrollPrompt: string;
  };
  rsvp: {
    deadline: string;
    whatsappNumber: string;
  };
  eventsLayout: EventsLayoutType;
  events: WeddingEvent[];
  gallery: string[];
}

export interface RsvpSubmission {
  id: string;
  selectedEvents: string[];
  guestName: string;
  phone: string;
  guestCount: number;
  dietaryNote: string;
  songRequest: string;
  submittedAt: string;
}

// ============================================================================
// 2. PRESETS & DEFAULT INVITE CONFIGURATION
// ============================================================================

export const INVOCATION_PRESETS: string[] = [
  '|| Shree Ganeshaya Namah ||',
  '|| Om Namah Shivaya ||',
  '|| Shree Krishnaya Namah ||',
  'Har Har Mahadev',
  'Jai Shree Ram',
  'In the name of Allah, the Most Gracious',
  'With the blessings of the Lord',
  'Ik Onkar · Waheguru',
  '|| श्री गणेशाय नम: ||',
  '|| ॐ नमः शिवाय ||',
  '|| जय जिनेन्द्र ||',
  '|| नमो बुध्दाय ||',
];

export const TIMEZONE_OPTIONS: {
  key: TimezoneKey;
  label: string;
  offset: string;
}[] = [
  { key: 'IST', label: 'India (IST, UTC+5:30)', offset: '+05:30' },
  { key: 'GST', label: 'UAE (GST, UTC+4:00)', offset: '+04:00' },
  { key: 'GMT', label: 'UK (GMT/BST, UTC+0:00)', offset: '+00:00' },
  { key: 'ET', label: 'US Eastern (ET, UTC-5:00)', offset: '-05:00' },
  { key: 'CT', label: 'US Central (CT, UTC-6:00)', offset: '-06:00' },
  { key: 'PT', label: 'US Pacific (PT, UTC-8:00)', offset: '-08:00' },
  { key: 'SGT', label: 'Singapore (SGT, UTC+8:00)', offset: '+08:00' },
  { key: 'AEST', label: 'Australia (AEST, UTC+10:00)', offset: '+10:00' },
];

export const INVITE: InviteConfig = {
  couple: {
    partner1Name: 'Hemant',
    partner1Parents: 'S/o Mr. Naresh & Mrs. Poonam Aggarwal',
    partner2Name: 'Kritika',
    partner2Parents: 'D/o Mr. Mukesh & Mrs. Sonam Aggarwal',
    partner1Role: 'The Groom',
    partner2Role: 'The Bride',
    partner1Photo:
      'https://res.cloudinary.com/dqjlffxja/image/upload/v1791705044/Groom_in_Warm_Golden_Bokeh_wb3clb.png',
    partner1SecondaryPhoto: '',
    partner2Photo:
      'https://res.cloudinary.com/dqjlffxja/image/upload/v1791705034/Serene_Festive_Saree_Portrait_scyebv.png',
    partner2SecondaryPhoto: '',
    coverPhoto: '',
  },
  blessing: {
    headerIcon: 'hinduism',
    invocationPreset: '|| Shree Ganeshaya Namah ||',
    invocationText: '|| Shree Ganeshaya Namah ||',
  },
  reveal: {
    topLine: 'H & K',
    innerLine: 'H & K',
    innerSubhead: 'WEDDING INVITATION',
    innerFootnote: 'November 26, 2026 · New Delhi',
    coverLabel: 'WEDDING INVITATION',
    promptHeadline: 'WITH LOVE, WE INVITE YOU',
    sealPrompt: 'TAP THE SEAL TO OPEN',
  },
  wedding: {
    date: 'November 26, 2026',
    isoDate: '2026-11-26T15:00:00',
    venue:
      'Shri Dharmik Ram Leela Mandal Inside Shri Kaleshwar Nath Shiv Mandir Mayur Vihar, Patparganj New Delhi – 110091',
    timezone: 'IST',
    musicUrl: 'SYNTH_CHIME',
  },
  story: {
    signatureQuote:
      'Destiny brought them together. Families blessed their union. Love will make it everlasting.',
    storyText:
      'What began with a warm introduction between two families soon blossomed into effortless conversations over endless cups of chai, shared laughter, and a quiet certainty that we had found home in each other. Through the blessings of our parents and elders, our two paths now merge into one shared journey. As autumn turns into winter in New Delhi, we invite you to stand beside us, shower us with your blessings, and celebrate the beginning of our forever.',
  },
  stay: {
    accommodation: [],
    accommodationContacts: [
      { name: 'Mr. Naresh Kumar Aggarwal (Father of the Groom)', phone: '+919810954538' },
      { name: 'Gourav Aggarwal (Brother of the Groom)', phone: '+919205816849' },
    ],
    transportation: [],
    transportationContacts: [],
  },
  labels: {
    heroSubtitle: 'TOGETHER WITH THEIR FAMILIES',
    heroInvitationLine: 'Request the honour of your presence',
    saveTheDateTag: 'RESERVE FOR US',
    storyTitle: 'OUR STORY',
    storySubline: '— THE BEGINNING OF FOREVER',
    eventsKicker: 'PROGRAMME',
    eventsTitle: 'The Celebrations',
    eventsSubtitle: 'A joyous gathering of rituals, music & sacred vows',
    venueTag: 'MARRIAGE VENUE',
    stayTitle: 'Your Wedding Hosts',
    staySubtitle:
      "Need assistance with directions or the venue? We're just a phone call away.",
    galleryTitle: 'Captured Moments',
    gallerySubtitle: 'Glimpses of our journey towards forever',
    countdownTitle: 'COUNTING DOWN TO FOREVER',
    rsvpKicker: 'RSVP',
    rsvpTitle: 'Will You Be Joining Us?',
    rsvpQuestion: 'Which celebrations will you attend?',
    rsvpSuccessTitle: 'With Gratitude & Joy',
    rsvpSuccessMessage:
      'Your response has been recorded. We are truly honoured to celebrate these sacred moments with you.',
    songTitle: 'What song will get you on the dance floor?',
    footerWelcome: "We can't wait to celebrate with you",
    footerBrand: 'MADE WITH LOVE',
    scrollPrompt: 'SCROLL TO EXPLORE',
  },
  rsvp: {
    deadline: 'October 1st, 2026',
    whatsappNumber: '919811000001',
  },
  eventsLayout: 'timeline',
  events: [
    {
      id: 'evt-1',
      name: 'Ghudchadi',
      date: 'NOVEMBER 26, 2026',
      time: '3:00 PM onwards',
      venueAddress:
        'H. No. 29, Block-D Urvashi Enclave Near Vardhan Multispeciality Hospital Ghaziabad, Uttar Pradesh – 201018',
      dressCode: 'Traditional',
      mapLink:
        'https://maps.google.com/maps?q=28.7069186%2C77.444319&z=17&hl=en',
    },
    {
      id: 'evt-2',
      name: 'Departure of Barat',
      date: 'NOVEMBER 26, 2026',
      time: '06:00 PM onwards',
      venueAddress:
        'H. No. 29, Block-D Urvashi Enclave Near Vardhan Multispeciality Hospital Ghaziabad, Uttar Pradesh – 201018',
      dressCode: 'Traditional',
      mapLink:
        'https://maps.google.com/maps?q=28.7069186%2C77.444319&z=17&hl=en',
    },
  ],
  gallery: [],
};

// ============================================================================
// 3. ORNAMENTAL & SACRED INLINE SVG ARTWORK
// ============================================================================

const BlessingSvg: React.FC<{ type: BlessingIconType }> = ({ type }) => {
  if (type === 'none') return null;

  switch (type) {
    case 'hinduism':
      // Delicate continuous-line Lord Ganesha motif matching the reference screenshot
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-9 h-9 text-[#B58B66] mx-auto mb-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Ganesha emblem"
        >
          {/* Crown / Mukut */}
          <path d="M26 16 L32 7 L38 16" />
          <path d="M28 13 L32 10 L36 13" />
          <circle cx="32" cy="5" r="1" fill="currentColor" />
          {/* Tilak lines */}
          <path d="M28 20 Q32 19 36 20" />
          <path d="M29 22.5 Q32 21.5 35 22.5" />
          <circle cx="32" cy="25" r="1" fill="currentColor" />
          {/* Left & Right Ears */}
          <path d="M26 18 C17 16, 15 27, 23 31 C25 32, 26 30, 27 28" />
          <path d="M38 18 C47 16, 49 27, 41 31 C39 32, 38 30, 37 28" />
          {/* Curved Trunk */}
          <path d="M29 26 C28 34, 29 42, 35 42 C39 42, 40 38, 37 36 C35.5 35, 34 36.5, 35 38" />
          {/* Tusk & Lower Curve */}
          <path d="M27 33 L24 35" />
          <path d="M22 44 C26 50, 38 50, 42 44" />
          {/* Sacred Lotus Base */}
          <path d="M18 52 Q32 56 46 52" />
          <path d="M25 55 Q32 57 39 55" />
        </svg>
      );

    case 'sikhism':
      // Ik Onkar / Khanda line emblem
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-9 h-9 text-[#B58B66] mx-auto mb-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Sikh emblem"
        >
          <line x1="32" y1="8" x2="32" y2="54" />
          <path d="M29 14 L32 8 L35 14" />
          <circle cx="32" cy="30" r="10" />
          <path d="M20 16 C12 24, 12 38, 22 48" />
          <path d="M44 16 C52 24, 52 38, 42 48" />
          <circle cx="32" cy="55" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'islam':
      // Crescent Moon & Star with botanical arch
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-9 h-9 text-[#B58B66] mx-auto mb-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Crescent emblem"
        >
          <path d="M38 16 A16 16 0 1 0 48 42 A13 13 0 1 1 38 16 Z" />
          <path d="M42 22 L43.5 26 L47.5 27.5 L43.5 29 L42 33 L40.5 29 L36.5 27.5 L40.5 26 Z" />
        </svg>
      );

    case 'christianity':
      // Fine-line ornate cross with olive leaves
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-9 h-9 text-[#B58B66] mx-auto mb-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Cross emblem"
        >
          <line x1="32" y1="10" x2="32" y2="52" />
          <line x1="18" y1="24" x2="46" y2="24" />
          <circle cx="32" cy="24" r="3" />
          <path d="M24 46 C27 42, 30 44, 32 48 C34 44, 37 42, 40 46" />
        </svg>
      );

    case 'buddhism':
      // Sacred Eight-Spoke Dharma Wheel / Lotus
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-9 h-9 text-[#B58B66] mx-auto mb-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Dharma Wheel emblem"
        >
          <circle cx="32" cy="32" r="16" />
          <circle cx="32" cy="32" r="4" />
          <line x1="32" y1="12" x2="32" y2="52" />
          <line x1="12" y1="32" x2="52" y2="32" />
          <line x1="18" y1="18" x2="46" y2="46" />
          <line x1="46" y1="18" x2="18" y2="46" />
        </svg>
      );

    case 'jainism':
      // Sacred Lotus & Ahimsa arch
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-9 h-9 text-[#B58B66] mx-auto mb-2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Jain Lotus emblem"
        >
          <path d="M32 14 C27 24, 25 34, 32 42 C39 34, 37 24, 32 14 Z" />
          <path d="M32 42 C22 38, 16 28, 22 20 C26 24, 28 32, 32 42 Z" />
          <path d="M32 42 C42 38, 48 28, 42 20 C38 24, 36 32, 32 42 Z" />
          <path d="M18 46 Q32 52 46 46" />
          <circle cx="32" cy="10" r="1.2" fill="currentColor" />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * Ornamental Divider: dot — curved flourish / line — diamond — line — dot
 */
const OrnamentalDivider: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => (
  <div
    className={`flex items-center justify-center select-none ${
      compact ? 'my-3' : 'my-5'
    } ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 180 14"
      className={compact ? 'w-32 h-3 text-[#B58B66]' : 'w-40 h-3.5 text-[#B58B66]'}
      fill="none"
    >
      <circle cx="14" cy="7" r="1.4" fill="currentColor" opacity="0.65" />
      <path
        d="M24 7 L78 7"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.45"
      />
      <path
        d="M65 7 Q72 4 79 7"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.55"
      />
      <polygon
        points="90,3.2 93.8,7 90,10.8 86.2,7"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M101 7 Q108 10 115 7"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.55"
      />
      <path
        d="M102 7 L156 7"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.45"
      />
      <circle cx="166" cy="7" r="1.4" fill="currentColor" opacity="0.65" />
    </svg>
  </div>
);

/**
 * Corner Flourish for double-bordered cards
 */
const CornerFlourish: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
}> = ({ position }) => {
  const rotationMap = {
    tl: 'rotate-0 top-2 left-2',
    tr: 'rotate-90 top-2 right-2',
    br: 'rotate-180 bottom-2 right-2',
    bl: '-rotate-90 bottom-2 left-2',
  };

  return (
    <svg
      viewBox="0 0 28 28"
      className={`w-5 h-5 absolute pointer-events-none text-[#B58B66]/65 ${rotationMap[position]}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 22 L2 6 C2 3.8 3.8 2 6 2 L22 2"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <path
        d="M6 14 C6 9.5 9.5 6 14 6"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <circle cx="6" cy="6" r="1.1" fill="currentColor" />
    </svg>
  );
};

// ============================================================================
// 4. CONFETTI & SPARKLE CANVAS PARTICLE SYSTEM (60FPS)
// ============================================================================

interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  width: number;
  height: number;
  color: string;
  shape: 'rect' | 'oval' | 'diamond' | 'sparkle';
  rotation: number;
  vRot: number;
  opacity: number;
  fadeRate: number;
  gravity: number;
  drift: number;
  wobble: number;
  wobbleSpeed: number;
}

const CONFETTI_PALETTE = ['#B58B66', '#D9BFA0', '#F3E7D6', '#FFFFFF', '#C69F79'];

const ConfettiCanvas: React.FC<{
  burstTrigger: number;
  mode?: 'envelope' | 'rsvp';
}> = ({ burstTrigger, mode = 'envelope' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!burstTrigger || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const originX = window.innerWidth / 2;
    const originY =
      mode === 'envelope'
        ? Math.min(window.innerHeight * 0.45, 420)
        : window.innerHeight * 0.55;

    const count = mode === 'envelope' ? 130 : 75;
    const shapes: CanvasParticle['shape'][] = [
      'rect',
      'oval',
      'diamond',
      'sparkle',
    ];

    const particles: CanvasParticle[] = Array.from({ length: count }, (_, i) => {
      const angle =
        -Math.PI / 2 + (Math.random() - 0.5) * (mode === 'envelope' ? 2.1 : 1.8);
      const speed =
        mode === 'envelope'
          ? 4 + Math.random() * 11
          : 3.5 + Math.random() * 8;
      const shape =
        i % 7 === 0
          ? 'sparkle'
          : shapes[Math.floor(Math.random() * shapes.length)];
      const size = 4 + Math.random() * 6.5;

      return {
        x: originX + (Math.random() - 0.5) * 90,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        size,
        width: size * (0.7 + Math.random() * 0.8),
        height: size * (0.45 + Math.random() * 0.5),
        color:
          CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)],
        shape,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.14,
        opacity: 0.9 + Math.random() * 0.1,
        fadeRate: 0.0045 + Math.random() * 0.004,
        gravity: 0.14 + Math.random() * 0.08,
        drift: (Math.random() - 0.5) * 0.04,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.06,
      };
    });

    let rafId = 0;

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;

      for (const p of particles) {
        if (p.opacity <= 0.01) continue;
        alive++;

        p.x += p.vx + Math.sin(p.wobble) * 0.6;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.992;
        p.vx += p.drift;
        p.rotation += p.vRot;
        p.wobble += p.wobbleSpeed;
        p.opacity -= p.fadeRate;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else if (p.shape === 'oval') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.width / 2, p.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.7);
          ctx.lineTo(p.size * 0.5, 0);
          ctx.lineTo(0, p.size * 0.7);
          ctx.lineTo(-p.size * 0.5, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // 4-point sparkle
          const s = p.size * 0.85;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (alive > 0) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [burstTrigger, mode, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      aria-hidden="true"
    />
  );
};

// ============================================================================
// 5. TIMEZONE & ICS CALENDAR HELPERS
// ============================================================================

function getTargetTimestamp(isoDate: string, tzKey: TimezoneKey): number {
  const tz =
    TIMEZONE_OPTIONS.find((t) => t.key === tzKey) || TIMEZONE_OPTIONS[0];
  const cleanIso = isoDate.includes('T') ? isoDate : `${isoDate}T15:00:00`;
  const parsed = Date.parse(`${cleanIso}${tz.offset}`);
  if (Number.isNaN(parsed)) {
    return Date.parse(`2026-11-26T15:00:00+05:30`);
  }
  return parsed;
}

// ============================================================================
// 6. ELEGANT INITIAL PLACEHOLDER & COUPLE ARCH PORTRAIT
// ============================================================================

const CoupleArchCard: React.FC<{
  name: string;
  role: string;
  primaryPhoto: string;
  secondaryPhoto: string;
  initial: string;
  variant: 'groom' | 'bride';
  onUploadPrimary: (b64: string) => void;
  onUploadSecondary: (b64: string) => void;
}> = ({
  name,
  role,
  primaryPhoto,
  secondaryPhoto,
  initial,
  variant,
  onUploadPrimary,
  onUploadSecondary,
}) => {
  const primaryInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    cb: (b64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') cb(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center group">
      {/* Arch Frame Container */}
      <div className="relative pt-2 pb-7 px-2">
        {/* Outer Subtle Arch Halo */}
        <div
          className="w-36 h-44 sm:w-40 sm:h-48 rounded-t-full p-1.5 border border-[#E6D9C8] bg-[#FCFAF6] relative shadow-[0_16px_40px_rgba(74,47,34,0.10)]"
          style={{
            borderTopLeftRadius: '9999px',
            borderTopRightRadius: '9999px',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
          }}
        >
          {/* Small Triangle Pin on top center of the arch */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 text-[#B58B66]"
            aria-hidden="true"
          >
            <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor">
              <polygon points="0,0 10,0 5,6.5" />
            </svg>
          </div>

          {/* Inner Arch Image Slot with Slow Ken Burns */}
          <button
            type="button"
            onClick={() => primaryInputRef.current?.click()}
            title={`Click to upload ${name}'s portrait`}
            aria-label={`Upload portrait photo for ${name}`}
            className="w-full h-full overflow-hidden relative block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B58B66]"
            style={{
              borderTopLeftRadius: '9999px',
              borderTopRightRadius: '9999px',
              borderBottomLeftRadius: '3px',
              borderBottomRightRadius: '3px',
            }}
          >
            {primaryPhoto ? (
              <img
                src={primaryPhoto}
                alt={name}
                className="w-full h-full object-cover object-top ken-burns-slow"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center relative ken-burns-slow"
                style={{
                  background:
                    variant === 'groom'
                      ? 'radial-gradient(circle at 50% 35%, #EFE5D5 0%, #DFCCB4 65%, #CEB597 100%)'
                      : 'radial-gradient(circle at 50% 35%, #F3E6DC 0%, #E4CBB8 65%, #D3B299 100%)',
                }}
              >
                {/* Subtle botanical silhouette & initial */}
                <svg
                  viewBox="0 0 100 120"
                  className="w-full h-full absolute inset-0 text-[#4A2F22]/10"
                  fill="none"
                >
                  <circle
                    cx="50"
                    cy="48"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="0.7"
                  />
                  <path
                    d="M20 115 C20 86, 80 86, 80 115"
                    stroke="currentColor"
                    strokeWidth="0.8"
                  />
                </svg>
                <span className="font-script text-5xl text-[#4A2F22]/80 select-none relative z-10">
                  {initial}
                </span>
                <span className="font-label text-[8px] tracking-[0.25em] uppercase text-[#8A6F5A] mt-1 relative z-10 opacity-80 group-hover:opacity-100">
                  Tap to add photo
                </span>
              </div>
            )}
          </button>
          <input
            ref={primaryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e, onUploadPrimary)}
          />
        </div>
      </div>

      {/* Name & Role */}
      <h3 className="font-serif text-lg sm:text-xl text-[#4A2F22] tracking-wide mt-0.5">
        {name}
      </h3>
      <p className="font-label text-[9px] tracking-[0.3em] uppercase text-[#8A6F5A] mt-1">
        {role}
      </p>
    </div>
  );
};

// ============================================================================
// 7. COUNTDOWN CIRCULAR TILE WITH SLIDE/FLIP DIGIT ANIMATION
// ============================================================================

const CountdownCircle: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => {
  const formatted = String(Math.max(0, value)).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-[#D8C6B0] flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_6px_rgba(255,255,255,0.6),0_6px_18px_rgba(74,47,34,0.06)]"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #FAF5EC 0%, #EFE4D2 70%, #E5D5BE 100%)',
        }}
      >
        <div className="absolute inset-[3px] rounded-full border border-[#B58B66]/20 pointer-events-none" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-xl sm:text-2xl text-[#4A2F22] tabular-nums"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-label text-[8.5px] tracking-[0.28em] uppercase text-[#8A6F5A] mt-2.5">
        {label}
      </span>
    </div>
  );
};

// ============================================================================
// 8. SCREEN 1: FULL-SCREEN INTERACTIVE ENVELOPE REVEAL
// ============================================================================

const EnvelopeIntro: React.FC<{
  invite: InviteConfig;
  onComplete: () => void;
  onTriggerConfetti: () => void;
}> = ({ invite, onComplete, onTriggerConfetti }) => {
  const [stage, setStage] = useState<
    'idle' | 'sealPress' | 'flapOpen' | 'cardRise' | 'exit'
  >('idle');
  const prefersReducedMotion = useReducedMotion();

  const sealParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const dist = 36 + (i % 3) * 14;
        return {
          id: i,
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist,
          size: i % 2 === 0 ? 5 : 3.5,
        };
      }),
    []
  );

  const handleOpenEnvelope = useCallback(() => {
    if (stage !== 'idle') return;

    if (prefersReducedMotion) {
      onTriggerConfetti();
      onComplete();
      return;
    }

    // Step 1: Seal presses in (0 -> 450ms)
    setStage('sealPress');

    // Step 2: Flap rotates open in 3D (450ms -> 1350ms)
    const t1 = window.setTimeout(() => {
      setStage('flapOpen');
    }, 450);

    // Step 3 & 4: Inside card slides UP + Confetti & Sparkle burst (1150ms -> 2700ms)
    const t2 = window.setTimeout(() => {
      setStage('cardRise');
      onTriggerConfetti();
    }, 1150);

    // Step 5: Scale up & fade out to reveal full invitation (2850ms -> 3500ms)
    const t3 = window.setTimeout(() => {
      setStage('exit');
    }, 2850);

    const t4 = window.setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [stage, prefersReducedMotion, onComplete, onTriggerConfetti]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenEnvelope();
    }
  };

  // Parse monogram parts e.g. "H & K"
  const monogramParts = useMemo(() => {
    const raw = invite.reveal.topLine.trim();
    if (raw.includes('&')) {
      const [left, right] = raw.split('&').map((s) => s.trim());
      return { left: left || 'H', right: right || 'K', hasAmp: true };
    }
    return { left: raw, right: '', hasAmp: false };
  }, [invite.reveal.topLine]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 select-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={
        stage === 'exit'
          ? { opacity: 0, scale: 1.07 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Twinkling CSS Sparkle Stars around envelope when card rises */}
      <AnimatePresence>
        {(stage === 'cardRise' || stage === 'exit') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            {[
              { x: -175, y: -135, delay: 0.05, scale: 1 },
              { x: 185, y: -120, delay: 0.15, scale: 0.85 },
              { x: -210, y: -25, delay: 0.25, scale: 0.75 },
              { x: 205, y: -15, delay: 0.1, scale: 1.1 },
              { x: -130, y: -175, delay: 0.2, scale: 0.9 },
              { x: 135, y: -170, delay: 0.08, scale: 0.8 },
            ].map((sp, idx) => (
              <motion.svg
                key={idx}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#B58B66"
                className="absolute"
                style={{
                  transform: `translate(${sp.x}px, ${sp.y}px) scale(${sp.scale})`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.3, 1, 0],
                  scale: [0.3, 1.2, 0.8, 1.1, 0],
                  rotate: [0, 45, 90],
                }}
                transition={{
                  duration: 1.8,
                  delay: sp.delay,
                  ease: 'easeOut',
                }}
              >
                <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" />
              </motion.svg>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Envelope Wrapper */}
      <motion.div
        animate={
          stage === 'idle' && !prefersReducedMotion
            ? { y: [0, -6, 0] }
            : { y: 0 }
        }
        transition={
          stage === 'idle'
            ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.4 }
        }
        className="relative flex flex-col items-center"
      >
        {/* ENVELOPE 3D STAGE */}
        <div
          className="relative w-[328px] h-[226px] sm:w-[410px] sm:h-[282px]"
          style={{ perspective: '1200px' }}
        >
          {/* Soft realistic ambient shadow directly beneath the envelope */}
          <div
            className="absolute -bottom-7 left-6 right-6 h-12 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(74,47,34,0.22) 0%, rgba(74,47,34,0.08) 55%, rgba(74,47,34,0) 80%)',
              filter: 'blur(10px)',
            }}
          />

          {/* 1. ENVELOPE BACK INTERIOR (Darker warm sand inside pocket) */}
          <div
            className="absolute inset-0 rounded-[3px] border border-[#D8C7B2]"
            style={{
              background:
                'linear-gradient(180deg, #D5C3AC 0%, #C8B398 55%, #BDA589 100%)',
              boxShadow: '0 22px 50px rgba(74, 47, 34, 0.16)',
            }}
          />

          {/* 2. INSIDE MINI INVITATION CARD (Slides UP out of envelope) */}
          <motion.div
            initial={{ y: 8, opacity: 0.96, scale: 0.96 }}
            animate={
              stage === 'cardRise' || stage === 'exit'
                ? { y: -86, opacity: 1, scale: 1 }
                : stage === 'flapOpen'
                ? { y: -12, opacity: 1, scale: 0.98 }
                : { y: 12, opacity: 0.92, scale: 0.96 }
            }
            transition={{
              duration: 1.15,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="absolute left-[7%] right-[7%] top-[8%] h-[82%] z-20 rounded-[2px] bg-[#FAF6EE] p-2.5 sm:p-3.5 shadow-[0_10px_28px_rgba(74,47,34,0.14)] flex flex-col items-center justify-center text-center"
          >
            {/* Thin Double Border on Mini Card */}
            <div className="w-full h-full border border-[#D9C7B2] p-1 flex flex-col items-center justify-center relative">
              <div className="w-full h-full border border-[#E6D9C8] flex flex-col items-center justify-center px-3 py-2">
                <p className="font-serif italic text-2xl sm:text-3xl text-[#8A684C] tracking-wider">
                  {monogramParts.hasAmp ? (
                    <>
                      <span>{monogramParts.left}</span>
                      <span className="text-base sm:text-lg mx-1.5 text-[#B58B66]">
                        &amp;
                      </span>
                      <span>{monogramParts.right}</span>
                    </>
                  ) : (
                    invite.reveal.innerLine
                  )}
                </p>
                <p className="font-label text-[8.5px] sm:text-[9.5px] tracking-[0.34em] uppercase text-[#7A614D] mt-2">
                  {invite.reveal.coverLabel || invite.reveal.innerSubhead}
                </p>
                {invite.reveal.innerFootnote && (
                  <p className="font-serif italic text-[10px] text-[#8A6F5A]/80 mt-1.5">
                    {invite.reveal.innerFootnote}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* 3. ENVELOPE FRONT POCKET (Left, Right & Bottom Fold Flaps) */}
          <svg
            viewBox="0 0 410 282"
            className="absolute inset-0 w-full h-full z-25 pointer-events-none rounded-[3px] overflow-hidden"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="leftFoldGrad" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#EAE0D0" />
                <stop offset="100%" stopColor="#DDD0BC" />
              </linearGradient>
              <linearGradient id="rightFoldGrad" x1="100%" y1="0%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#E6DBC9" />
                <stop offset="100%" stopColor="#D9CBB6" />
              </linearGradient>
              <linearGradient id="bottomFoldGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ECE3D5" />
                <stop offset="100%" stopColor="#DFD2BE" />
              </linearGradient>
              <filter id="foldShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow
                  dx="0"
                  dy="-2"
                  stdDeviation="3"
                  floodColor="#4A2F22"
                  floodOpacity="0.08"
                />
              </filter>
            </defs>

            {/* Left Side Fold */}
            <polygon
              points="0,0 205,148 0,282"
              fill="url(#leftFoldGrad)"
              stroke="#E6D9C8"
              strokeWidth="0.7"
            />
            {/* Right Side Fold */}
            <polygon
              points="410,0 205,148 410,282"
              fill="url(#rightFoldGrad)"
              stroke="#E6D9C8"
              strokeWidth="0.7"
            />
            {/* Bottom Pocket Fold */}
            <polygon
              points="0,282 205,134 410,282"
              fill="url(#bottomFoldGrad)"
              stroke="#EDE4D7"
              strokeWidth="0.9"
              filter="url(#foldShadow)"
            />
          </svg>

          {/* 4. TOP TRIANGULAR FLAP (3D RotateX 0 -> 180deg) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={
              stage === 'flapOpen' || stage === 'cardRise' || stage === 'exit'
                ? { rotateX: 180 }
                : { rotateX: 0 }
            }
            transition={{
              duration: 0.9,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              zIndex:
                stage === 'cardRise' || stage === 'exit' ? 10 : 30,
            }}
            className="absolute inset-x-0 top-0 h-[58%] pointer-events-none"
          >
            <svg
              viewBox="0 0 410 165"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="topFlapFront" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#EFE7DA" />
                  <stop offset="65%" stopColor="#E4D7C5" />
                  <stop offset="100%" stopColor="#DACAB4" />
                </linearGradient>
                <filter id="flapDropShadow" x="-15%" y="-10%" width="130%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="6"
                    stdDeviation="6"
                    floodColor="#4A2F22"
                    floodOpacity="0.14"
                  />
                </filter>
              </defs>
              <polygon
                points="0,0 410,0 205,160"
                fill="url(#topFlapFront)"
                stroke="#EFE6D8"
                strokeWidth="1"
                filter="url(#flapDropShadow)"
              />
            </svg>
          </motion.div>

          {/* 5. GLOSSY ROUND WAX SEAL BUTTON IN CENTER OF FLAP */}
          <AnimatePresence>
            {(stage === 'idle' || stage === 'sealPress') && (
              <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-40">
                {/* Faint Ripple Ring */}
                <motion.div
                  animate={
                    !prefersReducedMotion
                      ? {
                          scale: [1, 1.24, 1.32],
                          opacity: [0.42, 0.15, 0],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute -inset-3 rounded-full border border-[#B58B66]/45 pointer-events-none"
                />

                {/* Outer Dotted Ring */}
                <div className="absolute -inset-2 rounded-full border border-dashed border-[#B58B66]/45 pointer-events-none" />
                <div className="absolute -inset-1 rounded-full border border-[#B58B66]/30 pointer-events-none" />

                {/* 12 Crack Burst Particles when Seal is tapped */}
                {stage === 'sealPress' &&
                  sealParticles.map((p) => (
                    <motion.span
                      key={p.id}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: p.tx,
                        y: p.ty,
                        opacity: 0,
                        scale: 0.2,
                      }}
                      transition={{ duration: 0.44, ease: 'easeOut' }}
                      style={{ width: p.size, height: p.size }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B58B66] pointer-events-none"
                    />
                  ))}

                {/* Interactive Seal Button */}
                <motion.button
                  type="button"
                  onClick={handleOpenEnvelope}
                  onKeyDown={handleKeyDown}
                  aria-label={`${invite.reveal.sealPrompt} — ${invite.couple.partner1Name} and ${invite.couple.partner2Name} Wedding Invitation`}
                  animate={
                    stage === 'sealPress'
                      ? { scale: 0.9, opacity: 0 }
                      : !prefersReducedMotion
                      ? { scale: [1, 1.03, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    stage === 'sealPress'
                      ? { duration: 0.42, ease: 'easeInOut' }
                      : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                  }
                  className="relative w-22 h-22 sm:w-25 sm:h-25 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A2F22] focus-visible:ring-offset-4 overflow-hidden group"
                  style={{
                    background:
                      'radial-gradient(circle at 32% 28%, #E6D2BC 0%, #CCAFA0 42%, #B89678 78%, #9B7A5C 100%)',
                    boxShadow:
                      '0 10px 24px rgba(74, 47, 34, 0.28), inset 0 2px 5px rgba(255, 255, 255, 0.65), inset 0 -4px 8px rgba(74, 47, 34, 0.28)',
                  }}
                >
                  {/* Inner Metallic Rim */}
                  <span
                    className="absolute inset-1.5 rounded-full border border-[#FAF3EA]/65 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 2px 6px rgba(74,47,34,0.18)',
                    }}
                  />

                  {/* Light Shine Sweep Across the Seal */}
                  <span
                    className="absolute inset-0 pointer-events-none seal-shine-sweep"
                    aria-hidden="true"
                  />

                  {/* Monogram Text Inside Seal */}
                  <span className="font-serif italic text-xl sm:text-2xl text-[#3E2519] tracking-wider flex items-baseline justify-center relative z-10 select-none">
                    {monogramParts.hasAmp ? (
                      <>
                        <span>{monogramParts.left}</span>
                        <span className="text-xs sm:text-sm mx-1 text-[#8D6546] not-italic font-serif">
                          &amp;
                        </span>
                        <span>{monogramParts.right}</span>
                      </>
                    ) : (
                      invite.reveal.topLine
                    )}
                  </span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* TEXT BELOW ENVELOPE */}
        <motion.div
          animate={
            stage === 'idle'
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.4 }}
          className="mt-14 sm:mt-16 text-center flex flex-col items-center"
        >
          <p className="font-label text-[10px] sm:text-[11px] font-semibold tracking-[0.34em] uppercase text-[#4A2F22]">
            {invite.reveal.promptHeadline}
          </p>

          {/* Diamond Divider */}
          <div
            className="flex items-center justify-center gap-2.5 my-3"
            aria-hidden="true"
          >
            <span className="w-9 h-[1px] bg-[#B58B66]/45" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B58B66]" />
            <span className="w-9 h-[1px] bg-[#B58B66]/45" />
          </div>

          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="font-label text-[9.5px] tracking-[0.3em] uppercase text-[#8A6F5A] hover:text-[#4A2F22] transition-colors cursor-pointer py-1 px-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B58B66]"
          >
            {invite.reveal.sealPrompt}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// 9. ADMIN CONFIGURATION DRAWER ("Edit Invite" Live Customizer)
// ============================================================================

const AdminConfigDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  invite: InviteConfig;
  setInvite: React.Dispatch<React.SetStateAction<InviteConfig>>;
  onReplayIntro: () => void;
  rsvpList: RsvpSubmission[];
}> = ({ isOpen, onClose, invite, setInvite, onReplayIntro, rsvpList }) => {
  const [activeTab, setActiveTab] = useState<
    'couple' | 'blessing' | 'events' | 'story' | 'stay' | 'gallery' | 'labels'
  >('couple');

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addEvent = () => {
    const newEvent: WeddingEvent = {
      id: `evt-${Date.now()}`,
      name: 'New Celebration',
      date: invite.wedding.date.toUpperCase(),
      time: '7:00 PM onwards',
      venueAddress: invite.wedding.venue,
      dressCode: 'Traditional / Cocktail',
      mapLink: '',
    };
    setInvite((prev) => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  const updateEvent = (
    id: string,
    field: keyof WeddingEvent,
    value: string
  ) => {
    setInvite((prev) => ({
      ...prev,
      events: prev.events.map((ev) =>
        ev.id === id ? { ...ev, [field]: value } : ev
      ),
    }));
  };

  const removeEvent = (id: string) => {
    setInvite((prev) => ({
      ...prev,
      events: prev.events.filter((ev) => ev.id !== id),
    }));
  };

  const moveEvent = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= invite.events.length) return;
    setInvite((prev) => {
      const copy = [...prev.events];
      const [item] = copy.splice(index, 1);
      copy.splice(target, 0, item);
      return { ...prev, events: copy };
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-[#4A2F22]/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Edit Wedding Invitation Configuration"
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#FCFAF6] text-[#4A2F22] h-full flex flex-col border-r border-[#E6D9C8] shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E6D9C8] flex items-center justify-between bg-[#F5EFE4]">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#4A2F22]">
              Customize Invitation
            </h2>
            <p className="font-label text-[9px] tracking-[0.22em] uppercase text-[#8A6F5A]">
              Live Studio Editor · Instant Preview
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReplayIntro}
              title="Replay Envelope Reveal"
              className="px-2.5 py-1.5 text-[10px] font-label tracking-[0.18em] uppercase border border-[#B58B66]/50 text-[#4A2F22] hover:bg-[#B58B66] hover:text-white transition-colors rounded-[2px] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Envelope
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close editor"
              className="p-1.5 text-[#8A6F5A] hover:text-[#4A2F22] rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-[#E6D9C8] bg-[#F5EFE4]/60 px-3 py-1.5 gap-1 no-scrollbar">
          {(
            [
              { id: 'couple', label: 'Couple' },
              { id: 'blessing', label: 'Blessing & Reveal' },
              { id: 'events', label: 'Events' },
              { id: 'story', label: 'Date & Story' },
              { id: 'stay', label: 'Stay & RSVP' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'labels', label: 'Labels' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 text-[10px] font-label tracking-[0.2em] uppercase whitespace-nowrap rounded-[2px] transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#B58B66] text-white'
                  : 'text-[#8A6F5A] hover:text-[#4A2F22]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {activeTab === 'couple' && (
            <div className="space-y-4">
              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Partner 1
                </h3>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={invite.couple.partner1Name}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        couple: { ...p.couple, partner1Name: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22] focus:outline-none focus:border-[#B58B66]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Parents Line
                  </label>
                  <input
                    type="text"
                    value={invite.couple.partner1Parents}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        couple: {
                          ...p.couple,
                          partner1Parents: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22] focus:outline-none focus:border-[#B58B66]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Role Label
                  </label>
                  <input
                    type="text"
                    value={invite.couple.partner1Role}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        couple: { ...p.couple, partner1Role: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22] focus:outline-none focus:border-[#B58B66]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-[#B58B66] text-[#4A2F22] cursor-pointer hover:bg-[#B58B66]/10 text-[11px]">
                    <Upload className="w-3.5 h-3.5 text-[#B58B66]" />
                    Arch Portrait
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (b64) =>
                          setInvite((p) => ({
                            ...p,
                            couple: { ...p.couple, partner1Photo: b64 },
                          }))
                        )
                      }
                    />
                  </label>
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-[#B58B66] text-[#4A2F22] cursor-pointer hover:bg-[#B58B66]/10 text-[11px]">
                    <Upload className="w-3.5 h-3.5 text-[#B58B66]" />
                    Detail Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (b64) =>
                          setInvite((p) => ({
                            ...p,
                            couple: {
                              ...p.couple,
                              partner1SecondaryPhoto: b64,
                            },
                          }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Partner 2
                </h3>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={invite.couple.partner2Name}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        couple: { ...p.couple, partner2Name: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22] focus:outline-none focus:border-[#B58B66]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Parents Line
                  </label>
                  <input
                    type="text"
                    value={invite.couple.partner2Parents}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        couple: {
                          ...p.couple,
                          partner2Parents: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22] focus:outline-none focus:border-[#B58B66]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Role Label
                  </label>
                  <input
                    type="text"
                    value={invite.couple.partner2Role}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        couple: { ...p.couple, partner2Role: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22] focus:outline-none focus:border-[#B58B66]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-[#B58B66] text-[#4A2F22] cursor-pointer hover:bg-[#B58B66]/10 text-[11px]">
                    <Upload className="w-3.5 h-3.5 text-[#B58B66]" />
                    Arch Portrait
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (b64) =>
                          setInvite((p) => ({
                            ...p,
                            couple: { ...p.couple, partner2Photo: b64 },
                          }))
                        )
                      }
                    />
                  </label>
                  <label className="flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-[#B58B66] text-[#4A2F22] cursor-pointer hover:bg-[#B58B66]/10 text-[11px]">
                    <Upload className="w-3.5 h-3.5 text-[#B58B66]" />
                    Detail Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (b64) =>
                          setInvite((p) => ({
                            ...p,
                            couple: {
                              ...p.couple,
                              partner2SecondaryPhoto: b64,
                            },
                          }))
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blessing' && (
            <div className="space-y-4">
              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Sacred Emblem &amp; Invocation
                </h3>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Header Icon (Inline SVG)
                  </label>
                  <select
                    value={invite.blessing.headerIcon}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        blessing: {
                          ...p.blessing,
                          headerIcon: e.target.value as BlessingIconType,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22]"
                  >
                    <option value="hinduism">Hinduism (Lord Ganesha)</option>
                    <option value="sikhism">Sikhism (Khanda / Ik Onkar)</option>
                    <option value="islam">Islam (Crescent &amp; Star)</option>
                    <option value="christianity">Christianity (Ornate Cross)</option>
                    <option value="buddhism">Buddhism (Dharma Wheel)</option>
                    <option value="jainism">Jainism (Sacred Lotus)</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Invocation Preset
                  </label>
                  <select
                    value={invite.blessing.invocationPreset}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        blessing: {
                          ...p.blessing,
                          invocationPreset: e.target.value,
                          invocationText: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22]"
                  >
                    {INVOCATION_PRESETS.map((preset) => (
                      <option key={preset} value={preset}>
                        {preset}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Custom Invocation Text
                  </label>
                  <input
                    type="text"
                    value={invite.blessing.invocationText}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        blessing: {
                          ...p.blessing,
                          invocationText: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22]"
                  />
                </div>
              </div>

              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Envelope Reveal Copy
                </h3>
                {(
                  [
                    ['topLine', 'Wax Seal Monogram (e.g. H & K)'],
                    ['innerLine', 'Inner Card Monogram'],
                    ['coverLabel', 'Inner Card Cover Label'],
                    ['innerFootnote', 'Inner Card Footnote'],
                    ['promptHeadline', 'Headline Below Envelope'],
                    ['sealPrompt', 'Tap Seal Prompt'],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-[11px] text-[#8A6F5A] mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={invite.reveal[field]}
                      onChange={(e) =>
                        setInvite((p) => ({
                          ...p,
                          reveal: { ...p.reveal, [field]: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E6D9C8] text-[#4A2F22]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-2">
                <label className="block font-label text-[10px] tracking-[0.22em] uppercase text-[#B58B66] font-semibold">
                  Celebrations Layout Style
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['timeline', 'accordion', 'grid', 'minimal'] as const).map(
                    (lay) => (
                      <button
                        key={lay}
                        type="button"
                        onClick={() =>
                          setInvite((p) => ({ ...p, eventsLayout: lay }))
                        }
                        className={`py-2 px-2 text-[10px] font-label tracking-[0.15em] uppercase border rounded-[2px] cursor-pointer ${
                          invite.eventsLayout === lay
                            ? 'bg-[#B58B66] text-white border-[#B58B66]'
                            : 'bg-white text-[#8A6F5A] border-[#E6D9C8]'
                        }`}
                      >
                        {lay}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-label text-[10px] tracking-[0.22em] uppercase text-[#8A6F5A]">
                  {invite.events.length} Celebrations
                </span>
                <button
                  type="button"
                  onClick={addEvent}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#B58B66] text-white font-label text-[10px] tracking-[0.2em] uppercase rounded-[2px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Event
                </button>
              </div>

              {invite.events.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-[#E6D9C8] pb-2">
                    <span className="font-label text-[10px] tracking-[0.22em] uppercase text-[#B58B66] font-semibold">
                      Event {idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveEvent(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Move event up"
                        className="p-1 text-[#8A6F5A] hover:text-[#4A2F22] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveEvent(idx, 1)}
                        disabled={idx === invite.events.length - 1}
                        aria-label="Move event down"
                        className="p-1 text-[#8A6F5A] hover:text-[#4A2F22] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEvent(ev.id)}
                        aria-label="Delete event"
                        className="p-1 text-[#9E3F3F] hover:opacity-80 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Event Name"
                    value={ev.name}
                    onChange={(e) =>
                      updateEvent(ev.id, 'name', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6D9C8]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Date (e.g. NOV 26, 2026)"
                      value={ev.date}
                      onChange={(e) =>
                        updateEvent(ev.id, 'date', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E6D9C8]"
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g. 3:00 PM onwards)"
                      value={ev.time}
                      onChange={(e) =>
                        updateEvent(ev.id, 'time', e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-[#E6D9C8]"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Dress Code"
                    value={ev.dressCode}
                    onChange={(e) =>
                      updateEvent(ev.id, 'dressCode', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6D9C8]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Venue Address"
                    value={ev.venueAddress}
                    onChange={(e) =>
                      updateEvent(ev.id, 'venueAddress', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6D9C8]"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-4">
              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Wedding Date, Timezone &amp; Main Venue
                </h3>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Display Date Text
                  </label>
                  <input
                    type="text"
                    value={invite.wedding.date}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        wedding: { ...p.wedding, date: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Countdown Target (ISO Date-Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={invite.wedding.isoDate}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        wedding: { ...p.wedding, isoDate: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Wedding Timezone
                  </label>
                  <select
                    value={invite.wedding.timezone}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        wedding: {
                          ...p.wedding,
                          timezone: e.target.value as TimezoneKey,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz.key} value={tz.key}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Main Wedding Venue Address
                  </label>
                  <textarea
                    rows={3}
                    value={invite.wedding.venue}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        wedding: { ...p.wedding, venue: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Background Audio URL (or SYNTH_CHIME, leave blank to hide)
                  </label>
                  <input
                    type="text"
                    value={invite.wedding.musicUrl}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        wedding: { ...p.wedding, musicUrl: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
              </div>

              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Our Story
                </h3>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Signature Quote
                  </label>
                  <textarea
                    rows={2}
                    value={invite.story.signatureQuote}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        story: { ...p.story, signatureQuote: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Long-Form Story Paragraph
                  </label>
                  <textarea
                    rows={4}
                    value={invite.story.storyText}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        story: { ...p.story, storyText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stay' && (
            <div className="space-y-4">
              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  RSVP Settings
                </h3>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    RSVP Deadline Text
                  </label>
                  <input
                    type="text"
                    value={invite.rsvp.deadline}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        rsvp: { ...p.rsvp, deadline: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#8A6F5A] mb-1">
                    Host WhatsApp Number (Digits with country code)
                  </label>
                  <input
                    type="text"
                    value={invite.rsvp.whatsappNumber}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        rsvp: { ...p.rsvp, whatsappNumber: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                  />
                </div>
              </div>

              <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-3">
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                  Accommodation Notes (One per line)
                </h3>
                <textarea
                  rows={3}
                  value={invite.stay.accommodation.join('\n')}
                  onChange={(e) =>
                    setInvite((p) => ({
                      ...p,
                      stay: {
                        ...p.stay,
                        accommodation: e.target.value
                          .split('\n')
                          .filter((line) => line.trim().length > 0),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                />
                <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold pt-2">
                  Transportation Notes (One per line)
                </h3>
                <textarea
                  rows={3}
                  value={invite.stay.transportation.join('\n')}
                  onChange={(e) =>
                    setInvite((p) => ({
                      ...p,
                      stay: {
                        ...p.stay,
                        transportation: e.target.value
                          .split('\n')
                          .filter((line) => line.trim().length > 0),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-[#E6D9C8]"
                />
              </div>

              {rsvpList.length > 0 && (
                <div className="p-3.5 border border-[#E6D9C8] bg-[#F5EFE4]/40 space-y-2">
                  <h3 className="font-label text-[10px] tracking-[0.25em] uppercase text-[#B58B66] font-semibold">
                    Session RSVP Submissions ({rsvpList.length})
                  </h3>
                  {rsvpList.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-2 bg-white border border-[#E6D9C8] text-[11px]"
                    >
                      <p className="font-semibold text-[#4A2F22]">
                        {sub.guestName} ({sub.guestCount} guests)
                      </p>
                      <p className="text-[#8A6F5A]">{sub.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center p-5 border border-dashed border-[#B58B66] bg-[#F5EFE4]/40 cursor-pointer hover:bg-[#B58B66]/10 transition-colors">
                <Upload className="w-5 h-5 text-[#B58B66] mb-1.5" />
                <span className="font-label text-[10px] tracking-[0.22em] uppercase text-[#4A2F22]">
                  Upload Portrait Photo to Gallery
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, (b64) =>
                      setInvite((p) => ({
                        ...p,
                        gallery: [...p.gallery, b64],
                      }))
                    )
                  }
                />
              </label>

              {invite.gallery.length === 0 ? (
                <p className="text-center text-[#8A6F5A] py-4 italic font-serif">
                  Showing curated luxury editorial placeholders until photos are
                  uploaded.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {invite.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/5] border border-[#E6D9C8] overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setInvite((p) => ({
                            ...p,
                            gallery: p.gallery.filter((_, idx) => idx !== i),
                          }))
                        }
                        aria-label="Remove image"
                        className="absolute top-1 right-1 p-1 bg-[#4A2F22]/80 text-white rounded-full cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'labels' && (
            <div className="space-y-3">
              {(
                Object.keys(invite.labels) as Array<keyof InviteConfig['labels']>
              ).map((key) => (
                <div key={key}>
                  <label className="block text-[10px] font-label tracking-[0.15em] uppercase text-[#8A6F5A] mb-1">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={invite.labels[key]}
                    onChange={(e) =>
                      setInvite((p) => ({
                        ...p,
                        labels: { ...p.labels, [key]: e.target.value },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E6D9C8]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// 10. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  const [invite, setInvite] = useState<InviteConfig>(INVITE);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [confettiBurst, setConfettiBurst] = useState<number>(0);
  const [confettiMode, setConfettiMode] = useState<'envelope' | 'rsvp'>(
    'envelope'
  );
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(
    INVITE.events[0]?.id || null
  );
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // RSVP 3-Step Form State
  const [rsvpStep, setRsvpStep] = useState<1 | 2 | 3>(1);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    INVITE.events.map((e) => e.id)
  );
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dietaryNote, setDietaryNote] = useState<string>('');
  const [songRequest, setSongRequest] = useState<string>('');
  const [rsvpError, setRsvpError] = useState<string>('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState<RsvpSubmission | null>(
    null
  );
  const [rsvpList, setRsvpList] = useState<RsvpSubmission[]>([]);

  // Audio / Ambient Music State
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Timeline Scroll Progress
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 65%'],
  });
  const smoothTimelineScale = useSpring(timelineProgress, {
    stiffness: 90,
    damping: 24,
  });

  // Sync document title
  useEffect(() => {
    document.title = `${invite.couple.partner1Name} & ${invite.couple.partner2Name} | Wedding Invitation`;
  }, [invite.couple.partner1Name, invite.couple.partner2Name]);

  // Countdown Calculation with Selected Wedding Timezone
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    mins: number;
    secs: number;
    isPast: boolean;
  }>({ days: 45, hours: 11, mins: 16, secs: 18, isPast: false });

  useEffect(() => {
    const updateTimer = () => {
      const targetMs = getTargetTimestamp(
        invite.wedding.isoDate,
        invite.wedding.timezone
      );
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0, isPast: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, mins, secs, isPast: false });
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [invite.wedding.isoDate, invite.wedding.timezone]);

  // Gentle WebAudio Sitar/Harp Chime Generator or External Audio URL
  const stopAmbientAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    setIsPlayingMusic(false);
  }, []);

  const startAmbientAudio = useCallback(() => {
    const url = invite.wedding.musicUrl.trim();
    if (!url) return;

    if (url !== 'SYNTH_CHIME') {
      if (!audioRef.current || audioRef.current.src !== url) {
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.35;
      }
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
      return;
    }

    // Gentle WebAudio API Pentatonic Chime for zero-external-asset reliability
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      let step = 0;

      const playChimeNote = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.025, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start(now);
        osc.stop(now + 2.7);
        step++;
      };

      playChimeNote();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = window.setInterval(playChimeNote, 2800);
      setIsPlayingMusic(true);
    } catch {
      setIsPlayingMusic(false);
    }
  }, [invite.wedding.musicUrl]);

  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopAmbientAudio();
    } else {
      startAmbientAudio();
    }
  };

  // RSVP Step Handlers
  const toggleEventSelection = (id: string) => {
    setRsvpError('');
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllEvents = () => {
    setRsvpError('');
    if (selectedEvents.length === invite.events.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(invite.events.map((e) => e.id));
    }
  };

  const handleRsvpNextStep = () => {
    setRsvpError('');
    if (rsvpStep === 1) {
      if (selectedEvents.length === 0) {
        setRsvpError('Please select at least one celebration to attend.');
        return;
      }
      setRsvpStep(2);
    } else if (rsvpStep === 2) {
      if (!guestName.trim()) {
        setRsvpError('Please enter your full name.');
        return;
      }
      if (!guestPhone.trim() || guestPhone.trim().length < 7) {
        setRsvpError('Please enter a valid contact phone number.');
        return;
      }
      setRsvpStep(3);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission: RsvpSubmission = {
      id: `rsvp-${Date.now()}`,
      selectedEvents,
      guestName: guestName.trim(),
      phone: guestPhone.trim(),
      guestCount,
      dietaryNote: dietaryNote.trim(),
      songRequest: songRequest.trim(),
      submittedAt: new Date().toLocaleTimeString(),
    };
    setRsvpList((prev) => [submission, ...prev]);
    setRsvpSubmitted(submission);
    setConfettiMode('rsvp');
    setConfettiBurst(Date.now());
  };

  const getWhatsAppUrl = (sub: RsvpSubmission) => {
    const eventNames = invite.events
      .filter((ev) => sub.selectedEvents.includes(ev.id))
      .map((ev) => ev.name)
      .join(', ');
    const message = [
      `Namaste! RSVP for *${invite.couple.partner1Name} & ${invite.couple.partner2Name}'s Wedding*`,
      `• Guest: ${sub.guestName}`,
      `• Phone: ${sub.phone}`,
      `• Guests Attending: ${sub.guestCount}`,
      `• Celebrations: ${eventNames}`,
      sub.dietaryNote ? `• Dietary Note: ${sub.dietaryNote}` : '',
      sub.songRequest ? `• Song Request: ${sub.songRequest}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const cleanPhone = invite.rsvp.whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Scroll Reveal Motion Props
  const sectionRevealProps = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  return (
    <div className="min-h-screen bg-[#F5EFE4] text-[#4A2F22] relative overflow-x-hidden selection:bg-[#B58B66]/25 selection:text-[#4A2F22]">
      {/* Google Fonts & Custom Keyframe Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Noto+Sans+Devanagari:wght@400;500;600&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        .font-serif {
          font-family: 'Playfair Display', 'Noto Sans Devanagari', Georgia, serif;
        }
        .font-script {
          font-family: 'Great Vibes', cursive;
        }
        .font-label {
          font-family: 'Outfit', 'Noto Sans Devanagari', sans-serif;
        }

        @keyframes kenBurnsSlow {
          0% { transform: scale(1) translate3d(0, 0, 0); }
          50% { transform: scale(1.07) translate3d(-1%, -1%, 0); }
          100% { transform: scale(1) translate3d(0, 0, 0); }
        }
        .ken-burns-slow {
          animation: kenBurnsSlow 18s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes sealShine {
          0%, 65% { transform: translateX(-140%) rotate(25deg); opacity: 0; }
          75% { opacity: 0.65; }
          90%, 100% { transform: translateX(140%) rotate(25deg); opacity: 0; }
        }
        .seal-shine-sweep {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.65) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: sealShine 5.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .ken-burns-slow, .seal-shine-sweep {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle Paper-Grain SVG feTurbulence Overlay (4% opacity) */}
      <svg
        className="pointer-events-none fixed inset-0 z-30 w-full h-full opacity-[0.04]"
        aria-hidden="true"
      >
        <filter id="luxury-paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#luxury-paper-grain)" />
      </svg>

      {/* Particle Canvas for Envelope & RSVP Confetti */}
      <ConfettiCanvas burstTrigger={confettiBurst} mode={confettiMode} />

      {/* SCREEN 1: ENVELOPE REVEAL */}
      <AnimatePresence>
        {!isOpened && (
          <EnvelopeIntro
            invite={invite}
            onTriggerConfetti={() => {
              setConfettiMode('envelope');
              setConfettiBurst(Date.now());
            }}
            onComplete={() => {
              setIsOpened(true);
              startAmbientAudio();
            }}
          />
        )}
      </AnimatePresence>

      {/* FLOATING MUSIC BUTTON (Right Edge, matches reference screenshot) */}
      {isOpened && invite.wedding.musicUrl.trim() !== '' && (
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={
            isPlayingMusic ? 'Pause background music' : 'Play background music'
          }
          title={isPlayingMusic ? 'Pause music' : 'Play music'}
          className="fixed right-3.5 sm:right-5 top-1/2 -translate-y-1/2 z-40 w-9 h-9 rounded-full bg-[#FCFAF6]/90 border border-[#D8C6B0] shadow-[0_6px_20px_rgba(74,47,34,0.12)] flex items-center justify-center text-[#8A6F5A] hover:text-[#4A2F22] transition-transform active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B58B66]"
        >
          {isPlayingMusic ? (
            <Music className="w-3.5 h-3.5 text-[#B58B66]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-[#8A6F5A]" />
          )}
        </button>
      )}

      {/* Admin Live Editor Drawer */}
      <AdminConfigDrawer
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        invite={invite}
        setInvite={setInvite}
        rsvpList={rsvpList}
        onReplayIntro={() => {
          setIsEditorOpen(false);
          setIsOpened(false);
        }}
      />

      {/* SCREEN 2: THE INVITATION (Single Scrolling Page) */}
      <main
        className={`relative z-10 w-full max-w-[540px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 space-y-20 sm:space-y-24 transition-opacity duration-700 ${
          isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none h-screen overflow-hidden'
        }`}
      >
        {/* ================================================================
            1. HERO INVITATION CARD
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="Wedding Invitation Formal Card"
          className="w-full max-w-[440px] mx-auto"
        >
          <div className="bg-[#FCFAF6] p-2.5 sm:p-3.5 rounded-[2px] shadow-[0_20px_50px_rgba(74,47,34,0.12)] border border-[#E6D9C8]/90">
            {/* Outer Border of Double-Line Frame */}
            <div className="border border-[#DFC9B0] p-1">
              {/* Inner Border of Double-Line Frame */}
              <div className="border border-[#EADFD0] relative px-5 sm:px-9 py-11 sm:py-14 text-center flex flex-col items-center">
                <CornerFlourish position="tl" />
                <CornerFlourish position="tr" />
                <CornerFlourish position="bl" />
                <CornerFlourish position="br" />

                {/* Sacred Header Icon */}
                <BlessingSvg type={invite.blessing.headerIcon} />

                {/* Blessing Invocation Text */}
                {invite.blessing.invocationText && (
                  <p className="font-serif text-[13px] sm:text-sm text-[#B58B66] tracking-wide mb-3">
                    {invite.blessing.invocationText}
                  </p>
                )}

                {/* Together With Their Families */}
                <p className="font-label text-[9.5px] sm:text-[10px] tracking-[0.3em] uppercase text-[#8A6F5A]">
                  {invite.labels.heroSubtitle}
                </p>

                <OrnamentalDivider />

                {/* Partner 1 Name with Handwriting Clip-Path Reveal */}
                <motion.h1
                  initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }}
                  animate={
                    isOpened
                      ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                      : { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }
                  }
                  transition={{
                    duration: 1.4,
                    delay: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-script text-5xl sm:text-[56px] leading-[1.15] text-[#4A2F22] py-1 px-2"
                >
                  {invite.couple.partner1Name}
                </motion.h1>

                <p className="font-label text-[13px] sm:text-sm text-[#8A6F5A] tracking-wide mt-1">
                  {invite.couple.partner1Parents}
                </p>

                {/* Script Ampersand */}
                <span
                  className="font-script text-2xl sm:text-3xl text-[#B58B66] my-3 select-none"
                  aria-hidden="true"
                >
                  &amp;
                </span>

                {/* Partner 2 Name with Handwriting Clip-Path Reveal */}
                <motion.h2
                  initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }}
                  animate={
                    isOpened
                      ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                      : { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 }
                  }
                  transition={{
                    duration: 1.4,
                    delay: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-script text-5xl sm:text-[56px] leading-[1.15] text-[#4A2F22] py-1 px-2"
                >
                  {invite.couple.partner2Name}
                </motion.h2>

                <p className="font-label text-[13px] sm:text-sm text-[#8A6F5A] tracking-wide mt-1 mb-8">
                  {invite.couple.partner2Parents}
                </p>

                {/* Italic Presence Line */}
                <p className="font-serif italic text-sm sm:text-[15px] text-[#4A2F22]">
                  {invite.labels.heroInvitationLine}
                </p>
              </div>
            </div>
          </div>

          {/* 2. SCROLL TO EXPLORE PROMPT */}
          <div className="mt-10 flex flex-col items-center justify-center text-center">
            <a
              href="#couple-section"
              className="inline-flex items-center gap-1.5 font-label text-[9px] tracking-[0.3em] uppercase text-[#8A6F5A] hover:text-[#4A2F22] transition-colors py-2"
            >
              <span>{invite.labels.scrollPrompt}</span>
              <motion.span
                animate={{ y: [0, 3.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓
              </motion.span>
            </a>
          </div>
        </motion.section>

        {/* ================================================================
            3. COUPLE ARCH PORTRAITS SECTION
           ================================================================ */}
        <motion.section
          id="couple-section"
          {...sectionRevealProps}
          aria-label="The Couple"
          className="pt-2"
        >
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-7">
            <CoupleArchCard
              name={invite.couple.partner1Name}
              role={invite.couple.partner1Role}
              primaryPhoto={invite.couple.partner1Photo}
              secondaryPhoto={invite.couple.partner1SecondaryPhoto}
              initial={invite.couple.partner1Name.charAt(0) || 'H'}
              variant="groom"
              onUploadPrimary={(b64) =>
                setInvite((p) => ({
                  ...p,
                  couple: { ...p.couple, partner1Photo: b64 },
                }))
              }
              onUploadSecondary={(b64) =>
                setInvite((p) => ({
                  ...p,
                  couple: { ...p.couple, partner1SecondaryPhoto: b64 },
                }))
              }
            />

            {/* Center Circular Heart Badge */}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EFE5D5] border border-[#DFCEB9] flex items-center justify-center shrink-0 -mt-10 shadow-sm"
              aria-hidden="true"
            >
              <Heart className="w-3.5 h-3.5 text-[#B58B66] fill-[#B58B66]" />
            </div>

            <CoupleArchCard
              name={invite.couple.partner2Name}
              role={invite.couple.partner2Role}
              primaryPhoto={invite.couple.partner2Photo}
              secondaryPhoto={invite.couple.partner2SecondaryPhoto}
              initial={invite.couple.partner2Name.charAt(0) || 'K'}
              variant="bride"
              onUploadPrimary={(b64) =>
                setInvite((p) => ({
                  ...p,
                  couple: { ...p.couple, partner2Photo: b64 },
                }))
              }
              onUploadSecondary={(b64) =>
                setInvite((p) => ({
                  ...p,
                  couple: { ...p.couple, partner2SecondaryPhoto: b64 },
                }))
              }
            />
          </div>
        </motion.section>

        {/* ================================================================
            4. SAVE THE DATE CARD + ICS DOWNLOAD
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="Save the Date"
          className="w-full max-w-[340px] mx-auto"
        >
          <div className="bg-[#FCFAF6] rounded-xl px-6 py-8 text-center border border-[#E6D9C8] shadow-[0_20px_50px_rgba(74,47,34,0.10)]">
            <p className="font-label text-[9px] tracking-[0.32em] uppercase text-[#8A6F5A] mb-2">
              {invite.labels.saveTheDateTag}
            </p>
            <h2 className="font-serif text-2xl sm:text-[26px] text-[#4A2F22] tracking-wide">
              {invite.wedding.date}
            </h2>
          </div>
        </motion.section>

        {/* ================================================================
            5. COUNTDOWN SECTION
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="Wedding Countdown"
          className="text-center"
        >
          <p className="font-label text-[9.5px] tracking-[0.32em] uppercase text-[#8A6F5A] mb-5">
            {invite.labels.countdownTitle}
          </p>

          {countdown.isPast ? (
            <div className="py-4 px-6 inline-block bg-[#FCFAF6] border border-[#E6D9C8] rounded-lg shadow-sm">
              <p className="font-serif italic text-2xl text-[#B58B66]">
                Today we celebrate!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3.5 sm:gap-5">
              <CountdownCircle value={countdown.days} label="DAYS" />
              <CountdownCircle value={countdown.hours} label="HOURS" />
              <CountdownCircle value={countdown.mins} label="MINS" />
              <CountdownCircle value={countdown.secs} label="SECS" />
            </div>
          )}
        </motion.section>

        {/* ================================================================
            6. OUR STORY CARD
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="Our Story"
          className="w-full max-w-[470px] mx-auto"
        >
          <div className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-[2px] px-6 sm:px-10 py-9 sm:py-11 text-center shadow-[0_20px_50px_rgba(74,47,34,0.08)]">
            <p className="font-label text-xs sm:text-sm tracking-[0.32em] uppercase text-[#8A6F5A]">
              {invite.labels.storyTitle}
            </p>

            <OrnamentalDivider compact />

            <blockquote className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[#4A2F22] max-w-sm mx-auto my-4">
              &ldquo;{invite.story.signatureQuote}&rdquo;
            </blockquote>

            <div className="w-full h-[1px] bg-[#E6D9C8]/80 my-5" />

            <p className="font-label text-xs sm:text-sm tracking-[0.28em] uppercase text-[#8A6F5A] italic">
              {invite.labels.storySubline}
            </p>
          </div>
        </motion.section>

        {/* ================================================================
            7. THE CELEBRATIONS (4 Switchable Layouts: Timeline, Accordion, Grid, Minimal)
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="The Celebrations"
          className="w-full"
        >
          {/* Heading */}
          <div className="text-center mb-10">
            <p className="font-label text-[9px] tracking-[0.32em] uppercase text-[#8A6F5A] mb-1.5">
              {invite.labels.eventsKicker}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#4A2F22]">
              {invite.labels.eventsTitle}
            </h2>
            <div className="w-10 h-[1px] bg-[#B58B66]/60 mx-auto mt-2.5" />
          </div>

          {/* LAYOUT 1: VERTICAL TIMELINE (Default — Matches Reference Screenshot) */}
          {invite.eventsLayout === 'timeline' && (
            <div ref={timelineRef} className="relative pl-7 sm:pl-9 space-y-6">
              {/* Background Vertical Hairline */}
              <div
                className="absolute left-[9px] sm:left-[11px] top-3 bottom-6 w-[1px] bg-[#E6D9C8]"
                aria-hidden="true"
              />
              {/* Animated Scroll-Drawing Vertical Line */}
              <motion.div
                style={{
                  scaleY: smoothTimelineScale,
                  transformOrigin: 'top',
                }}
                className="absolute left-[9px] sm:left-[11px] top-3 bottom-6 w-[1px] bg-[#B58B66]"
                aria-hidden="true"
              />

              {invite.events.map((ev, index) => {
                const mapHref =
                  ev.mapLink?.trim() ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ev.venueAddress
                  )}`;

                return (
                  <motion.article
                    key={ev.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative"
                  >
                    {/* Round Node Dot on Timeline */}
                    <div
                      className="absolute -left-7 sm:-left-9 top-2 w-[19px] h-[19px] sm:w-[23px] sm:h-[23px] rounded-full bg-[#F5EFE4] border border-[#B58B66] flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#B58B66]" />
                    </div>

                    {/* Event Card */}
                    <div className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-[4px] p-5 sm:p-6 shadow-[0_12px_34px_rgba(74,47,34,0.06)]">
                      {/* Kicker: EVENT 1 · DATE · TIME */}
                      <div className="flex flex-wrap items-center gap-1.5 font-label text-[8.5px] sm:text-[9px] tracking-[0.24em] uppercase text-[#B58B66] font-medium">
                        <span>EVENT {index + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ev.date}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ev.time.split(' ')[0]} {ev.time.split(' ')[1]}</span>
                      </div>

                      {/* Event Name in Serif */}
                      <h3 className="font-serif text-xl sm:text-[22px] text-[#4A2F22] mt-1 pb-4 border-b border-[#EFE6D8]">
                        {ev.name}
                      </h3>

                      {/* Two Columns: Timings & Dress Code */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#EFE6D8]">
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-[#B58B66] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-label text-[8.5px] tracking-[0.22em] uppercase text-[#4A2F22] font-semibold">
                              TIMINGS
                            </p>
                            <p className="text-[11.5px] text-[#8A6F5A] mt-0.5">
                              {ev.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Shirt className="w-3.5 h-3.5 text-[#B58B66] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-label text-[8.5px] tracking-[0.22em] uppercase text-[#4A2F22] font-semibold">
                              DRESS CODE
                            </p>
                            <p className="text-[11.5px] text-[#8A6F5A] mt-0.5">
                              {ev.dressCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Venue with Pin Icon & Address */}
                      <div className="pt-4 flex items-start gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B58B66] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-label text-[8.5px] tracking-[0.22em] uppercase text-[#4A2F22] font-semibold">
                            VENUE
                          </p>
                          <p className="text-[11.5px] leading-relaxed text-[#8A6F5A] mt-0.5">
                            {ev.venueAddress}
                          </p>
                          <a
                            href={mapHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-label text-[9px] tracking-[0.24em] uppercase text-[#B58B66] hover:text-[#4A2F22] font-medium mt-3 transition-colors"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>GET DIRECTIONS</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* LAYOUT 2: ACCORDION */}
          {invite.eventsLayout === 'accordion' && (
            <div className="space-y-3">
              {invite.events.map((ev, index) => {
                const isOpen = openAccordionId === ev.id;
                const mapHref =
                  ev.mapLink?.trim() ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ev.venueAddress
                  )}`;
                return (
                  <div
                    key={ev.id}
                    className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-[4px] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordionId(isOpen ? null : ev.id)
                      }
                      className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
                    >
                      <div>
                        <p className="font-label text-[8.5px] tracking-[0.24em] uppercase text-[#B58B66]">
                          EVENT {index + 1} · {ev.date}
                        </p>
                        <h3 className="font-serif text-lg text-[#4A2F22] mt-0.5">
                          {ev.name}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#B58B66] transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="px-5 pb-5 pt-2 border-t border-[#EFE6D8] space-y-3 text-xs"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="font-label text-[8.5px] tracking-[0.2em] uppercase text-[#4A2F22] block">
                                Timings
                              </span>
                              <span className="text-[#8A6F5A]">{ev.time}</span>
                            </div>
                            <div>
                              <span className="font-label text-[8.5px] tracking-[0.2em] uppercase text-[#4A2F22] block">
                                Dress Code
                              </span>
                              <span className="text-[#8A6F5A]">
                                {ev.dressCode}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-label text-[8.5px] tracking-[0.2em] uppercase text-[#4A2F22] block">
                              Venue
                            </span>
                            <p className="text-[#8A6F5A] mt-0.5">
                              {ev.venueAddress}
                            </p>
                          </div>
                          <a
                            href={mapHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-label text-[9px] tracking-[0.24em] uppercase text-[#B58B66]"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>GET DIRECTIONS</span>
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* LAYOUT 3: GRID */}
          {invite.eventsLayout === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {invite.events.map((ev, index) => {
                const mapHref =
                  ev.mapLink?.trim() ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ev.venueAddress
                  )}`;
                return (
                  <div
                    key={ev.id}
                    className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-[4px] p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <p className="font-label text-[8.5px] tracking-[0.24em] uppercase text-[#B58B66]">
                        EVENT {index + 1} · {ev.date}
                      </p>
                      <h3 className="font-serif text-lg text-[#4A2F22] mt-1 pb-3 border-b border-[#EFE6D8]">
                        {ev.name}
                      </h3>
                      <p className="text-xs text-[#8A6F5A] mt-3">
                        <strong className="text-[#4A2F22]">Time:</strong>{' '}
                        {ev.time}
                      </p>
                      <p className="text-xs text-[#8A6F5A] mt-1">
                        <strong className="text-[#4A2F22]">Dress:</strong>{' '}
                        {ev.dressCode}
                      </p>
                      <p className="text-xs text-[#8A6F5A] mt-2 leading-relaxed">
                        {ev.venueAddress}
                      </p>
                    </div>
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-label text-[9px] tracking-[0.24em] uppercase text-[#B58B66] mt-4"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>GET DIRECTIONS</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* LAYOUT 4: MINIMAL */}
          {invite.eventsLayout === 'minimal' && (
            <div className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-[4px] divide-y divide-[#EFE6D8] px-6 py-2">
              {invite.events.map((ev, index) => {
                const mapHref =
                  ev.mapLink?.trim() ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    ev.venueAddress
                  )}`;
                return (
                  <div key={ev.id} className="py-5 text-center">
                    <p className="font-label text-[8.5px] tracking-[0.24em] uppercase text-[#B58B66]">
                      EVENT {index + 1} · {ev.date} · {ev.time}
                    </p>
                    <h3 className="font-serif text-xl text-[#4A2F22] mt-1">
                      {ev.name}
                    </h3>
                    <p className="text-xs text-[#8A6F5A] mt-1">
                      Dress Code: {ev.dressCode}
                    </p>
                    <p className="text-xs text-[#8A6F5A] mt-1 max-w-sm mx-auto">
                      {ev.venueAddress}
                    </p>
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block font-label text-[9px] tracking-[0.24em] uppercase text-[#B58B66] mt-2"
                    >
                      GET DIRECTIONS →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ================================================================
            8. MAIN VENUE CARD
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="Main Wedding Venue"
          className="w-full"
        >
          <div className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-xl px-6 sm:px-10 py-9 sm:py-11 text-center shadow-[0_20px_50px_rgba(74,47,34,0.08)]">
            <p className="font-label text-[9px] tracking-[0.32em] uppercase text-[#8A6F5A] mb-3.5">
              {invite.labels.venueTag}
            </p>
            <h2
              className="font-serif text-lg sm:text-xl leading-relaxed text-[#4A2F22] max-w-md mx-auto"
              style={{ textWrap: 'balance' }}
            >
              {invite.wedding.venue}
            </h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                invite.wedding.venue
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-5 font-label text-[9.5px] tracking-[0.28em] uppercase text-[#B58B66] hover:text-[#4A2F22] transition-colors"
            >
              GET DIRECTIONS →
            </a>
          </div>
        </motion.section>

        {/* ================================================================
            9. WEDDING HOSTS SECTION (With Tap-to-Call Contacts)
           ================================================================ */}
        <motion.section
          {...sectionRevealProps}
          aria-label="Wedding Hosts Contact Information"
          className="w-full"
        >
          <div className="bg-[#FCFAF6] border border-[#E6D9C8] rounded-[4px] p-6 sm:p-8 shadow-[0_14px_38px_rgba(74,47,34,0.06)]">
            <div className="text-center mb-7">
              <h2 className="font-serif text-2xl text-[#4A2F22]">
                {invite.labels.stayTitle}
              </h2>
              <OrnamentalDivider compact />
              <p className="text-xs sm:text-[13px] text-[#8A6F5A] leading-relaxed max-w-sm mx-auto mt-3">
                {invite.labels.staySubtitle}
              </p>
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              {invite.stay.accommodationContacts.map((c, idx) => {
                const match = c.name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
                const personName = match ? match[1] : c.name;
                const relation = match ? match[2] : '';
                return (
                  <a
                    key={idx}
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 bg-[#F5EFE4]/70 border border-[#E6D9C8] rounded-[2px] hover:border-[#B58B66] transition-colors"
                  >
                    <div>
                      <p className="text-sm text-[#4A2F22] font-medium">
                        {personName}
                      </p>
                      {relation && (
                        <p className="font-label text-[9px] tracking-[0.2em] uppercase text-[#8A6F5A] mt-0.5">
                          {relation}
                        </p>
                      )}
                      <p className="text-[11px] text-[#8A6F5A] mt-1">
                        {c.phone}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 shrink-0 font-label text-[9px] tracking-[0.2em] uppercase text-[#B58B66] px-2.5 py-1.5 border border-[#DFCBB2] rounded-full">
                      <Phone className="w-3 h-3" /> Call
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ================================================================
            12. FOOTER
           ================================================================ */}
        <footer className="pt-4 pb-10 text-center space-y-3">
          <OrnamentalDivider compact />
          <p className="font-serif italic text-2xl sm:text-3xl text-[#4A2F22]">
            {invite.labels.footerWelcome}
          </p>
          <p className="font-label text-[8px] tracking-[0.34em] uppercase text-[#8A6F5A]/80">
            {invite.labels.footerBrand}
          </p>
        </footer>
      </main>
    </div>
  );
}
