# Kona Island Coffee — Interactive Website Build Specification

## 1. Authority and workflow

This document is the authoritative build specification for the Kona Island Coffee interactive redesign.

Before changing code:

1. Read this file completely.
2. Inspect the existing repository and verify claims against actual code.
3. Confirm the active branch is `kona-interactive-redesign`.
4. Never work directly on `main`.
5. Preserve working routes and external Square links until replacements are explicitly approved.
6. Do not push, merge, deploy, delete major functionality, or open a pull request without explicit user authorization.
7. Do not expose, request, commit, or rename secrets.
8. This project does not use Supabase. Do not add Supabase or another CMS.
9. GitHub remains the code host and Vercel remains the deployment platform.
10. Do not treat the README as proof that a feature works. Verify actual implementation.

## 2. Project objective

Replace the current generic tropical coffee-shop presentation with a premium, cinematic, editorial, interactive brand experience.

The website should feel like the digital flagship of Kona Island Coffee: warm Hawaiian hospitality expressed through a calm, contemporary Bay Area lens.

Primary emotional sequence:

**Curiosity → Calm → Trust → Desire to Visit**

Core brand line:

**Your Island Escape.**

The experience must remain useful. Visitors must be able to find the café, view the menu, order ahead, locate the truck, and purchase gift cards without navigating through excessive animation.

## 3. Verified business facts

### Brand

- Name: Kona Island Coffee
- Coffee positioning: authentic 100% Kona Coffee
- Do not describe the Kona coffee as a blend.
- Brand began operations in 2022; first sales began in 2023.
- The business grew from a Bay Area coffee trailer into a Mountain View café.
- Founders: Hanna Mejia-Hans and Jorge Mejia.
- Do not invent biographies, quotations, awards, farmers, partners, or historical details.

### Mountain View café

- Address: 2565 California Street, STE 84, Mountain View, CA 94040
- Located at The Village at San Antonio Center / San Antonio Village Center
- Public ordering website: https://www.orderkonamountainview.com/
- The Mountain View storefront does not serve crepes.
- The café serves 100% Kona coffee, handcrafted drinks, chimney cakes, and bakery items.
- Do not hard-code operating hours until the current hours are reconfirmed.

### Coffee truck

- The truck is a separate Kona location and ordering destination.
- Valley Medical Center location: 751 S. Bascom Ave, Sobrato Pavilion, San Jose.
- Truck schedules can change and should be centralized in content rather than duplicated in components.
- Do not represent old apartment stops or dated schedules as current without verification.

### External actions

Preserve verified working Square ordering and gift-card links from the current code unless a newer confirmed URL is supplied. If links conflict, report the conflict rather than choosing silently.

## 4. Content accuracy requirements

The current site contains outdated, placeholder, or inaccurate content. Remove or replace:

- Featured Oʻahu crepe on the Mountain View-focused homepage
- Claims that the Mountain View café serves crepes
- Fictional testimonials
- Fictional customer names or avatars
- Fictional founders, employees, farmers, or origin details
- Old opening announcements
- Old or duplicated operating hours
- “App coming soon” sections unless an app project is actively verified
- Unsupported “award-winning,” “best,” farm-direct, or sustainability claims
- Decorative Hawaiian or tropical emoji
- Generic “aloha” filler copy
- Placeholder functionality presented as a live integration

Never fabricate missing information. Put uncertain operational facts in centralized typed content with a clear verification note.

## 5. Brand direction

### Personality

- Premium
- Calm
- Island-luxury
- Warm
- Knowledgeable
- Editorial
- Welcoming
- Contemporary
- Intentionally restrained

### References

Use these as qualitative references, not as templates to copy:

- Aman Resorts
- Aesop
- Leica
- Apple editorial storytelling
- Premium Hawaiian hospitality brands
- High-end coffee and travel magazines

### Avoid

- Generic café templates
- Bright tourist-tropical styling
- Palm-leaf clutter
- Luau styling
- Busy gradients
- Bright teal as a dominant color
- Excessive rounded cards
- Glassmorphism everywhere
- Heavy drop shadows
- Icon grids
- Emoji decoration
- Loud promotional banners
- Aggressive sales language
- Animation used only to demonstrate technology

## 6. Visual system

### Core palette

- Warm sand / cream: `#F3EDE4`
- Deep espresso brown
- Muted charcoal / black
- Koa-inspired warm brown
- Off-white
- Restrained warm gold
- Natural tropical green only when supported by photography

Introduce semantic CSS tokens rather than scattering hex values through components.

Bright teal belongs to the previous visual direction. Do not use it as a dominant redesign color.

### Typography

Typography should feel premium and editorial while remaining readable.

- Preserve the real Kona logo/wordmark asset.
- Do not approximate the logo using a generic font.
- Use a sophisticated editorial display face only if licensing and web delivery are valid.
- Use a highly readable body typeface.
- Avoid novelty script fonts and generic brush-script Hawaiian styling.
- Optimize typography with `next/font` or properly hosted local files.
- Ensure fonts do not create layout shift.

### Photography

Photography leads the experience.

- Prefer real Kona café, drink, founder, trailer, Hawaiʻi, and coffee-farm assets.
- Never generate fake founders, customers, café interiors, products, or farms.
- Inspect `public/images` before choosing assets.
- Never reference nonexistent files.
- Do not delete or mass-rename the existing image library during early phases.
- Mark unsuitable or missing imagery explicitly.
- Prepare selected assets for WebP/AVIF and responsive crops later.
- Do not load images directly from Google Drive in production.

## 7. Interaction philosophy

The site must be memorable and interactive but calm.

Use existing Framer Motion for initial development. Do not add GSAP in Phase 1.

Motion should:

- Support storytelling
- Use restrained opacity, masking, scale, and small positional movement
- Avoid scroll hijacking
- Avoid long loading screens
- Avoid excessive cursor effects
- Avoid parallax overload
- Preserve normal browser scrolling
- Respect `prefers-reduced-motion`
- Remain functional without animation
- Perform smoothly on typical mobile devices
- Never delay ordering, directions, or menu access

Interactions must work with:

- Keyboard
- Pointer
- Touch
- Screen readers where appropriate
- Reduced-motion settings

## 8. Target information architecture

Primary navigation:

- Experience
- Coffee
- Menu
- Our Story
- Visit
- Order Ahead

The header should:

- Begin transparent over the hero when contrast permits
- Transition to a readable solid treatment after scrolling
- Return intelligently when scrolling upward
- Include an accessible mobile menu
- Provide visible keyboard focus
- Avoid overcrowding
- Keep Order Ahead clear but understated

Recommended page architecture:

- Home
- Experience
- Coffee
- Menu or menu preview
- Our Story
- Visit
- Journal later
- Existing catering/contact pages only if still required
- External Square ordering
- External gift cards

Do not remove old routes until route usage and redirect requirements are audited.

## 9. Target homepage

### 9.1 Cinematic arrival

Full-viewport real Kona photography or approved short video.

Copy:

- KONA wordmark
- Your Island Escape.
- 100% Authentic Kona Coffee
- Mountain View, California

Actions:

- Visit the Café
- Order Ahead

Rules:

- One primary visual, not a slideshow or collage
- Calm entrance animation
- Responsive desktop and mobile crop
- No promotional popup
- No opening announcement card
- No autoplay audio
- Video, if later used, must be optimized and have a still-image fallback

### 9.2 The Kona experience

Three principles presented editorially, not as generic feature cards:

- Authentic — 100% Kona Coffee. Never blended.
- Crafted — Every cup prepared with intention.
- Escape — A calm place in the middle of your day.

Do not add generic icons unless they materially improve understanding.

### 9.3 The space

Large café photography with magazine-like pacing.

Possible short lines:

- Designed for conversations.
- Built for slow mornings.
- Stay a little longer.

Copy is subject to final creative approval.

### 9.4 Our craft

Show real preparation and equipment:

- Modbar
- Mahlkönig grinding
- Marco single-serve pour-over
- Hand-prepared drinks
- Coffee brewed one cup at a time

Avoid unsupported sourcing or technical claims.

### 9.5 Choose your escape

A lightweight interactive mood selector:

- Comforting
- Tropical
- Bold
- Refreshing

Each choice reveals verified Kona drinks from a typed local dataset.

Requirements:

- No AI or database required
- No account
- No tracking-based personalization
- Keyboard and touch support
- Clear selected state
- Meaningful non-animated fallback
- Link each recommendation to the correct ordering/menu destination
- Never invent products or prices

### 9.6 Signature collection

A curated product experience rather than the full menu.

Potential verified products include:

- Kona Island Latte
- Captain Cook
- Kamoa Mocha
- Hilo UBE
- Crème Brûlée
- Island Coco Refresher
- Blue Hawaiʻi Refresher, only after confirming it is publicly available

Prices and availability must remain centralized and treated as operational content.

### 9.7 Coffee origin

Lead with:

**Coffee should be appreciated like wine.**

Progressive origin journey:

Hawaiʻi → Big Island → Kona District → Farm → Harvest → Roast → Cup

Requirements:

- Build structure progressively
- Never invent farm names, elevations, processing methods, or relationships
- Use verified educational copy
- Provide static readable content for SEO and accessibility
- Add advanced animation only after the content is approved

### 9.8 From trailer to dream

An editorial, documentary-style timeline:

- The idea
- The first trailer
- Early Bay Area customers
- Family effort
- Mountain View café
- Today

Use real assets and verified dates. Mark missing captions or dates instead of fabricating them.

### 9.9 Visit Kona

Provide practical choices:

- Mountain View café
- Coffee truck
- Directions
- Current hours
- Order ahead
- Gift cards
- Trailer schedule where current

Keep operational information centralized.

### 9.10 Footer

Minimal:

- Logo
- Navigation
- Contact
- Verified social links
- Order ahead
- Gift cards
- Copyright
- Required legal links

## 10. Content architecture

Create typed centralized content for:

- Navigation
- Locations
- Hours
- Ordering URLs
- Gift-card URL
- Contact details
- Social profiles
- Featured products
- Homepage copy
- Timeline entries
- Origin entries

Suggested organization:

```text
src/
  content/
    site.ts
    homepage.ts
    products.ts
    story.ts
  lib/
    types.ts
```

Adapt to the actual repository after inspection. Do not duplicate existing systems unnecessarily.

## 11. Component architecture

Prefer small, focused components and Server Components by default.

Potential structure:

```text
src/
  components/
    site-header.tsx
    site-footer.tsx
    home/
      cinematic-hero.tsx
      kona-principles.tsx
      space-editorial.tsx
      craft-story.tsx
      escape-selector.tsx
      signature-collection.tsx
      origin-journey.tsx
      trailer-timeline.tsx
      visit-kona.tsx
      section-reveal.tsx
```

Use Client Components only for genuine interaction. Do not create a giant monolithic homepage component.

## 12. Engineering requirements

- Preserve Next.js App Router.
- Preserve TypeScript strictness.
- Preserve Tailwind CSS 4 unless a verified technical issue requires change.
- Prefer Server Components.
- Keep client and animation boundaries small.
- Use semantic HTML.
- Use `next/image` correctly.
- Prevent layout shift.
- Meet reasonable WCAG AA contrast.
- Maintain visible focus states.
- Maintain keyboard navigation.
- Respect reduced motion.
- Avoid hydration errors.
- Do not introduce `any` without documenting why.
- Do not suppress ESLint or TypeScript errors.
- Do not enable `ignoreBuildErrors`.
- Do not introduce unnecessary packages.
- Keep the production build passing.
- Avoid shipping mock POS functionality as real customer functionality.
- Treat Square as the current external ordering system.
- Keep Vercel compatibility.

## 13. Performance requirements

Targets are guidelines, not reasons to falsify measurements:

- Strong Core Web Vitals
- Largest hero asset responsibly optimized
- No layout shift from fonts or images
- Lazy-load below-the-fold media
- Avoid heavy client-side animation bundles
- Avoid high-frame-count image sequences on mobile
- Pause offscreen media
- Use responsive image sizes
- Preserve meaningful content before animation loads

Advanced Fable-style sequences must be progressive enhancements, not dependencies for core content.

## 14. Accessibility requirements

- Semantic headings in logical order
- Skip link
- Keyboard-accessible navigation and selectors
- Dialog focus management where dialogs exist
- Meaningful alternative text
- Decorative images marked appropriately
- No information communicated only through animation or color
- Reduced-motion fallback
- Adequate text contrast over photography
- Touch targets sized appropriately
- Static alternative for interactive origin and timeline experiences

## 15. SEO requirements

Homepage metadata should accurately reflect:

- 100% Kona Coffee
- Mountain View café
- Bay Area coffee truck
- Chimney cakes at Mountain View rather than crepes

Create or verify:

- Canonical metadata
- Open Graph metadata
- LocalBusiness or CafeOrCoffeeShop structured data using only verified facts
- Sitemap
- robots configuration
- Descriptive page titles
- Indexable text beneath interactive presentations

Do not add:

- Fake ratings
- Fake review schema
- Unsupported awards
- Keyword-stuffed copy
- Incorrect service locations

## 16. Phased implementation

### Phase 0 — Repository audit

Before code changes, report:

1. Current architecture
2. Current routes
3. Implemented functionality versus README claims
4. Content inaccuracies
5. Reusable components
6. Components that should be replaced
7. Asset inventory summary
8. Performance risks
9. Accessibility risks
10. Exact Phase 1 file plan
11. Packages proposed for addition or removal
12. Genuine blocking questions

Do not make code changes during the audit.

### Phase 1 — Foundation and first visual review

Implement only after audit approval:

1. Design tokens
2. Typography foundation
3. Typed centralized business content
4. New header/navigation
5. New footer foundation
6. Homepage shell
7. Cinematic hero
8. Kona experience principles
9. The Space editorial section
10. Responsive desktop/mobile behavior
11. Reduced-motion behavior
12. Correct basic metadata

Do not delete old pages.
Do not build every advanced interaction.
Do not add GSAP.
Do not deploy.

### Phase 2 — Craft and discovery

- Our Craft
- Choose Your Escape
- Signature Collection
- Refined mobile interaction
- Approved image optimization

### Phase 3 — Origin and story

- Coffee origin journey
- Trailer-to-dream timeline
- Static accessibility and SEO equivalents
- Carefully selected richer motion if justified

### Phase 4 — Supporting pages

- Experience
- Coffee
- Menu
- Our Story
- Visit
- Journal architecture if approved
- Redirect and legacy-route plan

### Phase 5 — Verification and launch preparation

- Content accuracy review
- Desktop and mobile visual review
- Keyboard and screen-reader checks
- Reduced-motion check
- Performance review
- Metadata and structured-data validation
- Square link verification
- Vercel preview review
- Launch/rollback plan

## 17. Claude Code operating procedure

When Claude Code first opens this branch, the first instruction should be:

> Read KONA_INTERACTIVE_BUILD_SPEC.md completely. Inspect the repository and produce the Phase 0 audit. Do not modify files, install packages, commit, push, deploy, merge, or open a pull request.

After the Phase 0 audit is approved, Claude may implement Phase 1 locally.

After implementation, Claude must run:

```bash
npm install
npm run lint
npm run build
```

Claude must then report:

- Files changed
- Features completed
- Content placeholders
- Lint result
- Production build result
- Mobile behavior
- Accessibility behavior
- Visual review checklist
- Recommended next step

Every commit, push, pull request, merge, and deployment requires explicit authorization.

## 18. Definition of success

The redesign succeeds when:

- It feels unmistakably like Kona Island Coffee.
- It is calm, premium, warm, and editorial.
- It uses authentic Kona assets and verified facts.
- It makes visitors want to visit.
- Ordering and directions remain obvious.
- Interaction enriches the story without obstructing it.
- Mobile is intentional.
- Reduced-motion visitors receive a complete experience.
- The production build passes.
- The current live site remains safe until final approval.
