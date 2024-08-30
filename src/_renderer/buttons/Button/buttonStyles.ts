import { BoxProps, Theme } from '@mui/material'
import { CButtonProps } from './Button'

const secondaryGrayColor = {
  light: {
    background: '#E1E1E1',
    disabled: '#F3F3F3',
    hover: '#CCCCCC',
  },
  dark: {
    background: '#666',
    disabled: '#666',
    hover: '#999',
  },
}

export const makeButtonStyles = (
  props: Pick<
    CButtonProps,
    | 'type'
    | 'disableHover'
    | 'iconButton'
    | 'icon'
    | 'dropdown'
    | 'sx'
    | 'disabled'
  > & {
    theme: Theme
  }
): BoxProps['sx'] => {
  const {
    theme,
    disableHover,
    sx,
    iconButton,
    dropdown,
    type,
    disabled,
    icon,
  } = props

  const padding = iconButton ? '4px' : type === 'text' ? '4px 16px' : 'auto'
  const commonStyles: Required<BoxProps['sx']> = {
    minWidth: 0,
    textTransform: 'none',
    display: 'flex',
    justifyContent: iconButton ? 'center' : 'flex-start',
    height: iconButton ? 28 : 'auto',
    padding,
    boxShadow: 'none',
    '& .MuiButton-startIcon': {
      ml: iconButton ? 'auto' : 0,
      mr: !icon ? 0 : iconButton ? 'auto' : '8px',
    },
    '& .MuiButton-endIcon': {
      ml: 'auto',
      pl: '5px',
    },
    width: iconButton && dropdown ? 53 : iconButton ? 28 : 'auto',
    pr: iconButton && dropdown ? 1 : undefined,
  }
  const secondaryBgColor =
    theme.palette.mode === 'light'
      ? !disabled
        ? secondaryGrayColor.light.background
        : secondaryGrayColor.light.disabled
      : !disabled
      ? secondaryGrayColor.dark.background
      : secondaryGrayColor.dark.disabled

  const disableHoverStyles = disableHover
    ? {
        background: 'transparent',
        '&: hover': {
          background: 'transparent',
        },
      }
    : {}

  return type === 'secondary'
    ? {
        ...commonStyles,
        border: '0px solid ' + theme.palette.primary.main + ' !important',
        background: secondaryBgColor,
        '&: hover': {
          border: '0px solid ' + theme.palette.primary.main,
          background:
            theme.palette.mode === 'light'
              ? secondaryGrayColor.light.hover
              : secondaryGrayColor.dark.hover,
        },
        padding,
        ...(sx ?? {}),
      }
    : type === 'text'
    ? {
        ...commonStyles,
        background: 'transparent',
        '&: hover': {
          border: '0px solid ' + theme.palette.primary.main,
          background: disableHover
            ? 'transparent'
            : theme.palette.mode === 'light'
            ? '#E1E1E1'
            : '#999',
        },
        ...disableHoverStyles,
        padding,
        ...(sx ?? {}),
      }
    : {
        ...commonStyles,
        '&: hover': {
          boxShadow: 'none',
        },
        ...(sx ?? {}),
      }
}
