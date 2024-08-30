import Icon from '@mdi/react'
import { Chip, ChipProps } from '@mui/material'

export type CChipProps = ChipProps & { icon?: string }

export const CChip = (props: CChipProps) => {
  return (
    <Chip
      {...props}
      icon={
        props?.icon ? (
          <Icon
            path={props.icon}
            size={'16px'}
            style={{ marginLeft: '8px' }}
          ></Icon>
        ) : undefined
      }
    />
  )
}
