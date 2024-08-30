import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { iconNames } from '../../../defs/mdiIcons'
import { MuiSize } from '../../../defs/muiSizeDict'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { muiBaseColors, muiBaseColorsOptions } from '../Chip/chipPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ButtonPropsSchema: ExtendedObjectSchemaType = {
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
    label: {
      type: PropertyType.String,
      required: false,
      form: {
        defaultValue: 'TestButton',
      },
      category: 'shortcut',
    },
    color: {
      type: PropertyType.String,
      required: false,
      enum: muiBaseColors,
      form: {
        defaultValue: muiBaseColorsOptions[0],
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: ['contained', 'outlined', 'text'],
      required: false,
      form: {
        defaultValue: 'contained',
      },
      category: 'shortcut',
    },
    size: {
      type: PropertyType.String,
      enum: Object.values(MuiSize),
      required: false,
      form: {
        defaultValue: MuiSize.medium,
      },
      category: 'shortcut',
    },
    name: { type: PropertyType.String, required: false, category: 'shortcut' },
    title: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    tooltip: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    iconButton: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
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
    disableHover: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTabStop: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    loading: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableInteractiveTooltip: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTooltipWhenDisabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableElevation: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableRipple: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableFocusRipple: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    fullWidth: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    href: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },

    icon: {
      type: PropertyType.icon,
      required: false,
      enum: iconNames,
      category: 'shortcut',
    },
    endIcon: {
      type: PropertyType.icon,
      required: false,
      enum: iconNames,
      category: 'shortcut',
    },
    iconColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    fontColor: {
      type: PropertyType.String,
      required: false,
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

    slotProps: {
      type: PropertyType.Object,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      category: 'customize',
      properties: {
        typography: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        startIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        endIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        loadingIconContainer: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        loadingProgress: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        tooltip: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
      },

      // keysDict: CSS_RULE_NAMES_DICT_FULL,
    },

    // children: {
    //   type: PropertyType.String,
    //   required: true,
    // },
    onClick: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'shortcut',
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

      //   returnType: { type: PropertyType.Void },
    },
  },
}
