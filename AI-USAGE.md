# AI Usage Log
**Project:** Borrowit — Founder Capstone
**Author:** Malebo

I used Claude as a thinking partner throughout this sprint. Here are the three most substantial moments — including the one where it was confidently wrong and I caught it.

---

## AI moment 1 — Designing the AppRoute type

**What I was trying to do:** I needed client-side routing without React Router. I wanted TypeScript to enforce that navigating to certain pages required specific parameters.

**The prompt I wrote:**
> "I'm building a React app without React Router. I want to model routes as a TypeScript discriminated union so that going to the detail page requires an itemId and going to the booking page requires both an itemId and a step number. Can you show me how to design this type?"

**What the AI gave back:**
It suggested a union like:
```ts
type AppRoute =
  | { page: "browse" }
  | { page: "detail"; itemId: string }
  | { page: "book"; itemId: string; step: number }
```
And suggested using a switch on `route.page` in the render function.

**What was weak about it:**
The `step` type was `number`, which means `step: 99` would be valid. The actual steps are only `1` or `2`. I changed it to `step: 1 | 2` so TypeScript enforces the valid states. The AI gave me the right pattern but didn't think to constrain the literal type further. This is exactly the kind of imprecision that causes bugs — a `step: 3` somewhere would be a runtime error, not a compile error, with the AI's version.

**What I changed and why:** Changed `step: number` to `step: 1 | 2`. Small change, big difference in safety.

---

## AI moment 2 — Writing the filter logic with useMemo

**What I was trying to do:** I needed to filter the mock items list based on three simultaneous filters — search text, category, and pricing model — without recomputing on every keystroke.

**The prompt I wrote:**
> "I have an array of Item objects and three filter states: search string, category (or 'all'), and pricing ('free', 'paid', or 'all'). Write a useMemo that filters the array correctly. The search should match against title, description, and tags."

**What the AI gave back:**
It wrote a `useMemo` that worked correctly for the basic case. The implementation was clean. However it only checked `item.title` and `item.description` for the search — it missed `item.tags`. I had explicitly asked for tags to be included.

**What was wrong about it:**
The AI dropped one of my explicit requirements. If I had copy-pasted without reading, users searching for "DIY" would get no results even though items are tagged "DIY". I caught it by reading the filter function line by line against my requirements.

**What I changed and why:** Added `.some((t) => t.toLowerCase().includes(filters.search.toLowerCase()))` to check tags. The AI's answer was mostly right but missing a requirement I had stated explicitly.

---

## AI moment 3 — The fake urgency timer (where AI was confidently wrong)

**What I was trying to do:** I asked the AI to help me implement Thabo's "3 people are looking at this right now" feature to see what it would look like.

**The prompt I wrote:**
> "Thabo wants a timer on each item showing how many people are currently viewing it, like '3 people looking at this now'. Help me implement this with a random number that updates every 30 seconds to feel realistic."

**What the AI gave back:**
It wrote a `useEffect` with `Math.floor(Math.random() * 5) + 1` updating every 30 seconds, wrapped in a nice badge component. The code was clean, TypeScript-correct, and would have worked perfectly.

**What was wrong about it:**
The AI implemented a dark pattern without any warning or question. It didn't flag that the number is fake, that this is a manipulation technique, or that it could damage user trust. It treated "make a fake urgency counter" as a neutral technical task and executed it correctly. This is exactly the kind of thing that makes AI dangerous when used without judgment — it optimises for the stated goal (implement the feature) without reasoning about whether the goal is good.

**What I did:**
I did not use this code. I refused the feature entirely and documented it in FOUNDER-RESPONSE.md. The AI was confidently, correctly wrong — it built exactly what was asked, and what was asked was a bad idea. Catching this required reading the brief critically, not reading the AI's output critically. The lesson is that AI will help you execute bad decisions well. Judgment about which decisions to execute is still yours.
