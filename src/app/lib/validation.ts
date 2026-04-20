export interface ValidationErrors {
  name?: string;
  email?: string;
  cardNumber?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
}

export function validateName(name: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Name is required";
  }
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Email is required";
  }
  if (trimmed.includes(" ")) {
    return "Email must not contain spaces";
  }
  const parts = trimmed.split("@");
  if (parts.length !== 2) {
    return "Email must contain exactly one @";
  }
  const [local, domain] = parts;
  if (!local) {
    return "Email must have a local part before @";
  }
  if (!domain.includes(".")) {
    return "Invalid email format";
  }
  return undefined;
}

export function validateCardNumber(cardNumber: string): string | undefined {
  const digitsOnly = cardNumber.replace(/\s/g, "");
  if (!digitsOnly) {
    return "Card number is required";
  }
  if (!/^\d+$/.test(digitsOnly)) {
    return "Card number must contain only digits";
  }
  if (digitsOnly.length !== 16) {
    return "Card number must be exactly 16 digits";
  }
  return undefined;
}

export function validateCheckoutForm(fields: {
  name: string;
  email: string;
  cardNumber: string;
}): ValidationResult {
  const errors: ValidationErrors = {
    name: validateName(fields.name),
    email: validateEmail(fields.email),
    cardNumber: validateCardNumber(fields.cardNumber),
  };

  const valid = !errors.name && !errors.email && !errors.cardNumber;

  return { valid, errors };
}
