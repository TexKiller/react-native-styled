import { camel2kebab } from "./string";

describe("camel2kebab", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(camel2kebab("camelCase")).toBe("camel-case");
  });
});
