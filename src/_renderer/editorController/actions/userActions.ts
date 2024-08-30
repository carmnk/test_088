import { Dispatch, SetStateAction, useMemo } from 'react'
import { EditorControllerType } from '../editorControllerTypes'
import { EditorStateType } from '../editorState'
import { v4 as uuid } from 'uuid'

export type UserActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  currentViewportElements: EditorControllerType['currentViewportElements']
  //   components: any[]
}

export const useUserActions = (params: UserActionsParams) => {
  const { editorState, setEditorState } = params
  const actions = useMemo(() => {
    return {
      htmlEvents: {
        addHtmlEvent: (
          element_id: string,
          event_name: string,
          endpoint_id: string
        ) => {
          const event_id = uuid()
          const action_id = uuid()
          const project_id = editorState.project.project_id
          setEditorState((prev) => {
            return {
              ...prev,
              events: [
                ...prev.events,
                {
                  event_id,
                  event_name,
                  element_id,
                  action_ids: [action_id],
                  project_id,
                },
              ],
              actions: [
                ...prev.actions,
                {
                  action_id,
                  action_name: `event_${element_id}_${event_name}`,
                  endpoint_id,
                  project_id,
                },
              ],
            }
          })
        },
        updateHtmlEvent: (
          event_id: string,
          newEndpointIds: string[]

          // action: { endpoint_id: string }
        ) => {
          // const endpoint_id = action.endpoint_id

          setEditorState((prev) => {
            // const event = prev.events.find(
            //   (event) => event.event_id === event_id
            // )
            // const action_ids = event?.action_ids
            // if (!event) {
            //   return prev
            // }
            const prevActionIds = prev.events.find(
              (event) => event.event_id === event_id
            )?.action_ids
            const prevEndpointsIds: string[] | undefined = prevActionIds
              ?.map((action_id) => {
                return prev.actions.find(
                  (action) => action.action_id === action_id
                )?.endpoint_id as string
              })
              .filter((endpoint_id) => endpoint_id)
            const additionalEndpointIds = newEndpointIds.filter(
              (endpoint_id) => !prevEndpointsIds?.includes(endpoint_id)
            )
            const additionalActions = additionalEndpointIds.map(
              (endpoint_id) => {
                const action_id = uuid()
                return {
                  action_id,
                  action_name: `event_${event_id}_${endpoint_id}`,
                  endpoint_id,
                  project_id: editorState.project.project_id,
                }
              }
            )

            const removedEndpointIds = prevEndpointsIds?.filter(
              (endpoint_id) => !newEndpointIds.includes(endpoint_id)
            )
            const removedActionIds = prev.actions
              .filter((action) =>
                removedEndpointIds?.includes(action.endpoint_id ?? '')
              )
              .map((action) => action.action_id)

            //
            if (
              removedActionIds?.length &&
              additionalActions?.length &&
              (removedActionIds?.length !== 1 ||
                additionalActions?.length !== 1)
            ) {
              console.warn(
                'The logic to change the event eps is currently expecting max 1 removedActionId and 1 additionalActionId if both arrays have length!!!'
              )
            }
            const newActions =
              additionalActions?.length && !removedActionIds?.length
                ? [...prev.actions, ...additionalActions]
                : removedActionIds?.length && !additionalActions?.length
                ? prev.actions.filter(
                    (action) => !removedActionIds.includes(action.action_id)
                  )
                : [
                    ...(prev.actions?.map((act) =>
                      removedActionIds.includes(act.action_id)
                        ? additionalActions[0]
                        : act
                    ) ?? []),
                    ...additionalActions,
                  ]
            const newActionIds = newActions.map((action) => action.action_id)
            return {
              ...prev,
              events: prev.events.map((event) => {
                if (event.event_id === event_id) {
                  return {
                    ...event,
                    action_ids: newActionIds,
                  }
                }
                return event
              }),
              actions: newActions,
            }
          })
        },
        removeHtmlEvent: (event_id: string) => {
          setEditorState((prev) => {
            const event = prev.events.find(
              (event) => event.event_id === event_id
            )
            const action_ids = event?.action_ids
            if (!event) {
              return prev
            }
            return {
              ...prev,
              events: prev.events.filter(
                (event) => event.event_id !== event_id
              ),
              actions: prev.actions.filter(
                (action) => !action_ids?.includes(action.action_id)
              ),
            }
          })
        },
        changeComponentActions: (
          elementId: string, // component_id
          newEndpointIds: string[],
          removedActionIds: string[]
        ) => {
          setEditorState((prev) => {
            const newActions = newEndpointIds.map((endpoint_id) => {
              const action_id = uuid()
              return {
                action_id,
                action_name: `event_${endpoint_id}`,
                endpoint_id,
                project_id: editorState.project.project_id,
              }
            })

            return {
              ...prev,
              actions: [
                ...prev.actions.filter(
                  (action) => !removedActionIds.includes(action.action_id)
                ),
                ...newActions,
              ],
              elements: prev.elements.map((element) => {
                if (element._id !== elementId) return element

                return {
                  ...element,
                  props: {
                    onClick:
                      (element as any).props.onClick
                        ?.map((action_or_endpoint_id: string) => {
                          if (
                            removedActionIds.includes(action_or_endpoint_id)
                          ) {
                            return null
                          }
                          const newAction = newActions.find(
                            (act) => act.endpoint_id === action_or_endpoint_id
                          )
                          if (newAction) {
                            return newAction.action_id
                          }
                          return action_or_endpoint_id
                        })
                        .filter((val: any) => val) ?? [],
                  },
                }
              }),
              // component actions are currently not entangled with events
              // events: prev.events.map((event) => {
              //   if (removedActionIds.includes(event.action_ids)) {
              //     return {
              //       ...event,
              //       action_ids: newActionIds,
              //     }
              //   }
              //   return event
              // }),
            }
          })
        },
      },
    }
  }, [setEditorState, editorState.project.project_id])
  return actions
}
