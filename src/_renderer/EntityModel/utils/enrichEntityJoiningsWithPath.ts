import { ENRICHED_ENTITY_JOININGS_MODEL_TYPE } from '../entityDataModel'

export const enrichEntityJoiningsWithPath = (
  structuredEntityJoinings: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[][]
): (ENRICHED_ENTITY_JOININGS_MODEL_TYPE & {
  path: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[]
})[][] => {
  return structuredEntityJoinings?.map((level, lIdx) =>
    level
      .map?.((joining) => {
        let baseEntityId = joining?.base_entity_id
        return {
          ...joining,
          path:
            new Array(lIdx)
              .fill(0)
              ?.map((v, idx) => {
                const idxInLevel = lIdx - idx - 1
                const lowerLevelEntityJoinings =
                  structuredEntityJoinings?.[idxInLevel]
                const linkedEntityJoinings = lowerLevelEntityJoinings?.find?.(
                  (v) => v.linked_entity_id === baseEntityId
                )
                baseEntityId = linkedEntityJoinings?.base_entity_id as any
                const laName = linkedEntityJoinings?.linked_entity?.entity_name
                return (linkedEntityJoinings ??
                  []) as (ENRICHED_ENTITY_JOININGS_MODEL_TYPE & {
                  path: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[]
                })[] as any
              })
              ?.reverse() || [],
        }
      })
      ?.filter((v) => v)
  )
}
