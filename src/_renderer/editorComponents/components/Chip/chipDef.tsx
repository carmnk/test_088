import { mdiInformation } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { chipPropsSchema } from './chipPropsRawSchema'
import { ChipWrapper } from './ChipWrapper'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ComponentDefType } from '../../componentDefType'

export const chipEditorComponentDef: ComponentDefType = {
  type: 'Chip' as const,
  props: {
    label: 'test',
    size: 'medium',
    variant: 'filled',
    color: 'primary',
    clickable: false,
    disabled: false,
    sx: {},
  },
  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(
      chipPropsSchema,
      editorController
      //   {
      //   dynamicOptionsDict: {
      //     component: [
      //       { value: undefined, label: 'Default (depends on variant)' },
      //       ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //     ],
      //   },
      // }
    ),
  icon: mdiInformation,
  category: 'basic',
  component: ChipWrapper,
  schema: chipPropsSchema,
}
//
