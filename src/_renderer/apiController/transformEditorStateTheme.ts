import { v4 as uuid } from 'uuid'
import { ExtendedTheme } from '../muiTheme'
import { createMuiTheme } from '../createTheme'
import { SerializedThemeType } from './editorDbStateType'

export const transformEditorStateTheme = (
  themes: ExtendedTheme[],
  project_id: string
): SerializedThemeType[] =>
  themes?.map?.((theme) => ({
    id: theme?.id ?? uuid(),
    project_id,
    name: theme.name,
    // palette
    mode: theme.palette.mode,
    primary_main: theme.palette.primary.main,
    primary_light: theme.palette.primary.light,
    primary_dark: theme.palette.primary.dark,
    primary_contrastText: theme.palette.primary.contrastText,
    secondary_main: theme.palette.secondary.main,
    secondary_light: theme.palette.secondary.light,
    secondary_dark: theme.palette.secondary.dark,
    secondary_contrastText: theme.palette.secondary.contrastText,
    error_main: theme.palette.error.main,
    error_light: theme.palette.error.light,
    error_dark: theme.palette.error.dark,
    error_contrastText: theme.palette.error.contrastText,
    warning_main: theme.palette.warning.main,
    warning_light: theme.palette.warning.light,
    warning_dark: theme.palette.warning.dark,
    warning_contrastText: theme.palette.warning.contrastText,
    info_main: theme.palette.info.main,
    info_light: theme.palette.info.light,
    info_dark: theme.palette.info.dark,
    info_contrastText: theme.palette.info.contrastText,
    success_main: theme.palette.success.main,
    success_light: theme.palette.success.light,
    success_dark: theme.palette.success.dark,
    success_contrastText: theme.palette.success.contrastText,

    text_primary: theme.palette.text.primary,
    text_secondary: theme.palette.text.secondary,
    text_disabled: theme.palette.text.disabled,
    background_default: theme.palette.background.paper,
    background_paper: theme.palette.background.paper,
    action_active: theme.palette.action.active,
    action_hover: theme.palette.action.hover,
    action_selected: theme.palette.action.selected,
    action_disabled: theme.palette.action.disabled,
    action_disabled_background: theme.palette.action.disabledBackground,
    action_focus: theme.palette.action.focus,
  }))

export const reloadSerializedThemes = (
  themesIn: SerializedThemeType[],
  themes: ExtendedTheme[]
): ExtendedTheme[] => {
  const loadedThemes = themesIn?.map((themeIn) => {
    const currentThemeProps = themes.find(
      (t) => t.palette.mode === themeIn.mode
    )
    const injectCurrentThemeTypographyProps = {
      typography: currentThemeProps?.typography,
    }
    const newThemeStatic = {
      ...injectCurrentThemeTypographyProps,
      palette: {
        primary: {
          main: themeIn.primary_main,
          light: themeIn.primary_light,
          dark: themeIn.primary_dark,
          contrastText: themeIn.primary_contrastText,
        },
        secondary: {
          main: themeIn.secondary_main,
          light: themeIn.secondary_light,
          dark: themeIn.secondary_dark,
          contrastText: themeIn.secondary_contrastText,
        },
        error: {
          main: themeIn.error_main,
          light: themeIn.error_light,
          dark: themeIn.error_dark,
          contrastText: themeIn.error_contrastText,
        },
        warning: {
          main: themeIn.warning_main,
          light: themeIn.warning_light,
          dark: themeIn.warning_dark,
          contrastText: themeIn.warning_contrastText,
        },
        info: {
          main: themeIn.info_main,
          light: themeIn.info_light,
          dark: themeIn.info_dark,
          contrastText: themeIn.info_contrastText,
        },
        success: {
          main: themeIn.success_main,
          light: themeIn.success_light,
          dark: themeIn.success_dark,
          contrastText: themeIn.success_contrastText,
        },
        text: {
          primary: themeIn.text_primary,
          secondary: themeIn.text_secondary,
          disabled: themeIn.text_disabled,
        },
        background: {
          default: themeIn.background_default,
          paper: themeIn.background_paper,
        },
        action: {
          active: themeIn.action_active,
          hover: themeIn.action_hover,
          selected: themeIn.action_selected,
          disabled: themeIn.action_disabled,
          disabledBackground: themeIn.action_disabled_background,
          focus: themeIn.action_focus,
        },
        mode: themeIn?.mode ?? 'light',
      },
    }
    // // undefined values have to be removed
    // const paletteRaw = newThemeStatic.palette
    // const paletteObjectKeys = Object.keys(paletteRaw).filter((key) => {
    //   return typeof paletteRaw[key as keyof typeof paletteRaw] === 'object'
    // })
    // for (const key of paletteObjectKeys) {
    //   const paletteColor = paletteRaw[key as keyof typeof paletteRaw]
    //   const colorKeys = Object.keys(paletteColor)
    //   colorKeys.forEach((colorKey) => {
    //     const color = paletteColor[colorKey as keyof typeof paletteColor]
    //     if (!color) {
    //       delete paletteColor[colorKey as keyof typeof paletteColor]
    //     }
    //   })
    // }

    // const muiTheme = responsiveFontSizes(createTheme(newThemeStatic), {
    //   factor: 2,
    // })
    // const theme = { ...muiTheme, name: themeIn.name, id: themeIn.id }
    // console.log('newThemeStatic ', {
    //     ...newThemeStatic,
    //     name: themeIn.name,
    //     id: themeIn.id,
    //   }, themes)
    const muiTheme = {
      ...createMuiTheme({
        ...newThemeStatic,
      } as any),
      name: themeIn.name,
      id: themeIn.id,
    }
    return muiTheme
  })
  return loadedThemes
}
