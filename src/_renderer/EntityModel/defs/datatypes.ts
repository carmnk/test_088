export enum DATATYPE {
  varchar = 'varchar',
  bool = 'bool',
  integer = 'integer',
  decimal = 'decimal',
  serialPrimaryKey = 'serial primary key',
  reference = 'reference', // will be mapped to integer references ${table}(${column}),
  references = 'references', // will be mapped to integer [], // FK emulation!
  // document = 'document', // -> FILE uploader 
}

export const DATATYPE_OPTIONS = Object.keys(DATATYPE).map((key) => ({
  value: DATATYPE[key as keyof typeof DATATYPE],
  label: DATATYPE[key as keyof typeof DATATYPE],
}))

/** ???? */
export const DATATYPE_FACTORY = {
  reference: (
    datatype: DATATYPE,
    referencedEntityName: string,
    referencedFieldName: string
  ) => `${datatype} references ${referencedEntityName}(referencedFieldName)`,
}
