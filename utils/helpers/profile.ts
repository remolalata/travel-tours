type ProfileIdentityInput = {
  firstName: string;
  lastName: string;
  email: string;
  fallbackName: string;
};

export function buildProfileDisplayName({
  firstName,
  lastName,
  email,
  fallbackName,
}: ProfileIdentityInput): string {
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  const emailName = email.trim().split('@')[0];

  return emailName || fallbackName;
}

export function buildProfileInitials({
  firstName,
  lastName,
  email,
  fallbackName,
}: ProfileIdentityInput): string {
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  const emailName = email.trim().split('@')[0]?.charAt(0).toUpperCase();

  return emailName || fallbackName.charAt(0).toUpperCase();
}
