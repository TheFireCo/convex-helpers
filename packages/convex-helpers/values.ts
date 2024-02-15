import { PropertyValidators, Validator, v } from "convex/values";

/**
 * Helper for defining a union of literals more concisely.
 *
 * e.g. `literals("a", 1, false)` is equivalent to
 * `v.union(v.literal("a"), v.literal(1), v.literal(false))`
 *
 * @param args Values you want to use in a union of literals.
 * @returns A validator for the union of the literals.
 */
export const literals = <
  V extends string | number | boolean | bigint,
  T extends [V, V, ...V[]]
>(
  ...args: T
): Validator<T[number]> => {
  return v.union(
    v.literal(args[0]),
    v.literal(args[1]),
    ...args.slice(2).map(v.literal)
  ) as Validator<T[number]>;
};

/**
 * oneof helps you define a union of object validators more concisely.
 *
 * e.g. `oneof({a: v.string()}, {b: v.number()})` is equivalent to
 * `v.union(v.object({a: v.string()}), v.object({b: v.number()}))`
 *
 * @param args Field validators to use in a union. NOT yet wrapped in v.object.
 * @returns A validator for the union of the object validators.
 */
// TODO: This isn't setting fieldPaths yet. Those types are hard to expose.
// export const oneof = <
//   V1 extends PropertyValidators,
//   V2 extends PropertyValidators,
//   V3 extends PropertyValidators[],
//   T extends [V1, V2, ...V3]
// >(
//   ...args: T
// ) => {
//   return v.union(
//     v.object(args[0]),
//     v.object(args[1]),
//     ...args.slice(2).map(v.object)
//   ) as Validator<ObjectType<T[number]>, false>;
// };

/**
 * nullable define a validator that can be the value or null more consisely.
 *
 * @param x The validator to make nullable. As in, it can be the value or null.
 * @returns A new validator that can be the value or null.
 */

export const nullable = <V extends Validator<any, false, any>>(x: V) =>
  v.union(v.null(), x);
/**
 * partial helps you define an object of optional validators more concisely.
 *
 * e.g. `partial({a: v.string(), b: v.number()})` is equivalent to
 * `{a: v.optional(v.string()), b: v.optional(v.number())}`
 *
 * @param obj The object of validators to make optional. e.g. {a: v.string()}
 * @returns A new object of validators that can be the value or undefined.
 */

export const partial = <T extends PropertyValidators>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, vv]) => [k, v.optional(vv)])
  ) as unknown as {
    [K in keyof T]: T[K] extends Validator<infer V, false, infer F>
      ? Validator<V | undefined, true, F>
      : never;
  };
};

// Shorthand for defining validators

/** Any string value. */
export const string = v.string();
/** JavaScript number, represented as a float64 in the database. */
export const number = v.float64();
/** boolean value. For typing it only as true, use `l(true)` */
export const boolean = v.boolean();
/** bigint, though stored as an int64 in the database. */
export const bigint = v.int64();
/** Any Convex value */
export const any = v.any();
/** Null value. Underscore is so it doesn't shadow the null builtin */
export const null_ = v.null();
/** References another table's _id field. */
export const id = v.id;
/** Object validator. `obj({ a: v.any() })` is `v.object({ a: v.any() })` */
export const obj = v.object;
/** Array validator. `array(v.any())` is `v.array(v.any())` */
export const array = v.array;
/** Literal value: a specific string, number, bigint or boolean value */
export const l = v.literal;
/** The value can be undefined / not specified */
export const optional = v.optional;
/** Union of values */
export const or = v.union;

/**
 * A string validator that is a branded string type.
 *
 * Read more at https://stack.convex.dev/using-branded-types-in-validators
 *
 * @param _brand - A unique string literal to brand the string with
 */
export const brandedString = <T extends string>(_brand: T) =>
  v.string() as Validator<string & { _: T }>;

/** Mark fields as deprecated with this permissive validator typed as null */
export const deprecated = v.optional(v.any()) as Validator<null, true>;
