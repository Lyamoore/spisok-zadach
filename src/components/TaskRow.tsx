import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import type { Task } from '../domain/task.ts'

type TaskRowProps = {
  task: Task
  mode: 'archive' | 'restore'
  divided: boolean
  onToggle: (id: string) => void
  onAction: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskRow({ task, mode, divided, onToggle, onAction, onDelete }: TaskRowProps) {
  const checkboxId = `task-${task.id}`
  const actionLabel =
    mode === 'archive'
      ? `Переместить «${task.title}» в архив`
      : `Восстановить «${task.title}» из архива`

  return (
    <Box
      component="li"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 0.5,
        pr: 1,
        minHeight: 60,
        borderTop: divided ? '1px solid' : 'none',
        borderColor: 'divider',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          },
        },
      }}
    >
      <Checkbox
        id={checkboxId}
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        slotProps={{
          input: {
            'aria-label': task.completed
              ? `Вернуть в активные: ${task.title}`
              : `Отметить выполненной: ${task.title}`,
          },
        }}
        sx={{ flexShrink: 0 }}
      />
      <Typography
        component="label"
        htmlFor={checkboxId}
        sx={{
          flex: 1,
          py: 1.25,
          cursor: 'pointer',
          overflowWrap: 'anywhere',
          color: task.completed ? 'text.secondary' : 'text.primary',
          textDecoration: task.completed ? 'line-through' : 'none',
          textDecorationColor: 'rgba(245, 245, 247, 0.35)',
        }}
      >
        {task.title}
      </Typography>
      <IconButton
        aria-label={actionLabel}
        onClick={() => onAction(task.id)}
        sx={{ flexShrink: 0, width: 44, height: 44, color: 'text.primary' }}
      >
        {mode === 'archive' ? <ArchiveOutlinedIcon /> : <UnarchiveOutlinedIcon />}
      </IconButton>
      <IconButton
        aria-label={`Удалить «${task.title}»`}
        onClick={() => onDelete(task.id)}
        sx={{
          flexShrink: 0,
          width: 44,
          height: 44,
          color: 'text.secondary',
          '&:hover': {
            color: '#F0B4B4',
            backgroundColor: 'rgba(240, 180, 180, 0.08)',
          },
        }}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Box>
  )
}
