import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { iconNames } from '../../../defs/mdiIcons'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ListNavPropsSchema: ExtendedObjectSchemaType = {
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
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item: any) => item?.category,
      category: 'shortcut',
    } as any,
    dense: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    disablePadding: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    subheader: {
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
        listItem: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItem',
        } as any,
        listItemButton: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemButton',
        } as any,
        listItemIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemIcon',
        } as any,
        listItemText: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemText',
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
