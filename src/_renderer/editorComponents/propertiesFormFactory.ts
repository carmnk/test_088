import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../defs/HTMLTagNamesDict'
import { EditorControllerType } from '../editorController/editorControllerTypes'
import { EditorStateType } from '../editorController/editorState'
import {
  ExtendedArraySchemaType,
  ExtendedObjectSchemaType,
  PropertyType,
} from './schemaTypes'
import {
  GenericFormProps,
  InputFieldType,
  StaticFieldDefinition,
} from '@cmk/fe_utils'

type OptionsDictType = {
  [key: string]: { value: any; label: string }[]
}

type KeysDictType = {
  [key: string]: any
}

const convertSchemaToFormType = (
  schemaType: PropertyType
): InputFieldType | 'object' | 'array' => {
  switch (schemaType) {
    case PropertyType.String:
      return 'text'
    case PropertyType.Number:
      return 'number'
    case PropertyType.Int:
      return 'number'
    case PropertyType.Boolean:
      return 'bool'
    case PropertyType.Object:
      return 'object'
    case PropertyType.json:
      return 'json'
    case PropertyType.Array:
      return 'array'
    case PropertyType.eventHandler:
      return 'multiselect'
    default:
      return 'text'
  }
}

const convertPropertiesToFields = (
  properties: ExtendedObjectSchemaType['properties'],
  injections?: GenericFormProps['injections'] // just created before fields!
): (Omit<StaticFieldDefinition, 'value' | 'onChange'> & {
  _prop_type: string
  _enum?: any[]
})[] => {
  return Object.keys(properties).map((key) => {
    const prop = properties[key]
    const doOverrideSelectType =
      ('enum' in prop && !!prop?.enum?.length) ||
      !!injections?.options?.[key]?.length
    const injectedObjectProperties =
      prop.type === PropertyType.Object
        ? {
            properties: prop.properties,
          }
        : {}

    const field: Omit<StaticFieldDefinition, 'value' | 'onChange'> & {
      _prop_type: string
      _enum?: any[]
      label: string
      items?: Omit<StaticFieldDefinition, 'value' | 'onChange'>[]
    } = {
      ...(prop ?? {}),
      _prop_type: prop.type,
      type:
        doOverrideSelectType && prop?.type === PropertyType.icon
          ? 'autocomplete'
          : doOverrideSelectType && prop?.type === PropertyType.eventHandler
          ? 'multiselect'
          : doOverrideSelectType
          ? 'select'
          : convertSchemaToFormType(prop.type),
      name: key,
      label: prop?.form?.label ?? key,
      _enum: 'enum' in prop ? prop?.enum : undefined,
      items:
        prop.type === PropertyType.Array
          ? ((prop.items?.[0] as any)?.properties as any)
          : undefined,
      ...injectedObjectProperties,
    }
    return field
  })
}

const extractInjectionOptionsFromProperties = (
  properties: ExtendedObjectSchemaType['properties'],
  injectionsIn?: DynamicFormInjectionsType,
  actionsOptions?: { [key: string]: any }
) => {
  return Object.keys(properties).reduce((acc, propKey) => {
    const injectedDynamicOptions = Object.keys(actionsOptions ?? {}).includes(
      propKey
    )
      ? actionsOptions?.[propKey]
      : injectionsIn?.dynamicOptionsDict?.[propKey]
    const prop = properties[propKey]
    const propOptions = injectedDynamicOptions?.length
      ? {
          [propKey]: injectedDynamicOptions,
        }
      : 'enum' in prop && prop?.enum?.length
      ? {
          [propKey]: prop.enum.map((val) => ({
            value: val,
            label: val,
          })),
        }
      : {}

    return {
      ...acc,
      ...propOptions,
    }
  }, {})
}

export type DynamicFormInjectionsType = {
  dynamicOptionsDict?: OptionsDictType
  dynamicKeysDict?: KeysDictType
  onBeforeChange?: (
    newFormData: any,
    prevFormData: any,
    changedKey: string,
    changedValue: any
  ) => {
    newFormData: any
    prevFormData: any
    changedKey: string
    changedValue: any
  }
}

const getEpActions = (editorState: EditorStateType) => {
  return editorState.externalApis
    .map((api) =>
      api.endpoints.map((ep) => ({ ...ep, api_id: api.external_api_id }))
    )
    .flat()
    .map((ep) => ({
      // IMPORTANT - if action_id is not present --> value is endpoint_id
      ...ep,
      value:
        editorState.actions.find((act) => act.endpoint_id === ep.endpoint_id)
          ?.action_id ?? ep.endpoint_id,
      endpoint_id: ep.endpoint_id,
      label: ep.name,
      textLabel: ep.name,
      action_id: editorState.actions.find(
        (act) => act.endpoint_id === ep.endpoint_id
      )?.action_id,
      // need the actions / action_id
    }))
}

/** needed for the menu */
export const propertyFormFactory = (
  propObjectSchema: ExtendedObjectSchemaType,
  editorController: EditorControllerType,
  injectionsIn?: DynamicFormInjectionsType // ??? to be checked if suitable,
  // actionsOptions: { [key: string]: any } = {}
): Omit<GenericFormProps, 'formData' | 'onChangeFormData'> => {
  const properties = propObjectSchema.properties
  // const elementEvents = editorController.editorState?.events?.filter(
  //   (event) => event.element_id === element._id
  // )
  const schemaEventNames = Object.keys(propObjectSchema.properties).filter(
    (key) => propObjectSchema.properties[key].type === PropertyType.eventHandler
  )
  const eventKeysDict = schemaEventNames.reduce<{
    [key: string]: ReturnType<typeof getEpActions>
  }>((acc, key) => {
    return {
      ...acc,
      [key]: getEpActions(editorController.editorState),
    }
  }, {})

  const injections: GenericFormProps['injections'] = {
    initialFormData: Object.keys(properties).reduce((acc, propKey) => {
      const defaultValue = properties[propKey].form?.defaultValue
      return defaultValue
        ? {
            ...acc,
            [propKey]: defaultValue,
          }
        : acc
    }, {}),
    required: Object.keys(properties).reduce((acc, propKey) => {
      const isRequired = properties[propKey].required
      return isRequired
        ? {
            ...acc,
            [propKey]: isRequired,
          }
        : acc
    }, {}),
    keysDict: {
      component: [
        { value: undefined, label: 'Default (depends on variant)' },
        ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      ],
      // ...(eventKeysDict ?? {}),
      ...(injectionsIn?.dynamicKeysDict ?? {}),
    },
    disabled: Object.keys(properties).reduce((acc, propKey) => {
      const isDisabled = properties[propKey].form?.disabled
      return isDisabled
        ? {
            ...acc,
            [propKey]: isDisabled,
          }
        : acc
    }, {}),
    options: extractInjectionOptionsFromProperties(
      properties,
      injectionsIn,
      eventKeysDict
    ),
    onBeforeChange: (newFormDataIn, prevFormData, changedKey, changedValue) => {
      const newFormData =
        injectionsIn?.onBeforeChange?.(
          newFormDataIn,
          prevFormData,
          changedKey,
          changedValue
        ) ?? newFormDataIn
      // must be a json type
      if (!['sx'].includes(changedKey)) {
        if (schemaEventNames.includes(changedKey)) {
          if (!editorController.editorState.ui.selected.element) {
            return newFormData
          }
          // currently new actions without action_id are exclusively endpoint_ids (FUTURE - also new actions)
          const newEndpointIds = changedValue?.filter(
            (val: string) =>
              !editorController.editorState.actions.find(
                (act) => act.action_id === val
              )
          ) // if not found they are new and endpoint_ids
          const removedActionIds =
            prevFormData?.[changedKey]?.filter?.(
              (val: string) =>
                !changedValue?.includes(val) &&
                editorController.editorState.actions.find(
                  (act) => act.action_id === val
                )
            ) ?? [] // prevFormData?.onClick can be undefined
          editorController.actions.events.htmlEvents.changeComponentActions(
            editorController.editorState.ui.selected.element,
            newEndpointIds,
            removedActionIds
          )
          console.log(
            'new FormData - onClick',
            newFormData,
            changedKey,
            changedValue
          )
          console.log('NEW EP Ids ', newEndpointIds)
          console.log('NEW REMOVED ACTIONS ', removedActionIds)
          return {
            ...(newFormData ?? {}),
            [changedKey]: changedValue.filter(
              (val: any) =>
                ![...newEndpointIds, ...removedActionIds].includes(val)
            ),
          }
        }

        return newFormData
      }
      // console.log(
      //   'BEFORE CHANGE',
      //   newFormData,
      //   prevFormData,
      //   changedKey,
      //   changedValue
      // )
      const oldProps = Object.keys(prevFormData[changedKey])
      const newProps = Object.keys(changedValue)
      const isPropAdded = newProps.find((prop) => !oldProps.includes(prop))

      if (!isPropAdded) {
        return newFormData
      }

      const addedProp = isPropAdded
      if (!addedProp.includes('&')) {
        return newFormData
      }
      const newSxValueAdj = { ...changedValue }
      newSxValueAdj[addedProp] = {}
      return { ...newFormData, sx: newSxValueAdj }
    },
  }

  const fieldsRaw = convertPropertiesToFields(properties, injections)

  // filter and arrays for now
  const fields = fieldsRaw.filter(
    (field) =>
      //   field.type !== 'object' &&
      // currently allow only selected arrays
      (field.type !== 'array' ||
        ['items', 'columns'].includes(field?.name ?? '')) &&
      (field.name !== 'children' ||
        field?._prop_type !== PropertyType.children) &&
      field._prop_type !== PropertyType.Function
  )

  const arrays = fields.filter((field) => field.type === 'array')

  const itemsArrays = fields.filter(
    (field) => field.type === 'array' && field.name === 'items'
  )
  const objects = fields.filter((field) => field.type === 'object')
  const itemsArrayProperties =
    (itemsArrays?.length &&
      (
        (properties.items as ExtendedArraySchemaType)
          ?.items?.[0] as ExtendedObjectSchemaType
      )?.properties) ||
    {}
  // const arrayProperties =
  //   arrays.map((field) => {
  //     return {...field}
  //   })
  //     //
  //     arrays?.length &&
  //       (
  //         (properties.items as ExtendedArraySchemaType)
  //           ?.items?.[0] as ExtendedObjectSchemaType
  //       )?.properties
  //   ) || {}
  //   const objectProperties = objects?.length
  //     ? objects.reduce((acc, obj) => {
  //         return {
  //             ...acc,
  //             a: obj.name
  //         }
  //     }
  //     : {}
  const objectSubforms = objects?.reduce((acc, obj) => {
    return {
      ...acc,
      [obj.name as string]: {
        fields: convertPropertiesToFields((obj as any).properties),
        injections: {
          //   initialFormData: injections.initialFormData?.[obj.name as string],
          required: {},
          disabled: {},
          options: extractInjectionOptionsFromProperties(
            (obj as any).properties,
            undefined,
            eventKeysDict
          ),
        },
      },
    }
  }, {})
  const itemsArraySubforms = itemsArrays?.length
    ? {
        items: {
          fields: convertPropertiesToFields(itemsArrayProperties),
          injections: {
            //   initialFormData: injections.initialFormData?.items,
            required: {},
            disabled: {},
            options: extractInjectionOptionsFromProperties(
              itemsArrayProperties,
              undefined,
              eventKeysDict
            ),
          },
        },
      }
    : {}
  const arraySubforms = arrays?.reduce(
    (acc, cur) => ({
      ...acc,
      [cur?.name as string]: {
        fields: convertPropertiesToFields((cur as any)?.items ?? {}),
        injections: {
          //   initialFormData: injections.initialFormData?.items,
          required: {},
          disabled: {},
          options: extractInjectionOptionsFromProperties(
            (cur as any)?.items ?? {},
            undefined,
            eventKeysDict
          ),
        },
      },
    }),
    {}
  )

  // arrays?.length
  //   ? {
  //       ['columns']: {
  //         fields: convertPropertiesToFields(arrayProperties),
  //         injections: {
  //           //   initialFormData: injections.initialFormData?.items,
  //           required: {},
  //           disabled: {},
  //           options: extractInjectionOptionsFromProperties(arrayProperties),
  //         },
  //       },
  //     }
  //   : {}

  
  return {
    fields: fields as any,
    injections,
    subforms: {
      ...itemsArraySubforms,
      ...arraySubforms,
      ...objectSubforms,
    } as any, // comes with arrays and objects
    // settings: {
    //   gap: 2,
    //   gridWidth: '100%',
    // },
  }
}
