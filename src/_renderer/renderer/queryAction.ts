import { query } from '@cmk/fe_utils'
import { EditorControllerType } from '../editorController/editorControllerTypes'

export const queryAction = async (
  appController: EditorControllerType['appController'],
  actionId: string,
  method: any,
  url: string,
  useCookies: boolean,
  payload: any,
  headers?: any,
  params?: any,
  responseType?: any,
  basicAuth?: { username: string; password: string }
) => {
  const response = await query(method, {
    url,
    payload,
    withCredentials: useCookies,
    auth: basicAuth,
    headers,
    params,
    responseType,
  })
  if (response?.data) {
    appController.actions.updateData(actionId, response.data)
  }

  return response
}
