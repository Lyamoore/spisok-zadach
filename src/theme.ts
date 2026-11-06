import { createTheme } from '@mui/material/styles'

const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A9C0FF',
      dark: '#93ADEF',
      contrastText: '#12141A',
    },
    background: {
      default: '#0C0D10',
      paper: '#16171C',
    },
    text: {
      primary: '#F5F5F7',
      secondary: '#B5B5BE',
      disabled: '#8D8D96',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    error: {
      main: '#F0B4B4',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily,
    h1: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.035em',
      lineHeight: 1.12,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0C0D10',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '2px solid #A9C0FF',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          minHeight: 44,
          paddingInline: 18,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          color: '#B5B5BE',
          '&:hover': {
            color: '#F5F5F7',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#16171C',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.22)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#A9C0FF',
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 4,
        },
        grouped: {
          border: 0,
          margin: 0,
          borderRadius: 999,
          '&:not(:first-of-type)': {
            marginLeft: 0,
            borderLeft: 0,
            borderRadius: 999,
          },
          '&:first-of-type': {
            borderRadius: 999,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 999,
          color: '#B5B5BE',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 14px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
          '&.Mui-selected': {
            color: '#F5F5F7',
            backgroundColor: 'rgba(169, 192, 255, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(169, 192, 255, 0.22)',
            },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 2,
          marginRight: 2,
        },
      },
    },
  },
})
