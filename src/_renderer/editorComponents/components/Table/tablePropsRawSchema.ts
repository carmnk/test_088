import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const tablePropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    data: {
      type: PropertyType.json,
      required: false,
      form: {
        defaultValue: [],
      },
      // items: [
      //   {
      //     type: PropertyType.Object,
      //     properties: {},
      //   },
      // ],
      label: 'Data',
      category: 'data',
    } as any,
    columns: {
      type: PropertyType.Array,
      required: false,
      form: {
        defaultValue: [],
      },
      items: [
        {
          type: PropertyType.Object,
          properties: {
            header: {
              type: PropertyType.String,
              required: false,
              form: {
                defaultValue: '',
                showInArrayList: true,
              },
            },
          },
        },
      ],
      category: 'data',
    },
    footerData: {
      type: PropertyType.Array,
      required: false,
      form: {
        defaultValue: [],
      },
      items: [
        {
          type: PropertyType.Object,
          properties: {},
        },
      ],
      category: 'data',
    },
    // children: {
    //   type: PropertyType.String,
    //   required: true,
    // },

    loading: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    loadingRows: {
      type: PropertyType.Number,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    headerBackground: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    footerBackground: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    noResultsLabel: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    clearFilersOnNoResultLabel: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    disableClearFiltersOnNoResults: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableSelection: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableNoResults: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTableHeader: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    // sx: {
    //   type: PropertyType.Object,
    //   required: false,
    //   properties: {},
    // },
  },
}
