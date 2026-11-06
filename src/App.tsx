import { useState, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { activeTasks, applyFilter, archivedTasks, type TaskFilter, type TaskSection } from './domain/task.ts'
import { AddTaskForm } from './components/AddTaskForm.tsx'
import { EmptyState, type EmptyKind } from './components/EmptyState.tsx'
import { SectionSwitch, TaskFilters } from './components/ListControls.tsx'
import { StorageNotice } from './components/StorageNotice.tsx'
import { TaskRow } from './components/TaskRow.tsx'
import { useTaskList } from './hooks/useTaskList.ts'

export default function App() {
  const { tasks, notice, addTask, toggleTask, archiveTask, restoreTask, deleteTask, dismissNotice } =
    useTaskList()
  const [section, setSection] = useState<TaskSection>('tasks')
  const [filter, setFilter] = useState<TaskFilter>('all')

  const inbox = activeTasks(tasks)
  const archived = archivedTasks(tasks)
  const visible = applyFilter(inbox, filter)
  const emptyKind: EmptyKind =
    inbox.length === 0 ? 'tasks' : filter === 'active' ? 'active' : 'completed'

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3 }, pt: { xs: 5, sm: 8 }, pb: 8 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: '2.125rem', sm: '2.75rem' }, mb: 1.5 }}
        >
          Список задач
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480, mb: 4 }}>
          Список хранится в этом браузере. Выполненное можно вернуть в работу, а ненужное — в архив.
        </Typography>

        <StorageNotice notice={notice} onDismiss={dismissNotice} />
        <AddTaskForm onAdd={addTask} />

        <Box sx={{ mt: 4 }}>
          <SectionSwitch
            section={section}
            taskCount={inbox.length}
            archiveCount={archived.length}
            onChange={setSection}
          />
        </Box>

        {section === 'tasks' ? (
          <Box component="section" aria-label="Текущие задачи" sx={{ mt: 2 }}>
            <TaskFilters
              filter={filter}
              counts={{
                all: inbox.length,
                active: inbox.filter((task) => !task.completed).length,
                completed: inbox.filter((task) => task.completed).length,
              }}
              onChange={setFilter}
            />
            <TaskPanel>
              {visible.length === 0 ? (
                <EmptyState kind={emptyKind} />
              ) : (
                <Box component="ul" sx={listSx}>
                  {visible.map((task, index) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      mode="archive"
                      divided={index > 0}
                      onToggle={toggleTask}
                      onAction={archiveTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </Box>
              )}
            </TaskPanel>
          </Box>
        ) : (
          <Box component="section" aria-label="Архив" sx={{ mt: 2 }}>
            <TaskPanel>
              {archived.length === 0 ? (
                <EmptyState kind="archive" />
              ) : (
                <Box component="ul" sx={listSx}>
                  {archived.map((task, index) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      mode="restore"
                      divided={index > 0}
                      onToggle={toggleTask}
                      onAction={restoreTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </Box>
              )}
            </TaskPanel>
          </Box>
        )}
      </Box>
    </Box>
  )
}

function TaskPanel({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        mt: 2,
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {children}
    </Box>
  )
}

const listSx = {
  listStyle: 'none',
  m: 0,
  p: 0,
} as const
