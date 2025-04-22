import { fixFontStyle } from "./fonts";

describe("fixFontStyle", () => {
  it("should return the correct font weight", () => {
    expect(fixFontStyle({ fontWeight: "normal" })).toEqual({
      fontWeight: 400,
      color: "inherit",
    });
  });
  it("should return the correct font family", () => {
    expect(fixFontStyle({ fontWeight: 700, fontFamily: "Arial" })).toEqual({
      fontWeight: 700,
      fontFamily: "Arial-Bold",
      color: "inherit",
    });
  });
  it("should not change font family if font family has dashes", () => {
    expect(fixFontStyle({ fontWeight: 400, fontFamily: "Arial-Bold" })).toEqual(
      {
        fontWeight: 400,
        fontFamily: "Arial-Bold",
        color: "inherit",
      },
    );
  });
});
