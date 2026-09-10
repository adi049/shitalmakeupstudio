# Shital Gurav Makeup Studio — Website

A luxury editorial website for the Shital Gurav Makeup Studio brand:
makeup studio + professional makeup academy.

Built with plain HTML5, CSS3 and vanilla JavaScript (no build process,
no frameworks). Upload the entire folder to any standard shared host
(Hostinger, cPanel, etc.) and it works as-is.

---

## Structure

    /                        8 pages (index, about, studio, academy,
                             gallery, packages, booking, contact)
    css/style.css            all component styles (desktop-first)
    css/responsive.css       tablet + mobile breakpoints
    js/main.js               navigation, reveals, parallax, testimonials
    js/gallery.js            gallery filters + fullscreen lightbox
    js/booking.js            appointment form (validation + hooks)
    images/logo/             official logo (transparent PNG) + favicons
    images/bridal/           brand photography from the studio
    images/gallery/          gallery + look images (see note below)
    images/academy/          academy imagery
    images/owner/            founder portrait

## Updating content — quick guide

| What                  | Where to change |
| --------------------- | --------------- |
| Phone / email / address / hours | Search for `[PHONE`, `[EMAIL`, `[LOCATION`, `[HOURS` across the HTML files |
| Prices               | `packages.html` — every `₹ [PRICE]` is a placeholder inside `.pkg-price` |
| Testimonials         | `js/main.js` — the `TESTIMONIALS` array (clearly marked) |
| Social links         | `index/about/contact` footers + contact page — search `instagram.com`, `facebook.com`, `wa.me`, `maps.google.com` |
| Google Maps embed    | `contact.html` — replace the `.map-placeholder` block (instructions in a comment there) |
| WhatsApp number      | `js/booking.js` (`BOOKING_CONFIG.whatsappNumber`) + contact page CTA |
| Course details       | `academy.html` — durations, schedules and fees are `[TO BE ADDED]` placeholders |
| Founder bio & portrait | `about.html` + replace the single file `images/owner/owner-portrait.jpg` |
| Gallery captions / categories | `gallery.html` — each `<figure>` has `data-category` and a caption |

## About the placeholder images

The files in `images/gallery/` (traditional-bride, soft-glam,
reception-glam, reception-evening, engagement-look, contemporary-bride,
editorial-beauty, detail-eye, detail-lip), `images/academy/` and
`images/owner/owner-portrait.jpg` are **temporary dummy images** used
until real photography is supplied. Replace each file (keeping the same
name) or update the `src` attributes — nothing else needs to change.

The official logo and the five brand photographs
(hero-bride, bride-classic, bride-editorial, bride-studio, bride-color)
are the supplied assets, optimised for the web.

## Connecting the booking form

The form currently runs frontend-only and shows a success message.
Open `js/booking.js` — the `BOOKING_CONFIG` block documents how to
connect it to WhatsApp, Email, Google Sheets or a backend API.

## Deployment notes

- Set the Open Graph `og:image` and add `og:url` in each page `<head>`
  to absolute URLs (e.g. `https://yourdomain.com/images/bridal/hero-bride.jpg`)
  after the domain is known.
- GSAP + ScrollTrigger and Google Fonts load from CDN. The site remains
  fully functional without them (animations degrade gracefully).
- All animations respect `prefers-reduced-motion`.

---

© 2026 Shital Gurav Makeup Studio. All rights reserved.
"# shitalmakeupstudio" 
