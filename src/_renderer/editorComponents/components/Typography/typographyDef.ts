import { mdiFormatText } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { typographyPropsSchema } from './typographyPropsRawSchema'
import { TypographyWrapper } from './TypographyWrapper'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ComponentDefType } from '../../componentDefType'

export const typographyEditorComponentDef: ComponentDefType = {
  type: 'Typography' as const,
  props: {
    children: 'test',
    noWrap: false,
    align: 'inherit',
    variant: 'body1',
    sx: {},
  },
  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(
      typographyPropsSchema,
      editorController
      //    {
      //   dynamicOptionsDict: {
      //     component: [
      //       { value: undefined, label: 'Default (depends on variant)' },
      //       ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //     ],
      //   },
      // }
    ),

  icon: mdiFormatText,
  category: 'basic',
  component: TypographyWrapper,
  schema: typographyPropsSchema,
}
//
