type PromiseResolvedType<T> = T extends Promise<infer R> ? R : never
type ArrayItemType<T> = T extends Array<infer I> ? I : never
