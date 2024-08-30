import { v4 as uuid } from 'uuid'
import { CSSProperties, Dispatch, SetStateAction, useMemo } from 'react'
import { EditorStateType } from '../editorState'

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useEditorControllerCssSelectorActions = (
  params: EditorControllerHtmlElementActionsParams
) => {
  const { editorState, setEditorState } = params

  const actions = useMemo(() => {
    const getSelectedCssClass = (id?: string) => {
      const selectedClassName = id ?? editorState.ui.selected.cssSelector ?? ''
      const selectedClass = editorState.cssSelectors.find(
        (sel) => sel._id === selectedClassName
      )
      // const commonWorkspace = editorState?.cssWorkspaces?.common;
      // const selectedClassStyle = commonWorkspace?.[selectedClass] ?? {};
      return selectedClass
    }

    const changeClassName = (newClassname: string, currentId: string) => {
      const newClassName = newClassname
      if (!newClassName) return
      const selectedClass = editorState.ui.selected.cssSelector
      if (!selectedClass) return
      if (!/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(selectedClass)) {
        return
      }
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
        },
        cssSelectors: current.cssSelectors.map((cssSelector) =>
          currentId === cssSelector._id
            ? {
                ...cssSelector,
                _userId: newClassName,
              }
            : cssSelector
        ),
      }))
    }

    const changeAddClassRuleName = (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            addRuleName: newValue,
          },
        },
      }))
    }

    const changeAddClassRuleValue = (newValue: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            addRuleValue: newValue,
          },
        },
      }))
    }

    const removeRule = (ruleName: string) => {
      if (!editorState.ui.selected.cssSelector) return

      setEditorState((current) => {
        // const currentClass =
        //   current?.cssWorkspaces?.common?.[
        //     current.ui.selected.cssSelector ?? ""
        //   ];
        // const { [ruleName as keyof CSSProperties]: _, ...restClassRules } =
        //   currentClass;

        return {
          ...current,
          cssSelectors: current.cssSelectors.map((cssSelector) => {
            if (cssSelector._id === current.ui.selected.cssSelector) {
              const ruleNameTyped = ruleName as keyof CSSProperties
              // eslint-disable-next-line
              const { [ruleNameTyped]: _rOut, ...restRules } = cssSelector
              return restRules
            }
            return cssSelector
          }),
        }
      })
    }

    const addNewRule = () => {
      if (!editorState.ui.selected.cssSelector) return
      if (
        !editorState.ui.detailsMenu.addRuleName ||
        !editorState.ui.detailsMenu.addRuleValue
      )
        return

      setEditorState((current) => ({
        ...current,
        // cssWorkspaces: {
        //   ...current?.cssWorkspaces,
        //   common: {
        //     ...current?.cssWorkspaces?.common,
        //     [current.ui.selected.cssSelector ?? ""]: {
        //       ...current?.cssWorkspaces?.common?.[
        //         current.ui.selected.cssSelector ?? ""
        //       ],
        //       [editorState.ui.detailsMenu.addRuleName ?? ""]:
        //         editorState.ui.detailsMenu.addRuleValue ?? "",
        //     },
        //   },
        // },
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            addRuleName: '',
            addRuleValue: '',
          },
        },
        cssSelectors: current.cssSelectors.map((cssSelector) => {
          if (cssSelector._id === current.ui.selected.cssSelector) {
            const newRuleName = editorState.ui.detailsMenu.addRuleName
            const newRuleValue = editorState.ui.detailsMenu.addRuleValue
            if (!newRuleName) return cssSelector
            return {
              ...cssSelector,
              css_selector_name: cssSelector.css_selector_name,
              css_selector_value: newRuleValue,
              css_selector_key: newRuleName,
              _userId: newRuleName,
              project_id: editorState.project.project_id,
              // [newRuleName]: newRuleValue,
            }
          }
          return cssSelector
        }),
      }))
    }

    const toggleEditRule = (ruleName: keyof CSSProperties) => {
      const cssClass = getSelectedCssClass(
        editorState.ui.selected.cssSelector ?? ''
      )
      const existingRuleValue = cssClass?.[ruleName]
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            ruleName: ruleName,
            ruleValue: (existingRuleValue as string) ?? '',
          },
        },
      }))
    }

    const changeEditRuleValue = (newValue: string) => {
      if (!editorState.ui.selected.cssSelector) return
      const currentEditRuleName = editorState?.ui?.detailsMenu?.ruleName
      if (!currentEditRuleName || !newValue) return

      setEditorState((current) => ({
        ...current,
        // cssWorkspaces: {
        //   ...current?.cssWorkspaces,
        //   common: {
        //     ...current?.cssWorkspaces?.common,
        //     [current.ui.selected.cssSelector ?? ""]: {
        //       ...current?.cssWorkspaces?.common?.[
        //         current.ui.selected.cssSelector ?? ""
        //       ],
        //       [currentEditRuleName ?? ""]: newValue ?? "",
        //     },
        //   },
        // },
        cssSelectors: current.cssSelectors.map((cssSelector) => {
          if (cssSelector._id === current.ui.selected.cssSelector) {
            return {
              ...cssSelector,
              [currentEditRuleName]: newValue,
            }
          }
          return cssSelector
        }),
      }))
    }

    // eslint-disable-next-line
    const addCssSelector = (newVal: string) => {
      setEditorState((current) => {
        const newClassNameRaw = 'newClass'
        const newClassNameOccurences = current?.cssSelectors.filter((sel) =>
          (sel.css_selector_name ?? '').includes(newClassNameRaw)
        )
        const newClassName =
          newClassNameRaw +
          (newClassNameOccurences?.length
            ? `_${newClassNameOccurences?.length}`
            : '')
        return {
          ...current,
          cssSelectors: [
            ...current.cssSelectors,
            {
              _id: uuid(),
              css_selector_name: newClassName,

              _type: 'css',
              _parentId: 'common',
              css_selector_value: '',
              css_selector_key: '',
              // _userID: '',
            },
          ],
        }
      })
    }

    const deleteCssSelector = (name: string) => {
      setEditorState((current) => {
        // const cssCommonWorkspace = current.cssWorkspaces?.common;
        // const { [name]: _nOut, ...cssCommonWorkspaceExDeleteItem } =
        //   cssCommonWorkspace;
        return {
          ...current,
          // cssWorkspaces: {
          //   ...current?.cssWorkspaces,
          //   common: cssCommonWorkspaceExDeleteItem,
          // },
          cssSelectors: current.cssSelectors.filter(
            (cssSelector) => cssSelector._id !== name
          ),
        }
      })
    }
    return {
      removeRule,
      addNewRule,
      toggleEditRule,
      changeEditRuleValue,
      changeClassName,
      changeAddClassRuleName,
      changeAddClassRuleValue,
      deleteCssSelector,
      addCssSelector,
    }
  }, [editorState, setEditorState])

  return actions
}
