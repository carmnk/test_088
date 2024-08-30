import { AxiosResponse, AxiosRequestConfig } from 'axios'
import {
  QueryConfigType,
  post2,
  put2,
  deletion2,
  getFile2,
  postWithReturnedFile2,
  get2,
} from './apiCalls'
import { BASE_URL } from '../API'

export type QUERY_METHODS =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'GET_FILE'
  | 'POST_GET_FILE'

export const makeApiQuery = <
  PayloadType = undefined,
  ResponseType = any,
  MappedResponseType = ResponseType
>(
  url: string,
  method: QUERY_METHODS = 'GET'
): {
  url: string
  query: (
    payload?: PayloadType,
    urlParams?: string,
    postprocessing?: (response: ResponseType) => MappedResponseType,
    queryConfig?: QueryConfigType,
    searchParams?: string
  ) => Promise<AxiosResponse<ResponseType>>
  type: QUERY_METHODS
} => {
  const queryFn =
    method === 'POST'
      ? post2
      : method === 'PUT'
      ? put2
      : method === 'DELETE'
      ? deletion2
      : method === 'GET_FILE'
      ? getFile2
      : method === 'POST_GET_FILE'
      ? postWithReturnedFile2
      : get2
  return {
    url: `${BASE_URL}${url}`,
    query: (
      payload?: PayloadType,
      urlParams?: string,
      postprocessing?: (response: ResponseType) => MappedResponseType,
      queryConfig?: AxiosRequestConfig,
      searchParams?: string
    ) =>
      queryFn<PayloadType, ResponseType>(
        `${BASE_URL}${url}${urlParams || ''}${
          urlParams && searchParams
            ? searchParams
            : !urlParams && searchParams
            ? `?${searchParams}`
            : ''
        }`,
        payload as any,
        postprocessing as any,
        queryConfig
      ),
    type: method === 'GET' ? ('GET' as const) : method,
  }
}
