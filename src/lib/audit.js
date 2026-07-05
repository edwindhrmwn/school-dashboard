// Audit-trail helpers. Meta columns order (rightmost in every sheet):
// IS_ACTIVE | INSERTED_BY | INSERTED_DATE | UPDATED_BY | UPDATED_DATE

export function currentUserEmail() {
  try {
    const u = JSON.parse(localStorage.getItem('goog_user') || 'null')
    return u?.email || 'unknown'
  } catch {
    return 'unknown'
  }
}

function nowStamp() {
  return new Date().toISOString()
}

// New record: activate + stamp inserted; updated left blank
export function auditStampCreate() {
  const by = currentUserEmail()
  const at = nowStamp()
  return { isActive: '1', insertedBy: by, insertedDate: at, updatedBy: '', updatedDate: '' }
}

// Edit: preserve isActive + inserted; refresh updated
export function auditStampUpdate(existing) {
  return {
    isActive: existing?.isActive ?? '1',
    insertedBy: existing?.insertedBy ?? '',
    insertedDate: existing?.insertedDate ?? '',
    updatedBy: currentUserEmail(),
    updatedDate: nowStamp(),
  }
}

// Soft delete: deactivate + refresh updated, keep inserted
export function auditStampDelete(existing) {
  return { ...auditStampUpdate(existing), isActive: '0' }
}

// A record is active unless IS_ACTIVE is explicitly '0' (blank/1 = active)
export function isActiveRecord(rec) {
  return String(rec?.isActive ?? '1') !== '0'
}
