export type Cast<A, B> = A extends B ? A : B;
export type Narrow<A> = Cast<
  A,
  {
    [K in keyof A]: Narrow<A[K]>;
  }
>;
export type Flat<A> = A extends Array<infer W> ? W : A;

export type StringToPrimitive<A> = A extends "true"
  ? boolean | "true"
  : A extends "false"
    ? boolean | "false"
    : A extends "null"
      ? null | "null"
      : A extends "undefined"
        ? undefined | "undefined"
        : A;

export type RecursiveMap<T> = Map<any, T | RecursiveMap<T>>;
