import { parseTemplated } from "./templated";
import { args, expected } from "./samples/templated";

describe("parseTemplated", () => {
  it("should return the correct result", () => {
    const result = parseTemplated(args);
    expect(result[0]).toEqual(expected[0]);
    expect(typeof result[1]).toEqual("function");
    expect(result.length).toEqual(2);
  });
});
