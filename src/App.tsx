import React from 'react'
import { useMemo } from 'react'
import { HtmlRenderer } from './_renderer/renderer/HtmlRenderer'
import { useEditorController } from './_renderer/editorController/editorController'
import appData from './app_data.json'
import { BrowserRouter } from 'react-router-dom'
import { transformEditorStateFromPayload } from './_renderer/apiController/transformEditorDbState'
import { baseComponents } from './_renderer/editorComponents/baseComponents'
import { defaultEditorState } from './_renderer/editorController/editorState'
import packageJson from '../package.json'
import { Toaster } from 'react-hot-toast'

// console.log('appData', appData)

function App() {
  const appDataAdj = useMemo(() => {
    const transformedState = transformEditorStateFromPayload(
      appData as any,
      defaultEditorState(),
      baseComponents
    )

    // adjust images -> images are currently supposed to be in the json - imageFiles.[n].image
    //CLOUD SOLutioN BACK !!!
    const images = transformedState.assets.images

    // this way is for base64 pictures
    // const adjImages = transformedState.assets.images.map((img) => ({
    //   ...img,
    //   image:
    //     appData?.imageFiles?.find?.((file) => file.asset_id === img._id)
    //       ?.image || null,
    // }))
    return {
      ...transformedState,
      assets: {
        ...transformedState.assets,
        images,
      },
      attributes: transformedState.attributes.map((attr) => {
        try {
          const attrValue =
            attr.attr_name === 'style' && typeof attr.attr_value === 'string'
              ? JSON.parse(attr.attr_value)
              : attr.attr_value
          return {
            ...attr,
            attr_value: attrValue,
          }
        } catch (e) {
          console.error('error', e)
        }
        return attr
      }),
    }
  }, [])

  console.log('IN', appData)
  const editorController = useEditorController({
    initialEditorState: appDataAdj as any,
    // injections: {
    //   components: [...baseComponents, buttonEditorComponentDef],
    // },
  })
  console.log('OUT', editorController)
  const theme = editorController.editorState.theme

  return (
    <>
      <BrowserRouter basename={packageJson?.homepage}>
        <HtmlRenderer
          editorController={editorController}
          theme={theme}
          isProduction
        ></HtmlRenderer>
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
