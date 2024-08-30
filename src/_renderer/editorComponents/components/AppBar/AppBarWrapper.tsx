import { AppBar, AppBarProps } from '@mui/material'
import { ReactNode } from 'react'

export type AppBarWrapperProps = AppBarProps & { rootInjection: ReactNode }

export const AppBarWrapper = (props: AppBarWrapperProps) => {
  const { children, rootInjection, ...rest } = props
  return (
    <AppBar {...rest}>
      {children}
      {rootInjection}
    </AppBar>
  )
}
