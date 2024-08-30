export enum PropertyType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Int = 'int',
  Object = 'object',
  Array = 'array',
  Function = 'function',
  children = 'children',
  icon = 'icon',
  json = 'json',
  eventHandler = 'eventHandler',
}

export type LiteralType = StringType | NumberType | BooleanType
export type SchemaType<IsExtendedType extends boolean = false> = FormProps &
  (
    | LiteralType
    | ObjectSchemaType<IsExtendedType>
    | ArraySchemaType
    | FunctionType
    | ChildrenType
    | IconType
    | JsonType
    | EventHandlerType
  )

type FormProps = {
  form?: {
    width12?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    fillWidth?: boolean
    label?: string
    placeholder?: string
    helpText?: string
    disabled?: boolean
    hidden?: boolean
    invisible?: boolean
    defaultValue?: any
    showInArrayList?: boolean
  }
}
export type ExtendedSchemaType = SchemaType<true> &
  FormProps & { category?: 'shortcut' | 'customize' | 'items' | 'data' }

export type StringType = {
  type: PropertyType.String
  required?: boolean // JSON Schema -> required is outside of property definition and includes all required properties
  pattern?: RegExp // -> is string in JSON Schema
  // multipleOf?: number  -> from Copilot ... !?
  maxLength?: number
  minLength?: number
  enum?: string[]
}

export type NumberType = {
  type: PropertyType.Number
  required?: boolean // JSON Schema -> required is outside of property definition and includes all required properties
  minimum?: number
  maximum?: number
  multipleOf?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  isInteger?: boolean
  enum?: number[]
}

export type BooleanType = {
  type: PropertyType.Boolean
  //   enum: [false, true] // -> for schema
  required?: boolean // JSON Schema -> ...
}

export type ObjectSchemaType<IsExtendedType extends boolean = false> = {
  type: PropertyType.Object
  required?: boolean // JSON Schema -> ...
  properties: Record<
    string,
    IsExtendedType extends true
      ? ExtendedSchemaType
      : SchemaType & { category?: 'shortcut' | 'customize' | 'items' | 'data' }
  >
  // like properties but with regex property keys / names -> e.g. "^S_": -> matches e.g. 'S_123': ...
  patternProperties?: Record<
    string,
    IsExtendedType extends true ? ExtendedSchemaType : SchemaType
  >
  additionalProperties?: boolean | IsExtendedType extends true
    ? ExtendedSchemaType
    : SchemaType // optional props
  propertyNames?: PropertyType
  maxProperties?: number
  minProperties?: number
  dependencies?: Record<string, string[]>
}
export type ExtendedObjectSchemaType = ObjectSchemaType<true> & FormProps

export type ArraySchemaType<IsExtendedType extends boolean = false> = {
  type: PropertyType.Array
  required?: boolean // JSON Schema -> ...
  items: (IsExtendedType extends true ? ExtendedSchemaType : SchemaType)[] // -> items is an array in JSON Schema
  minItems?: number
  // less common
  maxItems?: number
  uniqueItems?: boolean // all items shall be unique
  additionalItems?: boolean | SchemaType
}

export type ExtendedArraySchemaType = ArraySchemaType<true> & FormProps

export type FunctionType = {
  type: PropertyType.Function
  required?: boolean // JSON Schema -> ...

  parameters: { [k: string]: SchemaType[] }
  returnType?: SchemaType
}

export type ChildrenType = {
  type: PropertyType.children
  required?: boolean
}

export type IconType = {
  type: PropertyType.icon
  required?: boolean
  enum: string[]
}

export type JsonType = {
  type: PropertyType.json
  required?: boolean
}
export type EventHandlerType = {
  type: PropertyType.eventHandler
  required?: boolean
}
