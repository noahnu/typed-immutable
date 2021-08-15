type BasePrimitive = string | boolean | number | null | undefined

type PrimitiveObject = {
    [K: string]: BasePrimitive | PrimitiveObject | PrimitiveArray
}
type PrimitiveArray = Array<BasePrimitive | PrimitiveObject | PrimitiveArray>

type AnyData = PrimitiveObject | PrimitiveArray | BasePrimitive

type Is<T extends U, U> = T

type FilterKeys<T> = T extends readonly unknown[]
    ? number extends T['length']
        ? number
        : `${number}`
    : string | number

type AsImmutable<Schema> = Schema extends AnyData
    ? Schema extends BasePrimitive
        ? Schema
        : Schema extends Is<
              infer S,
              { [P in keyof Schema & FilterKeys<Schema>]-?: Schema[P] }
          >
        ? {
              [P in keyof S]-?: S[P] extends PrimitiveArray | PrimitiveObject
                  ? Immutable<S[P]>
                  : Readonly<S[P]>
          }
        : never
    : never

// eslint-disable-next-line @typescript-eslint/ban-types
type Paths<T> = T extends object
    ? {
          [K in keyof T & FilterKeys<T>]: [`${K}`] | [`${K}`, ...Paths<T[K]>]
      }[keyof T & FilterKeys<T>]
    : never

// TypeScript does not like "0" extends keyof { 0: ... }, so we have to write out own descend
type Descend<T, K extends string> = T extends { [P in K]?: infer X }
    ? X | (T extends { [P in K]: any } ? never : undefined)
    : T[K & keyof T] | undefined // index access type of T is to support indexed types

type PickSplitPath<Schema, Keys extends string[]> = Keys extends [
    Is<infer First, string>,
    ...Is<infer Rest, string[]>
]
    ? Schema extends Schema
        ? { [P in First]: PickSplitPath<Descend<Schema, First>, Rest> }[First]
        : never
    : Schema

type GetInSchema<
    Schema extends PrimitiveObject | PrimitiveArray,
    Keys extends Paths<Schema>,
> = PickSplitPath<Schema, Keys>

type S = {
    abc: string
    nested: { key: string; someArray: (string | number)[] }
    really_nested: { level1: { level2: string } }
}
type B = GetInSchema<S, Paths<S>> // why is B unknown. Must be some intersection of Paths? need to filter it?

function isBasePrimitive(value: unknown): value is BasePrimitive {
    return (
        value === undefined ||
        value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number'
    )
}

function hasKey<T>(obj: T, key: any): key is keyof T {
    return key in obj
}
class Immutable<Schema extends PrimitiveObject | PrimitiveArray> {
    private value: AsImmutable<Schema>

    constructor(initialValue: Schema) {
        if (Array.isArray(initialValue)) {
            this.value = initialValue.map((value) =>
                isBasePrimitive(value) ? value : new Immutable(value),
            ) as AsImmutable<Schema>
        } else {
            this.value = Object.fromEntries(
                Object.entries(initialValue).map(([key, value]) => [
                    key,
                    isBasePrimitive(value) ? value : new Immutable(value),
                ]),
            ) as AsImmutable<Schema>
        }
    }

    get<K extends keyof AsImmutable<Schema>>(key: K): AsImmutable<Schema>[K] {
        return this.value[key]
    }

    getIn<R = AsImmutable<GetInSchema<Schema, Paths<Schema>>>>([
        zeroth,
        ...rest
    ]: Paths<Schema>): R | undefined {
        if (hasKey(this.value, zeroth)) {
            const el = this.value[zeroth]
            if (rest.length && el instanceof Immutable) {
                return el.getIn(rest as any) as R
            }
            return el as unknown as R
        }
        return undefined
    }
}

export default Immutable
