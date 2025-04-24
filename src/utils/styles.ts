export const fixFontStyle = (style: any) => {
  if (!style) {
    return { fontWeight: 400, color: "inherit" };
  }
  let weight = 400;
  let family = "";
  let color = "inherit";
  let textDecoration = "inherit";
  let whiteSpace = "inherit";
  let overflowWrap = "inherit";
  const styles = [...(style instanceof Array ? style : [style])];
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
    if (style?.textDecoration) {
      textDecoration = style.textDecoration;
    }
    if (style?.whiteSpace) {
      whiteSpace = style.whiteSpace;
    }
    if (style?.overflowWrap) {
      overflowWrap = style.overflowWrap;
    }
  }
  if ((weight as any) === "normal") {
    weight = 400;
  } else if ((weight as any) === "bold") {
    weight = 700;
  }
  styles[styles.length - 1].fontWeight = weight;
  styles[styles.length - 1].color = color;
  styles[styles.length - 1].textDecoration = textDecoration;
  styles[styles.length - 1].whiteSpace = whiteSpace;
  styles[styles.length - 1].overflowWrap = overflowWrap;
  if (family && !family.includes("-")) {
    styles[styles.length - 1].fontFamily =
      (weight < 500 && `${family}-Regular`) ||
      (weight < 600 && `${family}-Medium`) ||
      (weight < 700 && `${family}-SemiBold`) ||
      `${family}-Bold`;
  }
  return style;
};

export const fixViewStyle = (style: any) => {
  if (!style) {
    return { display: "block", flexDirection: "row" };
  }
  const styles = [...(style instanceof Array ? style : [style])];
  styles[0].display = styles[0].display || "block";
  styles[0].flexDirection = styles[0].flexDirection || "row";
  return style;
};
