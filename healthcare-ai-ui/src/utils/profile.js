export function displayUserName(user, fallback = "Authenticated user") {
  return user?.name || user?.email || fallback;
}

export function displaySpecialty(user, fallback = "Role not provided") {
  return user?.specialty || fallback;
}

export function userInitials(user) {
  const source = displayUserName(user, "");
  const parts = source
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
