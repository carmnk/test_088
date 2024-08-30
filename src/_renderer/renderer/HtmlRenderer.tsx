import { Box, Theme, ThemeProvider } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import { renderHtmlElements } from './renderElements.tsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import { uniq } from 'lodash'
import { EditorControllerType } from '../editorController/editorControllerTypes.ts'
import { useMdiIcons } from './icons/useMdiIcons.ts'
import { ElementType } from '../editorController/editorState.ts'
import { useWindowSize } from '../hooks/useWindowSize.ts'

// -> must be generated dynamically!
// import siteProps from '../site_props.json'

export type HtmlRendererProps = {
  editorController: EditorControllerType
  isProduction?: boolean
  theme: Theme
}

export const HtmlRenderer = (props: HtmlRendererProps) => {
  const { editorController, isProduction, theme } = props
  const {
    editorState,
    setEditorState,
    currentViewportElements,
    selectedPageHtmlElements2,
    actions,
    COMPONENT_MODELS,
  } = editorController

  const selectElement = actions.ui.selectElement

  const location = useLocation()

  const icons = useMdiIcons(
    selectedPageHtmlElements2,
    COMPONENT_MODELS,
    editorState.properties
  )

  const handleSelectElement = React.useCallback(
    (element: ElementType, boundingRect: any) => {
      if (isProduction) {
        return
      }
      if (!element?._id) return
      selectElement(element._id, boundingRect)
    },
    [selectElement, isProduction]
  )

  const renderPage = React.useCallback(
    (page: string) => {
      const pageElements = currentViewportElements.filter(
        (el) => el._page === page
      )

      return renderHtmlElements(
        pageElements,
        editorController,
        handleSelectElement,
        editorState.ui.tableUis,
        theme,
        isProduction,
        icons,
        undefined,
        isProduction ? undefined : editorState.ui.pointerMode === 'production'
      )
    },
    [
      editorState,
      editorController,
      handleSelectElement,
      icons,
      theme,
      currentViewportElements,
      isProduction,
    ]
  )

  // change the route, renderer uses editorState.ui.selected.page to render the page
  useEffect(() => {
    if (!isProduction) {
      return
    }
    console.log('location changed', location.pathname)
    const pageName = location.pathname.slice(1) || 'index'
    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selected: { ...current.ui.selected, page: pageName },
      },
    }))
  }, [location.pathname, isProduction, setEditorState])

  const remainingPages = React.useMemo(() => {
    if (!isProduction) {
      return []
    }
    const pages = uniq(currentViewportElements?.map((el) => el._page) ?? [])
    const pagesExIndex = pages.filter((page) => page !== 'index')
    return pagesExIndex
  }, [currentViewportElements, isProduction])

  const renderedCurrentPageElements = useMemo(() => {
    return isProduction || !editorState.ui.selected.page
      ? null
      : renderPage(editorState.ui.selected.page)
  }, [editorState.ui.selected.page, isProduction, renderPage])

  const containerStyles = useMemo(() => {
    return {
      overflowY: 'auto',
      cursor:
        editorState?.ui?.dragging && editorState.ui.dragMode === 'reorder'
          ? 'grabbing'
          : ['margin', 'padding'].includes(editorState.ui.dragMode) &&
            ['top', 'bottom'].includes(
              editorState.ui.selected.hoveredElementSide ?? ''
            )
          ? 'ns-resize'
          : ['margin', 'padding'].includes(editorState.ui.dragMode) &&
            ['left', 'right'].includes(
              editorState.ui.selected.hoveredElementSide ?? ''
            )
          ? 'ew-resize'
          : 'default',
    }
  }, [
    editorState?.ui?.dragging,
    editorState.ui?.dragMode,
    editorState.ui?.selected?.hoveredElementSide,
  ])

  const windowSize = useWindowSize()

  useEffect(() => {
    if (!isProduction) {
      return
    }
    const breakpointValues = editorState.theme.breakpoints.values
    const viewportSize =
      windowSize.width < breakpointValues.sm
        ? 'xs'
        : windowSize.width < breakpointValues.md
        ? 'sm'
        : windowSize.width < breakpointValues.lg
        ? 'md'
        : windowSize.width < breakpointValues.xl
        ? 'lg'
        : 'xl'

    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selected: {
          ...current.ui.selected,
          viewport: viewportSize,
        },
      },
    }))
  }, [
    windowSize,
    isProduction,
    editorState?.theme?.breakpoints?.values,
    setEditorState,
  ])

  return (
    <ThemeProvider theme={theme ?? editorState.theme}>
      {isProduction ? (
        <Box
          height="100%"
          bgcolor="background.default"
          color={'text.primary'}
          sx={containerStyles}
        >
          <Routes>
            <Route path="/" element={renderPage('index')} />
            {remainingPages?.map((pageName) => (
              <Route
                key={pageName}
                path={`/${pageName}`}
                element={renderPage(pageName)}
              />
            ))}
          </Routes>
        </Box>
      ) : (
        <Box
          zIndex={10} // for preview mode -> must be on top of the right menu
          flexGrow={1}
          bgcolor={'background.default'}
          color={'text.primary'}
          overflow={'auto'}
          position={editorState.ui.previewMode ? 'absolute' : 'relative'}
          width={editorState.ui.previewMode ? '100%' : undefined}
          height={editorState.ui.previewMode ? '100%' : undefined}
          sx={containerStyles}
        >
          {renderedCurrentPageElements}
        </Box>
      )}
    </ThemeProvider>
  )
}
