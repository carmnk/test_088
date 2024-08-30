import { ExtendedObjectSchemaType } from './schemaTypes'

export type ComponentDefType = {
  type: string
  component?: any
  
  category: string
  state?: string // currently just tested for truthyness
  schema: ExtendedObjectSchemaType
  props?: Record<string, any>
  icon: string
  // rootInjection?: DynamicFormInjectionsType
  formGen?: any
  
}
