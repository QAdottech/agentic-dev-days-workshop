# Workshop Tasks

## How this works

You have a bookstore e-commerce app with a 4-layer verification pipeline:

```
Layer 1: Build + Lint + Types       → catches syntax/type errors
Layer 2: Unit Tests (Vitest)        → catches logic errors
Layer 3: Invariant Tests (Vitest)   → catches property violations
Layer 4: QA.tech E2E                → catches UX/behavioral issues in a real browser
```

Each task has two parts: **build** something with your coding agent, and **verify** it by adding tests to the pipeline. Use your coding agent for both parts.

Run tests locally before pushing: `npm test`

---

## Task 0: Smoke Test

**Goal:** Verify your setup works end to end.

1. Create a branch: `git checkout -b pair-XX` (use your assigned number)
2. Make a small change — fix the typo in the footer or update the shop name
3. Push and open a PR against `main`
4. Watch: Vercel deploys a preview, the pipeline runs Layers 1-3
5. Verify: everything passes, preview URL works

**Done when:** PR is open, pipeline is green, preview URL loads the app.

---

## Task 1: Empty Cart State

**Goal:** Experience unit tests as fast feedback for your coding agent.

### Build

The cart page is blank when empty — just a white page. Ask your coding agent:

> "When the cart is empty, show a friendly message and a link back to the product list instead of a blank page."

### Verify

Add unit tests in `tests/unit/cart.test.ts`:

```typescript
// Hint: you'll need to test the component renders differently
// when the cart is empty vs when it has items.
// You can also ask your coding agent to write these tests.
```

Push, watch the pipeline. Layer 2 should validate your empty state works.

---

## Task 2: Discount Codes

**Goal:** Experience invariant tests catching what unit tests miss.

### Build

Ask your coding agent:

> "Add a discount code feature to the checkout page. The code SAVE10 gives 10% off and HALF gives 50% off. Show an input field where users can enter a code, with an 'Apply' button. Invalid codes should show an error. The order summary should show the subtotal, discount amount, and new total."

### Verify — Unit tests

Add to `tests/unit/discount.test.ts` (new file):

```typescript
import { describe, it, expect } from "vitest";

// Test the discount calculation logic:
// - SAVE10 applies 10% discount
// - HALF applies 50% discount
// - Invalid code returns an error
// - Discount is calculated on the subtotal
```

### Verify — Invariant tests

Add to `tests/invariants/pricing.test.ts`:

```typescript
// These invariants must hold regardless of what discount is applied:
//
// - Total is never negative (what if discount > subtotal?)
// - Total equals subtotal minus discount amount (no rounding drift)
// - Discount is never greater than subtotal
// - Applying a discount to an empty cart doesn't break anything
```

Push, watch the pipeline. The invariant tests will likely catch edge cases your coding agent didn't handle — negative totals, empty cart with discount, rounding issues.

**The lesson:** Unit tests check what you thought of. Invariants check what must always be true.

---

## Task 3: Form Validation + QA.tech

**Goal:** Enable Layer 4 and see what only a browser can catch.

### Build

Ask your coding agent:

> "Add client-side validation to the checkout form. Email must be a valid email, name is required, card number must be exactly 16 digits. Show inline error messages next to each field. The submit button should be disabled while the form is submitting."

### Verify — Invariant tests

Add to `tests/invariants/forms.test.ts` (new file):

```typescript
import { describe, it, expect } from "vitest";

// Form invariants:
// - Submitting with empty required fields does not proceed
// - Invalid email format is rejected
// - Card number validation accepts exactly 16 digits
```

### Verify — Enable Layer 4

1. Open `.github/workflows/verify.yml`
2. Uncomment the `layer-4-e2e` job
3. Push

QA.tech will test your app in a real browser. It takes ~5 minutes. Move on to the discussion while it runs — the results will appear as a PR comment.

**What QA.tech might find that your code-level tests can't:**
- Error messages appear but aren't next to the right fields
- The submit button disables but there's no visual loading indicator
- Double-clicking submit before it disables sends the form twice
- The form works on desktop but breaks on mobile

---

## Task 4: Define Your Own Invariant (stretch)

**Goal:** Pick a behavioral invariant and implement it.

Choose one:

### Option A: Destructive action confirmation
> Every remove/delete action should require confirmation before executing.

The "Remove" button on cart items currently just deletes immediately. Add a confirmation dialog and write an invariant test that verifies destructive actions always ask for confirmation.

### Option B: Deep link integrity
> Every meaningful page should work when accessed directly via URL.

Write a test that verifies: if you navigate to `/cart` with items, share that URL, and open it fresh — the page renders correctly (even if the cart is empty in a new session, the page shouldn't break).

### Option C: No placeholder text in production
> User-facing text must never contain TODO, FIXME, Lorem ipsum, or placeholder content.

Write an invariant test that scans the rendered output of key pages for placeholder text patterns. (Hint: there are already some TODOs in the codebase.)

---

## Reference: Running Tests Locally

```bash
npm test              # run all tests
npm run test:unit     # run only unit tests
npm run test:invariants  # run only invariant tests
npm run test:watch    # watch mode — re-runs on changes
```

## Reference: Useful Invariant Patterns

```typescript
// Property: something is always true
it("total is never negative", () => {
  for (const scenario of scenarios) {
    expect(calculate(scenario)).toBeGreaterThanOrEqual(0);
  }
});

// Consistency: two things always agree
it("displayed total equals computed total", () => {
  expect(displayedTotal).toBeCloseTo(computedTotal);
});

// Boundary: edge cases don't break things
it("works with zero items", () => { ... });
it("works with maximum quantity", () => { ... });

// Idempotency: doing it twice has the same effect as once
it("applying the same discount twice doesn't stack", () => { ... });
```
