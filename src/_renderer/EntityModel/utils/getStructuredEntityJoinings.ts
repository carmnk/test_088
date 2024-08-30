import { uniqBy } from 'lodash'
import { EntityFieldType } from '../entitiy_fields'
import { ENRICHED_ENTITY_JOININGS_MODEL_TYPE } from '../entityDataModel'
import { enrichEntityJoiningsWithPath } from '..'

/** filters and structures descending (sub)entities
 * returns array of arrays of entity_id, entity_id_field_id, base_entity_id, base_entity_id_field_id
 * @returns
 */
export const getStructuredEntityJoinings = (
  baseEntityId: number,
  entity_fields: EntityFieldType[],
  entity_joinings: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[]
): (ENRICHED_ENTITY_JOININGS_MODEL_TYPE & { path: any[] })[][] => {
  const baseEntityReferenceFields = entity_fields?.filter(
    (field) =>
      ['reference', 'references'].includes(field?.data_type) &&
      field?.entity_id === baseEntityId
  )
  const linkedBaseEntityFieldIds = baseEntityReferenceFields
    ?.map((field) =>
      ['reference', 'references'].includes(field?.data_type)
        ? field?.entity_field_id
        : null
    )
    .filter((val) => val)

  const srcEntityJoinings = entity_joinings?.filter((joining) =>
    linkedBaseEntityFieldIds.includes(joining?.base_entity_field_id)
  )
  if (!srcEntityJoinings?.length) {
    // console.log(
    //   'No Joining found with base_entity_field_ids ',
    //   linkedBaseEntityFieldIds
    // )
    return [[]]
  }
  const structuredEntityJoinings = [
    srcEntityJoinings?.map((srcEntityJoining) => ({
      ...srcEntityJoining,
    })),
    [],
  ]
  const addToCurrentLevel = (joining: ENRICHED_ENTITY_JOININGS_MODEL_TYPE) => {
    structuredEntityJoinings?.[structuredEntityJoinings?.length - 1 ?? ''].push(
      joining
    )
  }
  // can have maximal n levels where n is the number of entity_joinings
  for (let i = 0; i < entity_joinings.length; i++) {
    const levelEntityJoinings = structuredEntityJoinings[i] ?? []
    if (!levelEntityJoinings?.length) break
    if (i) {
      structuredEntityJoinings.push([])
    }
    const copyLevelEntityJoinings = [...levelEntityJoinings]
    // no more base entities to join -> BREAK
    for (const linkedEntityData of copyLevelEntityJoinings) {
      const { linked_entity_id } = linkedEntityData
      const subEntities = uniqBy(
        entity_joinings?.filter(
          (joining) => joining?.base_entity_id === linked_entity_id
        ),
        'linked_entity_id'
      )
      for (let j = 0; j < subEntities?.length; j++) {
        const subEntity = subEntities[j]
        addToCurrentLevel(subEntity)
      }
    }
  }
  const filteredStructuredEntityJoinings = structuredEntityJoinings?.filter(
    (v) => v?.length
  )
  const enrichedEntityJoinings = enrichEntityJoiningsWithPath(
    filteredStructuredEntityJoinings
  )

  // const structureWithPath = filteredStructure?.map((level, lIdx) =>
  //   level
  //     .map((joining) => ({
  //       ...joining,
  //       path: new Array(lIdx).fill(0)?.map((v, idx) => {
  //         const idxInLevel = lIdx - idx - 1
  //         const lowerLevelEntityJoinings = filteredStructure?.[idxInLevel]
  //         const linkedEntityJoinings = lowerLevelEntityJoinings?.find?.(
  //           (v) => v.linked_entity_id === joining.base_entity_id
  //         )
  //         return linkedEntityJoinings
  //       }),
  //     }))
  //     ?.filter((v) => v)
  // )
  return enrichedEntityJoinings
}
