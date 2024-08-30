import { ChangeEvent, Dispatch, SetStateAction, useMemo } from 'react'
import { EditorStateType } from '../editorState'
import { defaultEditorState, defaultPageElements } from '../editorState'
import { uniq } from 'lodash'
import { transformEditorStateFromPayload } from '../../apiController/transformEditorDbState'
import { transformEditorStateToPayload } from '../../apiController/transformEditorState'
import { EditorControllerType } from '../editorControllerTypes'
import { v4 as uuid } from 'uuid'
import { toBase64 } from '../../utils/file'

export type useEditorControllerProjectActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  currentViewportElements: EditorControllerType['currentViewportElements']
  components: any[]
}

export const useEditorControllerProjectActions = (
  params: useEditorControllerProjectActionsParams
) => {
  const { editorState, setEditorState, currentViewportElements, components } =
    params

  const actions = useMemo(() => {
    const saveProjectToJson = async () => {
      const newImages = []
      for (let i = 0; i < editorState.assets.images.length; i++) {
        const image = editorState.assets.images[i]
        const imageBase64 = await toBase64(image.image as unknown as File)
        newImages.push({
          ...image,
          image: imageBase64,
        })
      }
      // editorState.assets.images.map((image) => ({
      //   ...image,
      //   image: toBase64(image.image as unknown as File),
      // }))
      const editStateAdj = {
        ...editorState,
        assets: {
          ...editorState.assets,
          images: newImages,
        },
      }
      const editorDbState = transformEditorStateToPayload(
        editStateAdj as any,
        true
      )
      if (!editorDbState) {
        return
      }

      const filenameExExtension =
        editorState?.project?.project_name ?? 'project'
      const filename = `${filenameExExtension}.json`
      const file = new File([JSON.stringify(editorDbState)], filename, {
        type: 'text/plain',
        lastModified: new Date().getTime(),
      })
      const objectURL = window.URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = objectURL
      link.setAttribute('download', filename ? filename : file.name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    const loadProjectFromJson = async (e: ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(e.target.files ?? [])
      const file = files?.[0]
      if (!file) return
      const fileText = await file.text()
      const editorDbState = JSON.parse(fileText) as any

      const editorState = transformEditorStateFromPayload(
        editorDbState,
        defaultEditorState(),
        components,
        false
      )
      setEditorState(editorState)
    }
    const changeProjectName = (newValue: string, e: any) => {
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, project_name: newValue },
      }))
    }
    const changeHtmlPagesTitle = (newValue: string, e: any) => {
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, html_pages_title: newValue },
      }))
    }

    const changeHtmlPagesDescription = (newValue: string, e: any) => {
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, html_pages_description: newValue },
      }))
    }

    const handleChangeProjectType = (newValue: string) => {
      // const isFrontendOnly = newValue === 'frontend_only'
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, project_type: newValue as any },
      }))
    }

    // IS an old Textarea !
    const changeProjectDescription = (e: any) => {
      setEditorState((current) => ({
        ...current,
        project: { ...current.project, project_description: e.target.value },
      }))
    }
    const addHtmlPage = () => {
      setEditorState((current) => {
        const currentPages =
          currentViewportElements?.map((el) => el._page) ?? []
        const newPageName =
          `newPage` +
          (currentPages.includes('newPage')
            ? currentPages
                .map((pageName) => pageName.includes('newPage'))
                ?.filter((x) => x)?.length ?? 1
            : ''
          )?.toString()
        const newDefaultPageElements = defaultPageElements().map((el) => ({
          ...el,
          _page: newPageName,
        }))
        if (current.ui.selected.viewport === 'xs') {
          return {
            ...current,
            elements: [...current.elements, ...newDefaultPageElements],
          }
        } else {
          // add page only for specific viewport
          return {
            ...current,
            // elements: [...current.elements, ...newDefaultPageElements],
            alternativeViewports: {
              ...current.alternativeViewports,
              [current.ui.selected.viewport]: [
                ...current.alternativeViewports[current.ui.selected.viewport],
                ...newDefaultPageElements,
              ],
            },
          }
        }
      })
    }
    /** always rename page in all viewports */
    const renameHtmlPage = (oldPageName: string, newPageName: string) => {
      setEditorState((current) => {
        return {
          ...current,
          elements: current.elements.map((el) => {
            if (el._page === oldPageName) {
              return { ...el, _page: newPageName }
            }
            return el
          }),
          alternativeViewports: {
            sm: current.alternativeViewports.sm.map((el) => {
              if (el._page === oldPageName) {
                return { ...el, _page: newPageName }
              }
              return el
            }),
            md: current.alternativeViewports.md.map((el) => {
              if (el._page === oldPageName) {
                return { ...el, _page: newPageName }
              }
              return el
            }),
            lg: current.alternativeViewports.lg.map((el) => {
              if (el._page === oldPageName) {
                return { ...el, _page: newPageName }
              }
              return el
            }),
            xl: current.alternativeViewports.xl.map((el) => {
              if (el._page === oldPageName) {
                return { ...el, _page: newPageName }
              }
              return el
            }),
          },
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              page: newPageName,
            },
          },
        }
      })
    }

    const duplicateHtmlPage = (pageName: string) => {
      setEditorState((current) => {
        const currentPages = uniq(current.elements?.map((el) => el._page)) ?? []
        const newPageNameAdj =
          `duplicate_${pageName}` +
          (currentPages.includes(`duplicate_${pageName}`)
            ? currentPages
                .map((pageName) => pageName.includes(`duplicate_${pageName}`))
                ?.filter((x) => x)?.length ?? 1
            : '')
        const duplicatePageElements = current.elements
          ?.filter((el) => el._page === pageName)
          ?.map((el) => ({
            ...el,
            _page: newPageNameAdj,
            // _id: uuid(),
          }))
        // currently only 1 root element!
        const rootElementId = duplicatePageElements?.find(
          (el) => !el?._parentId
        )?._id
        if (!rootElementId) return current

        const sortedParentIds = [rootElementId]
        for (let i = 0; i < duplicatePageElements.length; i++) {
          const parentId = sortedParentIds?.[i]
          if (!parentId) break
          for (let j = 0; j < duplicatePageElements.length; j++) {
            const el = duplicatePageElements[j]
            if (el._parentId === parentId) {
              sortedParentIds.push(el._id)
            }
          }
        }
        const sortedElementsExRoot = sortedParentIds
          .map((parentId) =>
            duplicatePageElements.filter((el) => el._parentId === parentId)
          )
          .flat()
        const rootElement = duplicatePageElements.find(
          (el) => el._id === rootElementId
        )
        if (!rootElement) return current
        const sortedElements = [rootElement, ...sortedElementsExRoot]
        const newIdsKeys = sortedElements.map((el) => {
          return { prevId: el._id, prevParentId: el._parentId, newId: uuid() }
        })
        const newDuplicatePageElements = duplicatePageElements.map((dup) => {
          const newId = newIdsKeys.find((el) => el.prevId === dup._id)?.newId
          const newParentId = newIdsKeys.find(
            (el) => el.prevId === dup._parentId
          )?.newId
          return {
            ...dup,
            _id: newId ?? null,
            _parentId: newParentId ?? null,
          }
        })
        const filteredNewDuplicatePageElements =
          newDuplicatePageElements.filter(
            (dupl) => !!dupl._id
          ) as typeof newDuplicatePageElements & { _id: string }[]
        if (current.ui.selected.viewport === 'xs') {
          return {
            ...current,
            elements: [
              ...current.elements,
              ...filteredNewDuplicatePageElements,
            ],
          }
        } else {
          // add page only for specific viewport
          return {
            ...current,
            alternativeViewports: {
              ...current.alternativeViewports,
              [current.ui.selected.viewport]: [
                ...current.alternativeViewports[current.ui.selected.viewport],
                ...filteredNewDuplicatePageElements,
              ],
            },
          }
        }
      })
    }

    const removeHtmlPage = (pageName: string) => {
      setEditorState((current) => {
        return {
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              page: current.ui.selected.page === pageName ? 'index' : pageName,
            },
          },
          elements: current.elements.filter((el) => el._page !== pageName),
          alternativeViewports: {
            sm: current.alternativeViewports.sm.filter(
              (el) => el._page !== pageName
            ),
            md: current.alternativeViewports.md.filter(
              (el) => el._page !== pageName
            ),
            lg: current.alternativeViewports.lg.filter(
              (el) => el._page !== pageName
            ),
            xl: current.alternativeViewports.xl.filter(
              (el) => el._page !== pageName
            ),
          },
        }
      })
    }
    const handleChangeDefaultTheme = (newDefaultTheme: string) => {
      setEditorState((current) => {
        return {
          ...current,
          defaultTheme: newDefaultTheme as any,
        }
      })
    }

    return {
      saveProjectToJson,
      changeProjectName,
      changeProjectDescription,
      loadProjectFromJson,
      // relevant for viewports
      addHtmlPage,
      removeHtmlPage,
      duplicateHtmlPage,
      renameHtmlPage,
      // relevant for viewports end
      handleChangeDefaultTheme,
      changeHtmlPagesTitle,
      changeHtmlPagesDescription,
      handleChangeProjectType,
    }
  }, [currentViewportElements, editorState, setEditorState, components])

  return actions
}
