# Product Invariants

These are properties that must **always hold**, regardless of what features are added or changed. They are the behavioral contract of the application.

When you add a new feature, define the invariants first. Then implement. The invariants are your specification — they tell the coding agent what "correct" means.

---

## Pricing

| ID | Invariant | Severity |
|----|-----------|----------|
| PRICE-01 | Cart total is never negative | Critical |
| PRICE-02 | Cart total equals the sum of (item price × quantity) for all items | Critical |
| PRICE-03 | Empty cart has zero total | Critical |
| PRICE-04 | Adding an item to the cart always increases the total | Major |
| PRICE-05 | All product prices are positive | Critical |
| PRICE-06 | Formatted prices always show exactly 2 decimal places | Major |

**Test file:** `tests/invariants/pricing.test.ts`

---

## Cart

| ID | Invariant | Severity |
|----|-----------|----------|
| CART-01 | Adding an existing item increments quantity, never duplicates the entry | Critical |
| CART-02 | Removing the last item results in an empty cart (no phantom items) | Critical |
| CART-03 | Item count displayed equals the sum of all quantities | Major |
| CART-04 | Cart operations are deterministic (same inputs → same result) | Major |

**Test file:** `tests/invariants/cart.test.ts`

---

## Discount Codes (to be added in Task 1)

_When you implement discount codes, these invariants must hold:_

| ID | Invariant | Severity |
|----|-----------|----------|
| DISC-01 | Total with discount is never negative | Critical |
| DISC-02 | Total with discount equals subtotal minus discount amount | Critical |
| DISC-03 | Discount amount never exceeds subtotal | Critical |
| DISC-04 | Invalid discount code produces an error, never a wrong total | Critical |
| DISC-05 | Applying the same code twice has the same effect as once (idempotent) | Major |

**Test file:** `tests/invariants/discount.test.ts` _(you create this)_

---

## Form Validation (to be added in Task 2)

_When you implement checkout validation, define your own invariants here. Examples:_

| ID | Invariant | Severity |
|----|-----------|----------|
| FORM-01 | Submitting with empty required fields never completes checkout | Critical |
| FORM-02 | ? | ? |
| FORM-03 | ? | ? |

_Think about: What must always be true about form submission? About validation feedback? About error states?_

**Test file:** `tests/invariants/forms.test.ts` _(you create this)_

---

## Browser-Level Invariants (verified by QA.tech)

These can't be checked in code — they require a real browser:

| ID | Invariant | Severity |
|----|-----------|----------|
| UI-01 | Empty cart page shows a helpful message, not a blank page | Major |
| UI-02 | Form validation errors appear next to the relevant field | Major |
| UI-03 | Submit button shows a loading/disabled state during submission | Major |
| UI-04 | No page shows TODO, FIXME, or placeholder text | Minor |
| UI-05 | All pages are navigable and don't show errors | Critical |
