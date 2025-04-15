export const fixFontStyle = (style: any) => {
  if (!style) {
    return;
  }
  let weight = 400;
  let family = "";
  const styles = style instanceof Array ? style : [style];
  for (const style of styles) {
    if (style?.fontWeight) {
      weight = style.fontWeight;
    }
    if (style?.fontFamily) {
      family = style.fontFamily;
    }
  }
  if ((weight as any) === "normal") {
    weight = 400;
  } else if ((weight as any) === "bold") {
    weight = 700;
  }
  styles[styles.length - 1].fontWeight = weight;
  if (family && !family.includes("-")) {
    styles[styles.length - 1].fontFamily =
      (weight < 500 && `${family}-Regular`) ||
      (weight < 600 && `${family}-Medium`) ||
      (weight < 700 && `${family}-SemiBold`) ||
      `${family}-Bold`;
  }
  return style;
};
