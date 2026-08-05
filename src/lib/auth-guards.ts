/** Team console routes (not the public team sign-in page). */
export function isAdminPanelPath(path: string): boolean {
  return path === "/admin" || (path.startsWith("/admin/") && path !== "/admin/login");
}

export const ADMIN_AUTH_COOKIE = "onyx_admin_auth";

export function setAdminAuthCookie() {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ADMIN_AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

export function clearAdminAuthCookie() {
  document.cookie = `${ADMIN_AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function hasAdminAuthCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((part) => part === `${ADMIN_AUTH_COOKIE}=1`);
}
