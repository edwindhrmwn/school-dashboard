import { sheetsClient } from './sheetsClient'
import { SHEETS, rowToUserAkses } from '../config/sheets'
import { isActiveRecord } from './audit'

// True if `email` exists in User_Akses with IS_ACTIVE truthy (blank/1 = active).
// Comparison is case-insensitive since Google emails are effectively case-insensitive.
export async function isEmailAuthorized(email) {
  if (!email) return false
  const rows = await sheetsClient.get(SHEETS.USER_AKSES)
  const users = rows.slice(1).map((r, i) => rowToUserAkses(r, i + 2))
  const target = email.trim().toLowerCase()
  return users.some((u) => u.email.trim().toLowerCase() === target && isActiveRecord(u))
}
