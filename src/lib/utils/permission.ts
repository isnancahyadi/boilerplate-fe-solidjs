/**
 * Permission Helper
 *
 * Mengurai string permissions format `module:action` (misal `user:create`, `item:delete`)
 * dan memverifikasi otorisasi pengguna terhadap aksi UI tertentu.
 */

export function parsePermission(module: string, userPermissions?: Array<string> | null): Array<string> {
  if (!userPermissions || !Array.isArray(userPermissions) || userPermissions.length === 0) {
    return [];
  }

  const prefix = `${module.toLowerCase()}:`;

  return userPermissions
    .filter((perm) => typeof perm === "string" && perm.toLowerCase().startsWith(prefix))
    .map((perm) => perm.slice(prefix.length).toLowerCase());
}

export function hasPermission(
  userPermissions: Array<string> | null | undefined,
  module: string,
  action: string,
): boolean {
  const actions = parsePermission(module, userPermissions);
  return actions.includes(action.toLowerCase()) || actions.includes("*");
}
