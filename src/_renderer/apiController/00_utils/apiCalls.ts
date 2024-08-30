import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export type QueryConfigType = Omit<
  AxiosRequestConfig,
  'data' | 'url' | 'method'
> & {
  disableRedirectToLogin?: boolean
}

export type QueryFnType<PayloadType = any, ResponseType = any> = (
  url: string,
  payload?: PayloadType,
  queryConfig?: QueryConfigType
) => Promise<AxiosResponse<ResponseType>>

export const post2 = async <
  PayloadType = { [key: string]: any },
  ResponseType = any,
  MappedResponseType = any
>(
  url: string,
  payload?: PayloadType,
  postprocessing?: (resp: ResponseType) => MappedResponseType,
  queryConfig?: QueryConfigType
): Promise<AxiosResponse<ResponseType>> => {
  const { disableRedirectToLogin, headers: queryHeaders } = queryConfig ?? {}
  return new Promise(function (resolve, reject) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...(queryHeaders ?? {}),
    }
    axios({
      ...queryConfig,
      method: 'post',
      url: url,
      timeout: 1000 * 1200,
      data: payload,
      headers,
      withCredentials: true,
    } as any)
      .then(async (response) => {
        resolve(response)
      })
      .catch((error) => {
        if (!disableRedirectToLogin) redirectToLoginPageIfTokenIsExpired(error)
        reject(error.response)
      })
  })
}

export const postWithReturnedFile2 = async <
  PayloadType = { [key: string]: any },
  ResponseType = any,
  MappedResponseType = any
>(
  url: string,
  payload?: PayloadType,
  postprocessing?: (resp: ResponseType) => MappedResponseType,
  queryConfig?: QueryConfigType
): Promise<AxiosResponse<ResponseType>> => {
  const { disableRedirectToLogin, headers: queryHeaders } = queryConfig ?? {}
  const headers: any = {
    'Content-Type': 'application/json',
    ...(queryHeaders ?? {}),
  }
  return new Promise<AxiosResponse>(function (resolve, reject) {
    axios({
      ...queryConfig,
      method: 'post',
      url: url,
      responseType: 'blob',
      timeout: 1000 * 1200,
      data: payload,
      headers,
      withCredentials: true,
    })
      .then(async (response) => {
        resolve(response)
      })
      .catch((error) => {
        if (!disableRedirectToLogin) redirectToLoginPageIfTokenIsExpired(error)
        reject(error.response)
      })
  })
}

export const get2 = async <
  PayloadType = undefined,
  ResponseType = any,
  MappedResponseType = ResponseType
>(
  url: string,
  payload?: PayloadType,
  postprocessing?: (resp: ResponseType) => MappedResponseType,
  queryConfig?: QueryConfigType
): Promise<AxiosResponse<ResponseType>> => {
  const { disableRedirectToLogin, headers: queryHeaders } = queryConfig ?? {}

  return new Promise<AxiosResponse<ResponseType>>(function (resolve, reject) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...(queryHeaders ?? {}),
    }
    axios({
      ...queryConfig,
      method: 'get',
      url: url,
      timeout: 1000 * 120,
      headers,
      withCredentials: true,
    })
      .then(async (response) => {
        resolve(response)
      })
      .catch((error) => {
        // if (!disableRedirectToLogin) redirectToLoginPageIfTokenIsExpired(error)
        reject(error)
      })
  })
}

export const getFile2 = async <
  PayloadType = undefined,
  ResponseType = Blob,
  MappedResponseType = ResponseType
>(
  url: string,
  payload?: PayloadType,
  postprocessing?: (resp: ResponseType) => MappedResponseType,
  queryConfig?: QueryConfigType
): Promise<AxiosResponse<ResponseType>> => {
  const { disableRedirectToLogin, headers: queryHeaders } = queryConfig ?? {}
  return new Promise<AxiosResponse>(function (resolve, reject) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...(queryHeaders ?? {}),
    }
    axios({
      ...queryConfig,
      method: 'get',
      url: url,
      responseType: 'blob',
      timeout: 1000 * 120,
      headers,
      withCredentials: true,
    })
      .then(async (response) => {
        resolve(response)
      })
      .catch((error) => {
        if (!disableRedirectToLogin) redirectToLoginPageIfTokenIsExpired(error)
        reject(error.response)
      })
  })
}

export const put2 = async <
  PayloadType = { [key: string]: any },
  ResponseType = any,
  MappedResponseType = any
>(
  url: string,
  payload?: PayloadType,
  postprocessing?: (resp: ResponseType) => MappedResponseType,
  queryConfig?: QueryConfigType
): Promise<AxiosResponse<ResponseType>> => {
  const { disableRedirectToLogin, headers: queryHeaders } = queryConfig ?? {}
  return new Promise<AxiosResponse>(function (resolve, reject) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...(queryHeaders ?? {}),
    }
    axios({
      ...queryConfig,
      method: 'put',
      url: url,
      timeout: 1000 * 60,
      data: payload,
      headers,
      withCredentials: true,
    })
      .then(async (response) => {
        resolve(response)
      })
      .catch((error) => {
        if (!disableRedirectToLogin) redirectToLoginPageIfTokenIsExpired(error)
        reject(error.response)
      })
  })
}

export const deletion2 = async <
  PayloadType = { [key: string]: any },
  ResponseType = any,
  MappedResponseType = any
>(
  url: string,
  payload?: PayloadType,
  postprocessing?: (resp: ResponseType) => MappedResponseType,
  queryConfig?: QueryConfigType
): Promise<AxiosResponse<ResponseType>> => {
  const { disableRedirectToLogin, headers: queryHeaders } = queryConfig ?? {}
  return new Promise<AxiosResponse>(function (resolve, reject) {
    const headers: any = {
      'Content-Type': 'application/json',
      ...(queryHeaders ?? {}),
    }
    axios({
      ...queryConfig,
      method: 'delete',
      url: url,
      timeout: 1000 * 60,
      data: payload,
      headers,
      withCredentials: true,
    })
      .then(async (response) => {
        resolve(response)
      })
      .catch((error) => {
        if (!disableRedirectToLogin) redirectToLoginPageIfTokenIsExpired(error)
        reject(error.response)
      })
  })
}

export const redirectToLoginPageIfTokenIsExpired = (
  error: AxiosError<any, { data: { msg: string } }>
) => {
  // if (process?.env?.JEST_WORKER_ID !== undefined) return
  if (
    error.response &&
    error.response.status == 401
    // ['Token has expired', `Missing cookie "access_token_cookie"`].includes(error.response.data.msg)
  ) {
    // {"msg":"Missing cookie \"access_token_cookie\""}
    // if (error.response && error.response.status == 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('expiry')
    // window.location.href = '/login's
  }
}
