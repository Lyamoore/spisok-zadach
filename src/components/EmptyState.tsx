import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export type EmptyKind = 'tasks' | 'active' | 'completed' | 'archive'

const copy: Record<EmptyKind, { title: string; description: string }> = {
  tasks: {
    title: 'Пока нет задач',
    description: 'Добавьте первую — она появится в этом списке.',
  },
  active: {
    title: 'Нет активных задач',
    description: 'Все задачи из списка уже выполнены.',
  },
  completed: {
    title: 'Нет выполненных задач',
    description: 'Отметьте задачу галочкой, и она появится здесь.',
  },
  archive: {
    title: 'Архив пуст',
    description: 'Сюда попадают задачи, которые вы убрали из основного списка. Их можно вернуть обратно.',
  },
}

type EmptyStateProps = {
  kind: EmptyKind
}

export function EmptyState({ kind }: EmptyStateProps) {
  const content = copy[kind]

  return (
    <Box sx={{ px: 3, py: { xs: 5, sm: 7 }, textAlign: 'center' }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {content.title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 380, mx: 'auto' }}>
        {content.description}
      </Typography>
    </Box>
  )
}
