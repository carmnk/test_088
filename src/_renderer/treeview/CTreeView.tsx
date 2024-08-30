/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react'
import { TreeView } from '@mui/x-tree-view/TreeView'
import Icon from '@mdi/react'
import { StyledTreeItem, StyledTreeItemProps } from './CTreeItem'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string
    '--tree-view-bg-color'?: string
  }
}
const treeViewProps = {
  WebkitUserSelect: 'none' /* Safari */,
  MozUserSelect: 'none' /* Firefox */,
  MsUserSelect: 'none' /* IE10+/Edge */,
  userSelect: 'none' /* Standard */,
}

const recursiveMap = (
  items: StyledTreeItemProps[],
  events: {
    additionalActions?:
      | AdditionalActionType[]
      | ((item: any) => AdditionalActionType[])
    actions?: AdditionalActionType[] | ((item: any) => AdditionalActionType[])
  },
  disableBorderLeft?: boolean,
  toggleExpand?: (id: string) => void,
  parentId?: string
): JSX.Element[] => {
  const relevantElements = parentId
    ? items?.filter((el) => el._parentId === parentId)
    : items?.filter((el) => !el._parentId)
  return (
    relevantElements?.map?.(({ icon, ...item }) => {
      const additionalActions =
        typeof events?.additionalActions === 'function'
          ? events?.additionalActions(item)
          : events?.additionalActions
      const actions =
        typeof events?.actions === 'function'
          ? events?.actions(item)
          : events?.actions
      const children = (item?.children ?? []) as StyledTreeItemProps[]
      const { children: _c, ...props } = item
      return (
        <StyledTreeItem
          key={item.nodeId}
          {...props}
          icon={typeof icon === 'string' ? <Icon path={icon} size={1} /> : icon}
          disableBorderLeft={disableBorderLeft}
          additionalActions={additionalActions}
          actions={actions}
          toggleExpand={toggleExpand}
        >
          {((!!children?.length &&
            recursiveMap(
              children,
              events,
              undefined,
              toggleExpand,
              item.nodeId as any
            )) as any) || undefined}
        </StyledTreeItem>
      )
    }) ?? null
  )
}

export type AdditionalActionType = {
  action: (nodeId: string | number, e: any) => void
  icon: string
  tooltip: string
  label: string
  disabled?: boolean
}

export type AdditionalActionGenType =
  | AdditionalActionType[]
  | ((item: any) => AdditionalActionType[])

export type CTreeViewProps = {
  items: StyledTreeItemProps[]
  actions?: AdditionalActionGenType
  additionalActions?: AdditionalActionGenType
  onToggleExpand?: (id: string, e: any) => void
  onToggleSelect?: (id: string, e: any) => void
  onDragDrop?: (event: any, draggedItem: any, droppedItem: any) => void // nodeId is the id of the dropped item
  onDragging?: (event: any, active: boolean, draggedItem: any) => void
  expandedItems?: string[]
  selectedItems?: string[]
  maxWidth?: number
  disableItemsFocusable?: boolean
  width?: number
}

export const CTreeView = (props: CTreeViewProps) => {
  const {
    items,
    onToggleExpand,
    onToggleSelect,
    expandedItems,
    selectedItems,
    maxWidth = 320,
    additionalActions,
    disableItemsFocusable,
    actions,
    onDragDrop,
    onDragging,
    width,
  } = props

  const [ui, setUi] = React.useState<{
    dragging: { ctrKeyDown: boolean; active: boolean }
  }>({
    dragging: { ctrKeyDown: false, active: false },
  })
  const [overlay, setOverlay] = React.useState<any>(null)
  const treeViewRef = React.useRef<any>(null)

  const handleDragStart = React.useCallback((event: any) => {
    const treeItemProps = event?.active?.data?.current

    setOverlay(treeItemProps)
    setUi((current) => ({
      ...current,
      dragging: { ...current?.dragging, active: true },
    }))
  }, [])
  const handleDragEnd = React.useCallback(
    (event: any) => {
      const overItem = event?.over?.data?.current
      const overNodeId = overItem?.nodeId

      if (!overItem || !overlay) return

      onDragDrop?.(event, overlay, overItem)
      setOverlay(null)
      setUi((current) => ({
        ...current,
        dragging: { ctrKeyDown: false, active: false },
      }))
      onDragging?.(event, false, overlay)
      lastMouseMoveEvent.current = null
    },
    [onDragDrop, overlay, onDragging]
  )

  const lastMouseMoveEvent = React.useRef<any>(null)
  React.useEffect(() => {
    const mouseMoveListener = (e: any) => {
      lastMouseMoveEvent.current = e
      const isCtrlPressed = e?.ctrlKey
      onDragging?.(e, true, overlay)
      setUi((current) =>
        isCtrlPressed !== current?.dragging?.ctrKeyDown
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: isCtrlPressed },
            }
          : current
      )
    }
    const keyDownListener = (e: any) => {
      const ctrlKey = e?.ctrlKey
      const newEvent = { ...(lastMouseMoveEvent.current ?? {}), ctrlKey }
      onDragging?.(newEvent, true, overlay) // event handler is not addded if dragging is not active
      setUi((current) =>
        ctrlKey !== current?.dragging?.ctrKeyDown
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: ctrlKey },
            }
          : current
      )
    }
    const keyUpListener = (e: any) => {
      const ctrlKey = e?.ctrlKey
      const newEvent = {
        ...(lastMouseMoveEvent.current ?? {}),
        ctrlKey: false,
      }
      onDragging?.(newEvent, true, overlay) // event handler is not addded if dragging is not active
      setUi((current) =>
        ctrlKey !== current?.dragging?.ctrKeyDown
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: false },
            }
          : current
      )
    }

    if (ui?.dragging?.active) {
      document.addEventListener('keydown', keyDownListener)
      document.addEventListener('keyup', keyUpListener)
      document.addEventListener('mousemove', mouseMoveListener)
    }
    return () => {
      if (ui?.dragging?.active) {
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)
        document.removeEventListener('mousemove', mouseMoveListener)
      }
    }
  }, [onDragging, overlay, ui?.dragging?.active])

  const handleExpandNode = React.useCallback(
    (id: string) => {
      if (!onToggleExpand) return
      onToggleExpand(id, null)
    },
    [onToggleExpand]
  )

  const selected = selectedItems?.[0]
  React.useEffect(() => {
    if (selected === null) {
      const focusedItem = treeViewRef.current?.querySelector(
        '.MuiTreeItem-content.Mui-focused'
      )
      if (focusedItem) {
        focusedItem.classList.remove('Mui-focused')
      }
    }
  }, [selected])

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // sensors={sensors}
      >
        <TreeView
          ref={treeViewRef}
          disabledItemsFocusable={disableItemsFocusable}
          aria-label="tree-view"
          expanded={expandedItems as any}
          onNodeSelect={(e, value) => {
            if (!onToggleSelect) return
            if (selectedItems?.[0] === value) {
              onToggleSelect(null as any, e)
              return
            }
            onToggleSelect?.(value, e)
            // treeViewRef.current.focus()
          }}
          // onNodeToggle={(e, value) => {
          //   e.stopPropagation();
          //   if (!onToggleExpand) return;
          //   // if ((e?.target as any)?.nodeName !== "svg") return;

          //   const newToggles = [
          //     ...(value.filter((v) => !expandedItems?.includes?.(v)) ?? []),
          //     ...(expandedItems?.filter((item) => !value?.includes?.(item)) ??
          //       []),
          //   ];
          //   forEach(newToggles, (t) => {
          //     onToggleExpand(t, e);
          //   });
          // }}
          selected={selectedItems?.[0]}
          // multiSelect={true}
          // defaultCollapseIcon={<Icon path={mdiChevronDown} size={1} />}
          // defaultExpandIcon={<Icon path={mdiChevronRight} size={1} />}
          // defaultEndIcon={<div style={{ width: 24 }} />}
          sx={{
            overflowY: 'auto',
            maxWidth: maxWidth,
            width,
            ...(treeViewProps as any),
          }}
        >
          {items?.map?.((item) =>
            recursiveMap(
              [item],
              {
                additionalActions: additionalActions,
                actions,
              },
              true,
              handleExpandNode
            )
          )}
        </TreeView>

        <DragOverlay modifiers={[restrictToVerticalAxis]}>
          {overlay && <StyledTreeItem key="overlay" {...overlay} />}
        </DragOverlay>
      </DndContext>
    </>
  )
}
