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
  useTransform,
  useReducedMotion,
} from 'motion/react';
import {
  Clock,
  Shirt,
  MapPin,
  Navigation,
  Phone,
  Calendar,
  Settings,
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Music,
  VolumeX,
  Heart,
  MessageCircle,
  RotateCcw,
  Palette,
} from 'lucide-react';

// ============================================================================
// 1. TYPES & CONFIGURATION INTERFACES
// ============================================================================

export type ThemePresetKey = 'blushRose' | 'classicCream';

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

export interface ArtSlotsConfig {
  floralTopLeft: string;
  floralRight: string;
  floralBottom: string;
  heroBackground: string;
  venuePhoto: string;
  ringBox: string;
  qrCodeOverride: string;
}

export interface HeroPosterCopy {
  hangingTagText: string;
  topRightQuote: string;
  blessingHeadline: string;
  parentsInviteIntro: string;
  namesConnector: string;
  celebrationMessage: string;
  infoDayLabel: string;
  infoDateLabel: string;
  infoTimeLabel: string;
  infoVenueShort: string;
  graciousPresenceLine: string;
  scanLocationLabel: string;
  posterFooterPillars: string;
}

export interface HostPerson {
  name: string;
  relation: string;
  phone: string;
}

export interface InviteConfig {
  theme: ThemePresetKey;
  documentTitle: string;
  art: ArtSlotsConfig;
  poster: HeroPosterCopy;
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
    venueMapLink: string;
    timezone: TimezoneKey;
    musicUrl: string;
    musicVolume: number;
  };
  hosts: HostPerson[];
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
    marriageVenueLabel: string;
    getDirectionsLabel: string;
    hostsTitle: string;
    hostsSubtitle: string;
    hostsCallLabel: string;
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
// 2. THEME PRESETS & DEFAULT INVITE CONFIGURATION
// ============================================================================

export const THEME_VARIABLES: Record<
  ThemePresetKey,
  Record<string, string>
> = {
  blushRose: {
    '--bg-start': '#FBEFEA',
    '--bg-end': '#F6DCD6',
    '--card-bg': '#FFF8F3',
    '--card-inner': '#FFFDFB',
    '--name-color': '#B5586B',
    '--text-main': '#6B3340',
    '--text-muted': '#96616D',
    '--accent-primary': '#C9A27E',
    '--gold-line': '#D8B988',
    '--leaf-green': '#7C8B63',
    '--border-hairline': '#EED5CE',
    '--badge-bg': '#F7DFDA',
    '--cta-bg': '#B5586B',
    '--cta-hover': '#9B4557',
    '--bloom-outer': '#F5CCD4',
    '--bloom-mid': '#E598A8',
    '--bloom-core': '#B5586B',
  },
  classicCream: {
    '--bg-start': '#F5EFE4',
    '--bg-end': '#EAE0CF',
    '--card-bg': '#FCFAF6',
    '--card-inner': '#FFFFFF',
    '--name-color': '#4A2F22',
    '--text-main': '#4A2F22',
    '--text-muted': '#8A6F5A',
    '--accent-primary': '#B58B66',
    '--gold-line': '#C9A57C',
    '--leaf-green': '#7E886B',
    '--border-hairline': '#E6D9C8',
    '--badge-bg': '#EFE5D5',
    '--cta-bg': '#A67F58',
    '--cta-hover': '#8F6B47',
    '--bloom-outer': '#F3E5D7',
    '--bloom-mid': '#D8B799',
    '--bloom-core': '#B58B66',
  },
};

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
  theme: 'blushRose',
  documentTitle: 'Hemant & Kritika | Wedding Invitation',
  art: {
    floralTopLeft: '',
    floralRight: '',
    floralBottom: '',
    heroBackground: '',
    venuePhoto: '',
    ringBox: '',
    qrCodeOverride: '',
  },
  poster: {
    hangingTagText: 'TWO FAMILIES ONE BEAUTIFUL JOURNEY',
    topRightQuote: 'SAME ROOTS BRIGHTER TOMORROWS',
    blessingHeadline: 'WITH THE BLESSINGS OF ALMIGHTY',
    parentsInviteIntro:
      'Mr. Naresh Aggarwal & Mrs. Poonam Aggarwal cordially invite you to the Wedding Ceremony of their beloved son',
    namesConnector: 'with',
    celebrationMessage:
      'Join us as we celebrate a new chapter filled with love, laughter and togetherness',
    infoDayLabel: 'THURSDAY',
    infoDateLabel: '26 NOVEMBER 2026',
    infoTimeLabel: '3:00 PM ONWARDS',
    infoVenueShort: 'MAYUR VIHAR, NEW DELHI',
    graciousPresenceLine:
      'Your gracious presence will make this occasion more special for us.',
    scanLocationLabel: 'Scan for Location',
    posterFooterPillars: 'FAMILY | LOVE | TOGETHER | FOREVER',
  },
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
    promptHeadline: 'YOU ARE CORDIALLY INVITED',
    sealPrompt: 'TAP THE SEAL TO OPEN',
  },
  wedding: {
    date: 'November 26, 2026',
    isoDate: '2026-11-26T15:00:00',
    venue:
      'Shri Dharmik Ram Leela Mandal, Inside Shri Kaleshwar Nath Shiv Mandir, Mayur Vihar, Patparganj, New Delhi – 110091',
    venueMapLink: 'https://maps.app.goo.gl/EWvdgepEFwvTTZma9',
    timezone: 'IST',
    musicUrl: '/song.mp3',
    musicVolume: 0.5,
  },
  hosts: [
    {
      name: 'Mr. Naresh Kumar Aggarwal',
      relation: 'Father of the Groom',
      phone: '+91 98109 54538',
    },
    {
      name: 'Gourav Aggarwal',
      relation: 'Brother of the Groom',
      phone: '+91 92058 16849',
    },
  ],
  story: {
    signatureQuote:
      'Destiny brought them together. Families blessed their union. Love will make it everlasting.',
    storyText:
      'What began with a warm introduction between two families soon blossomed into effortless conversations over endless cups of chai, shared laughter, and a quiet certainty that we had found home in each other. Through the blessings of our parents and elders, our two paths now merge into one shared journey. As autumn turns into winter in New Delhi, we invite you to stand beside us, shower us with your blessings, and celebrate the beginning of our forever.',
  },
  stay: {
    accommodation: [
      'Crowne Plaza New Delhi Mayur Vihar — 10 mins from main venue (Special family block reserved)',
      'Holiday Inn Mayur Vihar Noida — 12 mins from main venue (Complimentary breakfast included)',
    ],
    accommodationContacts: [
      { name: 'Mr. Naresh Kumar Aggarwal', phone: '+91 98109 54538' },
      { name: 'Gourav Aggarwal', phone: '+91 92058 16849' },
    ],
    transportation: [
      'Airport & Railway Station pickup available on request from Indira Gandhi International Airport (T3/T2)',
      'Dedicated evening shuttle coaches running between Crowne Plaza and Shri Kaleshwar Nath Shiv Mandir',
    ],
    transportationContacts: [
      { name: 'Gourav Aggarwal', phone: '+91 92058 16849' },
    ],
  },
  labels: {
    heroSubtitle: 'TOGETHER WITH THEIR FAMILIES',
    heroInvitationLine: 'Request the honour of your presence',
    saveTheDateTag: 'SAVE THE DATE',
    storyTitle: 'OUR STORY',
    storySubline: '— THE BEGINNING OF FOREVER',
    eventsKicker: 'PROGRAMME',
    eventsTitle: 'The Celebrations',
    eventsSubtitle: 'A joyous gathering of rituals, music & sacred vows',
    venueTag: 'VENUE',
    marriageVenueLabel: 'MARRIAGE VENUE',
    getDirectionsLabel: 'Get Directions',
    hostsTitle: 'Your Wedding Hosts',
    hostsSubtitle:
      "Need assistance with directions or the venue? We're just a phone call away.",
    hostsCallLabel: 'CALL',
    stayTitle: 'Stay & Travel',
    staySubtitle: 'Hospitality & Seamless Arrivals',
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
    whatsappNumber: '919810954538',
  },
  eventsLayout: 'timeline',
  events: [
    {
      id: 'evt-1',
      name: 'Ghudchadi',
      date: 'November 26, 2026',
      time: '3:00 PM onwards',
      venueAddress:
        'H. No. 29, Block-D Urvashi Enclave, Near Vardhan Multispeciality Hospital, Ghaziabad, Uttar Pradesh – 201018',
      dressCode: 'Traditional',
      mapLink: 'https://maps.google.com/maps?q=28.7069186,77.444319&z=17&hl=en',
    },
    {
      id: 'evt-2',
      name: 'Departure of Barat',
      date: 'November 26, 2026',
      time: '6:00 PM onwards',
      venueAddress:
        'H. No. 29, Block-D Urvashi Enclave, Near Vardhan Multispeciality Hospital, Ghaziabad, Uttar Pradesh – 201018',
      dressCode: 'Traditional',
      mapLink: 'https://maps.google.com/maps?q=28.7069186,77.444319&z=17&hl=en',
    },
  ],
  gallery: [],
};

// ============================================================================
// 3. COMPACT INLINE ISO/IEC 18004 QR CODE ENCODER (BYTE MODE, ECC LEVEL L)
// ============================================================================

const QR_VERSION_SPECS: Record<
  number,
  { size: number; totalCodewords: number; ecCodewords: number; align: number[] }
> = {
  2: { size: 25, totalCodewords: 44, ecCodewords: 10, align: [6, 18] },
  3: { size: 29, totalCodewords: 70, ecCodewords: 15, align: [6, 22] },
  4: { size: 33, totalCodewords: 100, ecCodewords: 20, align: [6, 26] },
  5: { size: 37, totalCodewords: 134, ecCodewords: 26, align: [6, 30] },
  6: { size: 41, totalCodewords: 172, ecCodewords: 36, align: [6, 34] },
};

function createQrMatrix(text: string): boolean[][] {
  const utf8 = Array.from(new TextEncoder().encode(text));
  let ver = 4;
  for (const v of [2, 3, 4, 5, 6]) {
    const dataCap = QR_VERSION_SPECS[v].totalCodewords - QR_VERSION_SPECS[v].ecCodewords;
    if (utf8.length + 2 <= dataCap) {
      ver = v;
      break;
    }
  }
  const spec = QR_VERSION_SPECS[ver];
  const dataCap = spec.totalCodewords - spec.ecCodewords;
  const payload = utf8.slice(0, dataCap - 2);

  // Bitstream construction (Byte mode = 0100)
  const bits: number[] = [0, 1, 0, 0];
  for (let i = 7; i >= 0; i--) bits.push((payload.length >> i) & 1);
  for (const b of payload) {
    for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1);
  }
  for (let i = 0; i < 4 && bits.length < dataCap * 8; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    dataBytes.push(byte);
  }
  const pads = [0xec, 0x11];
  let padIdx = 0;
  while (dataBytes.length < dataCap) {
    dataBytes.push(pads[padIdx % 2]);
    padIdx++;
  }

  // GF(256) Reed-Solomon Error Correction
  const exp = new Uint8Array(512);
  const log = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  const gfMul = (a: number, b: number) =>
    a === 0 || b === 0 ? 0 : exp[log[a] + log[b]];

  let gen = [1];
  for (let i = 0; i < spec.ecCodewords; i++) {
    const next = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= gfMul(gen[j], exp[i]);
    }
    gen = next;
  }

  const msg = [...dataBytes, ...new Array(spec.ecCodewords).fill(0)];
  for (let i = 0; i < dataBytes.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  const allCodewords = [...dataBytes, ...msg.slice(dataBytes.length)];

  const n = spec.size;
  const grid: boolean[][] = Array.from({ length: n }, () =>
    new Array(n).fill(false)
  );
  const reserved: boolean[][] = Array.from({ length: n }, () =>
    new Array(n).fill(false)
  );

  const setMod = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < n && c >= 0 && c < n) {
      grid[r][c] = val;
      reserved[r][c] = true;
    }
  };

  // Finder patterns + separators
  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const isBorder =
          (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
          (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        setMod(row + r, col + c, isBorder);
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, n - 7);
  placeFinder(n - 7, 0);

  // Alignment patterns
  const [a0, a1] = spec.align;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      setMod(
        a1 + r,
        a1 + c,
        Math.max(Math.abs(r), Math.abs(c)) !== 1
      );
    }
  }
  if (ver >= 2) {
    // Timing lines
    for (let i = 8; i < n - 8; i++) {
      if (!reserved[6][i]) setMod(6, i, i % 2 === 0);
      if (!reserved[i][6]) setMod(i, 6, i % 2 === 0);
    }
  }

  // Dark module & reserve format areas
  setMod(4 * ver + 9, 8, true);
  for (let i = 0; i < 9; i++) {
    if (!reserved[8][i]) reserved[8][i] = true;
    if (!reserved[i][8]) reserved[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    if (!reserved[8][n - 1 - i]) reserved[8][n - 1 - i] = true;
    if (!reserved[n - 1 - i][8]) reserved[n - 1 - i][8] = true;
  }

  // Zigzag placement with Mask 0 ((r + c) % 2 === 0)
  const fullBits: number[] = [];
  for (const b of allCodewords) {
    for (let i = 7; i >= 0; i--) fullBits.push((b >> i) & 1);
  }

  let bitPtr = 0;
  let upward = true;
  for (let right = n - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < n; vert++) {
      const r = upward ? n - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!reserved[r][c]) {
          const bit = bitPtr < fullBits.length ? fullBits[bitPtr++] === 1 : false;
          const masked = (r + c) % 2 === 0 ? !bit : bit;
          grid[r][c] = masked;
        }
      }
    }
    upward = !upward;
  }

  // Format bits for ECC Level L (01) + Mask 0 (000) -> 0x77c4
  const fmt = 0x77c4;
  const fBits: boolean[] = [];
  for (let i = 0; i < 15; i++) fBits.push(((fmt >> i) & 1) === 1);

  for (let i = 0; i <= 5; i++) grid[8][i] = fBits[i];
  grid[8][7] = fBits[6];
  grid[8][8] = fBits[7];
  grid[7][8] = fBits[8];
  for (let i = 9; i < 15; i++) grid[14 - i][8] = fBits[i];

  for (let i = 0; i < 8; i++) grid[8][n - 1 - i] = fBits[i];
  for (let i = 8; i < 15; i++) grid[n - 15 + i][8] = fBits[i];

  return grid;
}

const InlineQrCodeSvg: React.FC<{
  url: string;
  overrideImage?: string;
  className?: string;
}> = ({ url, overrideImage, className = 'w-20 h-20' }) => {
  const matrix = useMemo(() => createQrMatrix(url || 'https://maps.google.com'), [url]);

  if (overrideImage) {
    return (
      <img
        src={overrideImage}
        alt="Venue Location QR Code"
        className={`${className} object-contain rounded-[4px]`}
      />
    );
  }

  const size = matrix.length;
  return (
    <svg
      viewBox={`0 0 ${size + 4} ${size + 4}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Scan QR Code for Google Maps Venue Location"
    >
      <rect width={size + 4} height={size + 4} fill="#FFFDFB" rx="1.5" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c + 2}
              y={r + 2}
              width={1}
              height={1}
              fill="var(--text-main)"
            />
          ) : null
        )
      )}
    </svg>
  );
};

// ============================================================================
// 4. PROCEDURAL BOTANICAL & FLORAL SVG COMPONENTS (<Flower/>, <Leaf/>, <FloralCluster/>)
// ============================================================================

function seededNoise(seed: number): number {
  const x = Math.sin(seed * 97.13 + 19.7) * 10000;
  return x - Math.floor(x);
}

const Leaf: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  tone?: 'sage' | 'olive' | 'blush';
}> = ({ x, y, scale = 1, rotate = 0, tone = 'sage' }) => {
  const fillMap = {
    sage: 'var(--leaf-green)',
    olive: '#687750',
    blush: 'var(--accent-primary)',
  };
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0 0 C-9 -12, -8 -28, 0 -38 C8 -28, 9 -12, 0 0 Z"
        fill={fillMap[tone]}
        fillOpacity="0.82"
      />
      <path
        d="M0 -2 L0 -34 M0 -12 L-4 -17 M0 -18 L4 -23 M0 -24 L-3.5 -28"
        stroke="#FFFDF9"
        strokeWidth="0.65"
        strokeOpacity="0.55"
        strokeLinecap="round"
      />
    </g>
  );
};

const Flower: React.FC<{
  x: number;
  y: number;
  size?: number;
  variant?: 'peony' | 'dahlia' | 'ivoryRose' | 'bud';
  seed?: number;
}> = ({ x, y, size = 28, variant = 'peony', seed = 1 }) => {
  const uid = `fl-${variant}-${seed}-${Math.round(x)}-${Math.round(y)}`;
  const rotOffset = Math.round(seededNoise(seed) * 35);

  if (variant === 'bud') {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotOffset})`}>
        <path
          d="M-3 4 C-4 -3, 0 -8, 0 -8 C0 -8, 4 -3, 3 4 Z"
          fill="var(--bloom-mid)"
        />
        <path
          d="M-4 3 Q0 7 4 3"
          stroke="var(--leaf-green)"
          strokeWidth="1.2"
          fill="none"
        />
      </g>
    );
  }

  const outerCount = variant === 'dahlia' ? 12 : 8;
  const midCount = variant === 'dahlia' ? 10 : 7;
  const innerCount = 5;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotOffset})`}>
      <defs>
        <radialGradient id={`${uid}-outer`} cx="50%" cy="65%" r="65%">
          <stop
            offset="0%"
            stopColor={variant === 'ivoryRose' ? '#F3D2C8' : 'var(--bloom-core)'}
          />
          <stop
            offset="65%"
            stopColor={variant === 'ivoryRose' ? '#FCEEE9' : 'var(--bloom-outer)'}
          />
          <stop offset="100%" stopColor="#FFFDFB" />
        </radialGradient>
        <radialGradient id={`${uid}-mid`} cx="50%" cy="60%" r="60%">
          <stop
            offset="0%"
            stopColor={variant === 'ivoryRose' ? '#DFB29F' : 'var(--bloom-core)'}
          />
          <stop
            offset="100%"
            stopColor={variant === 'ivoryRose' ? '#FFF8F4' : 'var(--bloom-mid)'}
          />
        </radialGradient>
      </defs>

      {/* Drop shadow for bloom depth */}
      <circle
        cx="1"
        cy="2"
        r={size * 0.72}
        fill="#6B3340"
        fillOpacity="0.09"
      />

      {/* Outer Layered Petals */}
      {Array.from({ length: outerCount }).map((_, i) => {
        const deg = (i * 360) / outerCount;
        return (
          <ellipse
            key={`o-${i}`}
            cx="0"
            cy={-size * 0.36}
            rx={size * (variant === 'dahlia' ? 0.22 : 0.32)}
            ry={size * 0.48}
            fill={`url(#${uid}-outer)`}
            stroke="var(--bloom-mid)"
            strokeWidth="0.3"
            strokeOpacity="0.4"
            transform={`rotate(${deg})`}
          />
        );
      })}

      {/* Middle Layered Petals */}
      {Array.from({ length: midCount }).map((_, i) => {
        const deg = (i * 360) / midCount + 22;
        return (
          <ellipse
            key={`m-${i}`}
            cx="0"
            cy={-size * 0.25}
            rx={size * 0.23}
            ry={size * 0.34}
            fill={`url(#${uid}-mid)`}
            transform={`rotate(${deg})`}
          />
        );
      })}

      {/* Inner Cupped Petals */}
      {Array.from({ length: innerCount }).map((_, i) => {
        const deg = (i * 360) / innerCount + 11;
        return (
          <ellipse
            key={`i-${i}`}
            cx="0"
            cy={-size * 0.14}
            rx={size * 0.16}
            ry={size * 0.2}
            fill="var(--bloom-core)"
            fillOpacity={variant === 'ivoryRose' ? '0.45' : '0.75'}
            transform={`rotate(${deg})`}
          />
        );
      })}

      {/* Golden Stamen Center */}
      <circle cx="0" cy="0" r={size * 0.11} fill="var(--gold-line)" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 6;
        return (
          <circle
            key={`s-${i}`}
            cx={Math.cos(a) * size * 0.14}
            cy={Math.sin(a) * size * 0.14}
            r="1.1"
            fill="#FFFDF9"
          />
        );
      })}
    </g>
  );
};

const FloralCluster: React.FC<{
  placement: 'topLeft' | 'rightVine' | 'bottomLeft' | 'bottomRight' | 'divider';
  customImage?: string;
  className?: string;
}> = ({ placement, customImage, className = '' }) => {
  if (customImage) {
    return (
      <img
        src={customImage}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none select-none object-contain ${className}`}
      />
    );
  }

  if (placement === 'topLeft') {
    return (
      <svg
        viewBox="0 0 240 230"
        className={`pointer-events-none select-none overflow-visible ${className}`}
        aria-hidden="true"
      >
        {/* Cascading Vine & Leaves */}
        <path
          d="M10 190 Q35 110 110 45 Q160 18 215 15"
          stroke="var(--leaf-green)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.65"
        />
        <Leaf x={175} y={24} rotate={68} scale={0.85} tone="sage" />
        <Leaf x={140} y={38} rotate={45} scale={0.95} tone="olive" />
        <Leaf x={34} y={145} rotate={145} scale={0.95} tone="sage" />
        <Leaf x={24} y={178} rotate={160} scale={0.8} tone="olive" />
        <Leaf x={92} y={85} rotate={120} scale={1.05} tone="sage" />
        <Leaf x={115} y={28} rotate={25} scale={0.85} tone="blush" />

        {/* Baby's Breath Sprigs */}
        {[
          [192, 18],
          [202, 24],
          [184, 28],
          [18, 195],
          [28, 204],
          [12, 208],
          [128, 62],
          [136, 56],
        ].map(([bx, by], idx) => (
          <circle
            key={idx}
            cx={bx}
            cy={by}
            r="2.2"
            fill="#FFFDFB"
            stroke="var(--gold-line)"
            strokeWidth="0.6"
          />
        ))}

        {/* Main Peony, Dahlia & Ivory Rose Blooms */}
        <Flower x={98} y={42} size={36} variant="ivoryRose" seed={11} />
        <Flower x={44} y={56} size={44} variant="peony" seed={22} />
        <Flower x={42} y={114} size={38} variant="dahlia" seed={33} />
        <Flower x={78} y={82} size={28} variant="ivoryRose" seed={44} />
        <Flower x={148} y={24} size={18} variant="bud" seed={55} />
        <Flower x={22} y={158} size={20} variant="bud" seed={66} />
      </svg>
    );
  }

  if (placement === 'rightVine') {
    return (
      <svg
        viewBox="0 0 130 340"
        className={`pointer-events-none select-none overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M95 10 Q70 95 92 175 Q112 245 82 325"
          stroke="var(--leaf-green)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.65"
        />
        <Leaf x={88} y={55} rotate={-42} scale={0.85} tone="sage" />
        <Leaf x={78} y={130} rotate={-125} scale={0.95} tone="olive" />
        <Leaf x={96} y={215} rotate={-50} scale={0.9} tone="sage" />
        <Leaf x={85} y={275} rotate={-140} scale={0.8} tone="blush" />

        {/* Baby's breath dots */}
        {[
          [66, 85],
          [60, 94],
          [72, 235],
          [64, 245],
        ].map(([bx, by], idx) => (
          <circle
            key={idx}
            cx={bx}
            cy={by}
            r="2"
            fill="#FFFDFB"
            stroke="var(--gold-line)"
            strokeWidth="0.6"
          />
        ))}

        <Flower x={95} y={82} size={32} variant="ivoryRose" seed={71} />
        <Flower x={92} y={138} size={38} variant="peony" seed={72} />
        <Flower x={98} y={190} size={30} variant="dahlia" seed={73} />
        <Flower x={88} y={38} size={16} variant="bud" seed={74} />
        <Flower x={86} y={258} size={18} variant="bud" seed={75} />
      </svg>
    );
  }

  if (placement === 'bottomLeft' || placement === 'bottomRight') {
    const flip = placement === 'bottomRight' ? 'scale(-1, 1)' : undefined;
    return (
      <svg
        viewBox="0 0 180 180"
        className={`pointer-events-none select-none overflow-visible ${className}`}
        aria-hidden="true"
      >
        <g
          transform={
            flip ? 'translate(180, 0) scale(-1, 1)' : undefined
          }
        >
          <Leaf x={32} y={70} rotate={25} scale={0.9} tone="sage" />
          <Leaf x={78} y={142} rotate={75} scale={0.95} tone="olive" />
          <Leaf x={118} y={156} rotate={82} scale={0.8} tone="sage" />
          <Flower x={36} y={108} size={34} variant="ivoryRose" seed={81} />
          <Flower x={58} y={142} size={40} variant="peony" seed={82} />
          <Flower x={98} y={152} size={28} variant="dahlia" seed={83} />
          <Flower x={24} y={64} size={16} variant="bud" seed={84} />
        </g>
      </svg>
    );
  }

  // Ornamental Section Floral Vine Divider
  return (
    <svg
      viewBox="0 0 260 42"
      className={`w-52 h-8 mx-auto pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M18 21 Q75 9 130 21 Q185 33 242 21"
        stroke="var(--gold-line)"
        strokeWidth="1"
        fill="none"
      />
      <Leaf x={96} y={21} rotate={-65} scale={0.55} tone="sage" />
      <Leaf x={164} y={21} rotate={65} scale={0.55} tone="sage" />
      <Leaf x={68} y={18} rotate={-80} scale={0.42} tone="olive" />
      <Leaf x={192} y={24} rotate={80} scale={0.42} tone="olive" />
      <Flower x={130} y={21} size={16} variant="peony" seed={99} />
      <Flower x={106} y={19} size={11} variant="ivoryRose" seed={98} />
      <Flower x={154} y={23} size={11} variant="ivoryRose" seed={97} />
      <circle cx="32" cy="21" r="1.8" fill="var(--gold-line)" />
      <circle cx="228" cy="21" r="1.8" fill="var(--gold-line)" />
    </svg>
  );
};

// ============================================================================
// 5. SACRED EMBLEMS, LOTUS ORNAMENT, PALACE VENUE BAND & RING BOX SVGs
// ============================================================================

const BlessingSvg: React.FC<{ type: BlessingIconType }> = ({ type }) => {
  if (type === 'none') return null;

  switch (type) {
    case 'hinduism':
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 text-[var(--name-color)] mx-auto mb-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Ganesha emblem"
        >
          <path d="M26 16 L32 7 L38 16" />
          <path d="M28 13 L32 10 L36 13" />
          <circle cx="32" cy="5" r="1.2" fill="currentColor" />
          <path d="M28 20 Q32 19 36 20" />
          <path d="M29 22.5 Q32 21.5 35 22.5" />
          <circle cx="32" cy="25" r="1.1" fill="currentColor" />
          <path d="M26 18 C17 16, 15 27, 23 31 C25 32, 26 30, 27 28" />
          <path d="M38 18 C47 16, 49 27, 41 31 C39 32, 38 30, 37 28" />
          <path d="M29 26 C28 34, 29 42, 35 42 C39 42, 40 38, 37 36 C35.5 35, 34 36.5, 35 38" />
          <path d="M27 33 L24 35" />
          <path d="M22 44 C26 50, 38 50, 42 44" />
          <path d="M18 52 Q32 56 46 52" />
        </svg>
      );

    case 'sikhism':
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 text-[var(--name-color)] mx-auto mb-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Sikh emblem"
        >
          <line x1="32" y1="8" x2="32" y2="54" />
          <path d="M29 14 L32 8 L35 14" />
          <circle cx="32" cy="30" r="10" />
          <path d="M20 16 C12 24, 12 38, 22 48" />
          <path d="M44 16 C52 24, 52 38, 42 48" />
        </svg>
      );

    case 'islam':
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 text-[var(--name-color)] mx-auto mb-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Crescent emblem"
        >
          <path d="M38 16 A16 16 0 1 0 48 42 A13 13 0 1 1 38 16 Z" />
          <path d="M42 22 L43.5 26 L47.5 27.5 L43.5 29 L42 33 L40.5 29 L36.5 27.5 L40.5 26 Z" />
        </svg>
      );

    case 'christianity':
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 text-[var(--name-color)] mx-auto mb-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.35"
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
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 text-[var(--name-color)] mx-auto mb-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
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
      return (
        <svg
          viewBox="0 0 64 64"
          className="w-10 h-10 text-[var(--name-color)] mx-auto mb-1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Sacred Jain Lotus emblem"
        >
          <path d="M32 14 C27 24, 25 34, 32 42 C39 34, 37 24, 32 14 Z" />
          <path d="M32 42 C22 38, 16 28, 22 20 C26 24, 28 32, 32 42 Z" />
          <path d="M32 42 C42 38, 48 28, 42 20 C38 24, 36 32, 32 42 Z" />
          <path d="M18 46 Q32 52 46 46" />
        </svg>
      );

    default:
      return null;
  }
};

/**
 * Lotus Ornament Divider inside Hero Poster
 */
const LotusDividerSvg: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <div
    className={`flex items-center justify-center my-3 select-none ${className}`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 220 26" className="w-44 h-5" fill="none">
      <line
        x1="12"
        y1="14"
        x2="82"
        y2="14"
        stroke="var(--gold-line)"
        strokeWidth="0.9"
      />
      <circle cx="84" cy="14" r="1.5" fill="var(--gold-line)" />
      {/* Center Lotus Petals */}
      <path
        d="M110 4 C105 10, 105 17, 110 21 C115 17, 115 10, 110 4 Z"
        fill="var(--bloom-mid)"
        stroke="var(--name-color)"
        strokeWidth="0.7"
      />
      <path
        d="M110 21 C102 19, 98 13, 102 8 C105 11, 107 16, 110 21 Z"
        fill="var(--bloom-outer)"
        stroke="var(--name-color)"
        strokeWidth="0.65"
      />
      <path
        d="M110 21 C118 19, 122 13, 118 8 C115 11, 113 16, 110 21 Z"
        fill="var(--bloom-outer)"
        stroke="var(--name-color)"
        strokeWidth="0.65"
      />
      <circle cx="136" cy="14" r="1.5" fill="var(--gold-line)" />
      <line
        x1="138"
        y1="14"
        x2="208"
        y2="14"
        stroke="var(--gold-line)"
        strokeWidth="0.9"
      />
    </svg>
  </div>
);

/**
 * Illustrated Palace Venue Band with Warm Windows, Trees, Pathway & 20 Drifting Golden Fireflies
 */
const PalaceVenueBand: React.FC<{ customPhoto?: string }> = ({
  customPhoto,
}) => {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 19) % 88)}%`,
        bottom: `${8 + ((i * 23) % 65)}%`,
        size: 3 + (i % 4) * 1.5,
        duration: 3.5 + (i % 5) * 0.9,
        delay: (i % 7) * 0.45,
      })),
    []
  );

  return (
    <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-b-[24px] select-none">
      {customPhoto ? (
        <img
          src={customPhoto}
          alt="Wedding Venue"
          className="w-full h-full object-cover"
        />
      ) : (
        <svg
          viewBox="0 0 460 210"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="palaceSky" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="var(--card-bg)" stopOpacity="1" />
              <stop offset="32%" stopColor="#F2D4C6" />
              <stop offset="70%" stopColor="#8E5B52" />
              <stop offset="100%" stopColor="#3B231E" />
            </linearGradient>
            <linearGradient id="pathwayGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#F8D794" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#D69F66" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#5C3A2E" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="windowWarmth" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#FFF7D6" />
              <stop offset="55%" stopColor="#F7C26B" />
              <stop offset="100%" stopColor="#C97A3E" />
            </radialGradient>
            <radialGradient id="lampHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF6CC" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#F5C469" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F5C469" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Twilight Sky */}
          <rect width="460" height="210" fill="url(#palaceSky)" />

          {/* Lush Evening Trees Flanking Left & Right */}
          <g fill="#3E4A35" opacity="0.85">
            <circle cx="38" cy="110" r="46" />
            <circle cx="78" cy="118" r="36" />
            <circle cx="15" cy="135" r="35" />
            <circle cx="422" cy="110" r="46" />
            <circle cx="382" cy="118" r="36" />
            <circle cx="445" cy="135" r="35" />
          </g>

          {/* Symmetrical Heritage Palace Architecture */}
          <g transform="translate(88, 46)">
            {/* Central Royal Dome & Chhatris */}
            <path
              d="M112 36 C112 12, 172 12, 172 36 Z"
              fill="#D9B38C"
              stroke="#FFF2D6"
              strokeWidth="0.8"
            />
            <line
              x1="142"
              y1="4"
              x2="142"
              y2="16"
              stroke="#FFF2D6"
              strokeWidth="1.2"
            />
            <path d="M52 44 C52 28, 84 28, 84 44 Z" fill="#C9A27B" />
            <path d="M200 44 C200 28, 232 28, 232 44 Z" fill="#C9A27B" />

            {/* Palace Facade */}
            <rect
              x="16"
              y="44"
              width="252"
              height="68"
              rx="2"
              fill="#E5C5A3"
              stroke="#C99E74"
              strokeWidth="1"
            />
            {/* Upper Cornice */}
            <line
              x1="12"
              y1="44"
              x2="272"
              y2="44"
              stroke="#FFF4DC"
              strokeWidth="1.8"
            />
            <line
              x1="16"
              y1="76"
              x2="268"
              y2="76"
              stroke="#C99E74"
              strokeWidth="0.9"
            />

            {/* Upper Level Glowing Arch Windows */}
            {Array.from({ length: 9 }).map((_, idx) => {
              const wx = 26 + idx * 27;
              return (
                <path
                  key={`uw-${idx}`}
                  d={`M${wx} 70 L${wx} 55 A6.5 6.5 0 0 1 ${wx + 13} 55 L${
                    wx + 13
                  } 70 Z`}
                  fill="url(#windowWarmth)"
                />
              );
            })}

            {/* Lower Level Grand Arches */}
            {Array.from({ length: 7 }).map((_, idx) => {
              const wx = 28 + idx * 34;
              const isCenter = idx === 3;
              return (
                <path
                  key={`lw-${idx}`}
                  d={`M${wx} 112 L${wx} ${isCenter ? 84 : 88} A${
                    isCenter ? 10 : 8
                  } ${isCenter ? 10 : 8} 0 0 1 ${
                    wx + (isCenter ? 20 : 16)
                  } ${isCenter ? 84 : 88} L${
                    wx + (isCenter ? 20 : 16)
                  } 112 Z`}
                  fill="url(#windowWarmth)"
                />
              );
            })}
          </g>

          {/* Lawn & Perspective Lit Pathway */}
          <rect x="0" y="156" width="460" height="54" fill="#2E3626" />
          <polygon
            points="198,156 262,156 348,210 112,210"
            fill="url(#pathwayGlow)"
          />
          {/* Pathway Hedges */}
          <path
            d="M196 156 L104 210"
            stroke="#596949"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M264 156 L356 210"
            stroke="#596949"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Glowing Pathway Lamp Posts */}
          {[
            { x: 176, y: 158, s: 0.75 },
            { x: 284, y: 158, s: 0.75 },
            { x: 146, y: 176, s: 0.9 },
            { x: 314, y: 176, s: 0.9 },
            { x: 115, y: 194, s: 1.05 },
            { x: 345, y: 194, s: 1.05 },
          ].map((lamp, idx) => (
            <g
              key={idx}
              transform={`translate(${lamp.x}, ${lamp.y}) scale(${lamp.s})`}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-18"
                stroke="#3A251C"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="-19" r="11" fill="url(#lampHalo)" />
              <circle cx="0" cy="-19" r="2.6" fill="#FFF9E2" />
            </g>
          ))}
        </svg>
      )}

      {/* Soft Top Fade Into Card Background */}
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, var(--card-bg) 0%, rgba(255,248,243,0) 100%)',
        }}
      />

      {/* Warm Evening Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(45,22,20,0.42) 100%)',
        }}
      />

      {/* 20 Floating Golden Bokeh / Firefly Lights */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {fireflies.map((f) => (
          <motion.span
            key={f.id}
            style={{
              left: f.left,
              bottom: f.bottom,
              width: f.size,
              height: f.size,
              background:
                'radial-gradient(circle, #FFF8D6 0%, #F5C469 60%, transparent 100%)',
              boxShadow: '0 0 8px 2px rgba(245, 196, 105, 0.55)',
            }}
            animate={{
              y: [0, -22, -40],
              opacity: [0, 0.9, 0],
              scale: [0.7, 1.25, 0.8],
            }}
            transition={{
              duration: f.duration,
              delay: f.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Velvet Ring Box on Gold Plate with Twinkling Diamond Sparkle (Bottom-Left of Hero)
 */
const RingBoxElement: React.FC<{ customImage?: string }> = ({
  customImage,
}) => {
  if (customImage) {
    return (
      <img
        src={customImage}
        alt="Wedding Rings"
        className="w-24 h-24 object-contain drop-shadow-md select-none pointer-events-none"
      />
    );
  }

  return (
    <div
      className="relative w-24 h-22 select-none pointer-events-none"
      aria-hidden="true"
    >
      <svg viewBox="0 0 110 92" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="goldPlateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6E2B3" />
            <stop offset="50%" stopColor="#D6AD60" />
            <stop offset="100%" stopColor="#9E7432" />
          </linearGradient>
          <linearGradient id="velvetBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9C3848" />
            <stop offset="100%" stopColor="#5E1924" />
          </linearGradient>
        </defs>

        {/* Ornate Gold Tray / Plate */}
        <ellipse
          cx="54"
          cy="72"
          rx="44"
          ry="12"
          fill="url(#goldPlateGrad)"
          stroke="#FFF1CC"
          strokeWidth="0.8"
        />
        <ellipse
          cx="54"
          cy="71"
          rx="36"
          ry="8.5"
          fill="none"
          stroke="#8B6226"
          strokeWidth="0.6"
        />

        {/* Open Velvet Ring Box Lid */}
        <path
          d="M28 46 C26 24, 68 24, 66 46 Z"
          fill="url(#velvetBoxGrad)"
          stroke="#C87A86"
          strokeWidth="0.7"
        />
        <ellipse cx="47" cy="46" rx="19" ry="5" fill="#F7E5DF" />

        {/* Velvet Ring Box Base */}
        <path
          d="M26 48 L68 48 L64 68 C64 72, 30 72, 30 68 Z"
          fill="url(#velvetBoxGrad)"
        />
        <ellipse
          cx="47"
          cy="48"
          rx="21"
          ry="5.5"
          fill="#F5D8D0"
          stroke="#D8B988"
          strokeWidth="0.8"
        />

        {/* Two Interlocking Gold & Solitaire Rings */}
        <circle
          cx="43"
          cy="44"
          r="6.5"
          fill="none"
          stroke="#E5C07B"
          strokeWidth="2.1"
        />
        <circle
          cx="52"
          cy="45"
          r="6"
          fill="none"
          stroke="#F4D799"
          strokeWidth="1.9"
        />
        {/* Diamond Solitaire */}
        <polygon
          points="43,33 46.5,36.5 43,39.5 39.5,36.5"
          fill="#FFFFFF"
          stroke="#D8B988"
          strokeWidth="0.5"
        />

        {/* Small Loose Rose Petals on Plate */}
        <ellipse
          cx="78"
          cy="68"
          rx="5"
          ry="3"
          fill="var(--bloom-core)"
          transform="rotate(-18 78 68)"
        />
        <ellipse
          cx="24"
          cy="71"
          rx="4.5"
          ry="2.6"
          fill="var(--bloom-mid)"
          transform="rotate(24 24 71)"
        />
      </svg>

      {/* Animated Twinkle Star on Solitaire Ring */}
      <motion.svg
        viewBox="0 0 24 24"
        className="w-5 h-5 absolute left-[30px] top-[18px] text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.95)]"
        fill="currentColor"
        animate={{
          scale: [0.6, 1.25, 0.6],
          opacity: [0.4, 1, 0.4],
          rotate: [0, 45, 90],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M12 0 Q12 12 24 12 Q12 12 12 24 Q12 12 0 12 Q12 12 12 0 Z" />
      </motion.svg>
    </div>
  );
};

// ============================================================================
// 6. AMBIENT FALLING ROSE PETALS + GOLD SPARKLES & BURST CONFETTI CANVAS
// ============================================================================

interface AmbientPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vRot: number;
  swayPhase: number;
  swaySpeed: number;
  isSparkle: boolean;
  color: string;
  opacity: number;
}

const AmbientPetalsCanvas: React.FC<{
  theme: ThemePresetKey;
  enabled: boolean;
}> = ({ theme, enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 640;
    const count = isMobile ? 18 : 24;
    const colors =
      theme === 'blushRose'
        ? ['#F5CCD4', '#E598A8', '#D87A8D', '#F8E3E7', '#D8B988']
        : ['#F3E5D7', '#DFC7AF', '#C9A57C', '#FAF2E8', '#B58B66'];

    const items: AmbientPetal[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: 0.32 + Math.random() * 0.48,
      size: i % 4 === 0 ? 3.5 + Math.random() * 2.5 : 6.5 + Math.random() * 5.5,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.015,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.012 + Math.random() * 0.015,
      isSparkle: i % 4 === 0,
      color: colors[i % colors.length],
      opacity: 0.35 + Math.random() * 0.38,
    }));

    let rafId = 0;
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of items) {
        p.swayPhase += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.38;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.y > window.innerHeight + 20) {
          p.y = -20;
          p.x = Math.random() * window.innerWidth;
        }
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.x < -20) p.x = window.innerWidth + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity * (0.75 + 0.25 * Math.sin(p.swayPhase * 2));
        ctx.fillStyle = p.color;

        if (p.isSparkle) {
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.closePath();
          ctx.fill();
        } else {
          // Soft organic rose petal silhouette
          const w = p.size;
          const h = p.size * 0.72;
          ctx.beginPath();
          ctx.moveTo(0, -h);
          ctx.bezierCurveTo(w, -h * 0.8, w * 0.9, h * 0.9, 0, h);
          ctx.bezierCurveTo(-w * 0.9, h * 0.9, -w, -h * 0.8, 0, -h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [theme, enabled, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      aria-hidden="true"
    />
  );
};

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

const ConfettiCanvas: React.FC<{
  burstTrigger: number;
  mode?: 'envelope' | 'rsvp';
  theme: ThemePresetKey;
}> = ({ burstTrigger, mode = 'envelope', theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!burstTrigger || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const palette =
      theme === 'blushRose'
        ? ['#B5586B', '#E598A8', '#D8B988', '#FFF8F3', '#C9A27E']
        : ['#B58B66', '#D9BFA0', '#F3E7D6', '#FFFFFF', '#C69F79'];

    const originX = window.innerWidth / 2;
    const originY =
      mode === 'envelope'
        ? Math.min(window.innerHeight * 0.45, 420)
        : window.innerHeight * 0.55;

    const count = mode === 'envelope' ? 125 : 75;
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
        i % 6 === 0
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
        color: palette[Math.floor(Math.random() * palette.length)],
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
  }, [burstTrigger, mode, theme, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      aria-hidden="true"
    />
  );
};

// ============================================================================
// 7. TIMEZONE & ICS CALENDAR HELPERS
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

function downloadIcsFile(invite: InviteConfig) {
  const startMs = getTargetTimestamp(
    invite.wedding.isoDate,
    invite.wedding.timezone
  );
  const endMs = startMs + 6 * 60 * 60 * 1000;

  const formatIcsDate = (ms: number) => {
    const d = new Date(ms);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const title = `${invite.couple.partner1Name} & ${invite.couple.partner2Name} — Wedding Celebration`;
  const description = `${invite.blessing.invocationText}\\n${invite.story.signatureQuote}\\nVenue: ${invite.wedding.venue}`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Luxury Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${Date.now()}@invitation.local`,
    `DTSTAMP:${formatIcsDate(Date.now())}`,
    `DTSTART:${formatIcsDate(startMs)}`,
    `DTEND:${formatIcsDate(endMs)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${invite.wedding.venue.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invite.couple.partner1Name.toLowerCase()}-${invite.couple.partner2Name.toLowerCase()}-wedding.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 8. ILLUSTRATED HERO POSTER COMPONENT (Matches Blush-Pink Floral Reference)
// ============================================================================

const IllustratedHeroPoster: React.FC<{
  invite: InviteConfig;
  isOpened: boolean;
  tilt: { x: number; y: number };
}> = ({ invite, isOpened, tilt }) => {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: posterRef,
    offset: ['start end', 'end start'],
  });

  const floralTopY = useTransform(scrollYProgress, [0, 1], [-8, 12]);
  const floralRightY = useTransform(scrollYProgress, [0, 1], [10, -14]);
  const floralBottomY = useTransform(scrollYProgress, [0, 1], [6, -8]);

  const mapQueryUrl = useMemo(
    () =>
      invite.wedding.venueMapLink ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        invite.wedding.venue
      )}`,
    [invite.wedding.venueMapLink, invite.wedding.venue]
  );

  // Split hanging tag lines neatly
  const tagWords = useMemo(
    () => invite.poster.hangingTagText.trim().split(/\s+/),
    [invite.poster.hangingTagText]
  );

  // Split top-right quote into 2 lines
  const topQuoteLines = useMemo(() => {
    const words = invite.poster.topRightQuote.trim().split(/\s+/);
    const half = Math.ceil(words.length / 2);
    return [words.slice(0, half).join(' '), words.slice(half).join(' ')];
  }, [invite.poster.topRightQuote]);

  return (
    <div
      ref={posterRef}
      className="relative w-full max-w-[460px] mx-auto rounded-[28px] bg-[var(--card-bg)] shadow-[0_26px_65px_rgba(107,51,64,0.16)] border border-[var(--border-hairline)] overflow-hidden transition-colors duration-500"
    >
      {/* Optional Uploaded Hero Background Texture/Illustration */}
      {invite.art.heroBackground ? (
        <img
          src={invite.art.heroBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
        />
      ) : (
        /* Subtle radial blush-cream watercolor wash inside card */
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 18% 12%, var(--bloom-outer) 0%, transparent 42%), radial-gradient(circle at 88% 38%, var(--bloom-outer) 0%, transparent 38%), linear-gradient(180deg, var(--card-bg) 0%, var(--card-inner) 65%, var(--card-bg) 100%)',
            opacity: 0.55,
          }}
        />
      )}

      {/* 1. THIN GOLD ARCH OUTLINE (Stroke-Dashoffset Draw Animation) */}
      <svg
        viewBox="0 0 460 980"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Outer Tall Rounded-Top Gold Arch */}
        <motion.path
          d="M 22 955 L 22 215 A 208 205 0 0 1 438 215 L 438 955 Z"
          fill="none"
          stroke="var(--gold-line)"
          strokeWidth="1.35"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={
            isOpened
              ? { pathLength: 1, opacity: 0.9 }
              : { pathLength: 0, opacity: 0.2 }
          }
          transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.15 }}
        />
        {/* Inner Delicate Parallel Arch Line */}
        <motion.path
          d="M 28 949 L 28 218 A 202 199 0 0 1 432 218 L 432 949 Z"
          fill="none"
          stroke="var(--gold-line)"
          strokeWidth="0.65"
          strokeOpacity="0.55"
          initial={{ pathLength: 0 }}
          animate={isOpened ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.35 }}
        />
      </svg>

      {/* 2. PROCEDURAL FLORAL CORNERS WITH SWAY & PARALLAX */}
      {/* Top-Left Large Floral Cluster */}
      <motion.div
        style={{
          y: floralTopY,
          x: tilt.x * 8,
        }}
        className="absolute -top-4 -left-4 w-48 sm:w-56 z-20 pointer-events-none"
      >
        <div className="floral-sway-slow origin-top-left">
          <FloralCluster
            placement="topLeft"
            customImage={invite.art.floralTopLeft}
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* Right-Side Vertical Floral Vine */}
      <motion.div
        style={{
          y: floralRightY,
          x: tilt.x * -6,
        }}
        className="absolute top-36 -right-5 w-28 sm:w-32 z-20 pointer-events-none"
      >
        <div className="floral-sway-medium origin-right">
          <FloralCluster
            placement="rightVine"
            customImage={invite.art.floralRight}
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* Bottom-Left Floral Cluster */}
      <motion.div
        style={{ y: floralBottomY }}
        className="absolute bottom-36 -left-5 w-36 sm:w-40 z-20 pointer-events-none"
      >
        <div className="floral-sway-medium origin-bottom-left">
          <FloralCluster
            placement="bottomLeft"
            customImage={invite.art.floralBottom}
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* Bottom-Right Floral Cluster */}
      <motion.div
        style={{ y: floralBottomY }}
        className="absolute bottom-36 -right-5 w-36 sm:w-40 z-20 pointer-events-none"
      >
        <div className="floral-sway-slow origin-bottom-right">
          <FloralCluster
            placement="bottomRight"
            customImage={invite.art.floralBottom}
            className="w-full h-auto"
          />
        </div>
      </motion.div>

      {/* 3. HANGING PENDULUM TAG ON THE LEFT (Scalloped Notch + Rose Tassel) */}
      <div
        className="absolute top-0 left-7 sm:left-9 z-30 pointer-events-none pendulum-tag"
        style={{ transformOrigin: 'top center' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 92 275"
          className="w-20 sm:w-22 h-auto drop-shadow-[0_10px_18px_rgba(107,51,64,0.15)]"
        >
          {/* Hanging Gold String from Top Edge */}
          <line
            x1="46"
            y1="0"
            x2="46"
            y2="78"
            stroke="var(--gold-line)"
            strokeWidth="1.4"
          />
          {/* Small Gold Ring Clasp */}
          <circle
            cx="46"
            cy="78"
            r="3.5"
            fill="var(--card-bg)"
            stroke="var(--gold-line)"
            strokeWidth="1.3"
          />

          {/* Cream Scalloped Tag Body */}
          <path
            d="M 18 86 Q 32 76 46 86 Q 60 76 74 86 L 78 192 Q 46 204 14 192 Z"
            fill="var(--card-bg)"
            stroke="var(--gold-line)"
            strokeWidth="1.2"
          />
          <path
            d="M 22 90 L 70 90 L 73 188 Q 46 198 19 188 Z"
            fill="none"
            stroke="var(--border-hairline)"
            strokeWidth="0.7"
          />

          {/* Tag Text Lines */}
          <foreignObject x="18" y="96" width="56" height="86">
            <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
              <p className="font-label text-[6.5px] leading-[1.45] tracking-[0.18em] uppercase text-[var(--text-main)] font-semibold">
                {tagWords.slice(0, 2).join(' ')}
                <br />
                {tagWords.slice(2, 4).join(' ')}
                <br />
                {tagWords.slice(4).join(' ')}
              </p>
              <span className="text-[var(--name-color)] text-[8px] mt-1">
                ♥
              </span>
            </div>
          </foreignObject>

          {/* Silk Rose Tassel Below Tag */}
          <line
            x1="46"
            y1="198"
            x2="46"
            y2="214"
            stroke="var(--gold-line)"
            strokeWidth="1.4"
          />
          {/* Gold Tassel Cap */}
          <rect
            x="40"
            y="214"
            width="12"
            height="6"
            rx="2"
            fill="var(--gold-line)"
          />
          {/* Fanning Rose Silk Threads */}
          <path
            d="M 41 220 L 34 258 L 58 258 L 51 220 Z"
            fill="var(--name-color)"
            fillOpacity="0.85"
          />
          <line
            x1="44"
            y1="220"
            x2="41"
            y2="258"
            stroke="#FFF8F3"
            strokeWidth="0.5"
            strokeOpacity="0.45"
          />
          <line
            x1="48"
            y1="220"
            x2="51"
            y2="258"
            stroke="#FFF8F3"
            strokeWidth="0.5"
            strokeOpacity="0.45"
          />
        </svg>
      </div>

      {/* 4. TOP RIGHT QUOTE WITH HEART DIVIDER */}
      <div className="relative z-20 pt-6 pr-6 sm:pr-8 flex justify-end">
        <div className="text-right max-w-[165px]">
          <p className="font-label text-[7.5px] sm:text-[8px] leading-[1.55] tracking-[0.26em] uppercase text-[var(--text-main)] font-medium">
            {topQuoteLines[0]}
            {topQuoteLines[1] ? (
              <>
                <br />
                {topQuoteLines[1]}
              </>
            ) : null}
          </p>
          <div
            className="flex items-center justify-end gap-1.5 mt-1"
            aria-hidden="true"
          >
            <span className="w-7 h-[0.8px] bg-[var(--gold-line)]" />
            <span className="text-[8px] text-[var(--name-color)]">♥</span>
            <span className="w-7 h-[0.8px] bg-[var(--gold-line)]" />
          </div>
        </div>
      </div>

      {/* 5. MAIN POSTER CONTENT STACK */}
      <div className="relative z-20 px-7 sm:px-11 pt-8 pb-4 text-center flex flex-col items-center">
        {/* Sacred Blessing Icon (Om / Ganesha SVG) */}
        <BlessingSvg type={invite.blessing.headerIcon} />

        {/* Optional Sanskrit/Hindi Invocation */}
        {invite.blessing.invocationText && (
          <p className="font-serif text-[11.5px] text-[var(--name-color)] tracking-wide mb-1">
            {invite.blessing.invocationText}
          </p>
        )}

        {/* "WITH THE BLESSINGS OF ALMIGHTY" */}
        <p className="font-serif text-[11px] sm:text-xs tracking-[0.22em] uppercase text-[var(--text-main)] font-semibold">
          {invite.poster.blessingHeadline}
        </p>

        {/* Parents Invitation Block */}
        <p
          className="font-serif text-xs sm:text-[13px] leading-[1.6] text-[var(--text-main)] max-w-[275px] mt-3"
          style={{ textWrap: 'balance' }}
        >
          {invite.poster.parentsInviteIntro}
        </p>

        {/* COUPLE NAMES IN SCRIPT WITH GOLD FOIL SHIMMER + HANDWRITING REVEAL */}
        <div className="my-4 w-full flex flex-col items-center">
          <motion.h1
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.3 }}
            animate={
              isOpened
                ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                : { clipPath: 'inset(0 100% 0 0)', opacity: 0.3 }
            }
            transition={{
              duration: 1.45,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-script text-5xl sm:text-[62px] leading-[1.12] gold-foil-shimmer py-1 px-3"
          >
            {invite.couple.partner1Name}
          </motion.h1>

          <p className="font-label text-[9.5px] text-[var(--text-muted)] tracking-wide -mt-0.5">
            {invite.couple.partner1Parents}
          </p>

          {/* Connector ("with" or "&") flanked by thin lines & dots */}
          <div
            className="flex items-center justify-center gap-2.5 my-2"
            aria-hidden="true"
          >
            <span className="w-8 h-[0.8px] bg-[var(--gold-line)]" />
            <span className="w-1 h-1 rounded-full bg-[var(--gold-line)]" />
            <span className="font-script text-2xl sm:text-[26px] text-[var(--name-color)] px-1">
              {invite.poster.namesConnector}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--gold-line)]" />
            <span className="w-8 h-[0.8px] bg-[var(--gold-line)]" />
          </div>

          <motion.h2
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0.3 }}
            animate={
              isOpened
                ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
                : { clipPath: 'inset(0 100% 0 0)', opacity: 0.3 }
            }
            transition={{
              duration: 1.45,
              delay: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-script text-5xl sm:text-[62px] leading-[1.12] gold-foil-shimmer py-1 px-3"
          >
            {invite.couple.partner2Name}
          </motion.h2>

          <p className="font-label text-[9.5px] text-[var(--text-muted)] tracking-wide -mt-0.5">
            {invite.couple.partner2Parents}
          </p>
        </div>

        {/* Short Celebration Message */}
        <p
          className="font-serif text-xs sm:text-[13px] leading-relaxed text-[var(--text-main)] max-w-[290px] mt-1"
          style={{ textWrap: 'balance' }}
        >
          {invite.poster.celebrationMessage}
        </p>

        {/* 6. 3-COLUMN INFO ROW WITH CIRCULAR BLUSH BADGE ICONS & VERTICAL HAIRLINE DIVIDERS */}
        <div className="w-full grid grid-cols-3 divide-x divide-[var(--gold-line)]/60 mt-6 pt-2 pb-1">
          {/* Column 1: Calendar / Date */}
          <div className="px-2 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 16,
                delay: 0.15,
              }}
              className="w-9 h-9 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-line)]/50 flex items-center justify-center text-[var(--name-color)] mb-2 shadow-xs"
            >
              <Calendar className="w-4 h-4" />
            </motion.div>
            <p className="font-label text-[8px] sm:text-[8.5px] tracking-[0.16em] uppercase font-semibold text-[var(--text-main)] leading-tight">
              {invite.poster.infoDayLabel}
            </p>
            <p className="font-label text-[8px] sm:text-[8.5px] tracking-[0.14em] uppercase font-bold text-[var(--name-color)] mt-0.5 leading-tight">
              {invite.poster.infoDateLabel}
            </p>
          </div>

          {/* Column 2: Clock / Time */}
          <div className="px-2 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 16,
                delay: 0.28,
              }}
              className="w-9 h-9 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-line)]/50 flex items-center justify-center text-[var(--name-color)] mb-2 shadow-xs"
            >
              <Clock className="w-4 h-4" />
            </motion.div>
            <p className="font-label text-[8px] sm:text-[8.5px] tracking-[0.14em] uppercase font-bold text-[var(--text-main)] leading-tight">
              {invite.poster.infoTimeLabel}
            </p>
          </div>

          {/* Column 3: MapPin / Venue */}
          <div className="px-2 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 16,
                delay: 0.4,
              }}
              className="w-9 h-9 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-line)]/50 flex items-center justify-center text-[var(--name-color)] mb-2 shadow-xs"
            >
              <MapPin className="w-4 h-4" />
            </motion.div>
            <p className="font-label text-[7.5px] sm:text-[8px] tracking-[0.12em] uppercase font-bold text-[var(--text-main)] leading-tight line-clamp-3">
              {invite.poster.infoVenueShort}
            </p>
          </div>
        </div>

        {/* 7. LOTUS ORNAMENT DIVIDER + ITALIC SCRIPT LINE */}
        <LotusDividerSvg className="mt-4" />

        <p className="font-script text-xl sm:text-2xl text-[var(--text-main)] leading-snug max-w-[310px] mx-auto">
          {invite.poster.graciousPresenceLine}
        </p>
      </div>

      {/* 8. BOTTOM VENUE ILLUSTRATION BAND + RING BOX (LEFT) + QR CODE CARD (RIGHT) */}
      <div className="relative mt-2">
        <PalaceVenueBand customPhoto={invite.art.venuePhoto} />

        {/* Ring Box Element at Bottom-Left */}
        <div className="absolute left-4 sm:left-6 bottom-8 z-30">
          <RingBoxElement customImage={invite.art.ringBox} />
        </div>

        {/* "Scan for Location" Torn-Paper / Brush-Stroke Card at Bottom-Right */}
        <div className="absolute right-4 sm:right-6 bottom-8 z-30 flex flex-col items-center">
          <span className="font-script text-lg sm:text-xl text-[#FFFDF9] drop-shadow-[0_2px_4px_rgba(45,20,20,0.85)] mb-1">
            {invite.poster.scanLocationLabel}
          </span>
          <a
            href={mapQueryUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click or Scan QR Code to open Venue in Google Maps"
            className="relative p-2.5 bg-[var(--badge-bg)] border border-[var(--gold-line)] shadow-[0_10px_25px_rgba(45,20,20,0.35)] transition-transform hover:scale-105 cursor-pointer"
            style={{
              clipPath:
                'polygon(3% 0%, 97% 2%, 100% 95%, 94% 100%, 4% 98%, 0% 6%)',
            }}
          >
            <InlineQrCodeSvg
              url={mapQueryUrl}
              overrideImage={invite.art.qrCodeOverride}
              className="w-18 h-18 sm:w-20 sm:h-20"
            />
          </a>
        </div>

        {/* 9. HERO POSTER FOOTER PILLARS: "FAMILY | LOVE | TOGETHER | FOREVER" */}
        <div
          className="relative z-30 py-2.5 px-4 text-center bg-[var(--card-bg)] border-t border-[var(--gold-line)]/40 flex flex-col items-center"
        >
          <p className="font-label text-[8px] sm:text-[8.5px] tracking-[0.28em] uppercase text-[var(--text-main)] font-semibold">
            {invite.poster.posterFooterPillars}
          </p>
          <span
            className="text-[10px] text-[var(--name-color)] mt-0.5 leading-none"
            aria-hidden="true"
          >
            ♥
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 9. COUPLE ARCH PORTRAITS, COUNTDOWN TILES & ENVELOPE REVEAL INTRO
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
    <div className="flex flex-col items-center group relative">
      {/* Delicate Mini Floral Sprig on Arch Shoulder */}
      <div
        className={`absolute -top-2 ${
          variant === 'groom' ? '-left-2' : '-right-2'
        } z-30 pointer-events-none`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 48 48" className="w-11 h-11 overflow-visible">
          <Leaf x={24} y={24} rotate={variant === 'groom' ? -45 : 45} scale={0.55} tone="sage" />
          <Flower
            x={24}
            y={22}
            size={14}
            variant="peony"
            seed={variant === 'groom' ? 14 : 28}
          />
        </svg>
      </div>

      {/* Arch Frame Container */}
      <div className="relative pt-2 pb-7 px-2">
        <div
          className="w-36 h-44 sm:w-40 sm:h-48 rounded-t-full p-1.5 border border-[var(--gold-line)] bg-[var(--card-bg)] relative shadow-[0_16px_40px_rgba(107,51,64,0.12)]"
          style={{
            borderTopLeftRadius: '9999px',
            borderTopRightRadius: '9999px',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
          }}
        >
          {/* Small Triangle Pin on top center of the arch */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 text-[var(--gold-line)]"
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
            className="w-full h-full overflow-hidden relative block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--name-color)]"
            style={{
              borderTopLeftRadius: '9999px',
              borderTopRightRadius: '9999px',
              borderBottomLeftRadius: '4px',
              borderBottomRightRadius: '4px',
            }}
          >
            {primaryPhoto ? (
              <img
                src={primaryPhoto}
                alt={name}
                className="w-full h-full object-cover ken-burns-slow"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center relative ken-burns-slow"
                style={{
                  background:
                    'radial-gradient(circle at 50% 35%, var(--card-bg) 0%, var(--badge-bg) 65%, var(--bloom-outer) 100%)',
                }}
              >
                <svg
                  viewBox="0 0 100 120"
                  className="w-full h-full absolute inset-0 text-[var(--text-main)]/10"
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
                <span className="font-script text-5xl text-[var(--name-color)] select-none relative z-10">
                  {initial}
                </span>
                <span className="font-label text-[8px] tracking-[0.25em] uppercase text-[var(--text-muted)] mt-1 relative z-10 opacity-85 group-hover:opacity-100">
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
      <h3 className="font-serif text-lg sm:text-xl text-[var(--text-main)] tracking-wide mt-0.5">
        {name}
      </h3>
      <p className="font-label text-[9px] tracking-[0.3em] uppercase text-[var(--text-muted)] mt-1">
        {role}
      </p>
    </div>
  );
};

const CountdownCircle: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => {
  const formatted = String(Math.max(0, value)).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-[var(--gold-line)] flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),0_8px_20px_rgba(107,51,64,0.08)]"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, var(--card-inner) 0%, var(--card-bg) 65%, var(--badge-bg) 100%)',
        }}
      >
        <div className="absolute inset-[3px] rounded-full border border-[var(--gold-line)]/35 pointer-events-none" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-xl sm:text-2xl text-[var(--name-color)] tabular-nums font-medium"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-label text-[8.5px] tracking-[0.28em] uppercase text-[var(--text-muted)] mt-2.5">
        {label}
      </span>
    </div>
  );
};

// ============================================================================
// SCREEN 1: FULL-SCREEN INTERACTIVE ENVELOPE REVEAL
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

    setStage('sealPress');
    const t1 = window.setTimeout(() => setStage('flapOpen'), 450);
    const t2 = window.setTimeout(() => {
      setStage('cardRise');
      onTriggerConfetti();
    }, 1150);
    const t3 = window.setTimeout(() => setStage('exit'), 2850);
    const t4 = window.setTimeout(() => onComplete(), 3500);

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

  const monogramParts = useMemo(() => {
    const raw = invite.reveal.topLine.trim();
    if (raw.includes('&')) {
      const [left, right] = raw.split('&').map((s) => s.trim());
      return { left: left || 'H', right: right || 'K', hasAmp: true };
    }
    return { left: raw, right: '', hasAmp: false };
  }, [invite.reveal.topLine]);

  const isBlush = invite.theme === 'blushRose';

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center px-4 select-none overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%)',
      }}
      initial={{ opacity: 1 }}
      animate={
        stage === 'exit'
          ? { opacity: 0, scale: 1.07 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Twinkling Sparkle Stars around envelope when card rises */}
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
                fill="var(--gold-line)"
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
        {/* Sacred Ganesha Emblem above the Envelope */}
        <BlessingSvg type={invite.blessing.headerIcon} />

        <div
          className="relative w-[328px] h-[226px] sm:w-[410px] sm:h-[282px]"
          style={{ perspective: '1200px' }}
        >
          {/* Ambient Drop Shadow Beneath Envelope */}
          <div
            className="absolute -bottom-7 left-6 right-6 h-12 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(107,51,64,0.22) 0%, rgba(107,51,64,0.08) 55%, rgba(107,51,64,0) 80%)',
              filter: 'blur(10px)',
            }}
          />

          {/* 1. Envelope Back Interior */}
          <div
            className="absolute inset-0 rounded-[4px] border border-[var(--gold-line)]/50"
            style={{
              background: isBlush
                ? 'linear-gradient(180deg, #E8C5BE 0%, #DAB0A7 55%, #C99A90 100%)'
                : 'linear-gradient(180deg, #D5C3AC 0%, #C8B398 55%, #BDA589 100%)',
              boxShadow: '0 22px 50px rgba(74, 47, 34, 0.16)',
            }}
          />

          {/* 2. Inside Mini Invitation Card */}
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
            className="absolute left-[7%] right-[7%] top-[8%] h-[82%] z-20 rounded-[4px] bg-[var(--card-bg)] p-2.5 sm:p-3.5 shadow-[0_10px_28px_rgba(74,47,34,0.14)] flex flex-col items-center justify-center text-center"
          >
            <div className="w-full h-full border border-[var(--gold-line)] p-1 flex flex-col items-center justify-center relative">
              <div className="w-full h-full border border-[var(--border-hairline)] flex flex-col items-center justify-center px-3 py-2">
                <p className="font-serif italic text-2xl sm:text-3xl text-[var(--name-color)] tracking-wider">
                  {monogramParts.hasAmp ? (
                    <>
                      <span>{monogramParts.left}</span>
                      <span className="text-base sm:text-lg mx-1.5 text-[var(--accent-primary)]">
                        &amp;
                      </span>
                      <span>{monogramParts.right}</span>
                    </>
                  ) : (
                    invite.reveal.innerLine
                  )}
                </p>
                <p className="font-label text-[8.5px] sm:text-[9.5px] tracking-[0.34em] uppercase text-[var(--text-main)] mt-2">
                  {invite.reveal.coverLabel || invite.reveal.innerSubhead}
                </p>
                {invite.reveal.innerFootnote && (
                  <p className="font-serif italic text-[10px] text-[var(--text-muted)] mt-1.5">
                    {invite.reveal.innerFootnote}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* 3. Envelope Front Pocket */}
          <svg
            viewBox="0 0 410 282"
            className="absolute inset-0 w-full h-full z-25 pointer-events-none rounded-[4px] overflow-hidden"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="leftFoldGrad" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor={isBlush ? '#F7E2DC' : '#EAE0D0'} />
                <stop offset="100%" stopColor={isBlush ? '#EBD0C8' : '#DDD0BC'} />
              </linearGradient>
              <linearGradient id="rightFoldGrad" x1="100%" y1="0%" x2="0%" y2="50%">
                <stop offset="0%" stopColor={isBlush ? '#F5DDD6' : '#E6DBC9'} />
                <stop offset="100%" stopColor={isBlush ? '#E7C9C0' : '#D9CBB6'} />
              </linearGradient>
              <linearGradient id="bottomFoldGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor={isBlush ? '#FAE7E1' : '#ECE3D5'} />
                <stop offset="100%" stopColor={isBlush ? '#EDD3CB' : '#DFD2BE'} />
              </linearGradient>
            </defs>

            <polygon
              points="0,0 205,148 0,282"
              fill="url(#leftFoldGrad)"
              stroke="var(--border-hairline)"
              strokeWidth="0.7"
            />
            <polygon
              points="410,0 205,148 410,282"
              fill="url(#rightFoldGrad)"
              stroke="var(--border-hairline)"
              strokeWidth="0.7"
            />
            <polygon
              points="0,282 205,134 410,282"
              fill="url(#bottomFoldGrad)"
              stroke="var(--gold-line)"
              strokeOpacity="0.45"
              strokeWidth="0.9"
            />
          </svg>

          {/* 4. Top Triangular Flap */}
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
                  <stop offset="0%" stopColor={isBlush ? '#FCECE7' : '#EFE7DA'} />
                  <stop offset="65%" stopColor={isBlush ? '#F2D9D1' : '#E4D7C5'} />
                  <stop offset="100%" stopColor={isBlush ? '#E5C6BC' : '#DACAB4'} />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 410,0 205,160"
                fill="url(#topFlapFront)"
                stroke="var(--gold-line)"
                strokeOpacity="0.55"
                strokeWidth="1"
              />
            </svg>
          </motion.div>

          {/* 5. Glossy Round Wax Seal */}
          <AnimatePresence>
            {(stage === 'idle' || stage === 'sealPress') && (
              <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-40">
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
                  className="absolute -inset-3 rounded-full border border-[var(--name-color)]/45 pointer-events-none"
                />

                <div className="absolute -inset-2 rounded-full border border-dashed border-[var(--gold-line)] pointer-events-none" />
                <div className="absolute -inset-1 rounded-full border border-[var(--gold-line)]/50 pointer-events-none" />

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
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--name-color)] pointer-events-none"
                    />
                  ))}

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
                  className="relative w-22 h-22 sm:w-25 sm:h-25 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-main)] focus-visible:ring-offset-4 overflow-hidden"
                  style={{
                    background: isBlush
                      ? 'radial-gradient(circle at 32% 28%, #E8B8C1 0%, #CC8290 42%, #B5586B 78%, #8E3B4C 100%)'
                      : 'radial-gradient(circle at 32% 28%, #E6D2BC 0%, #CCAFA0 42%, #B89678 78%, #9B7A5C 100%)',
                    boxShadow:
                      '0 10px 24px rgba(107, 51, 64, 0.28), inset 0 2px 5px rgba(255, 255, 255, 0.65), inset 0 -4px 8px rgba(74, 47, 34, 0.28)',
                  }}
                >
                  <span
                    className="absolute inset-1.5 rounded-full border border-[#FAF3EA]/65 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 2px 6px rgba(74,47,34,0.18)',
                    }}
                  />
                  <span
                    className="absolute inset-0 pointer-events-none seal-shine-sweep"
                    aria-hidden="true"
                  />
                  <span
                    className={`font-serif italic text-xl sm:text-2xl tracking-wider flex items-baseline justify-center relative z-10 select-none ${
                      isBlush ? 'text-[#FFF8F3]' : 'text-[#3E2519]'
                    }`}
                  >
                    {monogramParts.hasAmp ? (
                      <>
                        <span>{monogramParts.left}</span>
                        <span className="text-xs sm:text-sm mx-1 opacity-85 not-italic font-serif">
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

        {/* Text Below Envelope */}
        <motion.div
          animate={
            stage === 'idle'
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.4 }}
          className="mt-14 sm:mt-16 text-center flex flex-col items-center"
        >
          <p className="font-label text-[10px] sm:text-[11px] font-semibold tracking-[0.34em] uppercase text-[var(--text-main)]">
            {invite.reveal.promptHeadline}
          </p>

          <div
            className="flex items-center justify-center gap-2.5 my-3"
            aria-hidden="true"
          >
            <span className="w-9 h-[1px] bg-[var(--gold-line)]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[var(--name-color)]" />
            <span className="w-9 h-[1px] bg-[var(--gold-line)]" />
          </div>

          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="font-label text-[9.5px] tracking-[0.3em] uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer py-1 px-3 focus:outline-none"
          >
            {invite.reveal.sealPrompt}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// 10. ORNATE CARD WRAPPER, EVENT LAYOUTS & LIGHTBOX GALLERY
// ============================================================================

const OrnateCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  showFloralCorners?: boolean;
}> = ({
  children,
  className = '',
  innerClassName = 'p-6 sm:p-10',
  showFloralCorners = false,
}) => (
  <div
    className={`relative rounded-[20px] bg-[var(--card-bg)] shadow-[0_20px_50px_rgba(107,51,64,0.11)] p-2 sm:p-2.5 transition-colors duration-500 ${className}`}
  >
    {/* Outer Thin Gold Border */}
    <div className="relative rounded-[14px] border border-[var(--gold-line)] p-1">
      {/* Inner Hairline Border */}
      <div
        className={`relative rounded-[11px] border border-[var(--border-hairline)] bg-[var(--card-inner)]/65 ${innerClassName}`}
      >
        {/* Tiny Gold Corner Flourishes */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => {
          const posMap = {
            tl: 'top-1.5 left-1.5 rotate-0',
            tr: 'top-1.5 right-1.5 rotate-90',
            bl: 'bottom-1.5 left-1.5 -rotate-90',
            br: 'bottom-1.5 right-1.5 rotate-180',
          };
          return (
            <svg
              key={pos}
              viewBox="0 0 24 24"
              className={`w-4 h-4 text-[var(--gold-line)] pointer-events-none select-none absolute ${posMap[pos]}`}
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 16 L2 4 Q2 2 4 2 L16 2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M5 11 L5 5 L11 5"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeLinecap="round"
                opacity="0.7"
              />
              <circle cx="2.5" cy="2.5" r="1.2" fill="currentColor" />
            </svg>
          );
        })}

        {/* Optional Delicate Floral Accent on Top-Left & Bottom-Right */}
        {showFloralCorners && (
          <>
            <div
              className="absolute -top-3 -left-3 w-12 h-12 pointer-events-none z-10"
              aria-hidden="true"
            >
              <svg viewBox="0 0 50 50" className="w-full h-full overflow-visible">
                <Leaf x={22} y={24} rotate={-45} scale={0.52} tone="sage" />
                <Leaf x={28} y={20} rotate={25} scale={0.45} tone="olive" />
                <Flower x={22} y={22} size={15} variant="peony" seed={41} />
              </svg>
            </div>
            <div
              className="absolute -bottom-3 -right-3 w-12 h-12 pointer-events-none z-10"
              aria-hidden="true"
            >
              <svg viewBox="0 0 50 50" className="w-full h-full overflow-visible">
                <Leaf x={28} y={26} rotate={135} scale={0.52} tone="sage" />
                <Flower x={28} y={28} size={14} variant="ivoryRose" seed={52} />
              </svg>
            </div>
          </>
        )}

        {children}
      </div>
    </div>
  </div>
);

const EventsDisplay: React.FC<{
  events: WeddingEvent[];
  layout: EventsLayoutType;
}> = ({ events, layout }) => {
  const [openId, setOpenId] = useState<string>(events[0]?.id || '');

  if (events.length === 0) {
    return (
      <p className="text-center font-serif italic text-[var(--text-muted)] py-6">
        Celebration itinerary details will be announced soon.
      </p>
    );
  }

  // 1. TIMELINE LAYOUT (DEFAULT: Alternating / Vertical with Pulsing Floral & Gold Node)
  if (layout === 'timeline') {
    return (
      <div className="relative py-4">
        {/* Vertical Center/Left Gold Line */}
        <div
          className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-[var(--gold-line)] to-transparent sm:-translate-x-1/2"
          aria-hidden="true"
        />

        <div className="space-y-8">
          {events.map((evt, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Pulsing Gold & Rose Node on Timeline */}
                <div
                  className="absolute left-4 sm:left-1/2 top-6 -translate-x-1/2 z-10 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-line)] animate-ping opacity-35 absolute" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[var(--name-color)] border-2 border-[var(--card-bg)] shadow-xs relative z-10" />
                </div>

                {/* Card Half */}
                <div
                  className={`w-full sm:w-1/2 pl-11 sm:pl-0 ${
                    isEven ? 'sm:pr-9 sm:text-right' : 'sm:pl-9 sm:text-left'
                  }`}
                >
                  <div className="relative rounded-[14px] bg-[var(--card-bg)] border border-[var(--gold-line)]/65 p-5 shadow-[0_12px_32px_rgba(107,51,64,0.08)] hover:border-[var(--name-color)]/60 transition-colors overflow-hidden">
                    {/* Subtle Corner Rose Motif inside Event Card */}
                    <svg
                      viewBox="0 0 60 60"
                      className={`w-14 h-14 absolute -top-2 ${
                        isEven ? '-left-2' : '-right-2'
                      } opacity-35 pointer-events-none`}
                      aria-hidden="true"
                    >
                      <Flower x={30} y={30} size={22} variant="peony" seed={idx + 10} />
                    </svg>

                    <span className="inline-block font-label text-[9px] tracking-[0.28em] uppercase text-[var(--name-color)] bg-[var(--badge-bg)] px-2.5 py-1 rounded-sm border border-[var(--gold-line)]/40">
                      {evt.date}
                    </span>

                    <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-main)] mt-2.5">
                      {evt.name}
                    </h3>

                    <div
                      className={`mt-3 space-y-2 text-xs sm:text-sm text-[var(--text-muted)] flex flex-col ${
                        isEven ? 'sm:items-end' : 'sm:items-start'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0" />
                        <span>{evt.time}</span>
                      </div>

                      {evt.dressCode && (
                        <div className="flex items-center gap-2">
                          <Shirt className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0" />
                          <span>Dress Code: {evt.dressCode}</span>
                        </div>
                      )}

                      <div
                        className={`flex items-start gap-2 ${
                          isEven ? 'sm:flex-row-reverse' : ''
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {evt.venueAddress}
                        </span>
                      </div>
                    </div>

                    {evt.mapLink && (
                      <div className="mt-4 pt-3 border-t border-[var(--border-hairline)]">
                        <a
                          href={evt.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-label text-[9.5px] tracking-[0.26em] uppercase text-[var(--name-color)] hover:text-[var(--text-main)] transition-colors font-semibold"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Get Directions</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. ACCORDION LAYOUT
  if (layout === 'accordion') {
    return (
      <div className="space-y-3">
        {events.map((evt) => {
          const isOpen = openId === evt.id;
          return (
            <div
              key={evt.id}
              className="rounded-[12px] border border-[var(--gold-line)]/70 bg-[var(--card-bg)] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? '' : evt.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--badge-bg)]/35 transition-colors"
              >
                <div>
                  <p className="font-label text-[9px] tracking-[0.28em] uppercase text-[var(--name-color)]">
                    {evt.date} · {evt.time}
                  </p>
                  <h3 className="font-serif text-lg sm:text-xl text-[var(--text-main)] mt-0.5">
                    {evt.name}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--name-color)] transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-[var(--border-hairline)] space-y-2.5 text-xs sm:text-sm text-[var(--text-muted)]">
                      {evt.dressCode && (
                        <div className="flex items-center gap-2">
                          <Shirt className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0" />
                          <span>Dress Code: {evt.dressCode}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {evt.venueAddress}
                        </span>
                      </div>
                      {evt.mapLink && (
                        <div className="pt-2">
                          <a
                            href={evt.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-label text-[9.5px] tracking-[0.25em] uppercase text-[var(--name-color)] hover:text-[var(--text-main)] font-semibold"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Open in Google Maps</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. GRID LAYOUT
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="rounded-[14px] border border-[var(--gold-line)]/70 bg-[var(--card-bg)] p-5 flex flex-col justify-between shadow-xs"
          >
            <div>
              <span className="inline-block font-label text-[8.5px] tracking-[0.26em] uppercase text-[var(--name-color)] bg-[var(--badge-bg)] px-2 py-0.5 rounded-sm">
                {evt.date}
              </span>
              <h3 className="font-serif text-xl text-[var(--text-main)] mt-2">
                {evt.name}
              </h3>

              <div className="mt-3 space-y-2 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0" />
                  <span>{evt.time}</span>
                </div>
                {evt.dressCode && (
                  <div className="flex items-center gap-2">
                    <Shirt className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0" />
                    <span>{evt.dressCode}</span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[var(--name-color)] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{evt.venueAddress}</span>
                </div>
              </div>
            </div>

            {evt.mapLink && (
              <div className="mt-4 pt-3 border-t border-[var(--border-hairline)]">
                <a
                  href={evt.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-label text-[9px] tracking-[0.25em] uppercase text-[var(--name-color)] hover:text-[var(--text-main)] font-semibold"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Directions</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 4. MINIMAL EDITORIAL LIST LAYOUT
  return (
    <div className="divide-y divide-[var(--border-hairline)]">
      {events.map((evt) => (
        <div
          key={evt.id}
          className="py-5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div>
            <p className="font-label text-[9px] tracking-[0.28em] uppercase text-[var(--name-color)]">
              {evt.date} · {evt.time}
            </p>
            <h3 className="font-serif text-xl text-[var(--text-main)] mt-0.5">
              {evt.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md leading-relaxed">
              {evt.venueAddress}
            </p>
            {evt.dressCode && (
              <p className="font-label text-[8.5px] tracking-[0.22em] uppercase text-[var(--text-muted)] mt-1.5">
                Attire: {evt.dressCode}
              </p>
            )}
          </div>

          {evt.mapLink && (
            <a
              href={evt.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] border border-[var(--gold-line)] font-label text-[9px] tracking-[0.24em] uppercase text-[var(--name-color)] hover:bg-[var(--badge-bg)] transition-colors"
            >
              <Navigation className="w-3 h-3" />
              <span>Map</span>
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// 11. 3-STEP RSVP WIZARD (With WhatsApp Deep Link + Confetti Celebration)
// ============================================================================

const RsvpSection: React.FC<{
  invite: InviteConfig;
  submissions: RsvpSubmission[];
  onSubmitRsvp: (sub: RsvpSubmission) => void;
}> = ({ invite, submissions, onSubmitRsvp }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(() =>
    invite.events.map((e) => e.name)
  );
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [dietaryNote, setDietaryNote] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleEventSelection = (name: string) => {
    setSelectedEvents((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const handleContinueToStep2 = () => {
    if (selectedEvents.length === 0) {
      setErrorMsg('Please select at least one celebration to attend.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    setErrorMsg('');

    const newSub: RsvpSubmission = {
      id: `rsvp-${Date.now()}`,
      selectedEvents,
      guestName: guestName.trim(),
      phone: phone.trim(),
      guestCount,
      dietaryNote: dietaryNote.trim(),
      songRequest: songRequest.trim(),
      submittedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSubmitRsvp(newSub);
    setStep(3);
  };

  const whatsappUrl = useMemo(() => {
    const cleanNum = invite.rsvp.whatsappNumber.replace(/\D/g, '');
    if (!cleanNum) return '';
    const lines = [
      `✨ *Wedding RSVP — ${invite.couple.partner1Name} & ${invite.couple.partner2Name}* ✨`,
      `• *Guest Name:* ${guestName.trim() || 'Guest'}`,
      `• *Guests Attending:* ${guestCount}`,
      `• *Celebrations:* ${selectedEvents.join(', ')}`,
      dietaryNote.trim() ? `• *Notes:* ${dietaryNote.trim()}` : '',
      songRequest.trim() ? `• *Song Request:* ${songRequest.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(lines)}`;
  }, [
    invite.rsvp.whatsappNumber,
    invite.couple.partner1Name,
    invite.couple.partner2Name,
    guestName,
    guestCount,
    selectedEvents,
    dietaryNote,
    songRequest,
  ]);

  return (
    <OrnateCard showFloralCorners>
      <div className="text-center mb-6">
        <p className="font-label text-[10px] tracking-[0.32em] uppercase text-[var(--name-color)] font-semibold">
          {invite.labels.rsvpKicker}
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)] mt-1">
          {invite.labels.rsvpTitle}
        </h2>
        {invite.rsvp.deadline && (
          <p className="font-serif italic text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Kindly respond by {invite.rsvp.deadline}
          </p>
        )}
        <FloralCluster placement="divider" className="mt-2" />
      </div>

      {/* Step Progress Indicator */}
      {step < 3 && (
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full font-label text-[10px] flex items-center justify-center border transition-colors ${
                  step === s
                    ? 'bg-[var(--cta-bg)] text-[#FFFDFB] border-[var(--cta-bg)]'
                    : step > s
                    ? 'bg-[var(--badge-bg)] text-[var(--name-color)] border-[var(--gold-line)]'
                    : 'bg-transparent text-[var(--text-muted)] border-[var(--border-hairline)]'
                }`}
              >
                {step > s ? <Check className="w-3 h-3" /> : s}
              </span>
              <span className="font-label text-[9px] tracking-[0.22em] uppercase text-[var(--text-muted)]">
                {s === 1 ? 'Functions' : 'Guest Details'}
              </span>
              {s === 1 && (
                <span className="w-8 h-[1px] bg-[var(--gold-line)]/60 mx-1" />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: SELECT CELEBRATIONS */}
        {step === 1 && (
          <motion.div
            key="rsvp-step-1"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-serif text-center text-base sm:text-lg text-[var(--text-main)] mb-4">
              {invite.labels.rsvpQuestion}
            </p>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {invite.events.map((evt) => {
                const checked = selectedEvents.includes(evt.name);
                return (
                  <button
                    key={evt.id}
                    type="button"
                    onClick={() => toggleEventSelection(evt.name)}
                    className={`w-full text-left p-3.5 rounded-[10px] border transition-all flex items-center justify-between cursor-pointer ${
                      checked
                        ? 'bg-[var(--badge-bg)]/60 border-[var(--name-color)] shadow-xs'
                        : 'bg-[var(--card-bg)] border-[var(--border-hairline)] hover:border-[var(--gold-line)]'
                    }`}
                  >
                    <div>
                      <p className="font-serif text-base sm:text-lg text-[var(--text-main)] font-medium">
                        {evt.name}
                      </p>
                      <p className="font-label text-[9px] tracking-[0.22em] uppercase text-[var(--text-muted)] mt-0.5">
                        {evt.date} · {evt.time}
                      </p>
                    </div>

                    <span
                      className={`w-5 h-5 rounded-[4px] flex items-center justify-center border transition-colors ${
                        checked
                          ? 'bg-[var(--cta-bg)] border-[var(--cta-bg)] text-white'
                          : 'border-[var(--gold-line)] bg-white/60'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {errorMsg && (
              <p className="text-xs text-[#B42318] text-center mt-3 font-medium">
                {errorMsg}
              </p>
            )}

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleContinueToStep2}
                className="w-full sm:w-auto min-w-[220px] py-3 px-8 rounded-[8px] bg-[var(--cta-bg)] hover:bg-[var(--cta-hover)] text-[#FFFDFB] font-label text-[10px] tracking-[0.28em] uppercase font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Continue to Details
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: GUEST DETAILS & SONG REQUEST */}
        {step === 2 && (
          <motion.form
            key="rsvp-step-2"
            onSubmit={handleFinalSubmit}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-[9px] tracking-[0.24em] uppercase text-[var(--text-main)] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Rajesh & Neha Sharma"
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[var(--card-bg)] border border-[var(--gold-line)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--name-color)]"
                />
              </div>

              <div>
                <label className="block font-label text-[9px] tracking-[0.24em] uppercase text-[var(--text-main)] mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98110 XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[var(--card-bg)] border border-[var(--gold-line)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--name-color)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label text-[9px] tracking-[0.24em] uppercase text-[var(--text-main)] mb-1.5">
                  Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                    className="w-9 h-9 rounded-[6px] border border-[var(--gold-line)] bg-[var(--card-bg)] text-[var(--text-main)] font-serif text-lg hover:bg-[var(--badge-bg)] cursor-pointer"
                  >
                    −
                  </button>
                  <span className="font-serif text-lg text-[var(--text-main)] min-w-[2.5rem] text-center">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.min(15, c + 1))}
                    className="w-9 h-9 rounded-[6px] border border-[var(--gold-line)] bg-[var(--card-bg)] text-[var(--text-main)] font-serif text-lg hover:bg-[var(--badge-bg)] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-label text-[9px] tracking-[0.24em] uppercase text-[var(--text-main)] mb-1.5">
                  Dietary / Arrival Note
                </label>
                <input
                  type="text"
                  value={dietaryNote}
                  onChange={(e) => setDietaryNote(e.target.value)}
                  placeholder="Jain food, allergies, flight arrival..."
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-[var(--card-bg)] border border-[var(--gold-line)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--name-color)]"
                />
              </div>
            </div>

            <div>
              <label className="block font-label text-[9px] tracking-[0.24em] uppercase text-[var(--text-main)] mb-1.5">
                {invite.labels.songTitle}
              </label>
              <input
                type="text"
                value={songRequest}
                onChange={(e) => setSongRequest(e.target.value)}
                placeholder="e.g. Kesariya, London Thumakda..."
                className="w-full px-3.5 py-2.5 rounded-[8px] bg-[var(--card-bg)] border border-[var(--gold-line)] text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--name-color)]"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-[#B42318] text-center font-medium">
                {errorMsg}
              </p>
            )}

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-[8px] border border-[var(--gold-line)] font-label text-[9.5px] tracking-[0.24em] uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto py-3 px-8 rounded-[8px] bg-[var(--cta-bg)] hover:bg-[var(--cta-hover)] text-[#FFFDFB] font-label text-[10px] tracking-[0.28em] uppercase font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Confirm Attendance
              </button>
            </div>
          </motion.form>
        )}

        {/* STEP 3: CONFIRMATION & WHATSAPP SHARE */}
        {step === 3 && (
          <motion.div
            key="rsvp-step-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-line)] mx-auto flex items-center justify-center text-[var(--name-color)]">
              <Heart className="w-5 h-5 fill-current" />
            </div>

            <h3 className="font-serif text-2xl text-[var(--text-main)]">
              {invite.labels.rsvpSuccessTitle}
            </h3>

            <p className="font-serif text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
              {invite.labels.rsvpSuccessMessage}
            </p>

            <div className="p-3.5 rounded-[10px] bg-[var(--badge-bg)]/45 border border-[var(--gold-line)]/50 max-w-md mx-auto text-xs text-[var(--text-main)] space-y-1">
              <p className="font-semibold">
                {guestName} ({guestCount}{' '}
                {guestCount === 1 ? 'Guest' : 'Guests'})
              </p>
              <p className="text-[var(--text-muted)]">
                Attending: {selectedEvents.join(' · ')}
              </p>
              {songRequest && (
                <p className="italic text-[var(--name-color)]">
                  Song: “{songRequest}”
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-[8px] bg-[#25D366] hover:bg-[#1EBE5D] text-white font-label text-[10px] tracking-[0.24em] uppercase font-semibold shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send RSVP on WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-[8px] border border-[var(--gold-line)] font-label text-[9.5px] tracking-[0.22em] uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                Edit Response
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session RSVP Guestbook Log */}
      {submissions.length > 0 && (
        <div className="mt-8 pt-5 border-t border-[var(--border-hairline)]">
          <p className="font-label text-[9px] tracking-[0.26em] uppercase text-[var(--text-muted)] text-center mb-3">
            Recent Blessings &amp; RSVPs ({submissions.length})
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="px-3.5 py-2 rounded-[8px] bg-[var(--card-bg)] border border-[var(--border-hairline)] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-serif font-medium text-[var(--text-main)]">
                    {sub.guestName}
                  </span>
                  <span className="text-[var(--text-muted)] ml-2">
                    ({sub.guestCount} {sub.guestCount === 1 ? 'guest' : 'guests'})
                  </span>
                </div>
                <span className="font-label text-[8.5px] tracking-widest uppercase text-[var(--name-color)]">
                  {sub.submittedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </OrnateCard>
  );
};

// ============================================================================
// 12. LIVE STUDIO CUSTOMIZER DRAWER (Theme Switcher, Artwork Slots, Events, Copy)
// ============================================================================

const ImageUploadField: React.FC<{
  label: string;
  sublabel?: string;
  value: string;
  onChange: (b64: string) => void;
}> = ({ label, sublabel, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3 rounded-[10px] bg-[var(--card-bg)] border border-[var(--border-hairline)] flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-label text-[9.5px] tracking-[0.2em] uppercase text-[var(--text-main)] font-semibold truncate">
          {label}
        </p>
        {sublabel && (
          <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
            {sublabel}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {value ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-9 h-9 rounded-[6px] object-cover border border-[var(--gold-line)]"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              title="Reset to SVG illustration"
              className="p-1.5 rounded-[6px] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[#B42318] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--badge-bg)] border border-[var(--gold-line)]/60 font-label text-[9px] tracking-[0.2em] uppercase text-[var(--name-color)] hover:bg-[var(--gold-line)]/25 cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
};

const EditInvitationDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  invite: InviteConfig;
  setInvite: React.Dispatch<React.SetStateAction<InviteConfig>>;
  onReplayEnvelope: () => void;
}> = ({ isOpen, onClose, invite, setInvite, onReplayEnvelope }) => {
  const [activeTab, setActiveTab] = useState<
    'theme' | 'poster' | 'couple' | 'events' | 'stay' | 'gallery'
  >('theme');
  const galleryUploadRef = useRef<HTMLInputElement | null>(null);

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const b64 = reader.result;
          setInvite((prev) => ({
            ...prev,
            gallery: [...prev.gallery, b64],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addNewEvent = () => {
    const newEvt: WeddingEvent = {
      id: `evt-${Date.now()}`,
      name: 'New Celebration',
      date: 'NOVEMBER 26, 2026',
      time: '5:00 PM onwards',
      venueAddress: 'Mayur Vihar, New Delhi',
      dressCode: 'Traditional',
      mapLink: 'https://www.google.com/maps',
    };
    setInvite((prev) => ({
      ...prev,
      events: [...prev.events, newEvt],
    }));
  };

  const updateEvent = (id: string, patch: Partial<WeddingEvent>) => {
    setInvite((prev) => ({
      ...prev,
      events: prev.events.map((evt) =>
        evt.id === id ? { ...evt, ...patch } : evt
      ),
    }));
  };

  const removeEvent = (id: string) => {
    setInvite((prev) => ({
      ...prev,
      events: prev.events.filter((evt) => evt.id !== id),
    }));
  };

  const moveEvent = (index: number, direction: -1 | 1) => {
    setInvite((prev) => {
      const copy = [...prev.events];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return { ...prev, events: copy };
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
          />

          {/* Slide-Over Studio Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[var(--card-inner)] border-l border-[var(--gold-line)] shadow-2xl flex flex-col overflow-hidden text-[var(--text-main)]"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[var(--card-bg)] border-b border-[var(--border-hairline)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[var(--name-color)]" />
                <h2 className="font-serif text-lg font-medium">
                  Invitation Studio Customizer
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReplayEnvelope();
                  }}
                  title="Replay Wax-Seal Envelope Reveal"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[var(--badge-bg)] border border-[var(--gold-line)]/50 font-label text-[8.5px] tracking-[0.2em] uppercase text-[var(--name-color)] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Replay Intro</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Studio Drawer"
                  className="p-1.5 rounded-full hover:bg-[var(--badge-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 py-2.5 bg-[var(--card-bg)]/60 border-b border-[var(--border-hairline)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(
                [
                  ['theme', 'Theme & Art'],
                  ['poster', 'Hero Poster'],
                  ['couple', 'Couple & Date'],
                  ['events', 'Events'],
                  ['stay', 'Stay & RSVP'],
                  ['gallery', 'Gallery'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-[6px] font-label text-[9px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === key
                      ? 'bg-[var(--cta-bg)] text-white font-semibold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--badge-bg)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* TAB 1: THEME & ARTWORK SLOTS */}
              {activeTab === 'theme' && (
                <div className="space-y-5">
                  <div>
                    <p className="font-label text-[9.5px] tracking-[0.24em] uppercase text-[var(--name-color)] font-semibold mb-2.5">
                      1. Color Theme Preset
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setInvite((prev) => ({ ...prev, theme: 'blushRose' }))
                        }
                        className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                          invite.theme === 'blushRose'
                            ? 'border-[#B5586B] bg-[#FFF8F3] ring-2 ring-[#B5586B]/25'
                            : 'border-[var(--border-hairline)] bg-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-4 h-4 rounded-full bg-[#F6DCD6] border border-[#D8B988]" />
                          <span className="w-4 h-4 rounded-full bg-[#B5586B]" />
                          <span className="w-4 h-4 rounded-full bg-[#7C8B63]" />
                        </div>
                        <p className="font-serif text-sm font-semibold text-[#6B3340]">
                          Blush Rose
                        </p>
                        <p className="text-[10px] text-[#96616D]">
                          Floral engagement card palette
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setInvite((prev) => ({
                            ...prev,
                            theme: 'classicCream',
                          }))
                        }
                        className={`p-3 rounded-[10px] border text-left transition-all cursor-pointer ${
                          invite.theme === 'classicCream'
                            ? 'border-[#B58B66] bg-[#FCFAF6] ring-2 ring-[#B58B66]/25'
                            : 'border-[var(--border-hairline)] bg-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="w-4 h-4 rounded-full bg-[#F5EFE4] border border-[#C9A57C]" />
                          <span className="w-4 h-4 rounded-full bg-[#B58B66]" />
                          <span className="w-4 h-4 rounded-full bg-[#4A2F22]" />
                        </div>
                        <p className="font-serif text-sm font-semibold text-[#4A2F22]">
                          Classic Cream
                        </p>
                        <p className="text-[10px] text-[#8A6F5A]">
                          Warm sand &amp; bronze luxury
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Custom AI / PNG Artwork Slots */}
                  <div>
                    <p className="font-label text-[9.5px] tracking-[0.24em] uppercase text-[var(--name-color)] font-semibold mb-1">
                      2. Illustrated Poster Artwork Slots
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] mb-3">
                      Upload transparent PNGs or photos to override any built-in
                      procedural SVG floral or palace illustration.
                    </p>

                    <div className="space-y-2.5">
                      <ImageUploadField
                        label="Top-Left Floral Cluster"
                        sublabel="art.floralTopLeft (Transparent PNG)"
                        value={invite.art.floralTopLeft}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, floralTopLeft: val },
                          }))
                        }
                      />
                      <ImageUploadField
                        label="Right Vertical Floral Vine"
                        sublabel="art.floralRight (Transparent PNG)"
                        value={invite.art.floralRight}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, floralRight: val },
                          }))
                        }
                      />
                      <ImageUploadField
                        label="Bottom Corner Florals"
                        sublabel="art.floralBottom (Transparent PNG)"
                        value={invite.art.floralBottom}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, floralBottom: val },
                          }))
                        }
                      />
                      <ImageUploadField
                        label="Venue Illustration / Photo"
                        sublabel="art.venuePhoto (Bottom palace band)"
                        value={invite.art.venuePhoto}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, venuePhoto: val },
                          }))
                        }
                      />
                      <ImageUploadField
                        label="Ring Box Illustration"
                        sublabel="art.ringBox (Bottom-left ring plate)"
                        value={invite.art.ringBox}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, ringBox: val },
                          }))
                        }
                      />
                      <ImageUploadField
                        label="Hero Card Background Wash"
                        sublabel="art.heroBackground (Texture / Watercolor)"
                        value={invite.art.heroBackground}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, heroBackground: val },
                          }))
                        }
                      />
                      <ImageUploadField
                        label="Custom QR Image Override"
                        sublabel="art.qrCodeOverride (Optional custom QR)"
                        value={invite.art.qrCodeOverride}
                        onChange={(val) =>
                          setInvite((prev) => ({
                            ...prev,
                            art: { ...prev.art, qrCodeOverride: val },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO POSTER TEXT &SACRED BLESSING */}
              {activeTab === 'poster' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1">
                      Sacred Header Emblem
                    </label>
                    <select
                      value={invite.blessing.headerIcon}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          blessing: {
                            ...prev.blessing,
                            headerIcon: e.target.value as BlessingIconType,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                    >
                      <option value="hinduism">Ganesha / Om (Hinduism)</option>
                      <option value="sikhism">Ik Onkar / Khanda (Sikhism)</option>
                      <option value="jainism">Sacred Lotus (Jainism)</option>
                      <option value="buddhism">Dharma Wheel (Buddhism)</option>
                      <option value="islam">Crescent &amp; Star (Islam)</option>
                      <option value="christianity">Sacred Cross (Christianity)</option>
                      <option value="none">None</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1">
                      Invocation Line Preset
                    </label>
                    <select
                      value={invite.blessing.invocationPreset}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          blessing: {
                            ...prev.blessing,
                            invocationPreset: e.target.value,
                            invocationText: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)] mb-2"
                    >
                      {INVOCATION_PRESETS.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={invite.blessing.invocationText}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          blessing: {
                            ...prev.blessing,
                            invocationText: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                      placeholder="Custom invocation text..."
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1">
                      Left Hanging Tag Text
                    </label>
                    <input
                      type="text"
                      value={invite.poster.hangingTagText}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          poster: {
                            ...prev.poster,
                            hangingTagText: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1">
                      Top-Right Quote
                    </label>
                    <input
                      type="text"
                      value={invite.poster.topRightQuote}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          poster: {
                            ...prev.poster,
                            topRightQuote: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1">
                      Parents Invite Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={invite.poster.parentsInviteIntro}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          poster: {
                            ...prev.poster,
                            parentsInviteIntro: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-label text-[8.5px] uppercase mb-1">
                        Day Label
                      </label>
                      <input
                        type="text"
                        value={invite.poster.infoDayLabel}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            poster: {
                              ...prev.poster,
                              infoDayLabel: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[8.5px] uppercase mb-1">
                        Date Label
                      </label>
                      <input
                        type="text"
                        value={invite.poster.infoDateLabel}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            poster: {
                              ...prev.poster,
                              infoDateLabel: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[8.5px] uppercase mb-1">
                        Time Label
                      </label>
                      <input
                        type="text"
                        value={invite.poster.infoTimeLabel}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            poster: {
                              ...prev.poster,
                              infoTimeLabel: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1.5 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1">
                      Poster Short Venue Column
                    </label>
                    <input
                      type="text"
                      value={invite.poster.infoVenueShort}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          poster: {
                            ...prev.poster,
                            infoVenueShort: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: COUPLE NAMES, PHOTOS & WEDDING DATE */}
              {activeTab === 'couple' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-label text-[9px] uppercase mb-1">
                        Groom Name
                      </label>
                      <input
                        type="text"
                        value={invite.couple.partner1Name}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            couple: {
                              ...prev.couple,
                              partner1Name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[9px] uppercase mb-1">
                        Bride Name
                      </label>
                      <input
                        type="text"
                        value={invite.couple.partner2Name}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            couple: {
                              ...prev.couple,
                              partner2Name: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      Groom Parents Line
                    </label>
                    <input
                      type="text"
                      value={invite.couple.partner1Parents}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            partner1Parents: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      Bride Parents Line
                    </label>
                    <input
                      type="text"
                      value={invite.couple.partner2Parents}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          couple: {
                            ...prev.couple,
                            partner2Parents: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-label text-[9px] uppercase mb-1">
                        ISO Countdown Date
                      </label>
                      <input
                        type="datetime-local"
                        value={invite.wedding.isoDate.slice(0, 16)}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            wedding: {
                              ...prev.wedding,
                              isoDate: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-2.5 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[9px] uppercase mb-1">
                        Timezone
                      </label>
                      <select
                        value={invite.wedding.timezone}
                        onChange={(e) =>
                          setInvite((prev) => ({
                            ...prev,
                            wedding: {
                              ...prev.wedding,
                              timezone: e.target.value as TimezoneKey,
                            },
                          }))
                        }
                        className="w-full px-2.5 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                      >
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz.key} value={tz.key}>
                            {tz.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      Main Venue Full Address (Marriage Venue)
                    </label>
                    <textarea
                      rows={2}
                      value={invite.wedding.venue}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          wedding: {
                            ...prev.wedding,
                            venue: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)] mb-2"
                    />
                    <label className="block font-label text-[9px] uppercase mb-1">
                      Marriage Venue Google Maps URL
                    </label>
                    <input
                      type="text"
                      value={invite.wedding.venueMapLink}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          wedding: {
                            ...prev.wedding,
                            venueMapLink: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      Our Story Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={invite.story.storyText}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          story: {
                            ...prev.story,
                            storyText: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: EVENTS & LAYOUT SWITCHER */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-label text-[9px] tracking-[0.22em] uppercase mb-1.5">
                      Events Display Layout
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        ['timeline', 'accordion', 'grid', 'minimal'] as const
                      ).map((lay) => (
                        <button
                          key={lay}
                          type="button"
                          onClick={() =>
                            setInvite((prev) => ({
                              ...prev,
                              eventsLayout: lay,
                            }))
                          }
                          className={`py-2 px-2 rounded-[6px] font-label text-[8.5px] tracking-[0.18em] uppercase border cursor-pointer ${
                            invite.eventsLayout === lay
                              ? 'bg-[var(--cta-bg)] text-white border-[var(--cta-bg)]'
                              : 'bg-[var(--card-bg)] border-[var(--border-hairline)] text-[var(--text-muted)]'
                          }`}
                        >
                          {lay}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-label text-[9.5px] tracking-[0.2em] uppercase font-semibold">
                      Celebration Functions ({invite.events.length})
                    </span>
                    <button
                      type="button"
                      onClick={addNewEvent}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[var(--cta-bg)] text-white font-label text-[8.5px] tracking-[0.2em] uppercase cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Event</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {invite.events.map((evt, idx) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-[10px] bg-[var(--card-bg)] border border-[var(--gold-line)]/60 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={evt.name}
                            onChange={(e) =>
                              updateEvent(evt.id, { name: e.target.value })
                            }
                            className="font-serif text-base font-medium bg-transparent border-b border-[var(--border-hairline)] focus:outline-none w-full"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => moveEvent(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 text-[var(--text-muted)] disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveEvent(idx, 1)}
                              disabled={idx === invite.events.length - 1}
                              className="p-1 text-[var(--text-muted)] disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeEvent(evt.id)}
                              className="p-1 text-[#B42318] cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={evt.date}
                            onChange={(e) =>
                              updateEvent(evt.id, { date: e.target.value })
                            }
                            placeholder="Date"
                            className="px-2.5 py-1.5 rounded-[6px] bg-white/80 border border-[var(--border-hairline)]"
                          />
                          <input
                            type="text"
                            value={evt.time}
                            onChange={(e) =>
                              updateEvent(evt.id, { time: e.target.value })
                            }
                            placeholder="Time"
                            className="px-2.5 py-1.5 rounded-[6px] bg-white/80 border border-[var(--border-hairline)]"
                          />
                        </div>

                        <input
                          type="text"
                          value={evt.venueAddress}
                          onChange={(e) =>
                            updateEvent(evt.id, {
                              venueAddress: e.target.value,
                            })
                          }
                          placeholder="Venue Address"
                          className="w-full px-2.5 py-1.5 rounded-[6px] bg-white/80 border border-[var(--border-hairline)]"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={evt.dressCode}
                            onChange={(e) =>
                              updateEvent(evt.id, { dressCode: e.target.value })
                            }
                            placeholder="Dress code"
                            className="px-2.5 py-1.5 rounded-[6px] bg-white/80 border border-[var(--border-hairline)]"
                          />
                          <input
                            type="text"
                            value={evt.mapLink}
                            onChange={(e) =>
                              updateEvent(evt.id, { mapLink: e.target.value })
                            }
                            placeholder="Google Maps URL"
                            className="px-2.5 py-1.5 rounded-[6px] bg-white/80 border border-[var(--border-hairline)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STAY, WHATSAPP RSVP & MUSIC */}
              {activeTab === 'stay' && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      WhatsApp Number for RSVP (Digits with Country Code)
                    </label>
                    <input
                      type="text"
                      value={invite.rsvp.whatsappNumber}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          rsvp: {
                            ...prev.rsvp,
                            whatsappNumber: e.target.value,
                          },
                        }))
                      }
                      placeholder="919811000001"
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--gold-line)]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      RSVP Deadline Text
                    </label>
                    <input
                      type="text"
                      value={invite.rsvp.deadline}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          rsvp: {
                            ...prev.rsvp,
                            deadline: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                    />
                  </div>

                  <div>
                    <label className="block font-label text-[9px] uppercase mb-1">
                      Background Music URL (or SYNTH_CHIME)
                    </label>
                    <input
                      type="text"
                      value={invite.wedding.musicUrl}
                      onChange={(e) =>
                        setInvite((prev) => ({
                          ...prev,
                          wedding: {
                            ...prev.wedding,
                            musicUrl: e.target.value,
                          },
                        }))
                      }
                      placeholder="SYNTH_CHIME or https://.../song.mp3"
                      className="w-full px-3 py-2 rounded-[6px] bg-[var(--card-bg)] border border-[var(--border-hairline)]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: GALLERY PHOTOS */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[9.5px] tracking-[0.2em] uppercase font-semibold">
                      Couple Gallery ({invite.gallery.length} Photos)
                    </span>
                    <button
                      type="button"
                      onClick={() => galleryUploadRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--cta-bg)] text-white font-label text-[8.5px] tracking-[0.2em] uppercase cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Add Photos</span>
                    </button>
                    <input
                      ref={galleryUploadRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryAdd}
                    />
                  </div>

                  {invite.gallery.length === 0 ? (
                    <p className="text-[var(--text-muted)] italic py-4 text-center">
                      No custom photos uploaded yet. Artistic wedding framing
                      placeholders are currently displayed.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2.5">
                      {invite.gallery.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-[4/5] rounded-[8px] overflow-hidden border border-[var(--gold-line)] group"
                        >
                          <img
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setInvite((prev) => ({
                                ...prev,
                                gallery: prev.gallery.filter(
                                  (_, idx) => idx !== i
                                ),
                              }))
                            }
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-90 hover:bg-[#B42318] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 13. MAIN APP COMPONENT (DEFAULT EXPORT)
// ============================================================================

export default function App() {
  const [invite, setInvite] = useState<InviteConfig>(INVITE);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [confettiBurst, setConfettiBurst] = useState<{
    id: number;
    mode: 'envelope' | 'rsvp';
  }>({ id: 0, mode: 'envelope' });
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<RsvpSubmission[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Subtle Mouse / DeviceOrientation Tilt for Hero Florals
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Audio / Synth Chime State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const userMutedRef = useRef<boolean>(false);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Sync document.title with INVITE.documentTitle
  useEffect(() => {
    if (invite.documentTitle) {
      document.title = invite.documentTitle;
    }
  }, [invite.documentTitle]);

  // Scroll Progress Bar at top of viewport
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  // Compute Countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const target = getTargetTimestamp(
        invite.wedding.isoDate,
        invite.wedding.timezone
      );
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [invite.wedding.isoDate, invite.wedding.timezone]);

  // Subtle pointer/device tilt handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setTilt({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Gentle WebAudio Sitar/Harp Chime Synthesizer fallback
  const startSynthChime = useCallback(() => {
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
      let stepIdx = 0;

      const playPluck = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running')
          return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        const freq = notes[stepIdx % notes.length];
        stepIdx++;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      };

      playPluck();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = window.setInterval(playPluck, 2200);
      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    setIsPlayingAudio(false);
  }, []);

  const startAudio = useCallback(() => {
    if (!invite.wedding.musicUrl) return;

    if (invite.wedding.musicUrl === 'SYNTH_CHIME') {
      startSynthChime();
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(invite.wedding.musicUrl);
      audio.loop = true;
      audio.volume = invite.wedding.musicVolume ?? 0.5;
      audioRef.current = audio;
    } else {
      audioRef.current.loop = true;
      audioRef.current.volume = invite.wedding.musicVolume ?? 0.5;
    }

    audioRef.current
      .play()
      .then(() => {
        setIsPlayingAudio(true);
      })
      .catch(() => {
        setIsPlayingAudio(false);
      });
  }, [
    invite.wedding.musicUrl,
    invite.wedding.musicVolume,
    startSynthChime,
  ]);

  // Try autoplay on load; if blocked by browser policy, start on the first tap/click/touch anywhere
  useEffect(() => {
    if (!invite.wedding.musicUrl) return;

    let unlocked = false;

    const removeUnlockListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    const handleFirstInteraction = () => {
      if (unlocked || userMutedRef.current) return;
      if (audioRef.current && !audioRef.current.paused) {
        unlocked = true;
        removeUnlockListeners();
        return;
      }
      startAudio();
      unlocked = true;
      removeUnlockListeners();
    };

    // Attempt immediate autoplay on mount
    startAudio();

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, {
      passive: true,
    });
    window.addEventListener('keydown', handleFirstInteraction, {
      passive: true,
    });

    return () => {
      removeUnlockListeners();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [invite.wedding.musicUrl, startAudio]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      userMutedRef.current = true;
      stopAudio();
    } else {
      userMutedRef.current = false;
      startAudio();
    }
  };

  const handleEnvelopeComplete = useCallback(() => {
    setIsOpened(true);
    if (!userMutedRef.current && !isPlayingAudio) {
      startAudio();
    }
  }, [startAudio, isPlayingAudio]);

  const handleTriggerEnvelopeConfetti = useCallback(() => {
    setConfettiBurst({ id: Date.now(), mode: 'envelope' });
  }, []);

  const handleRsvpSubmitted = useCallback((sub: RsvpSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);
    setConfettiBurst({ id: Date.now(), mode: 'rsvp' });
  }, []);

  const handleQuickGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const b64 = reader.result;
          setInvite((prev) => ({
            ...prev,
            gallery: [...prev.gallery, b64],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Theme CSS Variables injected onto root wrapper
  const themeStyleVars = useMemo(
    () => THEME_VARIABLES[invite.theme] as React.CSSProperties,
    [invite.theme]
  );

  // Artistic SVG Placeholders when gallery is empty
  const defaultGalleryPlaceholders = [
    {
      title: 'The Ring Exchange',
      subtitle: 'Sacred Promises',
      seed: 101,
    },
    {
      title: 'Mehendi & Laughter',
      subtitle: 'Henna & Songs',
      seed: 202,
    },
    {
      title: 'Under the Mandap',
      subtitle: 'Seven Sacred Vows',
      seed: 303,
    },
  ];

  return (
    <div
      style={themeStyleVars}
      className="min-h-screen w-full relative overflow-x-hidden selection:bg-[var(--name-color)] selection:text-white transition-colors duration-500"
    >
      {/* Google Fonts & Custom Keyframe Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');

        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-script {
          font-family: 'Great Vibes', cursive;
        }
        .font-label {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Metallic Gold + Rose Foil Shimmer Sweep on Couple Script Names */
        @keyframes foilShimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .gold-foil-shimmer {
          background-image: linear-gradient(
            110deg,
            var(--name-color) 0%,
            var(--name-color) 38%,
            var(--gold-line) 50%,
            var(--name-color) 62%,
            var(--name-color) 100%
          );
          background-size: 240% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: foilShimmer 5.5s ease-in-out infinite;
        }

        /* Gentle Floral Sway Animations */
        @keyframes floralSwaySlow {
          0%, 100% { transform: rotate(-1.8deg); }
          50% { transform: rotate(1.8deg); }
        }
        @keyframes floralSwayMed {
          0%, 100% { transform: rotate(2deg); }
          50% { transform: rotate(-2deg); }
        }
        .floral-sway-slow {
          animation: floralSwaySlow 8s ease-in-out infinite;
        }
        .floral-sway-medium {
          animation: floralSwayMed 6.5s ease-in-out infinite;
        }

        /* Left Hanging Tag Pendulum Swing */
        @keyframes pendulumSwing {
          0%, 100% { transform: rotate(-3.5deg); }
          50% { transform: rotate(3.5deg); }
        }
        .pendulum-tag {
          animation: pendulumSwing 5.8s ease-in-out infinite;
        }

        /* Slow Ken Burns Zoom on Couple Portraits */
        @keyframes kenBurnsSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .ken-burns-slow {
          animation: kenBurnsSlow 16s ease-in-out infinite;
        }

        /* Wax Seal Shine Sweep */
        @keyframes sealShine {
          0%, 65%, 100% { transform: translateX(-140%) rotate(25deg); }
          85% { transform: translateX(140%) rotate(25deg); }
        }
        .seal-shine-sweep::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.38) 50%,
            transparent 100%
          );
          animation: sealShine 5.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .floral-sway-slow,
          .floral-sway-medium,
          .pendulum-tag,
          .ken-burns-slow,
          .gold-foil-shimmer,
          .seal-shine-sweep::after {
            animation: none !important;
          }
        }
      `}</style>

      {/* Page Warm Blush / Cream Gradient Background */}
      <div
        className="fixed inset-0 -z-20 transition-colors duration-700"
        style={{
          background:
            'linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%)',
        }}
      />

      {/* Subtle Paper-Grain SVG feTurbulence Overlay (4% Opacity) */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-30 opacity-[0.04]"
        aria-hidden="true"
      >
        <filter id="luxuryPaperGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#luxuryPaperGrain)" />
      </svg>

      {/* Top Scroll Progress Ribbon */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold-line)] via-[var(--name-color)] to-[var(--gold-line)] origin-left z-50"
      />

      {/* Ambient Falling Rose Petals + Gold Sparkle Motes Canvas */}
      <AmbientPetalsCanvas theme={invite.theme} enabled={isOpened} />

      {/* Celebratory Confetti & Sparkle Burst Canvas */}
      <ConfettiCanvas
        burstTrigger={confettiBurst.id}
        mode={confettiBurst.mode}
        theme={invite.theme}
      />

      {/* SCREEN 1: Interactive Wax-Seal Envelope Reveal */}
      <AnimatePresence>
        {!isOpened && (
          <EnvelopeIntro
            invite={invite}
            onComplete={handleEnvelopeComplete}
            onTriggerConfetti={handleTriggerEnvelopeConfetti}
          />
        )}
      </AnimatePresence>

      {/* SCREEN 2: FULL ILLUSTRATED INVITATION EXPERIENCE */}
      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={
          isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-24 space-y-14 sm:space-y-18"
      >
        {/* SECTION 1: ILLUSTRATED HERO INVITATION POSTER (Matches Reference Card) */}
        <section aria-label="Wedding Invitation Poster">
          <IllustratedHeroPoster
            invite={invite}
            isOpened={isOpened}
            tilt={tilt}
          />

          {/* Quick Save the Date Action Row Below Poster */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => downloadIcsFile(invite)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--gold-line)] shadow-xs font-label text-[9.5px] tracking-[0.26em] uppercase text-[var(--text-main)] hover:bg-[var(--badge-bg)] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--name-color)]" />
              <span>{invite.labels.saveTheDateTag} (.ICS)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOpened(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[var(--card-bg)]/80 border border-[var(--border-hairline)] font-label text-[9px] tracking-[0.24em] uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Envelope</span>
            </button>
          </div>
        </section>

        {/* Ornamental Floral Vine Section Divider */}
        <FloralCluster placement="divider" />

        {/* SECTION 2: THE COUPLE (Arch Portraits + Floral Sprigs + Our Story) */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
        >
          <OrnateCard showFloralCorners>
            <div className="text-center mb-8">
              <p className="font-label text-[9.5px] tracking-[0.32em] uppercase text-[var(--name-color)] font-semibold">
                {invite.labels.storyTitle}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)] mt-1">
                {invite.couple.partner1Name} &amp; {invite.couple.partner2Name}
              </h2>
              <p className="font-label text-[9px] tracking-[0.28em] uppercase text-[var(--text-muted)] mt-1">
                {invite.labels.storySubline}
              </p>
            </div>

            {/* Dual Arch Portraits with Slow Ken Burns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 items-center justify-items-center my-4">
              <CoupleArchCard
                name={invite.couple.partner1Name}
                role={invite.couple.partner1Role}
                primaryPhoto={invite.couple.partner1Photo}
                secondaryPhoto={invite.couple.partner1SecondaryPhoto}
                initial={invite.couple.partner1Name.charAt(0) || 'H'}
                variant="groom"
                onUploadPrimary={(b64) =>
                  setInvite((prev) => ({
                    ...prev,
                    couple: { ...prev.couple, partner1Photo: b64 },
                  }))
                }
                onUploadSecondary={(b64) =>
                  setInvite((prev) => ({
                    ...prev,
                    couple: { ...prev.couple, partner1SecondaryPhoto: b64 },
                  }))
                }
              />

              <CoupleArchCard
                name={invite.couple.partner2Name}
                role={invite.couple.partner2Role}
                primaryPhoto={invite.couple.partner2Photo}
                secondaryPhoto={invite.couple.partner2SecondaryPhoto}
                initial={invite.couple.partner2Name.charAt(0) || 'K'}
                variant="bride"
                onUploadPrimary={(b64) =>
                  setInvite((prev) => ({
                    ...prev,
                    couple: { ...prev.couple, partner2Photo: b64 },
                  }))
                }
                onUploadSecondary={(b64) =>
                  setInvite((prev) => ({
                    ...prev,
                    couple: { ...prev.couple, partner2SecondaryPhoto: b64 },
                  }))
                }
              />
            </div>

            <LotusDividerSvg className="my-6" />

            {/* Signature Quote & Story Text */}
            <blockquote className="font-serif italic text-base sm:text-lg text-[var(--name-color)] text-center max-w-lg mx-auto leading-relaxed">
              “{invite.story.signatureQuote}”
            </blockquote>

            <p className="font-serif text-xs sm:text-sm text-[var(--text-main)]/90 text-center leading-[1.85] max-w-xl mx-auto mt-4">
              {invite.story.storyText}
            </p>
          </OrnateCard>
        </motion.section>

        {/* Ornamental Floral Vine Section Divider */}
        <FloralCluster placement="divider" />

        {/* SECTION 3: COUNTDOWN TO FOREVER (Circular Gold & Blush Medallion Tiles) */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
        >
          <OrnateCard showFloralCorners>
            <div className="text-center">
              <p className="font-label text-[9.5px] tracking-[0.32em] uppercase text-[var(--name-color)] font-semibold">
                {invite.labels.countdownTitle}
              </p>
              <h2 className="font-script text-4xl sm:text-5xl text-[var(--text-main)] mt-2">
                {invite.wedding.date}
              </h2>
              <p className="font-label text-[8.5px] tracking-[0.26em] uppercase text-[var(--text-muted)] mt-1">
                Timezone: {invite.wedding.timezone}
              </p>

              <div className="flex items-center justify-center gap-3 sm:gap-6 mt-7">
                <CountdownCircle value={timeLeft.days} label="Days" />
                <CountdownCircle value={timeLeft.hours} label="Hours" />
                <CountdownCircle value={timeLeft.minutes} label="Minutes" />
                <CountdownCircle value={timeLeft.seconds} label="Seconds" />
              </div>
            </div>
          </OrnateCard>
        </motion.section>

        {/* Ornamental Floral Vine Section Divider */}
        <FloralCluster placement="divider" />

        {/* SECTION 4: CELEBRATION ITINERARY (4 Switchable Layouts) */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
        >
          <OrnateCard showFloralCorners>
            <div className="text-center mb-6">
              <p className="font-label text-[9.5px] tracking-[0.32em] uppercase text-[var(--name-color)] font-semibold">
                {invite.labels.eventsKicker}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)] mt-1">
                {invite.labels.eventsTitle}
              </h2>
              <p className="font-serif italic text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                {invite.labels.eventsSubtitle}
              </p>

              {/* Subtle Layout Switcher Pills */}
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--badge-bg)]/60 border border-[var(--gold-line)]/50 mt-4">
                {(
                  ['timeline', 'accordion', 'grid', 'minimal'] as const
                ).map((lay) => (
                  <button
                    key={lay}
                    type="button"
                    onClick={() =>
                      setInvite((prev) => ({ ...prev, eventsLayout: lay }))
                    }
                    className={`px-3 py-1 rounded-full font-label text-[8.5px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                      invite.eventsLayout === lay
                        ? 'bg-[var(--cta-bg)] text-white font-semibold shadow-2xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {lay}
                  </button>
                ))}
              </div>
            </div>

            <EventsDisplay
              events={invite.events}
              layout={invite.eventsLayout}
            />
          </OrnateCard>
        </motion.section>

        {/* Ornamental Floral Vine Section Divider */}
        <FloralCluster placement="divider" />

        {/* SECTION 5: MARRIAGE VENUE (Card with label "MARRIAGE VENUE") */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
        >
          <OrnateCard showFloralCorners>
            <div className="text-center flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-[var(--badge-bg)] border border-[var(--gold-line)]/60 flex items-center justify-center text-[var(--name-color)] mb-3 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>

              <p className="font-label text-[10px] tracking-[0.32em] uppercase text-[var(--name-color)] font-semibold">
                {invite.labels.marriageVenueLabel}
              </p>

              <LotusDividerSvg className="my-3" />

              <p
                className="font-serif text-base sm:text-xl text-[var(--text-main)] max-w-md mx-auto leading-relaxed"
                style={{ textWrap: 'balance' }}
              >
                {invite.wedding.venue}
              </p>

              {invite.wedding.venueMapLink && (
                <div className="mt-6">
                  <a
                    href={invite.wedding.venueMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-7 rounded-[8px] bg-[var(--cta-bg)] hover:bg-[var(--cta-hover)] text-[#FFFDFB] font-label text-[10px] tracking-[0.28em] uppercase font-semibold transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{invite.labels.getDirectionsLabel}</span>
                  </a>
                </div>
              )}
            </div>
          </OrnateCard>
        </motion.section>

        {/* Ornamental Floral Vine Section Divider */}
        <FloralCluster placement="divider" />

        {/* SECTION 6: YOUR WEDDING HOSTS */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
        >
          <OrnateCard showFloralCorners>
            <div className="text-center mb-6">
              <p className="font-label text-[9.5px] tracking-[0.32em] uppercase text-[var(--name-color)] font-semibold">
                HOSPITALITY &amp; ASSISTANCE
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-main)] mt-1">
                {invite.labels.hostsTitle}
              </h2>
              <p className="font-serif italic text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-md mx-auto leading-relaxed">
                {invite.labels.hostsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {invite.hosts.map((host, idx) => {
                const cleanTel = host.phone.replace(/[^\d+]/g, '');
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-[14px] bg-[var(--card-bg)] border border-[var(--gold-line)]/65 flex flex-col items-center text-center justify-between shadow-[0_10px_28px_rgba(107,51,64,0.07)]"
                  >
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl text-[var(--text-main)] font-medium">
                        {host.name}
                      </h3>
                      <p className="font-label text-[9px] tracking-[0.26em] uppercase text-[var(--name-color)] mt-1">
                        {host.relation}
                      </p>
                      <p className="font-serif text-sm text-[var(--text-muted)] mt-2.5">
                        {host.phone}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border-hairline)] w-full flex justify-center">
                      <a
                        href={`tel:${cleanTel}`}
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-[8px] bg-[var(--cta-bg)] hover:bg-[var(--cta-hover)] text-[#FFFDFB] font-label text-[9.5px] tracking-[0.28em] uppercase font-semibold transition-colors shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{invite.labels.hostsCallLabel}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </OrnateCard>
        </motion.section>

        {/* SECTION 8: FLORAL CLOSING FOOTER */}
        <footer className="pt-6 pb-12 text-center flex flex-col items-center">
          <LotusDividerSvg />
          <p className="font-script text-4xl sm:text-5xl gold-foil-shimmer py-1 px-3 mt-2">
            {invite.couple.partner1Name} &amp; {invite.couple.partner2Name}
          </p>
          <p className="font-serif italic text-sm text-[var(--text-muted)] mt-1">
            {invite.labels.footerWelcome}
          </p>
          <p className="font-label text-[8.5px] tracking-[0.32em] uppercase text-[var(--text-main)]/75 mt-4">
            {invite.poster.posterFooterPillars}
          </p>
          <p className="font-label text-[8px] tracking-[0.3em] uppercase text-[var(--text-muted)]/70 mt-2">
            {invite.labels.footerBrand} · {invite.wedding.date}
          </p>
        </footer>
      </motion.main>

      {/* Lightbox Modal for Uploaded Gallery Photos */}
      <AnimatePresence>
        {lightboxIndex !== null && invite.gallery[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {invite.gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(
                      (lightboxIndex - 1 + invite.gallery.length) %
                        invite.gallery.length
                    );
                  }}
                  className="absolute left-4 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(
                      (lightboxIndex + 1) % invite.gallery.length
                    );
                  }}
                  className="absolute right-4 p-2.5 rounded-full bg-white/15 text-white hover:bg-white/25 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.img
              key={lightboxIndex}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={invite.gallery[lightboxIndex]}
              alt="Full view"
              className="max-w-full max-h-[85vh] rounded-[12px] border border-[var(--gold-line)] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Studio Customizer Drawer */}
      <EditInvitationDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        invite={invite}
        setInvite={setInvite}
        onReplayEnvelope={() => setIsOpened(false)}
      />
    </div>
  );
}
