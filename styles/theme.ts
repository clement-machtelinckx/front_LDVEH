import { Platform } from 'react-native';

export const colors = {
  parchment: '#f4ebd0',
  parchmentDark: '#e8dbb5',
  parchmentDeep: '#dccfa8',

  ink: '#2b1d0e',
  inkSoft: '#5a4a35',
  inkMuted: '#8a7656',

  leather: '#1a1410',
  leatherLight: '#2d2118',

  gold: '#c9a961',
  goldBright: '#e8c878',
  goldDeep: '#8a7232',

  danger: '#8b2e2e',
  success: '#5a7d3a',
  warning: '#b8722c',

  white: '#fff',
  shadow: 'rgba(43, 29, 14, 0.15)',
};

const sans = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' })!;
const display = Platform.select({ ios: 'Didot', android: 'serif', default: 'Didot, serif' })!;

export const fonts = {
  heading: sans,
  body: sans,
  display,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
};
