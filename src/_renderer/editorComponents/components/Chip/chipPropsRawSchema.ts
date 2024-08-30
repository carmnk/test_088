import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { iconNames } from '../../../defs/mdiIcons'
import { MuiSize } from '../../../defs/muiSizeDict'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
// const booleanOptions = [
//   { value: false, label: 'false' },
//   { value: true, label: 'true' },
// ]

export const muiBaseColors = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
]
export const muiBaseColorsOptions = muiBaseColors.map((bt) => ({
  value: bt,
  label: bt,
}))
// raw schema to use until schema can be generated reliably from typescript parser/checker
export const chipPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item: any) => item?.category,
      category: 'shortcut',
    } as any,
    icon: {
      type: PropertyType.icon,
      required: false,
      enum: iconNames,
      category: 'shortcut',
    },
    label: {
      type: PropertyType.String,
      form: {
        defaultValue: 'Test Chip',
      },
      category: 'shortcut',
    },
    size: {
      type: PropertyType.String,
      enum: Object.values(MuiSize).filter((size) => size !== 'large'),
      required: false,
      form: {
        defaultValue: MuiSize.medium,
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: ['filled', 'outlined'],
      required: false,
      form: {
        defaultValue: 'filled',
      },
      category: 'shortcut',
    },
    color: {
      // form: {
      // },
      type: PropertyType.String,
      required: false,
      enum: muiBaseColors,
      form: {
        defaultValue: muiBaseColors[0],
      },
      category: 'shortcut',
    },
    clickable: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: true,
      },
      category: 'shortcut',
    },
    disabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    skipFocusWhenDisabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    // disableTabStop: {
    //   type: PropertyType.Boolean,
    //   required: false,
    // },
    // icon: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: iconNames,
    // },
    // endIcon: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: iconNames,
    // },
    // fontColor: {
    //   type: PropertyType.String,
    //   required: false,
    // },
    // loading: {
    //   type: PropertyType.Boolean,
    //   required: false,
    // },
    // name: { type: PropertyType.String, required: false },

    //
    onClick: {
      type: PropertyType.Function,
      required: false,
      parameters: {
        event: [{ type: PropertyType.Object, required: true, properties: {} }],
      },
      //   returnType: { type: PropertyType.Void },
    },
    onKeyDown: {
      type: PropertyType.Function,
      required: false,
      parameters: {
        event: [{ type: PropertyType.Object, required: true, properties: {} }],
      },
      //   returnType: { type: PropertyType.Void },
    },
    onPointerDown: {
      type: PropertyType.Function,
      required: false,
      parameters: {
        event: [{ type: PropertyType.Object, required: true, properties: {} }],
      },
    },
    //

    // sx: {
    //   type: PropertyType.Object,
    //   required: false,
    //   properties: {},
    // },
    // title: {
    //   type: PropertyType.String,
    //   required: false,
    // },
    // tooltip: {
    //   type: PropertyType.String,
    //   required: false,
    // },
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
