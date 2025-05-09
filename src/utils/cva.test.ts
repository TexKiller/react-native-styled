import { expectAssignable, expectError } from "tsd";
import { CVA, cva, VariantProps } from "./cva";
import {
  InvalidCVASample,
  PropsSample,
  ValidCVASample,
  VariantPropsSample,
} from "./samples/cva";

describe("CVA", () => {
  it("should accept a valid configuration", async () => {
    expectAssignable<CVA<PropsSample>>({} as ValidCVASample);
  });
  it("should reject an invalid configuration", async () => {
    expectError(
      // @ts-expect-error black is not a valid color
      expectAssignable<CVA<PropsSample>>({} as InvalidCVASample),
    );
  });
});

describe("cva", () => {
  it("should extract props from a valid configuration", async () => {
    expectAssignable<CVA<PropsSample>>(cva({} as ValidCVASample));
  });
});

describe("VariantProps", () => {
  it("should extract props from a valid configuration", async () => {
    expectAssignable<VariantPropsSample>({} as VariantProps<CVA<PropsSample>>);
  });
});
