type BasePrimitive = string | boolean | number | null | undefined

type Primitive = BasePrimitive | PrimitiveObject<Primitive>

interface PrimitiveObject<T extends Primitive = Primitive>
    extends Record<string, T> {}

// type ImmutableSchema<Schema extends Primitive> =
//     Schema extends Immutable<PrimitiveObject>
//         ? Schema
//         : Schema extends BasePrimitive
//         ? Schema
//         : Schema extends PrimitiveObject
//         ? Immutable<
//               { [Props in keyof Schema]-?: ImmutableSchema<Schema[Props]> }
//           >
//         : never

type ImmutableObject<Schema> = Schema extends PrimitiveObject
    ? {
          [Props in keyof Schema]-?: Schema[Props] extends BasePrimitive
              ? Schema[Props]
              : Immutable<Schema[Props]>
      }
    : never

function isBasePrimitive(value: unknown): value is BasePrimitive {
    return (
        value === undefined ||
        value === null ||
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number'
    )
}

class Immutable<Schema extends PrimitiveObject> {
    private value: ImmutableObject<Schema>

    constructor(initialValue: Schema) {
        if (Array.isArray(initialValue)) {
            this.value = initialValue.map((value) =>
                isBasePrimitive(value)
                    ? value
                    : new Immutable<typeof value>(value),
            )
        } else {
            this.value = Object.fromEntries(
                Object.entries(initialValue).map(([key, value]) => [
                    key,
                    isBasePrimitive(value)
                        ? value
                        : new Immutable<typeof value>(value),
                ]),
            )
        }
    }

    get(key: keyof Schema): Schema[keyof Schema] {
        return this.value[key]
    }
}

export default Immutable
