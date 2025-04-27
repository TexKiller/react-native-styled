export const textProperties = [
  "color",
  "direction",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "textAlign",
  "textDecorationLine",
  "textTransform",
] as const;

export const fixFontStyle = (style: any, vars: any) => {
  if (!style) {
    style = {};
  }
  const s: Partial<Record<(typeof textProperties)[number], any>> = {};
  const styles = [...(style instanceof Array ? style : [style])];
  for (const style of styles) {
    for (const p of textProperties) {
      if (style[p] !== undefined) {
        s[p] = style[p];
      }
    }
  }
  if (s.fontWeight === "normal") {
    s.fontWeight = 400;
  } else if (s.fontWeight === "bold") {
    s.fontWeight = 700;
  }
  if (textProperties.find((p) => s[p] === undefined) && vars) {
    for (const p of textProperties) {
      if (s[p] === undefined) {
        s[p] = vars[`cssnative_${p}`];
      }
    }
  }
  if (s.fontWeight === undefined) {
    s.fontWeight = 400;
  }
  if (s.fontFamily && !s.fontFamily.includes("-")) {
    s.fontFamily =
      (s.fontWeight < 500 && `${s.fontFamily}-Regular`) ||
      (s.fontWeight < 600 && `${s.fontFamily}-Medium`) ||
      (s.fontWeight < 700 && `${s.fontFamily}-SemiBold`) ||
      `${s.fontFamily}-Bold`;
  }
  styles[styles.length - 1] = { ...styles[styles.length - 1], ...s };
  return styles;
};

export const fixViewStyle = (style: any) => {
  if (!style) {
    return { flexDirection: "column" } as const;
  }
  const styles = [...(style instanceof Array ? style : [style])];
  const display = styles.filter((s) => s.display).pop()?.display;
  const flexDirection = styles
    .filter((s) => s.flexDirection)
    .pop()?.flexDirection;
  styles[styles.length - 1] = {
    ...styles[styles.length - 1],
    flexDirection: display === "flex" ? flexDirection || "row" : "column",
  };
  return styles;
};
