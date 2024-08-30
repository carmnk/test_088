import { mdiNoteOutline } from '@mdi/js'
import { appBarDef } from '../AppBar/appBarDef'
import { ComponentDefType } from '../../componentDefType'

export const paperDef: ComponentDefType = {
  // to be seperated!
  ...appBarDef,
  type: 'Paper' as const,
  icon: mdiNoteOutline,
}
