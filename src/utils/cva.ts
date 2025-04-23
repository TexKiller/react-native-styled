import rnCSS from "rn-css";
import { Flat, Narrow } from "./types";

type TemplatedParameters = Parameters<ReturnType<typeof rnCSS>>;

export type CVA<V extends Record<string, any>> = {
  variants: {
    [k in keyof V]?: {
      [j in V[k]]?: TemplatedParameters | TemplatedParameters[];
    };
  };
  compoundVariants: ({ [k in keyof V]?: V[k] | V[k][] } & {
    css: TemplatedParameters | TemplatedParameters[];
  })[];
  defaultVariants: Partial<V>;
};

export const cva = <
  CV extends [...R],
  V extends {
    [k in keyof V]: {
      [j in keyof V[k]]: V[k][j] extends string ? string : [...S];
    };
  } = Record<never, never>,
  S extends string[] = string[],
  R extends { [k in keyof R[number]]: string | string[] }[] = Record<
    never,
    never
  >[],
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
  C extends CVA<infer V> ? Partial<V> : never;
