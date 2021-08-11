type BasePrimitive = string | boolean | number | null | undefined

type PrimitiveObject = {
    [K: string]: BasePrimitive | PrimitiveObject | PrimitiveArray
}
type PrimitiveArray = Array<BasePrimitive | PrimitiveObject | PrimitiveArray>

type AnyData = PrimitiveObject | PrimitiveArray | BasePrimitive

type AsImmutable<Schema extends AnyData> = Schema extends BasePrimitive
    ? Schema
    : {
          [Props in keyof Schema]-?: Schema[Props] extends
              | PrimitiveObject
              | PrimitiveArray
              ? Immutable<Schema[Props]>
              : Schema[Props]
      }

type Paths<Schema extends AnyData> = Schema extends BasePrimitive
    ? never
    : {
          [K in keyof Schema]-?: Schema[K] extends BasePrimitive
              ? [K]
              : Schema[K] extends Immutable<infer R>
              ? [K, ...Paths<R>]
              : Schema[K] extends PrimitiveObject | PrimitiveArray
              ? [K, ...Paths<Schema[K]>]
              : [K]
      }[keyof Schema]

type GetInSchema<
    Schema extends PrimitiveObject | PrimitiveArray,
    Keys = Paths<AsImmutable<Schema>>,
> = Keys extends [infer E1]
    ? E1 extends keyof Schema
        ? Schema[E1]
        : never
    : Keys extends [infer E1, ...any[]]
    ? E1 extends keyof Schema
        ? {
              [U in E1]-?: Schema[U] extends PrimitiveObject | PrimitiveArray
                  ? GetInSchema<Schema[U]>
                  : never
          }[E1]
        : never
    : never

// type A = GetInSchema<
//     { a: { c: { d: number; k: { r: 'hi' } } }; b: number },
//     ['a', 'c', 'k', 'r']
// >

function isBasePrimitive(value: unknown): value is BasePrimitive {
    return (
        value === undefined ||
        value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number'
    )
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

    getIn(keys: Paths<AsImmutable<Schema>>): GetInSchema<Schema> {
        // if (!Array.isArray(keys)) throw new Error('Keys must be array.')
        if (keys.length === 1) {
            return this.get(keys[0])
        }
        return this.get(keys[0]).getIn(keys.slice(1))
    }
}

export default Immutable
