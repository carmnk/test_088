import { mdiTable } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { tablePropsSchema } from './tablePropsRawSchema'
import { ComponentDefType } from '../../componentDefType'
import { Table } from '@cmk/fe_utils'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { uniq } from 'lodash'

export const tableEditorComponentDef: ComponentDefType = {
  type: 'Table' as const,

  component: Table,
  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(tablePropsSchema, editorController, {
      // dynamicOptionsDict: {
      //   component: [
      //     { value: undefined, label: 'Default (depends on variant)' },
      //     ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //   ],
      // },
      onBeforeChange: (newFormData, prevFormData, changedKey, changedValue) => {
        const adjFormData = Object.keys(newFormData).includes('columns')
          ? {
              ...newFormData,
              columns: newFormData?.columns?.map((col: any) => {
                return {
                  ...col,
                  renderCell: (item: any) => (
                    <td>{item?.[col?.header ?? '_test_']}</td>
                  ),
                  sortKey: col?.header,
                  filterKey: col?.header,
                  filterOptions: uniq(
                    newFormData?.data
                      ?.map((item: any) => item?.[col?.header])
                      .filter((val: any) => val)
                  ).sort((a: any, b: any) => (a > b ? 1 : b > a ? -1 : 0)),
                  getFilterValue: (opt: any) => opt,
                  getItemLabel: (opt: any) => opt,
                  // getIcon: (row) => <Icon path={mdiPencil} size={1} />,
                }
              }),
            }
          : newFormData
        console.log(
          'INTER-INJECTED OnBEFORE CHANGE:',
          changedKey,
          newFormData,
          adjFormData
        )
        return adjFormData
      },

      dynamicKeysDict: {
        data: (f: any, g: any) => {
          const columnHeaders = f?.columns?.map((column: any) => column.header)

          const columnHeaderDict = columnHeaders.reduce(
            (acc: any, header: any) => {
              acc[header] = 'test'
              return acc
            },
            {}
          )
          return [columnHeaderDict]
        },
      },
    }),
  props: {
    data: [
      { name: 'test', age: 30 },
      { name: 'test2', age: 20 },
    ],
    columns: [
      // {
      //   header: 'name',
      //   renderCell: (item: any) => <td>{item?.name}</td>,
      //   sortKey: 'name',
      //   filterKey: 'name',
      //   filterOptions: ['test', 'test2'],
      //   getFilterValue: (opt: any) => opt,
      //   getItemLabel: (opt: any) => opt,
      // },
      // {
      //   header: 'age',
      //   renderCell: (item: any) => <td>{item?.age}</td>,
      //   sortKey: 'age',
      // },
    ],
    filters: [],
  },

  icon: mdiTable,
  category: 'data',
  schema: tablePropsSchema,
}
