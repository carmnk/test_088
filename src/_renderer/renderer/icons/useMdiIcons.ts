import * as iconLibrary from '@mdi/js'
import {
  EditorStateType,
  ElementType,
} from '../../editorController/editorState'
import { useEffect, useState } from 'react'

// extracts a component's icon keys (properties of type 'icon')
export const getIconKeys = (elementType: any, components: any[]) => {
  const baseComponent = components.find((com) => com.type === elementType)
  if (!baseComponent) return { directIconKeys: [], arrayOfObjectProperties: [] }
  const properties: any =
    ('schema' in baseComponent && baseComponent?.schema?.properties) || []
  const directIconKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'icon'
  )
  const directArrayKeys = Object.keys(properties).filter(
    (key) => properties[key].type === 'array'
  )
  const arrayOfObjectProperties = directArrayKeys.map((key) => {
    const arrayProperties = properties[key].items?.[0]?.properties
    const arrayPropertyKeys = Object.keys(arrayProperties)
    const iconPropertyKeys = arrayPropertyKeys.filter(
      (key) => arrayProperties[key].type === 'icon'
    )
    return {
      key,
      properties: arrayProperties,
      propertyKeys: iconPropertyKeys,
    }
  }) // eg. key=items -> properties

  const arrayOfObjectIconKeys = arrayOfObjectProperties
    .map((array) => array.propertyKeys)
    ?.flat()
  return { directIconKeys, arrayOfObjectProperties, arrayOfObjectIconKeys }
}

export const useMdiIcons = (
  selectedPageElements: ElementType[],
  components: any[],
  properties: EditorStateType['properties']
) => {
  const [icons, setIcons] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const getPropByName = (key: string, element_id: string) =>
      properties?.find(
        (prop) => prop.prop_name === key && prop.element_id === element_id
      )?.prop_value

    const updateIcons = async () => {
      const flatElements = selectedPageElements
      const iconsNames = flatElements
        .map((el: any) => {
          const {
            directIconKeys,
            arrayOfObjectProperties,
            // arrayOfObjectIconKeys,
          } = getIconKeys(el.type, components)

          const directIconNames = directIconKeys.map((iconKey) => {
            return getPropByName(iconKey, el._id)
          })
          // UNCLEAR ???
          const arrayItemIconNames = arrayOfObjectProperties
            ?.map((props) => {
              return getPropByName(props.key, el._id)?.map((it: any) => {
                return props.propertyKeys.map((key) => it?.[key])
              })
            })
            .flat()
          const allIconNames = [...directIconNames, ...arrayItemIconNames]
          // return directIconNames
          return allIconNames
        })
        .flat()
        .filter((el) => el && !Object.keys(icons).includes(el))
      if (!iconsNames.length) return
      const iconsNew: any = {}
      for (const iconName of iconsNames) {
        if (!icons[iconName]) {
          iconsNew[iconName] =
            iconLibrary?.[iconName as keyof typeof iconLibrary]
        }
      }
      setIcons((current) => ({ ...current, ...iconsNew }))
    }
    updateIcons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPageElements])

  return icons
}
