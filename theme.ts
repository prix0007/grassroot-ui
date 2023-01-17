import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
    600: '#314a6d',
    500: '#485e7d',
    400: '#5f728e',
    300: '#8d9bae',
    200: '#bac3ce',
    100: '#d1d7df'
  },
  brandAccent: {
    
  }
}

const theme = extendTheme({ colors })

export default theme;