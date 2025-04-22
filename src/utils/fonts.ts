export const fixFontStyle = (style: any) => {
  if (!style) {
    return { fontWeight: 400, color: "inherit" };
  }
  let weight = 400;
  let family = "";
  let color = "inherit";
  const styles = style instanceof Array ? style : [style];
  for (const style of styles) {
    if (style?.fontWeight) {
      weight = style.fontWeight;
    }
    if (style?.fontFamily) {
      family = style.fontFamily;
    }
    if (style?.color) {
      color = style.color;
    }
  }
  if ((weight as any) === "normal") {
    weight = 400;
  } else if ((weight as any) === "bold") {
    weight = 700;
  }
  styles[styles.length - 1] = {
    ...styles[styles.length - 1],
    fontWeight: weight,
    color,
  };
  if (family && !family.includes("-")) {
    styles[styles.length - 1].fontFamily =
      (weight < 500 && `${family}-Regular`) ||
      (weight < 600 && `${family}-Medium`) ||
      (weight < 700 && `${family}-SemiBold`) ||
      `${family}-Bold`;
  }
  return style;
};
