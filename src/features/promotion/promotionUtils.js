// Parse a class name like "1 MINA" or "6 ARAFAH 1" → { level, suffix }
export function parseClass(name) {
  const m = String(name ?? '').match(/^(\d+)\s+(.+)$/)
  if (!m) return { level: null, suffix: name ?? '' }
  return { level: Number(m[1]), suffix: m[2] }
}

// Preferred next class (level + 1, same suffix) if it exists in the Kelas list.
export function nextClassName(currentName, classes) {
  const { level, suffix } = parseClass(currentName)
  if (level == null) return null
  const target = classes.find((c) => {
    const p = parseClass(c.className)
    return p.level === level + 1 && p.suffix === suffix
  })
  return target?.className ?? null
}

// All classes one level above the current one (any suffix) — e.g. 1 MINA → all "2 *".
export function classesAtNextLevel(currentName, classes) {
  const { level } = parseClass(currentName)
  if (level == null) return []
  return classes.filter((c) => parseClass(c.className).level === level + 1)
}

// Best default promotion target: same-suffix next class, else first class of next level, else '' (→ Lulus).
export function defaultTarget(currentName, classes) {
  return nextClassName(currentName, classes) || classesAtNextLevel(currentName, classes)[0]?.className || ''
}
