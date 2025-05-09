import { css } from "./css";
import { TemplatedParameters } from "./styled";
import { Flat, Narrow, StringToPrimitive } from "./types";

export type CVA<V extends Record<string, any>> = {
  variants: {
    [k in keyof V]?: {
      [j in V[k]]?: TemplatedParameters | Parameters<typeof css>;
    };
  };
  compoundVariants: ({ [k in keyof V]?: V[k] | V[k][] } & {
    css: TemplatedParameters | Parameters<typeof css>;
  })[];
  defaultVariants: Partial<V>;
};

export const cva = <
  CV extends [...R],
  V extends {
    [k in keyof V]: {
      [j in keyof V[k]]: V[k][j];
    };
  } = Record<never, never>,
  R extends ({
    [k in Exclude<keyof R[number], "css">]: k extends keyof R[number]
      ? R[number][k] extends string
        ? string
        : string[]
      : never;
  } & { css: TemplatedParameters | Parameters<typeof css> })[] = (Record<
    never,
    never
  > & { css: TemplatedParameters | Parameters<typeof css> })[],
  DV extends { [k in keyof DV]: string } = Record<never, never>,
>(cva: {
  variants?: Narrow<V>;
  compoundVariants?: Narrow<CV>;
  defaultVariants?: Narrow<DV>;
}) =>
  ({
    variants: cva.variants ?? {},
    compoundVariants: cva.compoundVariants ?? [],
    defaultVariants: cva.defaultVariants ?? {},
  }) as CVA<{
    [k in
      | keyof DV
      | keyof V
      | Exclude<keyof CV[number], "css">]: k extends keyof DV
      ? k extends keyof V
        ? k extends keyof CV[number]
          ? DV[k] | keyof V[k] | Flat<CV[number][k]>
          : DV[k] | keyof V[k]
        : k extends keyof CV[number]
          ? DV[k] | Flat<CV[number][k]>
          : DV[k]
      : k extends keyof V
        ? k extends keyof CV[number]
          ? keyof V[k] | Flat<CV[number][k]>
          : keyof V[k]
        : k extends keyof CV[number]
          ? Flat<CV[number][k]>
          : never;
  }>;

export type VariantProps<C extends CVA<any>> =
  C extends CVA<infer V> ? { [k in keyof V]?: StringToPrimitive<V[k]> } : never;
