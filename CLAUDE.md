# C.A.R. Homepage Prototype

Homepage redesign prototype for the California Association of Realtors (car.org). Static HTML/CSS/JS — no build tools, no framework. Served from a local Python HTTP server.

This is a ModOp agency project. C.A.R. is the largest state trade association for real estate professionals in the US.

## Project context

The live car.org site is a ~2018 Sitecore build with float-based layouts, Owl Carousel, and Coveo search. This prototype modernizes the homepage with CSS custom properties, CSS Grid, semantic HTML, and WCAG 2.2 AA accessibility. The nav prototype includes a desktop mega-menu, mobile accordion menu with sliding account view, and an account panel with focus trap.

Competitive landscape: association peers (NAR, CRMLS, DRE) all use navy/blue palettes. C.A.R.'s navy/gold combination is a brand differentiator. Consumer portals (Zillow, Redfin, Compass) are 3-5 years ahead in design system maturity. See `research/visual-trends-report.md` for the full competitive analysis.

## Project structure

```
index.html            Page content (hero, news, featured carousel, resources, events)
nav.html              Navigation partial (mobile nav, desktop mega-menu, account panel, backdrop)
footer.html           Footer partial (link columns, social icons, legal bar)
css/styles.css        All styles — tokens, nav, sections, account panel, responsive breakpoints
js/nav.js             Menu toggles, mobile accordion, account slide, escape handler
js/account-panel.js   Account panel open/close, focus trap, mobile bottom sheet
js/main.js            Featured carousel (7-slide infinite loop, 4 visible thumbs) and resource tabs
research/             Competitive research and visual trends report
```

### Embeds

`nav.html` and `footer.html` load into `index.html` via `fetch()` + `outerHTML` replacement. They are HTML partials, not standalone pages.

### Legacy files

- `car-homepage.html` — original monolithic prototype (reference only, do not edit)
- `car-navigation.html` — standalone nav prototype with account panel (design reference for nav.html)

## Running locally

```
python3 -m http.server 8000
open http://localhost:8000/index.html
```

Must be served over HTTP — `fetch()` embeds won't work from `file://`.

## Design tokens

CSS custom properties in `:root` within `styles.css`:

### Colors
- Navy: `--car-navy` / `--car-navy-light`
- Gold: `--car-gold` — brand accent, used in hero bg, active tab indicators, carousel active thumb, news section top border
- Purple: `--car-purple` / `--car-purple-light` — "explore/see-all" link color (news read-all, events calendar, mega-menu footer)
- Gray scale: `--car-gray-100` through `--car-gray-700` (gray-500 is `#767676`, AA-compliant at small sizes)
- Text: `--car-text` / `--car-subtext`
- Surface: `--car-surface` (page background)
- Focus: `--car-focus` (keyboard focus outlines)
- Danger: `--car-danger` (sign-out button)

### Typography
- `--font-heading: 'Literata', Georgia, serif` — variable serif with optical sizing, used at weight 600–800
- `--font-body: 'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif`
- Type scale (~1.25 ratio): `--text-display` (clamp), `--text-heading` (clamp), `--text-subheading`, `--text-body`, `--text-caption`, `--text-label`

### Easing
- `--ease-out-quart` — smooth deceleration, used for card hovers, scroll reveals
- `--ease-out-expo` — confident/decisive, used for carousel

## Conventions

- WCAG 2.2 AA — all targets min 44px, focus-visible outlines, aria labels on landmarks and controls
- Responsive at 768px (tablet/mobile) and 480px (small phone). Hero and section headings use `clamp()` for fluid sizing — no px overrides needed at breakpoints.
- Desktop nav: mega-dropdowns with backdrop overlay. Mobile: accordion menu with sliding account view
- Logos are inline base64 PNGs (keeps the prototype zero-dependency)
- Emoji icons are placeholders for eventual SVG/icon font
- All font sizes in `rem`, not `px`. Body text minimum `1rem` (16px).
- `prefers-reduced-motion: reduce` is supported — all animations/transitions are disabled

## Animations

- **Hero entrance**: staggered fadeUp on headline (0.1s), CTA (0.25s), shortcuts (0.4s)
- **Scroll reveals**: sections fade+rise on viewport entry via IntersectionObserver (fires once)
- **Card hover**: news, resource, event cards lift 2px with subtle shadow on hover
- **Resource tabs**: opacity crossfade on panel switch
- **Carousel**: exponential easing on thumb track and slide crossfade
- All motion uses `transform` + `opacity` only (GPU-composited). No layout property animations.

## When editing

- **Nav**: edit `nav.html` + `js/nav.js` (or `js/account-panel.js`). `nav.html` is the working copy; `car-navigation.html` is the design reference.
- **Styles**: all in `css/styles.css`, organized by section comments (nav, homepage sections, account panel, responsive).
- **Content**: edit `index.html`. Sections (hero, news, featured, resources, events) are demarcated with HTML comments.
- **Footer**: edit `footer.html`.
- Don't edit `car-homepage.html` — frozen reference.
