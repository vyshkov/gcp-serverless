import type { Theme } from '@mui/material';

import dark from './dark'
import normal from './normal'

type Themes = {
    [key: string]: Theme
}

const themes: Themes = {
  normal,
  dark,
}

export default function getTheme(theme: string) {
  return themes[theme];
}