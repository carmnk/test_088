import { Box, Paper, useTheme } from '@mui/material'
import React, {
  useRef,
  useCallback,
  useEffect,
  MouseEvent,
  useState,
  useMemo,
} from 'react'
import { ElementType } from '../editorController/editorState'
import { Button, Flex } from '@cmk/fe_utils'
import { mdiBorderInside, mdiBorderOutside, mdiSort } from '@mdi/js'
import { EditorControllerType } from '../editorController/editorControllerTypes'

// const anchorOrigin = {
//   vertical: 'top' as const,
//   horizontal: 'right' as const,
// }
// const transformOrigin = {
//   vertical: 'bottom' as const,
//   horizontal: 'left' as const,
// }

// const stopPropagation = (e: MouseEvent) => {
//   e.stopPropagation()
// }

export type RootElementOverlayProps = {
  editorController: EditorControllerType
  // editorState: EditorStateType
  // actions: EditorControllerType['actions']
  element: ElementType
  onIsHoveringChange: (elementId: string, isHovering: boolean) => void
  onSelectElement: (elementId: string, boundingRect: any) => void
  isProduction?: boolean
}

export const RootElementOverlay = (props: RootElementOverlayProps) => {
  const {
    element,
    onIsHoveringChange,
    onSelectElement,
    editorController,
    isProduction,
  } = props
  const { editorState, actions } = editorController
  const elementId = element._id
  const theme = useTheme()
  const overlayRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [openMenu, setOpenMenu] = useState(false)

  // const handleMenuClose = useCallback(() => {
  //   setOpenMenu(false)
  // }, [])

  const handleToggleMenu = useCallback((e: any) => {
    e.stopPropagation()
    setOpenMenu((prev) => !prev)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onHover = (e: any) => {
      // e.stopPropagation()
      onIsHoveringChange?.(elementId, true)
      // setOpenMenu(true)
    }
    const onMouseOut = (e: any) => {
      e.stopPropagation()

      onIsHoveringChange?.(elementId, false)
      // setOpenMenu(false)
    }

    overlayRef.current?.addEventListener('pointerenter', onHover)
    overlayRef.current?.addEventListener('pointerleave', onMouseOut)
    return () => {
      overlayRef.current?.removeEventListener('pointerenter', onHover)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      overlayRef.current?.removeEventListener('pointerleave', onMouseOut)
    }
  }, [onIsHoveringChange, elementId])

  const handleClickOverlay = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      handleToggleMenu(e)
      const { left, top, width, height } =
        overlayRef.current?.getBoundingClientRect() ?? {}
      const serializedBoundingRect = { left, top, width, height }
      onSelectElement?.(elementId, serializedBoundingRect)
    },
    [onSelectElement, elementId, handleToggleMenu]
  )

  const handleStartDragging = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      if (editorState?.ui?.selected?.element === elementId) {
        const rect = overlayRef.current?.getBoundingClientRect()
        if (!rect) return
        if (editorState.ui.dragMode === 'reorder') {
          actions.ui.startDraggingReorder(elementId)
        }
      }
    },
    [
      actions.ui,
      elementId,
      editorState?.ui?.selected?.element,
      editorState.ui.dragMode,
    ]
  )

  const handleMoveDragging = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      if (editorState.ui.dragMode === 'reorder') {
        actions.ui.moveDraggingReorder(elementId)
      }
    },
    [actions.ui, elementId, editorState.ui.dragMode]
  )
  const handleEndDragging = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation()
      if (editorState.ui.dragMode === 'reorder') {
        actions.ui.endDraggingReorder(elementId)
      }
    },
    [actions.ui, elementId, editorState.ui.dragMode]
  )

  useEffect(() => {
    const boundingRectRaw = overlayRef.current?.getBoundingClientRect()
    if (
      editorState.ui.selected.element === elementId &&
      !editorState.ui.selected?.activeElementBoundingRect &&
      boundingRectRaw
    ) {
      const { left, top, width, height } = boundingRectRaw
      const serializedBoundingRect = { left, top, width, height }
      actions.ui.postAddActiveBoundingRect(serializedBoundingRect)
    }
  }, [
    editorState.ui.selected?.activeElementBoundingRect,
    elementId,
    editorState.ui.selected.element,
    actions.ui,
  ])

  const overLayEventHandlers = useMemo(
    () =>
      editorState?.ui?.dragMode !== 'reorder'
        ? { onClick: handleClickOverlay }
        : {
            onClick: handleClickOverlay,
            onMouseDown: handleStartDragging,
            onMouseUp: handleEndDragging,
            onMouseMove: handleMoveDragging,
          },
    [
      handleClickOverlay,
      handleStartDragging,
      handleEndDragging,
      handleMoveDragging,
      editorState?.ui?.dragMode,
    ]
  )

  const outerBoxModelBoxStyles = useMemo(() => {
    const selectedElementId = editorState?.ui?.selected?.element
    if (!selectedElementId || element._id !== selectedElementId) return null
    // const selectedElement = currentViewportElements.find(
    //   (el) => el._id === selectedElementId
    // )
    const attributes = editorState.attributes.filter(
      (attr) => attr.element_id === selectedElementId
    )
    const attributesDict = attributes.reduce<Record<string, any>>(
      (acc, attr) => {
        return {
          ...acc,
          [attr.attr_name]: attr.attr_value,
        }
      },
      {}
    )

    const style = attributesDict?.style
    if (!style) return null

    const {
      marginTop = 0,
      marginRight = 0,
      marginBottom = 0,
      marginLeft = 0,
    } = style
    return {
      marginTop: `-${marginTop}`,
      marginRight: `-${marginRight}`,
      marginBottom: `-${marginBottom}`,
      marginLeft: `-${marginLeft}`,
      border: '1px solid blue',
      position: 'absolute',
      top: 0,
      left: 0,
      width: `calc(100% + ${
        parseFloat(marginLeft?.toString?.()?.replaceAll('px', '')) +
        parseFloat(marginRight?.toString?.()?.replaceAll('px', ''))
      }px)`,
      height: `calc(100% + ${
        parseFloat(marginTop?.toString?.()?.replaceAll('px', '')) +
        parseFloat(marginBottom?.toString?.()?.replaceAll('px', ''))
      }px)`,
    }
  }, [editorState?.ui?.selected?.element, element._id, editorState.attributes])

  const innerBoxModelBoxStyles = useMemo(() => {
    const selectedElementId = editorState?.ui?.selected?.element
    if (!selectedElementId || element._id !== selectedElementId) return null
    // const selectedElement = currentViewportElements.find(
    //   (el) => el._id === selectedElementId
    // )
    const attributes = editorState.attributes.filter(
      (attr) => attr.element_id === selectedElementId
    )
    const attributesDict = attributes.reduce<Record<string, any>>(
      (acc, attr) => {
        return {
          ...acc,
          [attr.attr_name]: attr.attr_value,
        }
      },
      {}
    )
    const style = attributesDict?.style
    if (!style) return null

    const {
      paddingTop = 0,
      paddingRight = 0,
      paddingBottom = 0,
      paddingLeft = 0,
    } = style

    return {
      marginTop: paddingTop,
      marginRight: paddingRight,
      marginBottom: paddingBottom,
      marginLeft: paddingLeft,
      border: '1px solid orange',
      position: 'absolute',
      top: 0,
      left: 0,
      width: `calc(100% - ${
        parseFloat(paddingRight?.toString?.()?.replaceAll('px', '')) +
        parseFloat(paddingLeft?.toString?.()?.replaceAll('px', ''))
      }px)`,
      height: `calc(100% - ${
        parseFloat(paddingTop?.toString?.()?.replaceAll('px', '')) +
        parseFloat(paddingBottom?.toString?.()?.replaceAll('px', ''))
      }px)`,
    }
  }, [editorState?.ui?.selected?.element, element._id, editorState.attributes])

  return isProduction || editorState.ui.pointerMode === 'production' ? null : (
    <Box
      ref={overlayRef}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bgcolor="transparent"
      // border={
      //   editorState?.ui?.selected?.element === elementId
      //     ? '2px solid ' + theme.palette.secondary.main
      //     : undefined
      //   // openMenu ? '1px solid ' + theme.palette.secondary.main : undefined
      // }
      sx={
        editorState?.ui?.selected?.element === elementId
          ? {
              borderImage: `linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main}) !important`,
              border: '3px solid transparent',
              borderImageSlice: '1 !important',
              // borderColor: 'red',
            }
          : editorState?.ui?.selected?.hoveredElement === elementId &&
            !editorState?.ui?.dragging
          ? {
              // borderImage: `linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.secondary.main}) !important`,
              border: `2px outset ${theme.palette.secondary.light}`,
              // borderImageSlice: '1 !important',
              // borderColor: 'red',
            }
          : editorState?.ui?.dragging?.elementIdTo === elementId &&
            editorState?.ui?.dragging
          ? {
              border: `2px dashed ${theme.palette.secondary.light}`,
            }
          : undefined
      }
      {...overLayEventHandlers}
    >
      {/*  */}
      <Box sx={outerBoxModelBoxStyles}></Box>
      <Box sx={innerBoxModelBoxStyles}></Box>
      {/* Arrow Tooltip */}
      <Box
        display={
          editorState?.ui?.selected?.element === elementId ? undefined : 'none'
        }
        position="fixed"
        top={overlayRef?.current?.getBoundingClientRect().top ?? 0}
        left={
          (overlayRef?.current?.getBoundingClientRect().left ?? 0) +
          (overlayRef?.current?.getBoundingClientRect().width ?? 0) +
          13
        }
        zIndex={100000}
      >
        {openMenu && (
          <Flex
            alignItems="center"
            sx={{
              '&:after': {
                content: "''",
                position: 'absolute',
                left: 0,
                top: '50%',
                width: 0,
                height: 0,
                border: '32px solid transparent',
                borderRightColor: 'red',
                borderLeft: 0,
                borderTop: 0,
                marginTop: '-8px',
                marginLeft: '-10px',
                borderRadius: '1px',
                transform: 'rotate(-22.5deg)',
                zIndex: -1,
              },
            }}
          >
            <Paper>
              {/* <Typography variant="caption"> {element._type}</Typography> */}
              <Button
                ref={buttonRef}
                variant="outlined"
                color="secondary"
                // onClick={stopPropagation}
                tooltip={
                  `Drag Element or Tooltip to ` +
                  (editorState.ui.dragMode === 'reorder'
                    ? 'Reorder Element in Html Tree'
                    : editorState.ui.dragMode === 'margin'
                    ? 'Adjust Margin'
                    : editorState.ui.dragMode === 'padding'
                    ? 'Adjust Padding'
                    : `Select ${element._type} Element`)
                }
                disableInteractiveTooltip
                endIcon={
                  editorState.ui.dragMode === 'reorder'
                    ? mdiSort
                    : editorState.ui.dragMode === 'margin'
                    ? mdiBorderOutside
                    : editorState.ui.dragMode === 'padding'
                    ? mdiBorderInside
                    : null
                }
                sx={{
                  borderWidth: '3px !important',
                  borderColor: 'secondary.main',
                  // cursor: 'default',
                  pointerEvents: 'none',
                }}
                onClick={handleToggleMenu}
              >
                {element._type}
              </Button>
            </Paper>
            {/* <Menu
            open={openMenu}
            anchorEl={buttonRef.current}
            onClose={handleMenuClose}
          >
            {menuItems
              ?.filter((item) => item.value !== editorState.ui.dragMode)
              ?.map((item) => (
                <MenuItem
                  key={item.value}
                  sx={{ fontSize: '14px', py: 0.25 }}
                  onClick={() => {
                    actions.ui.switchDragMode(item.value as any)
                  }}
                >
                  <Typography variant="caption">{item.label}</Typography>
                </MenuItem>
              ))}
          </Menu> */}
          </Flex>
        )}
      </Box>
    </Box>
  )
}
