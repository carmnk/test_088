import { Typography, TypographyProps } from '@mui/material'
import { ReactNode } from 'react'

export type TypographyWrapperProps = TypographyProps & {
  rootInjection: ReactNode
}
export const TypographyWrapper = (props: TypographyWrapperProps) => {
  const { children, rootInjection, ...rest } = props
  return (
    <Typography {...rest}>
      {children}
      {rootInjection}
    </Typography>
  )
}
