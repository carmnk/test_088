import { v4 as uuid } from 'uuid'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { EditorStateType, Endpoint, ExternalApi } from '../editorState'

export type useEditorControllerExternalApiActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useEditorControllerExternalApiActions = (
  params: useEditorControllerExternalApiActionsParams
) => {
  const { setEditorState } = params

  const actions = useMemo(() => {
    // api
    const addExternalApi = (
      newApiIn: Omit<ExternalApi, 'endpoints' | 'external_api_id'>
    ) => {
      const newApi = {
        ...newApiIn,
        external_api_id: uuid(),
        endpoints: [],
      }
      setEditorState((current) => ({
        ...current,
        externalApis: [...current.externalApis, newApi],
      }))
    }
    const updateExternalApi = (newApiIn: ExternalApi) => {
      const id = newApiIn.external_api_id
      setEditorState((current) => ({
        ...current,
        externalApis: current.externalApis.map((api) =>
          api.external_api_id === id ? newApiIn : api
        ),
      }))
    }
    const deleteApi = (apiId: string) => {
      setEditorState((current) => ({
        ...current,
        externalApis: current.externalApis.filter(
          (api) => api.external_api_id !== apiId
        ),
      }))
    }

    // endpoint
    const addEndpoint = (apiId: string, newEndpoint: any) => {
      setEditorState((current) => ({
        ...current,
        externalApis: current.externalApis.map((api) =>
          api.external_api_id === apiId
            ? { ...api, endpoints: [...api.endpoints, newEndpoint] }
            : api
        ),
      }))
    }
    const deleteEndpoint = (apiId: string, endpointId: string) => {
      setEditorState((current) => ({
        ...current,
        externalApis: current.externalApis.map((api) =>
          api.external_api_id === apiId
            ? {
                ...api,
                endpoints: api.endpoints.filter(
                  (endpoint) => endpoint.endpoint_id !== endpointId
                ),
              }
            : api
        ),
      }))
    }
    const updateEndpoint = (apiId: string, newEndpoint: Endpoint) => {
      setEditorState((current) => ({
        ...current,
        externalApis: current.externalApis.map((api) =>
          api.external_api_id === apiId
            ? {
                ...api,
                endpoints: api.endpoints.map((endpoint) =>
                  endpoint.endpoint_id === newEndpoint.endpoint_id
                    ? newEndpoint
                    : endpoint
                ),
              }
            : api
        ),
      }))
    }

    return {
      deleteApi,
      addExternalApi,
      updateExternalApi,
      addEndpoint,
      deleteEndpoint,
      updateEndpoint,
    }
  }, [setEditorState])

  return actions
}
