import { Theme } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material'

export const createMuiTheme = (
  theme: Theme & { name: string; id: string },
  disableResponsiveFonts?: boolean
) => {
  const palette = theme.palette
  const paletteMainKeys = Object.keys(palette)
  const newPalette = paletteMainKeys.reduce((acc, key) => {
    const mainColor = palette[key as keyof typeof palette]
    const mainColorSubColorNames = Object.keys(mainColor)
    const subColorNames = mainColorSubColorNames.filter(
      (colorName) => (mainColor as any)[colorName]
    )
    const subColors = subColorNames.reduce((acc, subColorName) => {
      const value = (mainColor as any)[subColorName]
      return {
        ...acc,
        [subColorName]: value,
      }
    }, {})
    const newValue = typeof mainColor === 'object' ? subColors : mainColor
    return {
      ...acc,
      [key]: newValue,
    }
  }, {})
  const paletteKeysCleaned: { [key: string]: any } = {}
  Object.keys(newPalette).forEach((key) => {
    if (Object.keys((newPalette as any)[key]).length) {
      paletteKeysCleaned[key] = (newPalette as any)[key]
    }
  })
  const cleanedTheme = {
    ...theme,
    palette: paletteKeysCleaned,
  }

  const disableResponsiveFontsLocal = true
  const makeResponsiveFontTheme = (theme: any) =>
    disableResponsiveFontsLocal ? theme : responsiveFontSizes(theme, { factor: 2 })

  return {
    name: cleanedTheme.name,
    id: cleanedTheme.id,
    ...makeResponsiveFontTheme(createTheme(cleanedTheme)),
  }
}
