import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { iconNames } from '../../../defs/mdiIcons'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const TabsPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
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
    variant: {
      type: PropertyType.String,
      required: false,
      enum: ['standard', 'scrollable', 'fullWidth'],
      category: 'shortcut',
    },
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item: any) => item?.category,
      category: 'shortcut',
    } as any,

    // textColor: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: ['inherit', 'primary', 'secondary'],
    //   form: {
    //     defaultValue: 'primary',
    //   },
    // },
    indicatorColor: {
      type: PropertyType.String,
      required: false,
      enum: ['primary', 'secondary'],
      form: {
        defaultValue: 'primary',
      },
      category: 'shortcut',
    },
    scrollButtons: {
      type: PropertyType.String,
      required: false,
      enum: ['auto', false, true] as any,
      category: 'shortcut',
    },
    orientation: {
      type: PropertyType.String,
      required: false,
      enum: ['horizontal', 'vertical'],
      category: 'shortcut',
    },
    disableIndicator: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableBorderBottom: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    centered: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    visibleScrollbar: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    useTabBorders: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    allowScrollButtonsMobile: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    selectionFollowsFocus: {
      type: PropertyType.Boolean,
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
          label: 'typography',
        } as any,
        activeTab: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'activeTab',
        } as any,
        inactiveTabs: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'inactiveTabs',
        } as any,
        tooltip: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tooltip',
        } as any,
        tabItemContainer: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        } as any,
        icon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'icon',
        } as any,
      },
    },
  },
}
