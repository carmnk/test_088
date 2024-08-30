import { Dispatch, SetStateAction, useMemo } from 'react'
import { ApiControllerType } from '../apiController'
import { API } from '../API'
import moment from 'moment'
import { EditorStateDbDataType } from '../editorDbStateType'
import { EditorStateType, ImageType } from '../../editorController/editorState'
import { transformEditorStateFromPayload } from '../transformEditorDbState'
import { createMuiTheme } from '../../createTheme'
import { v4 as uuidv4 } from 'uuid'
import { EditorControllerType } from '../../editorController/editorControllerTypes'
import { GithubUserType } from '../serverData'

export const SESSION_DURATION = 10 * 60 * 1000 // 10 minutes

export type ApiControllerActionsParams = {
  data: ApiControllerType['data']
  setData: Dispatch<SetStateAction<ApiControllerType['data']>>
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  appController: EditorControllerType['appController']
  components: any[]
  dbState?: EditorStateDbDataType | null
}

export const useApiControllerActions = (params: ApiControllerActionsParams) => {
  const {
    data,
    setData,
    editorState,
    setEditorState,
    appController,
    components,
    dbState,
  } = params

  const actions = useMemo(() => {
    const changeLogInStatus = (isLoggedIn: boolean) => {
      localStorage.removeItem('expires')
      localStorage.removeItem('email')
      setData((current) => ({
        ...current,
        loginForm: {
          ...current.loginForm,
          isLoggedIn,
        },
      }))
    }
    const changeLoginEmail = (email: string) => {
      setData((current) => ({
        ...current,
        loginForm: {
          ...current.loginForm,
          email,
        },
      }))
    }
    const changeLoginPassword = (password: string) => {
      setData((current) => ({
        ...current,
        loginForm: {
          ...current.loginForm,
          password,
        },
      }))
    }
    const login = async () => {
      try {
        const email = data.loginForm.email
        const password = data.loginForm.password
        const expiresAt = +new Date() + SESSION_DURATION
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const res = await API.login.query({ email, password })
          localStorage.setItem('expiresAt', expiresAt.toString())
          localStorage.setItem('email', email)
          setData((current) => ({
            ...current,
            loginForm: {
              ...current.loginForm,
              isLoggedIn: true,
            },
          }))
        } catch (e) {
          console.error(e)
        }

        // updateRoutes()
        // navigate?.(INITIAL_ROUTE)
      } catch (err) {
        // showToast(TOASTS.general.genericError)
        console.log(err)
      }
    }
    const logout = async () => {
      try {
        localStorage.removeItem('expiresAt')
        localStorage.removeItem('email')
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const res = await API.logout.query()
        } catch (e) {
          console.error(e)
        }

        setData((current) => ({
          ...current,
          loginForm: {
            ...current.loginForm,
            isLoggedIn: false,
          },
        }))
        // updateRoutes()
        // navigate?.(INITIAL_ROUTE)
      } catch (err) {
        // showToast(TOASTS.general.genericError)
        console.error(err)
      }
    }
    const handleRequestWebsiteZipBundle = async () => {
      setData((current) => ({
        ...current,
        bundleData: {
          ...current.bundleData,
          loading: true,
        },
      }))
      try {
        const res = await API.exportProjectToZip(
          editorState.project.project_id
        ).query()
        console.log('CREATE_BUNDLE- RESPONSE', res)
        //   const baseUrl = import.meta.env.VITE_WEBSITE_BUILDER_SERVER
        //   const url = baseUrl + '/fe_gen/zip_export'
        //   /* eslint-disable @typescript-eslint/no-unused-vars */
        //   const {
        //     // selectedCssClass,
        //     // selectedHtmlElementName,
        //     // selectedImage,
        //     // selectedFont
        //     // selectedPage,
        //     // expandedTreeItems,
        //     // imageWorkspaces,
        //     // htmlPages: htmlPagesIn, // !!! ???
        //     // cssWorkspaces,
        //     ui,
        //     ...dataRaw
        //   } = editorState
        //   /* eslint-enable @typescript-eslint/no-unused-vars */
        //   const htmlPages = makeImageSourcesForExport(editorState)
        //   const formData = new FormData()
        //   formData.append('cssWorkspaces', JSON.stringify(cssWorkspaces))
        //   formData.append('htmlPages', JSON.stringify(htmlPages))
        //   for (let f = 0; f < Object.keys(imageWorkspaces.common).length; f++) {
        //     const key = Object.keys(imageWorkspaces.common)[f]
        //     const image = imageWorkspaces.common[key]
        //     formData.append('image', image.image as unknown as File)
        //   }
        //   const res = await axios.post(url, formData, {
        //     responseType: 'blob',
        //     headers: {
        //       'Content-Type': 'multipart/form-data',
        //     },
        //   })
        //   const link = getLinkFromDownloadResponse(res)
        //   openDownloadWithLink(link)
      } catch (e) {
        console.error('error', e)
        alert('an error occurred while downloading the file')
      }
      setData((current) => ({
        ...current,
        bundleData: {
          ...current.bundleData,
          loading: false,
        },
      }))
    }

    // internal Fn to process server response
    const loadProjectFromServerResponse = async (
      serverResponse: EditorStateDbDataType,
      template_owner_user_id?: number
    ): Promise<EditorStateType> => {
      const newEditorState = transformEditorStateFromPayload(
        serverResponse,
        editorState,
        components
      )

      const currentEditorImageIds = editorState?.assets.images.map(
        (image) => image._id
      )
      const imageIdsFromDb = newEditorState?.assets.images?.map(
        (image) => image._id
      )
      const missingImageIds = imageIdsFromDb?.filter(
        (imageId) => !currentEditorImageIds?.includes(imageId)
      )

      const imageFiles: {
        url: string
        image: File
        _id: string
        src: string
      }[] = []
      for (let i = 0; i < missingImageIds?.length; i++) {
        const imageId = missingImageIds[i]
        try {
          const res = template_owner_user_id
            ? await API.getSharedAsset(template_owner_user_id, imageId).query()
            : await API.getAsset(imageId).query()
          const blob = res?.data
          const url = URL.createObjectURL(blob)
          const file = new File([blob], imageId, {
            type: blob.type,
          })

          imageFiles.push({ url, image: file, _id: imageId, src: url })
        } catch (err) {
          console.error(err)
        }
      }

      const newThemes = newEditorState?.themes?.map((theme) => {
        const muiTheme = createMuiTheme(theme)
        return muiTheme
      })

      const newAssets = {
        ...newEditorState.assets,
        images: (newEditorState.assets.images
          ? newEditorState.assets.images?.map((image) => {
              const imageFile = imageFiles.find(
                (imageFile) => imageFile._id === image._id
              )
              return {
                ...image,
                ...((imageFile || {}) as any),
              }
            }) ?? []
          : editorState?.assets.images) as ImageType[],
      }
      const attributesWithImages = newEditorState?.attributes
      // ?.map((attr) => {
      //   return attr.attr_name === 'src'
      //     ? {
      //         ...attr,
      //         attr_value:
      //           (
      //             newAssets.images.find((as) => as._id === attr.attr_value) ||
      //             {}
      //           )?.src || attr.attr_value,
      //       }
      //     : attr
      // })

      newEditorState.elements.forEach((el) => {
        const defaultComponentProps = components.find(
          (comp) => comp.type === el._type
        )
        if (!defaultComponentProps) return
        if ('state' in defaultComponentProps) {
          const _id = el._id
          appController.actions.addProperty(
            _id,
            (defaultComponentProps as any)?.state ?? ''
          )
        }
      })

      const defaultTheme = serverResponse?.project?.default_theme as any
      const newEditorStateWithImages = {
        ...newEditorState,
        attributes: attributesWithImages,
        // elements: elementsWithNewImages,
        assets: newAssets,
        themes: newThemes,
        theme: newThemes?.find(
          (theme) => theme.palette.mode === defaultTheme
        ) as any,
      }
      // console.log(
      //   'LOAD_PROJECT- data in,',
      //   serverResponse,
      //   newEditorState,
      //   newEditorStateWithImages
      // )
      if (serverResponse?.project) setEditorState(newEditorStateWithImages)

      return newEditorStateWithImages
    }

    const loadProjectFromCload = async (project_id: string) => {
      if (!project_id) return
      try {
        const res = await API.loadProject(project_id).query()
        const resDataIn = res?.data?.data

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newEditorState = await loadProjectFromServerResponse(resDataIn)
        console.log('LOAD_PROJECT- data in', resDataIn, newEditorState)
        setEditorState(newEditorState)
        return newEditorState
      } catch (err) {
        console.error(err)
      }
    }

    const cloneProjectFromCload = async (project_id: string) => {
      if (!project_id) return
      try {
        const res = await API.cloneProject(project_id).query()
        const resDataIn = res?.data?.data
        const template_owner_user_id =
          resDataIn?.project?.template_owner_user_id
        const newEditorState = await loadProjectFromServerResponse(
          resDataIn,
          template_owner_user_id
        )
        const images: (EditorStateType['assets']['images'][number] & {
          _old_asset_id: string
        })[] = newEditorState?.assets?.images?.map((image) => ({
          ...image,
          _id: uuidv4(),
          _old_asset_id: image._id,
          _upload: true,
        }))
        const elements = newEditorState?.elements?.map((el) =>
          el?._imageSrcId
            ? {
                ...el,
                _imageSrcId: images.find(
                  (img) => img._old_asset_id === el._imageSrcId
                )?._id,
              }
            : el
        )
        const newEditorStateAdjAssets: EditorStateType = {
          ...newEditorState,
          assets: { ...newEditorState.assets, images },
          elements,
        }
        setEditorState(newEditorStateAdjAssets)
      } catch (err) {
        console.error(err)
      }
    }

    const deleteProjectFromCloud = async (project_id: string) => {
      if (!project_id) return
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteProject(project_id).query()
      } catch (err) {
        console.error(err)
      }
    }

    const saveProjectToCloud = async (
      partialDbState?: Partial<EditorStateDbDataType>
    ): Promise<EditorStateType | null> => {
      // const payload: EditorStateType = editorState
      // const compareEditorStateBeforeSave = makeComparableEditorState(payload)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { images, imageFiles, ...payloadDbDataRaw } =
        partialDbState ?? dbState ?? {} //  transformEditorStateToPayload(payload
      if (!payloadDbDataRaw) {
        return null
      }
      // return
      // const payloadDbData = new FormData()
      // const { imageFiles, ...payloadJsonData } = payloadDbDataRaw
      // payloadDbData.append('data', JSON.stringify(payloadJsonData))
      // for (let f = 0; f < (imageFiles?.length ?? 0); f++) {
      //   const imageFile = imageFiles?.[f]
      //   if (!imageFile) continue
      //   const file = imageFile?.image as File
      //   const newFile = new File([file], imageFile.asset_id, {
      //     type: file.type,
      //   })

      //   payloadDbData.append('image', newFile)
      // }
      const project_id = editorState?.project?.project_id
      try {
        const res = await API.saveProject(project_id).query(
          payloadDbDataRaw
          // undefined,
          // undefined,
          // {
          //   headers: {
          //     'Content-Type': 'multipart/form-data',
          //   },
          // }
        )
        const resDataIn = res?.data?.data?.data
        const newEditorState = await loadProjectFromServerResponse(resDataIn)
        setEditorState(newEditorState)
        return newEditorState
      } catch (err) {
        console.error(err)
        return null
      }
    }

    const saveProjectImagesToCloud = async (
      partialDbState?: Partial<EditorStateDbDataType>
    ): Promise<EditorStateType | null> => {
      // const payload: EditorStateType = editorState
      // const compareEditorStateBeforeSave = makeComparableEditorState(payload)
      const payloadDbDataRaw = partialDbState ?? dbState //  transformEditorStateToPayload(payload
      if (!payloadDbDataRaw) {
        return null
      }
      // return
      const payloadDbData = new FormData()
      const { imageFiles, ...payloadJsonData } = payloadDbDataRaw
      payloadDbData.append('data', JSON.stringify(payloadJsonData))
      for (let f = 0; f < (imageFiles?.length ?? 0); f++) {
        const imageFile = imageFiles?.[f]
        if (!imageFile) continue
        const file = imageFile?.image as File
        const newFile = new File([file], imageFile.asset_id, {
          type: file.type,
        })

        payloadDbData.append('image', newFile)
      }
      const project_id = editorState?.project?.project_id
      try {
        const res = await API.saveProjectImages(project_id).query(
          payloadDbData,
          undefined,
          undefined,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        const resDataIn = res?.data?.data?.data
        const newEditorState = await loadProjectFromServerResponse(resDataIn)
        setEditorState(newEditorState)
        return newEditorState
      } catch (err) {
        console.error(err)
        return null
      }
    }

    const updateUserData = (user: GithubUserType) => {
      setData((current) => {
        return { ...current, user }
      })
    }
    const updateUserRepos = (repos: any[]) => {
      setData((current) => {
        return { ...current, repos }
      })
    }
    const refreshUserRepos = async () => {
      try {
        const resRepos = await API.getGithubUserRepos.query()
        const reposSorted = resRepos?.data?.data?.sort((a: any, b: any) => {
          return moment(a.updated_at).isSameOrBefore(moment(b.updated_at))
        })
        updateUserRepos(reposSorted)
      } catch (e) {
        console.error(e)
      }
    }

    const setLoading = (loading: boolean) => {
      setData((current) => {
        return { ...current, loading }
      })
    }

    const saveGithubRepo = async () => {
      try {
        setLoading(true)
        const res = await API.saveGithubRepo.query({
          project_id: editorState.project.project_id as any,
        })
        console.log('SAVE_GITHUB_REPO', res)
        await loadProjectFromCload(editorState.project.project_id)
        await refreshUserRepos()
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
      }
    }

    const getLoggedInStatus = () => {
      const expires = localStorage.getItem('expires')
      const email = localStorage.getItem('email')
      return { expires, email }
    }

    const deleteGithubPages = async () => {
      try {
        setLoading(true)
        const project_id = editorState.project.project_id
        const res = await API.deleteGithubPages(project_id).query()
        await loadProjectFromCload(editorState.project.project_id)
        await refreshUserRepos()
        console.log('Deactivated Github Pages', res)
        setLoading(false)
      } catch (e) {
        console.error("Couldn't deactivate Github Pages", e)
        console.error(e)
        setLoading(false)
      }
    }

    const createGithubPages = async () => {
      try {
        setLoading(true)
        console.log('CREATE GITHUB PAGES')
        const project_id = editorState.project.project_id
        const res = await API.createGithubPages(project_id).query()
        await loadProjectFromCload(editorState.project.project_id)
        await refreshUserRepos()
        console.log('Activated Github Pages', res)
        setLoading(false)
      } catch (e) {
        console.error("Couldn't activate Github Pages", e)
        console.error(e)
        setLoading(false)
      }
    }

    return {
      changeLogInStatus,
      changeLoginEmail,
      changeLoginPassword,
      login,
      logout,
      handleRequestWebsiteZipBundle,
      loadProjectFromServerResponse,
      loadProjectFromCload,
      cloneProjectFromCload,
      deleteProjectFromCloud,
      saveProjectToCloud,
      saveProjectImagesToCloud,
      updateUserData,
      updateUserRepos,
      refreshUserRepos,
      setLoading,
      saveGithubRepo,
      getLoggedInStatus,
      deleteGithubPages,
      createGithubPages,
    }
  }, [
    setData,
    data.loginForm.email,
    data.loginForm.password,
    editorState,
    components,
    setEditorState,
    appController.actions,
    dbState,
  ])

  return actions
}
