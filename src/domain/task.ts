export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: string
  archivedAt: string | null
}

export type TaskSection = 'tasks' | 'archive'

export type TaskFilter = 'all' | 'active' | 'completed'

export function createTask(title: string, now: Date = new Date()): Task | null {
  const normalizedTitle = title.trim()
  if (normalizedTitle === '') return null

  return {
    id: crypto.randomUUID(),
    title: normalizedTitle,
    completed: false,
    createdAt: now.toISOString(),
    archivedAt: null,
  }
}

export function activeTasks(tasks: readonly Task[]): Task[] {
  return tasks
    .filter((task) => task.archivedAt === null)
    .sort(byCreatedAtDesc)
}

export function archivedTasks(tasks: readonly Task[]): Task[] {
  return tasks
    .filter((task) => task.archivedAt !== null)
    .sort(byArchivedAtDesc)
}

export function applyFilter(tasks: readonly Task[], filter: TaskFilter): Task[] {
  if (filter === 'active') return tasks.filter((task) => !task.completed)
  if (filter === 'completed') return tasks.filter((task) => task.completed)
  return [...tasks]
}

export function withToggledCompletion(tasks: readonly Task[], id: string): Task[] {
  return mapTask(tasks, id, (task) => ({ ...task, completed: !task.completed }))
}

export function withArchived(tasks: readonly Task[], id: string, archivedAt: string): Task[] {
  return mapTask(tasks, id, (task) =>
    task.archivedAt === null ? { ...task, archivedAt } : task,
  )
}

export function withRestored(tasks: readonly Task[], id: string): Task[] {
  return mapTask(tasks, id, (task) =>
    task.archivedAt !== null ? { ...task, archivedAt: null } : task,
  )
}

export function withoutTask(tasks: readonly Task[], id: string): Task[] {
  const next = tasks.filter((task) => task.id !== id)
  return next.length === tasks.length ? (tasks as Task[]) : next
}

export function formatTaskCount(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  let noun = 'задач'

  if (mod10 === 1 && mod100 !== 11) noun = 'задача'
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) noun = 'задачи'

  return `${count} ${noun}`
}

function mapTask(
  tasks: readonly Task[],
  id: string,
  update: (task: Task) => Task,
): Task[] {
  let changed = false
  const next = tasks.map((task) => {
    if (task.id !== id) return task
    const updated = update(task)
    if (updated !== task) changed = true
    return updated
  })

  return changed ? next : (tasks as Task[])
}

function byCreatedAtDesc(left: Task, right: Task): number {
  return right.createdAt.localeCompare(left.createdAt) || right.id.localeCompare(left.id)
}

function byArchivedAtDesc(left: Task, right: Task): number {
  return (
    (right.archivedAt ?? '').localeCompare(left.archivedAt ?? '') ||
    right.id.localeCompare(left.id)
  )
}
