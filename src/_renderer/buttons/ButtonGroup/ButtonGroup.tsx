import { Divider, Stack, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { ButtonGroupButton, ButtonGroupButtonProps } from './ButtonGroupButton'
import { CButtonProps } from '@cmk/fe_utils'

export type ButtonGroupProps = {
  buttons?: (
    | (Omit<ButtonGroupButtonProps, 'selected'> & {
        value: string
      })
    | null
  )[]
  items?: (
    | (Omit<ButtonGroupButtonProps, 'selected'> & {
        value: string
      })
    | null
  )[]
  value: string
  buttonProps?: Omit<CButtonProps, 'icon' | 'tooltip' | 'label'>
  selectedButtonProps?: CButtonProps
  onChange: (value: string) => void
  isSelected?: (itemValue: string, groupValue: string) => boolean
  transformValue?: (newItemValue: string, currentGroupValue: string) => string
  iconButtons?: boolean
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  const {
    buttons,
    items,
    value,
    onChange,
    isSelected,
    transformValue,
    buttonProps,
    selectedButtonProps,
    iconButtons,
  } = props
  const itemsAdj = items ?? buttons

  const handleChange = useCallback(
    (newValue: string) => {
      if (!onChange) return
      const newValueAdj = transformValue
        ? transformValue(newValue, value)
        : newValue
      onChange(newValueAdj)
    },
    [onChange, transformValue, value]
  )

  const theme = useTheme()
  return (
    <Stack
      direction="row"
      gap={0.25}
      border={'1px solid ' + theme.palette.divider}
      width="max-content"
    >
      {itemsAdj?.map?.((item, bIdx) => {
        const isItemSelected =
          (item && isSelected?.(item.value, value)) ?? item?.value === value
        return item ? (
          <ButtonGroupButton
            {...(item ?? {})}
            iconButton={item?.iconButton ?? iconButtons}
            {...((isItemSelected ? selectedButtonProps : buttonProps) ?? {})}
            key={bIdx}
            selected={isItemSelected}
            onClick={() => handleChange(item.value)}
          />
        ) : (
          <Divider orientation="vertical" flexItem key={bIdx} />
        )
      }) ?? null}
    </Stack>
  )
}
