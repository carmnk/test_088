export type DefaultSuccessResponse = {
  success: boolean
}

export type ArrayElement2<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never

export type UnionFromTuple<T extends any[]> = T[number]

export type Unpromisify<T> = T extends Promise<infer U> ? U : T

export type ArrayElement<T> = T extends Array<infer U> ? U : T

export type MatchingObjectKeys<O, MatchType> = { [K in keyof O]-?: O[K] extends MatchType ? K : never }[keyof O]
