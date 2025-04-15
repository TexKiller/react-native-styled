import { useTemplated } from "./templated";
import { args, expected } from "./samples/templated";

describe("useTemplated", () => {
  it("should return the correct result", () => {
    const result = useTemplated(args, "web", {});
    expect(result).toEqual(expected);
  });
});
