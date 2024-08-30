import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const paperPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.children,
      // required: true,
      category: 'shortcut',
    },
    square: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    elevation: {
      type: PropertyType.Number,
      minimum: 0,
      maximum: 24,
      // required: true,
      form: {
        defaultValue: 1,
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: ['elevation', 'outlined'],
      // required: true,
      form: {
        defaultValue: 'elevation',
      },
      category: 'shortcut',
    },
  },
}
