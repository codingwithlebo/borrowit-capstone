# Decision Log
**Project:** Borrowit — Founder Capstone
**Author:** Malebo

---

## Decision: Refuse forced auth before browsing

- **Context:** Thabo explicitly asked to force sign-up before users can see any content, calling it a "growth hack." I had to decide whether to build it as requested or push back.
- **Options I considered:** (1) Build it exactly as asked — gate everything behind a login wall. (2) Build optional auth accessible from the header, with sign-up triggered at the point of booking.
- **What I chose and why:** Option 2. Mandatory registration before any content kills first-visit conversion. For a community marketplace with zero existing users, the first job is to convince someone there's something worth borrowing. If they hit a login wall before seeing a single item, most of them leave. We capture emails at booking instead — that's when the user is motivated and the email actually means something.
- **What I gave up:** Thabo's "capture emails from day one" goal is partially deferred. We get fewer emails early, but better quality ones from people who actually completed a booking.

---

## Decision: Refuse the fake urgency timer

- **Context:** Thabo asked for a "3 people are looking at this right now!!" counter on every item. He said it creates urgency.
- **Options I considered:** (1) Build it with a random number that resets every few minutes. (2) Refuse it entirely. (3) Replace it with something honest — e.g. a "requested 4 times this month" counter once we have real data.
- **What I chose and why:** Option 2, refuse it, with a note about option 3 for later. The number would be a lie. There are no real-time viewers. Dark patterns like this work once and destroy trust permanently. For a product built on community trust — where I'm lending my drill to a stranger — being caught faking urgency is fatal. I documented this clearly in FOUNDER-RESPONSE.md.
- **What I gave up:** Some conversion uplift that fake urgency genuinely does produce short-term. I traded short-term conversion for long-term trust.

---

## Decision: Use a single App.tsx with inline styles instead of separate component files and CSS

- **Context:** With a one-sprint deadline I had to choose between a well-structured multi-file component architecture and a single-file approach that I could ship and debug faster.
- **Options I considered:** (1) One component per file, CSS modules, proper folder structure. (2) Single App.tsx with all components, inline styles via a typed style helper.
- **What I chose and why:** Option 2 for this sprint. The typed `css()` helper I wrote means inline styles are still type-safe — no `any`, no magic strings. The trade-off is real: the file is long and harder to navigate. But for an MVP demo, shipping something that works beats shipping a clean architecture with half-built features. The `AppRoute` discriminated union already isolates routing cleanly, so refactoring into separate files later is one mechanical step.
- **What I gave up:** Separation of concerns, easier co-location of styles with components, and the ability to use CSS pseudo-selectors (`:hover` is done with `onMouseEnter`/`onMouseLeave` instead, which is more verbose).

---

## Decision: Model routes as a discriminated union instead of a string-based router

- **Context:** I needed client-side routing without installing React Router (keeping dependencies minimal).
- **Options I considered:** (1) Simple string state like `setPage("detail")` with separate state for the current item ID. (2) A discriminated union `AppRoute` type that encodes the page and its required params together.
- **What I chose and why:** Option 2. `AppRoute` means TypeScript enforces that navigating to the detail page requires an `itemId`, and navigating to the booking page requires both an `itemId` and a `step`. If I add a new page later and forget to handle it in the switch, the compiler tells me. It also documents the entire routing surface of the app in one type.
- **What I gave up:** The code is slightly more verbose at call sites — `onNavigate({ page: "detail", itemId: item.id })` instead of `setPage("detail"); setItemId(item.id)`. A small price for compile-time safety.

---

## Decision: Mock data in a typed file instead of an untyped JSON blob

- **Context:** The brief required mocking data without a backend, but said the data layer must be typed as if a real API were coming.
- **Options I considered:** (1) Hardcode items directly in JSX. (2) Put items in a JSON file and import it. (3) Write `items.ts` that exports `MOCK_ITEMS: Item[]` with full type annotations.
- **What I chose and why:** Option 3. The `Item` type in `types.ts` is the contract. `items.ts` imports and satisfies it. When a real API arrives, I replace `MOCK_ITEMS` with a `fetch` call — the rest of the app doesn't change because it already only knows about `Item`, not where it came from. TypeScript will tell me if the API response doesn't match the type.
- **What I gave up:** Nothing meaningful. JSON would have been slightly easier to write but would have lost type safety.

---

## Decision: Keep the filter state in BrowsePage with useMemo instead of a global store

- **Context:** Filters affect which items are shown on the browse page. I could have lifted this state globally or kept it local.
- **Options I considered:** (1) Global state (Context API or Zustand) so filters persist across navigation. (2) Local `useState` in `BrowsePage` with `useMemo` for derived filtered items.
- **What I chose and why:** Option 2. Filters are UI state, not application state. When a user navigates to a detail page and comes back, resetting filters is fine — probably expected. Adding a global store for this would be over-engineering for an MVP. `useMemo` on the filter computation means re-renders are cheap even with 100+ items.
- **What I gave up:** Filter persistence across navigation. If a user filters by "tools", clicks an item, and goes back, the filter resets. Acceptable trade-off for this sprint.

---

## Decision: Cut messaging, map, wishlist, referral codes, and dark mode from this sprint

- **Context:** Thabo asked for all of these. I had one sprint.
- **Options I considered:** (1) Try to stub all of them with placeholder UI. (2) Build 3-4 things properly and cut the rest entirely.
- **What I chose and why:** Option 2, every time. The brief says "three things done well beats ten half-built." Messaging without a backend is a text area that goes nowhere. A map without real coordinates is an image. Referral codes without a database are strings that mean nothing. Each of these deferred features is documented in FOUNDER-RESPONSE.md so Thabo knows the plan.
- **What I gave up:** The impression of completeness. A screen with a disabled "Messages" tab looks more finished than no tab at all. But it's dishonest, and it creates expectation debt.

---

## Decision: Design identity — dark, warm-toned, community feel

- **Context:** Thabo said "it has to look INSANE. Like premium. Better than Airbnb." I had to pick a visual direction.
- **Options I considered:** (1) Light, clean, Airbnb-adjacent (white cards, sans-serif, lots of space). (2) Dark background with a warm amber/orange accent — industrial feel, tool-focused, community-oriented. (3) Earthy tones, green accents, neighbourhood-garden feel.
- **What I chose and why:** Option 2. The product is about tools and gear — physical, tactile things. A dark background with an amber accent (`#f0883e`) feels premium without feeling cold. It's distinct from Airbnb (which is white and red) without trying too hard. The colour evokes rust, wood, workshop — things you'd actually borrow. Community and craft.
- **What I gave up:** Familiarity. Users who expect a marketplace to look like white-background-with-blue-buttons might take a moment to orient. I think the distinctiveness is worth it for an investor demo.

---

## Decision: Two-step booking flow instead of one long form

- **Context:** The booking flow needs dates and contact details. I could put both on one screen or split them.
- **Options I considered:** (1) Single form with all fields — dates, name, email, confirm. (2) Two steps: dates first (with live cost calculation), then contact details.
- **What I chose and why:** Option 2. Splitting the form reduces cognitive load and lets users see the total cost before they commit personal details. Step 1 (dates) shows the cost dynamically as they change dates — this is more useful feedback than a static total. Step 2 feels like a lighter ask once they've already committed to the dates. The two-step flow also mirrors what Airbnb and similar products do, so it feels familiar.
- **What I gave up:** One fewer screen to navigate. A single form would be slightly faster to complete. The trade-off is worth it for the improved UX.
