import { Dispatch, SetStateAction, useCallback } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { EditorStateType } from '../editorController/editorState'
import { API } from './API'
import { transformEditorStateToPayload } from './transformEditorState'
import { EditorControllerAppStateReturnType } from '../editorController/editorControllerTypes'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { EditorStateDbDataType } from './editorDbStateType'
import { debounce, isEqual } from 'lodash'
import { getDeepDifference } from '../utils/object.ts'
import { useApiControllerActions } from './actions/apiControllerActions'
import { ServerData, defaultServerData } from './serverData'
import { useEntityModelActions } from './actions/entityModelActions'

export const SESSION_DURATION = 10 * 60 * 1000 // 10 minutes

export type ApiControllerType = {
  data: ServerData
  actions: ReturnType<typeof useApiControllerActions> &
    ReturnType<typeof useEntityModelActions>
}

export const useApiController = (
  editorState: EditorStateType,
  setEditorState: Dispatch<SetStateAction<EditorStateType>>,
  appController: EditorControllerAppStateReturnType,
  components: any[]
): ApiControllerType => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchParamCode = searchParams?.get('code')

  const [data, setData] = useState<ServerData>(defaultServerData)

  const dbState = useMemo(() => {
    return transformEditorStateToPayload(editorState, false)
  }, [editorState])
  const lastDbState = useRef<EditorStateDbDataType | null>(dbState)

  const apiActions = useApiControllerActions({
    editorState,
    setEditorState,
    appController,
    data,
    setData,
    dbState,
    components,
  })
  const { updateUserData, updateUserRepos } = apiActions
  const { saveProjectImagesToCloud, saveProjectToCloud } = apiActions

  const entityActions = useEntityModelActions({
    setData,
    editorState,
  })

  // verify login via github code
  useEffect(() => {
    if (!searchParamCode) return
    const verifyGithubLogin = async () => {
      try {
        const resVerify = await API.verifyGithubLogin.query({
          code: searchParamCode,
        })
        console.log(resVerify)
        const userData = resVerify.data.data.data
        updateUserData(userData)
        const email = userData.login
        // remove code from url -> cannot be reused
        const expiresAt = +new Date() + SESSION_DURATION

        localStorage.setItem('expiresAt', expiresAt.toString())
        localStorage.setItem('email', email)
        localStorage.setItem('userData', JSON.stringify(userData))
        setSearchParams({})

        // console.log('VERIFY GITHUB LOGIN', resVerify)
        const resRepos = await API.getGithubUserRepos.query()
        const reposSorted = resRepos?.data?.data?.sort((a: any, b: any) => {
          return moment(a.updated_at).isSameOrBefore(moment(b.updated_at))
        })
        localStorage.setItem('userRepos', JSON.stringify(reposSorted))
        updateUserRepos(reposSorted)

        console.log('GITHUB REPOS', reposSorted)
      } catch (e) {
        console.log('ERROR VERIFYING GITHUB LOGIN', e)
        setSearchParams({})
      }
    }
    verifyGithubLogin()
  }, [searchParamCode, setSearchParams, updateUserData, updateUserRepos])

  const autoSave = useCallback(async () => {
    // console.log(
    //   'auto save, donts execute if ',
    //   !dbState,
    //   ' or ',
    //   !editorState.ui.isProjectInited
    // )
    if (
      dbState?.project.project_id !== lastDbState.current?.project.project_id
    ) {
      lastDbState.current = dbState
    }

    const dbStateKeys = Object.keys(dbState ?? {})
    const changedDbStateKeys = dbStateKeys.filter((keyRaw: any) => {
      const key = keyRaw as keyof EditorStateDbDataType
      const dbStateSub =
        key === 'project'
          ? (() => {
              const {
                created_datetime,
                edited_datetime,
                github_updated_datetime,
                github_updated_version_edited_datetime,

                ...rest
              } = dbState?.[key] ?? ({} as any)
              /* eslint-enable @typescript-eslint/no-unused-vars */
              return rest
            })()
          : dbState?.[key]

      const lastDbStateSub =
        key === 'project'
          ? (() => {
              const {
                created_datetime,
                edited_datetime,
                github_updated_datetime,
                github_updated_version_edited_datetime,
                ...rest
              } = lastDbState?.current?.[key] ?? ({} as any)
              /* eslint-enable @typescript-eslint/no-unused-vars */
              return rest
            })()
          : lastDbState?.current?.[key]

      const isEqualOldNew = isEqual(dbStateSub, lastDbStateSub)
      return !isEqualOldNew
    })
    // project is loaded from cloud

    if (
      !dbState ||
      !editorState.ui.isProjectInited ||
      !editorState.ui.isAutoSaveReady
    ) {
      return
    }
    if (!changedDbStateKeys.length) {
      console.log('state changed but not db relevant')
      return
    }
    // lastDbState.current = dbState
    // return

    const payload = changedDbStateKeys?.reduce((acc, key) => {
      return { ...acc, [key]: dbState[key as keyof typeof dbState] }
    }, {})

    // UPDATE STATE HERE
    console.log(
      'CHANGED STATE KEYS',
      changedDbStateKeys,
      getDeepDifference(dbState, lastDbState?.current),
      'Delta-Payload',
      payload,
      'X'
    )
    lastDbState.current = dbState

    if ((payload as any)?.elements?.find((el: any) => !el?.element_id)) {
      alert('STOP AUOTOSAVE - element_id is nullish')
      // await saveProjectToCloud(payload)
      return
    }

    if (
      changedDbStateKeys.includes('images') &&
      changedDbStateKeys.includes('imageFiles')
    ) {
      console.log('save images')
      await saveProjectImagesToCloud(payload)
    } else {
      if (
        !changedDbStateKeys.includes('imageFiles') &&
        changedDbStateKeys.includes('images')
      ) {
        console.log('DELETE images', dbState.imageFiles)
        const addedPayload = {
          ...(payload ?? {}),
          imageFiles: dbState.imageFiles || [],
        }
        await saveProjectImagesToCloud(addedPayload)
      }
      if (
        changedDbStateKeys.includes('images') ||
        changedDbStateKeys.includes('imageFiles')
      ) {
        console.warn(
          'Warning, perhaps your images may have NOT been saved successfully'
        )
      }
      console.log('save project')
      await saveProjectToCloud(payload)
    }
  }, [
    dbState,
    saveProjectToCloud,
    saveProjectImagesToCloud,
    editorState.ui.isProjectInited,
    editorState.ui.isAutoSaveReady,
  ])

  const debouncedAutoSave = useMemo(() => debounce(autoSave, 0), [autoSave])
  // auto save
  useEffect(() => {
    // return
    debouncedAutoSave()
  }, [dbState, saveProjectToCloud, saveProjectImagesToCloud, debouncedAutoSave])

  return {
    data,
    actions: { ...apiActions, ...entityActions },
  }
}
