# Workshop Tasks

## How this works

You have a bookstore app with a verification pipeline that gives your coding agent measurable feedback:

```
Layer 1: Build + Lint + Types       → catches syntax/type errors        (seconds)
Layer 2: Unit Tests                 → catches logic errors              (seconds)
Layer 3: Invariant Tests            → catches property violations       (seconds)
Layer 4: QA.tech PR Review          → catches UX/behavioral issues      (~5 min)
```

Business logic lives in `src/app/lib/` as pure functions. Tests import and verify the real code.

Invariants are defined in `INVARIANTS.md`. Read it before you start.

---

## Your workflow

1. Read the task and the invariants that must hold
2. Direct your coding agent: "Implement this feature AND write tests that verify these invariants"
3. Push, open a PR against your pair branch
4. Watch the pipeline — did the invariants pass?
5. If not, direct the agent to read the failure and fix it
6. When code layers pass, comment `@qa.tech` on the PR for browser verification

Run tests locally first: `npm test`

---

## Task 0: Understand the Environment (5 min)

**Goal:** See what's already in place before changing anything.

1. Read `INVARIANTS.md` — these are the rules
2. Look at `src/app/lib/cart.ts` — this is the business logic, pure functions
3. Look at `tests/invariants/pricing.test.ts` — this is how invariants become tests
4. Run `npm test` — see all 54 tests pass
5. Create your branch: `git checkout -b pair-XX/setup` (use your pair number)
6. Make a trivial change (update the shop name in Header.tsx)
7. Push and open a PR against `pair-XX`
8. Watch: Vercel deploys a preview, pipeline runs Layers 1-3

**Done when:** PR is open, pipeline is green, preview URL loads.

---

## Task 1: Discount Codes (20 min)

**Goal:** Implement a feature where the invariants are already defined for you.

### The invariants (from INVARIANTS.md)

Your implementation must satisfy:

| ID | Must be true |
|----|-------------|
| DISC-01 | Total with discount is never negative |
| DISC-02 | Total with discount equals subtotal minus discount amount |
| DISC-03 | Discount amount never exceeds subtotal |
| DISC-04 | Invalid discount code produces an error, never a wrong total |
| DISC-05 | Applying the same code twice has the same effect as once |

### Direct your coding agent

> "Add discount codes to the bookstore checkout. Create the discount logic in `src/app/lib/discount.ts` as pure functions. The codes are: SAVE10 (10% off) and HALF (50% off). Invalid codes should return an error.
>
> Add the UI to the checkout page: an input field for the code, an Apply button, and show the subtotal, discount amount, and new total in the order summary.
>
> Write invariant tests in `tests/invariants/discount.test.ts` that verify DISC-01 through DISC-05 from INVARIANTS.md. Import from `src/app/lib/discount.ts` and test the real functions.
>
> Run `npm test` to verify everything passes before committing."

### What to watch for

- Does the agent handle the edge cases? (Discount on empty cart? SAVE10 on a $0 subtotal?)
- Do the invariant tests actually test properties, or did the agent just test specific inputs?
- If an invariant fails, direct the agent to read the test output and fix the implementation

### Push

Create a feature branch: `git checkout -b pair-XX/discount-codes`

Open a PR against `pair-XX`. Watch the pipeline.

---

## Task 2: Form Validation (20 min)

**Goal:** Define your OWN invariants before implementing.

### Step 1: Define invariants

Before writing any code, think: **what must always be true about checkout form validation?**

Add your invariants to `INVARIANTS.md` under the "Form Validation" section. Examples to consider:

- What happens when required fields are empty?
- What happens with an invalid email format?
- Can the form be submitted while already submitting?
- What should happen to already-entered data when validation fails?

### Step 2: Direct your coding agent

> "Add client-side validation to the checkout form. Create validation logic in `src/app/lib/validation.ts` as pure functions. Name is required, email must be valid, card number must be exactly 16 digits.
>
> Add inline error messages to the checkout page that appear next to the relevant field.
>
> Write invariant tests in `tests/invariants/forms.test.ts` that verify the invariants I defined in INVARIANTS.md. Import from `src/app/lib/validation.ts` and test the real functions."

### Step 3: Push and review

Open a PR against `pair-XX`. The code-level invariants validate the logic.

Then comment on the PR: `@qa.tech test the checkout form validation. Submit with empty fields, with invalid email, and with valid data.`

**QA.tech will find things your code tests can't:** Are the error messages actually visible? Does the UX make sense? Is there a loading state?

---

## Task 3: Choose Your Own (stretch)

Pick one and define the invariants yourself:

### Option A: Quantity limits
Add a maximum quantity per item (e.g., 10). Define invariants: quantity is always between 1 and max, UI prevents exceeding the limit, total reflects the capped quantity.

### Option B: Cart persistence
Persist the cart to localStorage. Define invariants: reloading the page preserves cart contents, clearing the cart clears storage, corrupted storage doesn't crash the app.

### Option C: Order confirmation
Show order details on the confirmation page. Define invariants: confirmation shows the correct items and total, order number is unique, navigating back doesn't re-submit.

---

## Reference: Test Commands

```bash
npm test                  # run all tests
npm run test:unit         # unit tests only
npm run test:invariants   # invariant tests only
npm run test:watch        # watch mode
```

## Reference: Project Structure

```
src/app/
  lib/
    cart.ts               # cart logic (pure functions)
    discount.ts           # you create this in Task 1
    validation.ts         # you create this in Task 2
  context/
    CartContext.tsx        # React wrapper around lib/cart.ts
  components/             # UI components
  data/products.ts        # product catalog

tests/
  unit/cart.test.ts       # unit tests for cart functions
  invariants/
    pricing.test.ts       # PRICE-01 through PRICE-06
    cart.test.ts          # CART-01 through CART-04
    discount.test.ts      # you create this in Task 1
    forms.test.ts         # you create this in Task 2
```
