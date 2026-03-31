const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const MIN_PASSWORD_LENGTH = 10;

export function validateEmailFormat(email: string): string | null {
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
  return null;
}

export function validatePasswordFormat(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return null;
}

export function validateLoginForm(
  email: string,
  password: string,
): string | null {
  return validateEmailFormat(email) ?? validatePasswordFormat(password);
}

export function validateSignupForm(
  email: string,
  password: string,
): string | null {
  return validateEmailFormat(email) ?? validatePasswordFormat(password);
}

export function validateVerificationCode(code: string): string | null {
  if (!code) return "Please enter the verification code.";
  if (!/^\d{6}$/.test(code)) return "Verification code must be 6 digits.";
  return null;
}

export function validatePasswordResetForm(
  code: string,
  newPassword: string,
): string | null {
  return validateVerificationCode(code) ?? validatePasswordFormat(newPassword);
}
