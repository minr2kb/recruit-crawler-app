import red from '@mui/material/colors/red'
import createTheme from '@mui/material/styles/createTheme'
import FontWeightValues from './fontTypes'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1ECCA2',
      contrastText: '#FFF'
    },
    secondary: {
      main: '#333',
      contrastText: '#FFF'
    },
    error: {
      main: red[400]
    },

    text: {
      primary: '#333',
      secondary: '#666',
      disabled: '#BBB'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          fontSize: 14,
          fontWeight: FontWeightValues.BOLD,
          height: 40,
          minWidth: 0,
          ':hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiSelect: {
      defaultProps: {
        inputProps: { sx: { py: 1.2, fontSize: 14 } }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: FontWeightValues.REGULAR
        }
      }
    }
  },
  typography: {
    fontFamily: 'Apple SD Gothic Neo, sans-serif'
  }
})

export default theme
