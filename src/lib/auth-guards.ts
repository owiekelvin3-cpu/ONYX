/** Team console routes (not the public team sign-in page). */
export function isAdminPanelPath(path: string): boolean {
  return path === "/admin" || (path.startsWith("/admin/") && path !== "/admin/login");
}
