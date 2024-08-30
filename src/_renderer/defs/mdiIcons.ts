import * as LibNamespace from '@mdi/js'
export const a = 1

export const iconNames = Object.keys(LibNamespace)
export const iconOptions = iconNames.map((name) => ({
  label: name,
  value: name,
}))

export const importIconByName = async (name: string) => {
  const module = await import(`@mdi/js`)
  return (module as any)[name]
}
