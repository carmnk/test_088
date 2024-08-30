import { Dispatch, SetStateAction, useCallback } from 'react'
import { EntityPayloadType } from '../../EntityModel/entities'
import { EntityFieldPayloadType } from '../../EntityModel/entitiy_fields'
import { EntityJoiningPayloadType } from '../../EntityModel/entity_joinings'
import { EntityListFieldPayloadType } from '../../EntityModel/entity_list_fields'
import { EntityListPayloadType } from '../../EntityModel/entity_lists'
import { EntityValuePayloadType } from '../../EntityModel/entity_values'
import { API } from '../API'
import { EditorStateType } from '../../editorController/editorState'
import { ApiControllerType } from '../apiController'

export type ApiControllerActionsParams = {
  setData: Dispatch<SetStateAction<ApiControllerType['data']>>
  editorState: EditorStateType
}

export const useEntityModelActions = (params: ApiControllerActionsParams) => {
  const { setData, editorState } = params

  const updateDataModel = useCallback(async () => {
    try {
      const res = await API.getEntityModel.query()
      const entityModel = res?.data
      console.log('ENTITY MODEL IN ?????????', entityModel)
      setData((current) => {
        return { ...current, entityModel }
      })
    } catch (e) {
      console.log('ERROR GETTING ENTITY MODEL', e)
    }
  }, [setData])

  const createEntity = useCallback(
    async (payload: EntityPayloadType) => {
      try {
        const res = await API.createEntity.query(payload)
        await updateDataModel()
        console.log('CREATE_ENTITY', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY', e)
      }
    },
    [updateDataModel]
  )
  const editEntity = useCallback(
    async (payload: EntityPayloadType) => {
      try {
        const entity_id = payload?.entity_id
        if (!entity_id) return
        const res = await API.editEntity(entity_id).query(payload)
        updateDataModel()
        console.log('EDIT_ENTITY', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY', e)
      }
    },
    [updateDataModel]
  )

  const deleteEntity = useCallback(
    async (entity_id: number) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteEntity(entity_id).query()
        await updateDataModel()
      } catch (e) {
        console.error(e)
      }
    },
    [updateDataModel]
  )

  const createEntityField = useCallback(
    async (payload: EntityFieldPayloadType & { entity?: any }) => {
      try {
        console.log('PL', payload)
        const entity_id = editorState.ui.selected.entity as any
        if (!payload || !entity_id) return
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { entity_field_id: _eOut, entity, ...payloadCleaned } = payload
        const payloadEnriched = {
          ...payloadCleaned,
          entity_id,
        }
        const res = await API.createEntityField.query(payloadEnriched as any)
        await updateDataModel()
        console.log('CREATE_ENTITY', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY', e)
      }
    },
    [updateDataModel, editorState.ui.selected.entity]
  )
  const editEntityField = useCallback(
    async (payload: EntityFieldPayloadType) => {
      try {
        const entity_field_id = payload?.entity_field_id
        if (!entity_field_id) return
        const res = await API.editEntityField(entity_field_id).query(payload)
        updateDataModel()
        console.log('EDIT_ENTITY', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY', e)
      }
    },
    [updateDataModel]
  )

  const deleteEntityField = useCallback(
    async (entity_field_id: number) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteEntityField(entity_field_id).query()
        await updateDataModel()
      } catch (e) {
        console.error(e)
      }
    },
    [updateDataModel]
  )

  const createEntityValue = useCallback(
    async (payload: EntityValuePayloadType) => {
      try {
        const res = await API.createEntityValue.query(payload)
        await updateDataModel()
        console.log('CREATE_ENTITY_VALUE', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY_VALUE', e)
      }
    },
    [updateDataModel]
  )
  const editEntityValue = useCallback(
    async (payload: EntityValuePayloadType) => {
      try {
        const entity_values_id = payload?.entity_values_id
        if (!entity_values_id) return
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.editEntityValue(entity_values_id).query(payload)
        await updateDataModel()
      } catch (e) {
        console.log('ERROR EDIT_ENTITY_VALUE', e)
      }
    },
    [updateDataModel]
  )
  const deleteEntityValue = useCallback(
    async (entity_values_id: number) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteEntityValue(entity_values_id).query()
        await updateDataModel()
      } catch (e) {
        console.error(e)
      }
    },
    [updateDataModel]
  )

  const createEntityList = useCallback(
    async (payload: EntityListPayloadType) => {
      try {
        const res = await API.createEntityList.query(payload)
        await updateDataModel()
        console.log('CREATE_ENTITY_VALUE', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY_VALUE', e)
      }
    },
    [updateDataModel]
  )
  const editEntityList = useCallback(
    async (payload: EntityListPayloadType) => {
      try {
        const entity_list_id = payload?.entity_list_id
        if (!entity_list_id) return
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.editEntityList(entity_list_id).query(payload)
        await updateDataModel()
      } catch (e) {
        console.log('ERROR EDIT_ENTITY_VALUE', e)
      }
    },
    [updateDataModel]
  )
  const deleteEntityList = useCallback(
    async (entity_list_id: number) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteEntityList(entity_list_id).query()
        await updateDataModel()
      } catch (e) {
        console.error(e)
      }
    },
    [updateDataModel]
  )

  const createEntityListField = useCallback(
    async (payload: EntityListFieldPayloadType) => {
      try {
        const res = await API.createEntityListField.query(payload)
        await updateDataModel()
        console.log('CREATE_ENTITY_VALUE', res)
      } catch (e) {
        console.log('ERROR CREATE_ENTITY_VALUE', e)
      }
    },
    [updateDataModel]
  )
  const editEntityListField = useCallback(
    async (payload: EntityListFieldPayloadType) => {
      try {
        const entity_list_field_id = payload?.entity_list_field_id
        if (!entity_list_field_id) return
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.editEntityListField(entity_list_field_id).query(
          payload
        )
        await updateDataModel()
      } catch (e) {
        console.log('ERROR EDIT_ENTITY_VALUE', e)
      }
    },
    [updateDataModel]
  )
  const deleteEntityListField = useCallback(
    async (entity_list_field_id: number) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteEntityListField(
          entity_list_field_id
        ).query()
        await updateDataModel()
      } catch (e) {
        console.error(e)
      }
    },
    [updateDataModel]
  )

  const createEntityJoining = useCallback(
    async (payload: EntityJoiningPayloadType) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.createEntityJoining.query(payload)
        await updateDataModel()
      } catch (e) {
        console.log('ERROR CREATING ENTITY_JOINING', e)
      }
    },
    [updateDataModel]
  )
  const editEntityJoining = useCallback(
    async (payload: EntityJoiningPayloadType) => {
      try {
        const entity_joining_id = payload?.entity_joining_id
        if (!entity_joining_id) return
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.editEntityJoining(entity_joining_id).query(
          payload
        )
        await updateDataModel()
      } catch (e) {
        console.log('ERROR EDITING ENTITY_JOINING', e)
      }
    },
    [updateDataModel]
  )
  const deleteEntityJoining = useCallback(
    async (entity_joining_id: number) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await API.deleteEntityJoining(entity_joining_id).query()
        await updateDataModel()
      } catch (e) {
        console.error(e)
      }
    },
    [updateDataModel]
  )
  return {
    updateDataModel,
    createEntity,
    editEntity,
    deleteEntity,
    createEntityField,
    editEntityField,
    deleteEntityField,
    createEntityValue,
    editEntityValue,
    deleteEntityValue,
    createEntityList,
    editEntityList,
    deleteEntityList,
    createEntityListField,
    editEntityListField,
    deleteEntityListField,
    createEntityJoining,
    editEntityJoining,
    deleteEntityJoining,
  }
}
