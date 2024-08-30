// explicit
// type ButtonGroupButtonProps = Pick<
//   CButtonProps,
//   'icon' | 'tooltip' | 'onClick'
// > & {
//   value: string
//   selected: boolean
//   disabled?: boolean
//   iconButton?: boolean
//   label?: string
// }

import { Button, CButtonProps } from '@cmk/fe_utils'

export type ButtonGroupButtonProps = CButtonProps & {
  selected: boolean
}

export const ButtonGroupButton = (props: ButtonGroupButtonProps) => {
  const { selected, ...buttonProps } = props
  return (
    <Button variant={selected ? 'contained' : 'text'} {...buttonProps} />
  )
}
