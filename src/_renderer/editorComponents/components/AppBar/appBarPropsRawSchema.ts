import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { paperPropsSchema } from '../Paper/paperPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const appBarPropsSchema: ExtendedObjectSchemaType = {
  ...paperPropsSchema,
  properties: {
    ...Object.keys(paperPropsSchema.properties)?.reduce((acc, cur) => {
      const addObj =
        paperPropsSchema.properties[cur]?.category !== 'customize'
          ? {
              [cur]: paperPropsSchema.properties[cur],
            }
          : {}

      return { ...acc, ...addObj }
    }, {}),
    position: {
      type: PropertyType.String,
      enum: ['fixed', 'absolute', 'sticky', 'static', 'relative'],
      required: false,
      form: {
        defaultValue: 'fixed',
      },
      category: 'shortcut',
    },
    enableColorOnDark: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    color: {
      type: PropertyType.String,
      required: false,
      enum: [
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
        'error',
        'info',
        'success',
        'warning',
      ],
      form: {
        defaultValue: 'primary',
      },
      category: 'shortcut',
    },
    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      label: 'sx',
      keysDict: CSS_RULE_NAMES_DICT_FULL,
      category: 'customize',
    } as any,
  },
}
