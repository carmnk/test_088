import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
// import { HTML_TAG_NAMES_STRUCTURED_OPTIONS } from '../../../defs/HTMLTagNamesDict'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

export const muiTypographyColors = [
  'primary',
  'secondary',
  'error',
  'warning.main',
  'info.main',
  'success.main',
  'text.primary',
  'text.secondary',
  'text.disabled',
  'text.hint',
  'divider',
  'action.active',
  'inherit',
  // 'action.hover',
]

const typographyVariants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'subtitle1',
  'subtitle2',
  'caption',
  'button',
  'overline',
  'inherit',
]

const typographyAligns = ['inherit', 'left', 'center', 'right', 'justify']
// const components = HTML_TAG_NAMES_STRUCTURED_OPTIONS

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const typographyPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.String,
      form: {
        defaultValue: 'Test Typography',
      },
      category: 'shortcut',
    },
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item: any) => item?.category,
      category: 'shortcut',
    } as any,
    noWrap: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    align: {
      type: PropertyType.String,
      enum: typographyAligns,
      form: {
        defaultValue: 'inherit',
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: typographyVariants,
      form: {
        defaultValue: 'body1',
      },
      category: 'shortcut',
    },
    color: {
      // form: {
      // },
      type: PropertyType.String,
      enum: muiTypographyColors,

      // load dynamically!
      // form: {
      //   defaultValue: 'inherit',
      // },
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
