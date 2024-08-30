import { iconNames } from '../../../defs/mdiIcons'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { buttonEditorComponentDef } from '../Button/buttonDef'

/* eslint-disable @typescript-eslint/no-unused-vars */
const {
  icon,
  endIcon,
  onClick,
  onKeyDown,
  onPointerDown,
  title,
  tooltip,
  label,
  name,
  ...buttonSchema
  /* eslint-enable @typescript-eslint/no-unused-vars */
} = buttonEditorComponentDef.schema.properties

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ButtonGroupPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    // children: {
    //   type: PropertyType.children,
    // },
    items: {
      type: PropertyType.Array,
      items: [
        {
          type: PropertyType.Object,
          properties: {
            label: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            value: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            icon: { type: PropertyType.icon, enum: iconNames },
          },
        },
      ],
      form: {
        defaultValue: [{ value: 'test', label: 'test' }],
      },
      category: 'items',
    },
    buttonProps: {
      type: PropertyType.Object,
      properties: buttonSchema,
      category: 'shortcut',
    },
    selectedButtonProps: {
      type: PropertyType.Object,
      properties: buttonSchema,
      category: 'shortcut',
    },
  },
}
