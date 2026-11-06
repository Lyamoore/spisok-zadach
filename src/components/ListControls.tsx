import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { formatTaskCount, type TaskFilter, type TaskSection } from '../domain/task.ts'

type SectionSwitchProps = {
  section: TaskSection
  taskCount: number
  archiveCount: number
  onChange: (section: TaskSection) => void
}

type TaskFiltersProps = {
  filter: TaskFilter
  counts: Record<TaskFilter, number>
  onChange: (filter: TaskFilter) => void
}

export function SectionSwitch({ section, taskCount, archiveCount, onChange }: SectionSwitchProps) {
  return (
    <Box sx={groupFrameSx}>
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={section}
        aria-label="Раздел списка"
        onChange={(_, value: unknown) => {
          if (value === 'tasks' || value === 'archive') onChange(value)
        }}
      >
        <ToggleButton value="tasks" aria-label={`Задачи, ${formatTaskCount(taskCount)}`}>
          <ChoiceLabel label="Задачи" count={taskCount} />
        </ToggleButton>
        <ToggleButton value="archive" aria-label={`Архив, ${formatTaskCount(archiveCount)}`}>
          <ChoiceLabel label="Архив" count={archiveCount} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export function TaskFilters({ filter, counts, onChange }: TaskFiltersProps) {
  return (
    <Box sx={filterFrameSx}>
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={filter}
        aria-label="Фильтр задач"
        onChange={(_, value: unknown) => {
          if (value === 'all' || value === 'active' || value === 'completed') onChange(value)
        }}
        sx={filterGroupSx}
      >
        <ToggleButton value="all" aria-label={`Все, ${formatTaskCount(counts.all)}`} sx={filterButtonSx}>
          <ChoiceLabel label="Все" count={counts.all} />
        </ToggleButton>
        <ToggleButton
          value="active"
          aria-label={`Активные, ${formatTaskCount(counts.active)}`}
          sx={filterButtonSx}
        >
          <ChoiceLabel label="Активные" count={counts.active} />
        </ToggleButton>
        <ToggleButton
          value="completed"
          aria-label={`Выполненные, ${formatTaskCount(counts.completed)}`}
          sx={filterButtonSx}
        >
          <ChoiceLabel label="Выполненные" count={counts.completed} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

function ChoiceLabel({ label, count }: { label: string; count: number }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 0.75 }}>
      {label}
      <Box
        component="span"
        sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}
      >
        {count}
      </Box>
    </Box>
  )
}

const groupFrameSx = {
  width: '100%',
  p: '4px',
  borderRadius: 999,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
} as const

const filterFrameSx = {
  width: '100%',
  p: '4px',
  borderRadius: 999,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  '@media (max-width: 379px)': {
    borderRadius: '18px',
  },
} as const

const filterGroupSx = {
  width: '100%',
  flexWrap: 'nowrap',
  '@media (max-width: 379px)': {
    flexWrap: 'wrap',
  },
} as const

const filterButtonSx = {
  flex: '1 1 0',
  minWidth: 0,
  px: { xs: 1, sm: 1.75 },
  whiteSpace: 'nowrap',
  '@media (max-width: 379px)': {
    flex: '1 1 100%',
    borderRadius: '12px',
  },
} as const
