import { getDeepPropertyByPath } from '../utils/object'
import { EditorControllerType } from '../editorController/editorControllerTypes'

/**  replaces the placeholders AND EVALs the string if it contains any placeholders, static calculations are skipped!
    @returns the evaluated string -> can be any type !!!
*/
export const replaceTemplateInString = (
  text: string,
  appState: EditorControllerType['appController']['state']
) => {
  const getTemplates = (text: string) => {
    let templatesOut: {
      placeholder: string
      value: string
      type: string
      placeholderRaw: string
      placeholderCutted: string
    }[] = []
    const regex = /{_data\.[^}]*}/g
    const dataMatches = text.match(regex)
    // if (!matches) {
    //   return []
    // }
    const dataTemplates =
      dataMatches?.map((match) => {
        const keyRaw = match.replace('{_data.', '').replace('}', '')
        const key = keyRaw.replace(/\..*$/gm, '')

        return {
          type: 'data',
          placeholder: key,
          placeholderRaw: keyRaw,
          placeholderCutted: keyRaw.replace(key, ''),
          value: appState._data[key] ?? '',
          isValueUndefined: appState._data[key] === undefined,
        }
      }) || []
    templatesOut = [...templatesOut, ...dataTemplates]
    return templatesOut
  }

  let newText = text
  const templates = getTemplates(text)

  const undefinedPlaceholders = []
  for (const template of templates) {
    if (['string', 'number', 'boolean'].includes(typeof template.value)) {
      newText = newText.replaceAll(
        template.placeholder,
        "'" + template.value.toString() + "'"
      )
    } else {
      if ((template as any).isValueUndefined) {
        undefinedPlaceholders.push(template.placeholder)
        continue
      }
      if (
        typeof template.value === 'object' &&
        template.placeholderCutted.startsWith('.')
      ) {
        const path = template.placeholderCutted?.slice(1).split('.')
        const value = getDeepPropertyByPath(template.value, path)
        newText = newText
          .replaceAll(template.placeholderRaw, value ? '"' + value + '"' : '')
          .replaceAll('{_data.', '')
          .replaceAll('}', '')
        continue
      }
      newText = newText.replaceAll(template.placeholder, '"XXX"')
      console.warn('Template value is not a string', template)
    }
  }
  try {
    console.debug(
      'BEFORE EVAL -',
      newText,
      '-',
      typeof newText,
      newText === text
    )
    // this will though prevent calculations without placeholders
    const evalText = newText === text ? newText : eval(newText)
    return evalText === 'true' ? true : evalText === 'false' ? false : evalText
  } catch (e) {
    console.error('Error in eval', e, newText)
    return undefinedPlaceholders.length
      ? 'Placeholder could not be resolved: ' + undefinedPlaceholders.join(', ')
      : 'Error in eval'
  }
}
