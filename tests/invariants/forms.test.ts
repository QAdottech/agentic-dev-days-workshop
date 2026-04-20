import { describe, it, expect } from "vitest";
import {
  validateName,
  validateEmail,
  validateCardNumber,
  validateCheckoutForm,
} from "@/app/lib/validation";

describe("FORM-01: Submitting with empty required fields never completes checkout", () => {
  it("all empty fields fails validation", () => {
    const result = validateCheckoutForm({ name: "", email: "", cardNumber: "" });
    expect(result.valid).toBe(false);
  });

  it("empty name fails", () => {
    const result = validateCheckoutForm({
      name: "",
      email: "test@example.com",
      cardNumber: "4242424242424242",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
  });

  it("empty email fails", () => {
    const result = validateCheckoutForm({
      name: "John",
      email: "",
      cardNumber: "4242424242424242",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeTruthy();
  });

  it("empty card number fails", () => {
    const result = validateCheckoutForm({
      name: "John",
      email: "test@example.com",
      cardNumber: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors.cardNumber).toBeTruthy();
  });

  it("all valid fields passes", () => {
    const result = validateCheckoutForm({
      name: "John Doe",
      email: "john@example.com",
      cardNumber: "4242424242424242",
    });
    expect(result.valid).toBe(true);
  });
});

describe("FORM-02: A valid email must contain exactly one @ and at least one dot after it", () => {
  const invalidEmails = [
    "notanemail",
    "missing@dot",
    "@nodomain.com",
    "two@@signs.com",
    "spaces in@email.com",
  ];

  const validEmails = [
    "test@example.com",
    "user@sub.domain.com",
    "a@b.co",
  ];

  it.each(invalidEmails)("rejects '%s'", (email) => {
    expect(validateEmail(email)).toBeTruthy();
  });

  it.each(validEmails)("accepts '%s'", (email) => {
    expect(validateEmail(email)).toBeUndefined();
  });
});

describe("FORM-03: Card number must be exactly 16 digits", () => {
  const invalidCards = [
    "123",
    "12345678901234567",
    "abcdefghijklmnop",
    "4242-4242-4242-4242",
    "",
  ];

  const validCards = [
    "4242424242424242",
    "1234567890123456",
    "4242 4242 4242 4242", // spaces stripped
  ];

  it.each(invalidCards)("rejects '%s'", (card) => {
    expect(validateCardNumber(card)).toBeTruthy();
  });

  it.each(validCards)("accepts '%s'", (card) => {
    expect(validateCardNumber(card)).toBeUndefined();
  });
});

describe("FORM-04: Validation of one field does not affect other fields", () => {
  it("invalid email does not produce errors for valid name and card", () => {
    const result = validateCheckoutForm({
      name: "John Doe",
      email: "bad",
      cardNumber: "4242424242424242",
    });
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.name).toBeUndefined();
    expect(result.errors.cardNumber).toBeUndefined();
  });

  it("invalid card does not produce errors for valid name and email", () => {
    const result = validateCheckoutForm({
      name: "John Doe",
      email: "john@example.com",
      cardNumber: "123",
    });
    expect(result.errors.cardNumber).toBeTruthy();
    expect(result.errors.name).toBeUndefined();
    expect(result.errors.email).toBeUndefined();
  });
});

describe("FORM-05: All validation errors are clearable by fixing the input", () => {
  it("fixing name clears name error", () => {
    const bad = validateCheckoutForm({ name: "", email: "a@b.com", cardNumber: "4242424242424242" });
    expect(bad.errors.name).toBeTruthy();
    const fixed = validateCheckoutForm({ name: "John", email: "a@b.com", cardNumber: "4242424242424242" });
    expect(fixed.errors.name).toBeUndefined();
  });

  it("fixing email clears email error", () => {
    const bad = validateCheckoutForm({ name: "John", email: "bad", cardNumber: "4242424242424242" });
    expect(bad.errors.email).toBeTruthy();
    const fixed = validateCheckoutForm({ name: "John", email: "a@b.com", cardNumber: "4242424242424242" });
    expect(fixed.errors.email).toBeUndefined();
  });

  it("fixing card clears card error", () => {
    const bad = validateCheckoutForm({ name: "John", email: "a@b.com", cardNumber: "123" });
    expect(bad.errors.cardNumber).toBeTruthy();
    const fixed = validateCheckoutForm({ name: "John", email: "a@b.com", cardNumber: "4242424242424242" });
    expect(fixed.errors.cardNumber).toBeUndefined();
  });
});
