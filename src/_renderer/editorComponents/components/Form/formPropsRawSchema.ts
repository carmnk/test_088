import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const formPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    fields: {
      type: PropertyType.json,
      label: 'field',
      // keysDict: {
      //   name: '',
      //   label: '',
      //   type: 'text',
      // },
    } as any,
  },
}
