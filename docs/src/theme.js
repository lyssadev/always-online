import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  discord: {
    50: '#e8e9fd',
    100: '#c0c2fb',
    200: '#989cf9',
    300: '#7075f7',
    400: '#484ff5',
    500: '#2f35f3',
    600: '#252ac2',
    700: '#1b2092',
    800: '#111561',
    900: '#080b31',
  },
  loading: {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#00bcd4',
    600: '#00acc1',
    700: '#0097a7',
    800: '#00838f',
    900: '#006064',
  },
};

const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
    },
  }),
};

const components = {
  Button: {
    defaultProps: {
      colorScheme: 'discord',
      isLoading: false,
    },
  },
  Input: {
    variants: {
      filled: (props) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.100',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200',
          },
        },
      }),
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Select: {
    variants: {
      filled: (props) => ({
        field: {
          bg: props.colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.100',
          _hover: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200',
          },
        },
      }),
    },
    defaultProps: {
      variant: 'filled',
    },
  },
};

const theme = extendTheme({
  config,
  colors,
  styles,
  components,
});

export default theme;
