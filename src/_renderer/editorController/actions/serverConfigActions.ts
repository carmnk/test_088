import { Dispatch, SetStateAction, useMemo } from 'react'
import { EditorStateType } from '../editorState'

export type useEditorControllerServerConfigActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useEditorControllerServerConfigActions = (
  params: useEditorControllerServerConfigActionsParams
) => {
  const { setEditorState } = params

  const actions = useMemo(() => {
    const toggleServeFrontend = () => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              serve_frontend: !current.server.config.serve_frontend,
            },
          },
        }
      })
    }

    const toggleDisableHttps = () => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              disable_https: !current.server.config.disable_https,
            },
          },
        }
      })
    }

    const changeHttpPort = (newValue: number) => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              http_port: newValue,
            },
          },
        }
      })
    }

    const changeSslCertificatePath = (newValue: string) => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              ssl_certificate_path: newValue,
            },
          },
        }
      })
    }

    const changeSslPrivateKeyPath = (newValue: string) => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              ssl_private_key_path: newValue,
            },
          },
        }
      })
    }

    const changeAllowedOrigins = (newValue: string[]) => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              allowed_origins: newValue,
            },
          },
        }
      })
    }

    const changePostgresConfig = (
      newValue: string,
      valueType: 'host' | 'port' | 'db' | 'user' | 'password'
    ) => {
      setEditorState((current) => {
        return {
          ...current,
          server: {
            ...current.server,
            config: {
              ...current.server.config,
              [valueType]: newValue,
            },
          },
        }
      })
    }
    return {
      toggleServeFrontend,
      toggleDisableHttps,
      changeHttpPort,
      changeSslCertificatePath,
      changeSslPrivateKeyPath,
      changeAllowedOrigins,
      changePostgresConfig,
    }
  }, [setEditorState])

  return actions
}
