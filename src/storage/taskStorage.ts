import type { Task } from '../domain/task.ts'

export const STORAGE_KEY = 'spisok-zadach.tasks.v1'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/

export type LoadResult = {
  tasks: Task[]
  problem: 'none' | 'unavailable' | 'corrupt'
  corruptRaw: string | null
}

export type SaveResult =
  | { status: 'saved'; backupKey?: string }
  | { status: 'backup-failed' }
  | { status: 'write-failed' }

export function loadTasks(): LoadResult {
  let raw: string | null

  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return { tasks: [], problem: 'unavailable', corruptRaw: null }
  }

  if (raw === null) return { tasks: [], problem: 'none', corruptRaw: null }

  const tasks = parseStoredTasks(raw)
  if (tasks === null) return { tasks: [], problem: 'corrupt', corruptRaw: raw }

  return { tasks, problem: 'none', corruptRaw: null }
}

export function saveTasks(tasks: readonly Task[], corruptRaw: string | null): SaveResult {
  if (corruptRaw !== null) {
    const backupKey = createBackupKey()
    try {
      localStorage.setItem(backupKey, corruptRaw)
      if (localStorage.getItem(backupKey) !== corruptRaw) {
        removeQuietly(backupKey)
        return { status: 'backup-failed' }
      }
    } catch {
      return { status: 'backup-failed' }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      return { status: 'saved', backupKey }
    } catch {
      return { status: 'write-failed' }
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return { status: 'saved' }
  } catch {
    return { status: 'write-failed' }
  }
}

export function parseStoredTasks(raw: string): Task[] | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  if (!Array.isArray(parsed)) return null

  const ids = new Set<string>()
  const tasks: Task[] = []

  for (const item of parsed) {
    const task = parseTask(item)
    if (task === null || ids.has(task.id)) return null
    ids.add(task.id)
    tasks.push(task)
  }

  return tasks
}

function parseTask(value: unknown): Task | null {
  if (!isRecord(value)) return null

  const { id, title, completed, createdAt, archivedAt } = value
  if (typeof id !== 'string' || id.trim() === '') return null
  if (typeof title !== 'string' || title.trim() === '' || title !== title.trim()) return null
  if (typeof completed !== 'boolean') return null
  if (!isIsoDate(createdAt)) return null
  if (archivedAt !== null && !isIsoDate(archivedAt)) return null

  return { id, title, completed, createdAt, archivedAt }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(value))
}

function createBackupKey(): string {
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${STORAGE_KEY}.backup.${Date.now()}.${suffix}`
}

function removeQuietly(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Исходная запись важнее неудачной попытки стереть пустую копию.
  }
}
