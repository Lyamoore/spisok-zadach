import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { StorageNotice as StorageNoticeState } from '../hooks/useTaskList.ts'
import { STORAGE_KEY } from '../storage/taskStorage.ts'

type StorageNoticeProps = {
  notice: StorageNoticeState
  onDismiss: () => void
}

export function StorageNotice({ notice, onDismiss }: StorageNoticeProps) {
  if (notice.type === 'none') return null

  const message = messageFor(notice)
  const calm = notice.type === 'recovered'

  return (
    <Stack
      role={calm ? 'status' : 'alert'}
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        mb: 3,
        p: 2,
        alignItems: { sm: 'center' },
        justifyContent: 'space-between',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderLeftWidth: 3,
        borderLeftColor: calm ? 'primary.main' : '#D6C7A1',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {message}
      </Typography>
      {notice.type === 'recovered' && (
        <Button
          variant="text"
          onClick={onDismiss}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0, minHeight: 40 }}
        >
          Понятно
        </Button>
      )}
    </Stack>
  )
}

function messageFor(notice: Exclude<StorageNoticeState, { type: 'none' }>): string {
  switch (notice.type) {
    case 'unavailable':
      return 'Локальное хранилище браузера недоступно. Задачи можно вести сейчас, но после обновления страницы они не сохранятся.'
    case 'corrupt':
      return `Сохранённый список повреждён и не показан. Запись в ключе «${STORAGE_KEY}» не удалена. При следующем изменении приложение сначала скопирует её в резервный ключ и только потом запишет новый список.`
    case 'backup-failed':
      return 'Не удалось сделать резервную копию повреждённых данных, поэтому новый список не записан. Исходная запись осталась на месте.'
    case 'write-failed':
      return 'Не удалось записать изменения. Они видны сейчас, но могут пропасть после обновления страницы.'
    case 'recovered':
      return `Повреждённые данные сохранены в резервном ключе «${notice.backupKey}». Дальше список записывается как обычно.`
  }
}
