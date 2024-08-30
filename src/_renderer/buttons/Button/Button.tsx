import React, { CSSProperties, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { useTheme, Button as MuiButton, Box } from '@mui/material'
import {
  ButtonProps,
  Tooltip,
  Typography,
  TypographyProps,
} from '@mui/material'
import type { ButtonDropdown, ButtonType } from './defs'
import { ButtonEndIcon, ButtonStartIcon } from './ButtonIcons'
import { makeButtonStyles } from './buttonStyles'

export type CButtonProps = Pick<
  ButtonProps,
  'onClick' | 'onPointerDown' | 'onKeyDown' | 'size' | 'sx' | 'id'
> & {
  type?: ButtonType // 3 types of buttons: primary (default), secondary, text
  label?: React.ReactNode // label for the button - precedence over children!
  children?: React.ReactNode // label for the button - if label is not provided
  loading?: boolean // loading state (show spinner instead of icon)
  icon?: React.ReactNode
  endIcon?: React.ReactNode
  dropdown?: ButtonDropdown
  iconButton?: boolean
  disableHover?: boolean
  tooltip?: string
  color?: ButtonProps['color']
  iconColor?: string
  fontColor?: string
  iconSize?: CSSProperties['fontSize']
  disableTabstop?: boolean // if true, the button will not be focusable/tabable (tabindex=-1)
  title?: string // title attribute (html)
  name?: string // name attribute (html)
  disabled?: boolean // disabled attribute
  disableTooltipWhenDisabled?: boolean
  disableInteractiveTooltip?: boolean // will directly close not wait for hover
  typographyProps?: TypographyProps // props for the typography component inside the button
}

export const Button = React.forwardRef(
  (props: CButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const {
      icon,
      type,
      label,
      disableHover,
      children,
      endIcon,
      loading,
      dropdown,
      disabled: disabledIn,
      iconButton,
      iconSize,
      color,
      iconColor,
      fontColor,
      disableTabstop,
      disableInteractiveTooltip,
      typographyProps,
      disableTooltipWhenDisabled,
      ...rest
    } = props
    const theme = useTheme()
    const disabled = disabledIn || loading

    const startIcon = useMemo(
      () => (
        <ButtonStartIcon
          icon={icon}
          iconColor={iconColor}
          iconSize={iconSize}
          disabled={disabled}
          loading={loading}
          type={type}
        />
      ),
      [icon, iconColor, iconSize, disabled, loading, type]
    )
    const endIconAdj = useMemo(
      () => (
        <ButtonEndIcon
          disabled={disabled}
          endIcon={endIcon}
          iconColor={iconColor}
          type={type}
          dropdown={dropdown}
        />
      ),
      [disabled, endIcon, iconColor, type, dropdown]
    )

    const buttonStyles = useMemo(
      () =>
        makeButtonStyles({
          theme,
          type,
          disableHover,
          disabled,
          icon,
          iconButton,
          sx: rest?.sx,
          dropdown: dropdown,
        }),
      [
        theme,
        type,
        disableHover,
        disabled,
        icon,
        iconButton,
        rest?.sx,
        dropdown,
      ]
    )

    const Button = useMemo(
      () =>
        type === 'secondary' ? (
          <MuiButton
            color={color}
            ref={ref}
            variant="outlined"
            disableElevation
            startIcon={startIcon}
            endIcon={endIconAdj}
            disabled={disabled}
            {...rest}
            tabIndex={disableTabstop ? -1 : 0}
            sx={buttonStyles}
          >
            {!iconButton && (
              <Typography
                variant="body2"
                color={
                  disabled ? 'action.disabled' : fontColor ?? 'text.primary'
                }
                fontWeight={700}
                {...typographyProps}
              >
                {label ?? children}
              </Typography>
            )}
          </MuiButton>
        ) : type === 'text' ? (
          <MuiButton
            color={color}
            ref={ref}
            size="small"
            variant="text"
            startIcon={startIcon}
            endIcon={endIconAdj}
            disabled={disabled}
            {...rest}
            tabIndex={disableTabstop ? -1 : 0}
            sx={buttonStyles}
          >
            {!iconButton && (
              <Typography
                variant="body2"
                color={
                  disabled ? 'action.disabled' : fontColor ?? 'text.primary'
                }
                fontWeight={700}
                {...typographyProps}
              >
                {label ?? children}
              </Typography>
            )}
          </MuiButton>
        ) : (
          <MuiButton
            color={color}
            ref={ref}
            variant="contained"
            disableElevation
            startIcon={startIcon}
            endIcon={endIconAdj}
            disabled={disabled}
            {...rest}
            tabIndex={disableTabstop ? -1 : 0}
            sx={buttonStyles}
          >
            {!iconButton && (
              <Typography
                variant="body2"
                color={
                  disabled
                    ? 'action.disabled'
                    : fontColor ?? 'primary.contrastText'
                }
                fontWeight={700}
                {...typographyProps}
              >
                {label ?? children}
              </Typography>
            )}
          </MuiButton>
        ),
      [
        color,
        disableTabstop,
        iconButton,
        children,
        disabled,
        endIconAdj,
        fontColor,
        label,
        startIcon,
        type,
        buttonStyles,
        ref,
        typographyProps,
        rest, // could be a problem
      ]
    )

    const ButtonWithTooltip = useMemo(
      () =>
        props.tooltip ? (
          <Tooltip
            arrow={true}
            placement={'top'}
            title={disableTooltipWhenDisabled && disabled ? '' : props.tooltip}
            disableInteractive={disableInteractiveTooltip}
          >
            <Box width="max-content">{Button}</Box>
          </Tooltip>
        ) : (
          Button
        ),
      [
        Button,
        props.tooltip,
        disableInteractiveTooltip,
        disabled,
        disableTooltipWhenDisabled,
      ]
    )
    return ButtonWithTooltip
  }
)
Button.displayName = 'Button'
