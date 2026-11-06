import { useCallback, useRef, useState } from 'react'
import {
  createTask,
  withArchived,
  withRestored,
  withToggledCompletion,
  withoutTask,
  type Task,
} from '../domain/task.ts'
import { loadTasks, saveTasks, type LoadResult } from '../storage/taskStorage.ts'

export type StorageNotice =
  | { type: 'none' }
  | { type: 'unavailable' }
  | { type: 'corrupt' }
  | { type: 'backup-failed' }
  | { type: 'write-failed' }
  | { type: 'recovered'; backupKey: string }

export function useTaskList() {
  const [snapshot] = useState<LoadResult>(() => loadTasks())
  const [tasks, setTasks] = useState<Task[]>(snapshot.tasks)
  const [notice, setNotice] = useState<StorageNotice>(() => noticeFromLoad(snapshot))
  const tasksRef = useRef(tasks)
  const corruptRawRef = useRef<string | null>(snapshot.corruptRaw)
  const storageBlockedRef = useRef(snapshot.problem === 'unavailable')

  const commit = useCallback((updater: (current: readonly Task[]) => Task[]) => {
    const next = updater(tasksRef.current)
    if (next === tasksRef.current) return

    tasksRef.current = next
    setTasks(next)

    if (storageBlockedRef.current) return

    const result = saveTasks(next, corruptRawRef.current)
    if (result.status === 'saved') {
      if (result.backupKey) {
        corruptRawRef.current = null
        setNotice({ type: 'recovered', backupKey: result.backupKey })
        return
      }

      setNotice((current) =>
        current.type === 'write-failed' ||
        current.type === 'backup-failed' ||
        current.type === 'corrupt'
          ? { type: 'none' }
          : current,
      )
      return
    }

    if (result.status === 'backup-failed') {
      setNotice({ type: 'backup-failed' })
      return
    }

    setNotice({ type: 'write-failed' })
  }, [])

  const addTask = useCallback(
    (title: string) => {
      const task = createTask(title)
      if (!task) return false
      commit((current) => [task, ...current])
      return true
    },
    [commit],
  )

  const toggleTask = useCallback(
    (id: string) => {
      commit((current) => withToggledCompletion(current, id))
    },
    [commit],
  )

  const archiveTask = useCallback(
    (id: string) => {
      const archivedAt = new Date().toISOString()
      commit((current) => withArchived(current, id, archivedAt))
    },
    [commit],
  )

  const restoreTask = useCallback(
    (id: string) => {
      commit((current) => withRestored(current, id))
    },
    [commit],
  )

  const deleteTask = useCallback(
    (id: string) => {
      commit((current) => withoutTask(current, id))
    },
    [commit],
  )

  const dismissNotice = useCallback(() => {
    setNotice((current) => (current.type === 'recovered' ? { type: 'none' } : current))
  }, [])

  return {
    tasks,
    notice,
    addTask,
    toggleTask,
    archiveTask,
    restoreTask,
    deleteTask,
    dismissNotice,
  }
}

function noticeFromLoad(result: LoadResult): StorageNotice {
  if (result.problem === 'unavailable') return { type: 'unavailable' }
  if (result.problem === 'corrupt') return { type: 'corrupt' }
  return { type: 'none' }
}
