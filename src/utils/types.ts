export type Cast<A, B> = A extends B ? A : B;
export type Narrow<A> = Cast<
  A,
  {
    [K in keyof A]: Narrow<A[K]>;
  }
>;
export type Flat<A> = A extends Array<infer W> ? W : A;
