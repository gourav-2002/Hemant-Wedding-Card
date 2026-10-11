# Hemant & Kritika — Wedding Invitation Website

A single-page, animated digital wedding invitation built with React, TypeScript, and Vite. Guests open an interactive envelope, see the couple's details, event timeline, venue map, and can contact the wedding hosts directly — all on one scrolling page with ambient background music.

---

## The Couple

| | |
|---|---|
| **Groom** | Hemant — S/o Mr. Naresh & Mrs. Poonam Aggarwal |
| **Bride** | Kritika — D/o Mr. Mukesh & Mrs. Sonam Aggarwal |

**Wedding Date:** November 26, 2026 (IST)

**Signature Quote:** "Destiny brought them together. Families blessed their union. Love will make it everlasting."

---

## Venue

**Shri Dharmik Ram Leela Mandal**
Inside Shri Kaleshwar Nath Shiv Mandir, Mayur Vihar, Patparganj
New Delhi – 110091

**Get Directions:** https://maps.app.goo.gl/EWvdgepEFwvTTZma9

---

## Celebrations / Events

| Event | Date | Time | Venue | Dress Code |
|---|---|---|---|---|
| Ghudchadi | November 26, 2026 | 3:00 PM onwards | H. No. 29, Block-D Urvashi Enclave, Near Vardhan Multispeciality Hospital, Ghaziabad, Uttar Pradesh – 201018 | Traditional |
| Departure of Barat | November 26, 2026 | 6:00 PM onwards | H. No. 29, Block-D Urvashi Enclave, Near Vardhan Multispeciality Hospital, Ghaziabad, Uttar Pradesh – 201018 | Traditional |

**Map link (both events):** https://maps.google.com/maps?q=28.7069186,77.444319&z=17&hl=en

---

## Wedding Hosts (Contact for Directions / Assistance)

| Name | Relation | Phone |
|---|---|---|
| Mr. Naresh Kumar Aggarwal | Father of the Groom | +91 98109 54538 |
| Gourav Aggarwal | Brother of the Groom | +91 92058 16849 |

---

## Site Features

- **Animated envelope intro** — guests tap a wax seal to open the invitation, triggering a 3D flap-open animation and confetti burst.
- **Ambient background music** — plays automatically from `public/song.mp3` (attempts autoplay on load, falls back to starting on the first tap/click if the browser blocks autoplay).
- **Couple portraits** — arch-framed photos of the groom and bride.
- **Our Story** — a short note from the couple with a signature quote.
- **Save the Date** — countdown timer to the wedding date.
- **The Celebrations** — timeline of event cards (Ghudchadi, Departure of Barat) with date, time, dress code, and a "Get Directions" link to Google Maps.
- **Your Wedding Hosts** — tap-to-call contact cards for the father and brother of the groom.
- **Fully responsive** — designed mobile-first, works on all screen sizes.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool & dev server)
- **Tailwind CSS 4**
- **Motion** (animations)
- **Lucide React** (icons)

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Run the app in development mode:
   ```
   npm run dev
   ```
3. Build for production:
   ```
   npm run build
   ```
4. Preview the production build:
   ```
   npm run preview
   ```

---

## Project Structure

```
├── public/
│   └── song.mp3          # Background music played on the invitation
├── src/
│   ├── App.tsx            # Entire invitation (all content, layout & logic)
│   ├── index.css          # Global styles
│   └── main.tsx            # React entry point
├── index.html
└── vite.config.ts
```

All wedding content (names, dates, venue, events, hosts, labels) is defined in a single `INVITE` config object near the top of [`src/App.tsx`](src/App.tsx), making it straightforward to update details without touching layout code.
