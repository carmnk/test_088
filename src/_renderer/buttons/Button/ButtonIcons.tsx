import Icon from '@mdi/react'
import { ButtonDropdown, ButtonType } from './defs'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import { CircularProgress, Stack, useTheme } from '@mui/material'
import { CSSProperties } from 'react'

type ButtonStartIconProps = {
  loading?: boolean
  icon?: React.ReactNode
  iconSize?: CSSProperties['fontSize']
  iconColor?: string
  disabled?: boolean
  type?: ButtonType
}
export const ButtonStartIcon = (props: ButtonStartIconProps) => {
  const { loading, icon, iconSize, iconColor, disabled, type } = props
  const theme = useTheme()

  return loading ? (
    <Stack direction="row" alignItems="center" width="17px" mr={1}>
      <CircularProgress color="inherit" size={17} />
    </Stack>
  ) : typeof icon === 'string' ? (
    <Icon
      path={icon}
      size={iconSize ?? '16px'}
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : type === 'secondary' || type === 'text'
          ? theme.palette.text.primary
          : theme.palette.primary.contrastText)
      }
    />
  ) : (
    icon
  )
}

export const ButtonEndIcon = (
  props: Pick<ButtonStartIconProps, 'disabled' | 'iconColor' | 'type'> & {
    endIcon: React.ReactNode
    dropdown?: ButtonDropdown
  }
) => {
  const { endIcon, iconColor, disabled, type, dropdown } = props
  const theme = useTheme()
  return dropdown ? (
    <Icon
      path={dropdown === 'closed' ? mdiChevronDown : mdiChevronUp}
      size="16px"
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : type === 'secondary' || type === 'text'
          ? theme.palette.text.primary
          : theme.palette.primary.contrastText)
      }
    />
  ) : typeof endIcon === 'string' ? (
    <Icon
      path={endIcon}
      size="16px"
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : type === 'secondary' || type === 'text'
          ? theme.palette.text.primary
          : theme.palette.primary.contrastText)
      }
    />
  ) : (
    endIcon
  )
}
