import { Dispatch, SetStateAction, useMemo } from 'react'
import { EditorStateType } from '../editorState'
// import { EditorControllerType } from './editorControllerTypes'
import { v4 as uuid } from 'uuid'

export type useEditorControllerAssetActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  // currentViewportElements: EditorControllerType['currentViewportElements']
}

export const useEditorControllerAssetActions = (
  params: useEditorControllerAssetActionsParams
) => {
  const { editorState, setEditorState } = params
  const actions = useMemo(() => {
    const changeImageFilename = (newFileName: string) => {
      if (!newFileName) return
      const selectedFileId = editorState.ui.selected.image
      if (!selectedFileId) return

      setEditorState((current) => ({
        ...current,
        assets: {
          images: current.assets.images.map((image) => {
            if (image._id === selectedFileId) {
              return {
                ...image,
                fileName: newFileName,
              }
            }
            return image
          }),
        },
      }))
    }

    const deleteImageFile = (imageId: string) => {
      setEditorState((current) => {
        return {
          ...current,
          assets: {
            images: current.assets.images.filter(
              (image) => image._id !== imageId
            ),
          },
        }
      })
    }

    const handleProvidedImageFile = async (
      files: File[],
      checkFor?: 'squareImage'
    ) => {
      if (checkFor) {
        if (checkFor === 'squareImage') {
          const isSquareImage = await Promise.all(
            files.map(async (file) => {
              const img = new Image()
              img.src = URL.createObjectURL(file)
              await new Promise((resolve) => {
                img.onload = () => resolve(true)
                img.onerror = () => resolve(false)
              })
              return img.width === img.height
            })
          )
          if (!isSquareImage.every((el) => el)) {
            alert('Please provide square images only!')
            return
          }
        }
      }
      const img = new Image()
      ;(img as any).file = files[0]

      const reader = new FileReader()
      reader.onload = (e: any) => {
        img.src = e.target.result
      }
      reader.readAsDataURL(files[0])

      setEditorState((current) => ({
        ...current,
        assets: {
          images: [
            ...current.assets.images,
            ...files.map((file) => ({
              _id: uuid(),
              _upload: true,
              image: file as any,
              src: URL.createObjectURL(file),
              fileName: file.name,
            })),
          ],
        },
      }))
    }
    return {
      handleProvidedImageFile,
      deleteImageFile,
      changeImageFilename,
    }
  }, [editorState, setEditorState])

  return actions
}
