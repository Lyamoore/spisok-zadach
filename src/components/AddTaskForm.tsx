import { useRef, useState, type FormEvent } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

type AddTaskFormProps = {
  onAdd: (title: string) => boolean
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const added = onAdd(title)
    if (!added) {
      setError(true)
      inputRef.current?.focus()
      return
    }

    setTitle('')
    setError(false)
  }

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={handleSubmit}
      aria-label="Добавление задачи"
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{ alignItems: { sm: 'flex-start' } }}
    >
      <TextField
        inputRef={inputRef}
        name="title"
        label="Новая задача"
        placeholder="Что нужно сделать"
        value={title}
        error={error}
        helperText={error ? 'Введите текст задачи' : '\u00a0'}
        autoComplete="off"
        fullWidth
        onChange={(event) => {
          setTitle(event.target.value)
          if (error) setError(false)
        }}
        slotProps={{
          formHelperText: error ? { role: 'alert' } : { 'aria-hidden': true },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ width: { xs: '100%', sm: 'auto' }, minHeight: { sm: 56 }, flexShrink: 0 }}
      >
        Добавить
      </Button>
    </Stack>
  )
}
