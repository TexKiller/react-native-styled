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

export const fixStyleEntries = (styleEntries: [string, any][]) => {
  const lineHeight = styleEntries.find(([k]) => k === "lineHeight");
  if (lineHeight) {
    const fontSize = styleEntries.find(([k]) => k === "fontSize") || [0, 17];
    if (lineHeight[1] < fontSize[1] / 2) {
      lineHeight[1] *= fontSize[1];
    }
  }
  const direction = styleEntries.find(([k]) => k === "direction");
  for (const prefix of ["padding", "margin"]) {
    const inline = styleEntries.find(([k]) => k === `${prefix}Inline`);
    if (inline) {
      let inlineStart = styleEntries.find(
        ([k]) => k === `${prefix}InlineStart`,
      );
      if (!inlineStart) {
        inlineStart = [`${prefix}InlineStart`, undefined];
        styleEntries.push(inlineStart);
      }
      inlineStart[1] = inlineStart[1] ?? inline[1];
      let inlineEnd = styleEntries.find(([k]) => k === `${prefix}InlineEnd`);
      if (!inlineEnd) {
        inlineEnd = [`${prefix}InlineEnd`, undefined];
        styleEntries.push(inlineEnd);
      }
      inlineEnd[1] = inlineEnd[1] ?? inline[1];
      styleEntries.splice(styleEntries.indexOf(inline), 1);
    }
    const inlineStart = styleEntries.find(
      ([k]) => k === `${prefix}InlineStart`,
    );
    if (inlineStart) {
      const property =
        direction?.[1] === "rtl" ? `${prefix}Right` : `${prefix}Left`;
      let entry = styleEntries.find(([k]) => k === property);
      if (!entry) {
        entry = [property, undefined];
        styleEntries.push(entry);
      }
      entry[1] = entry[1] ?? inlineStart[1];
      styleEntries.splice(styleEntries.indexOf(inlineStart), 1);
    }
    const inlineEnd = styleEntries.find(([k]) => k === `${prefix}InlineEnd`);
    if (inlineEnd) {
      const property =
        direction?.[1] === "rtl" ? `${prefix}Left` : `${prefix}Right`;
      let entry = styleEntries.find(([k]) => k === property);
      if (!entry) {
        entry = [property, undefined];
        styleEntries.push(entry);
      }
      entry[1] = entry[1] ?? inlineEnd[1];
      styleEntries.splice(styleEntries.indexOf(inlineEnd), 1);
    }
    const block = styleEntries.find(([k]) => k === `${prefix}Block`);
    if (block) {
      let blockStart = styleEntries.find(([k]) => k === `${prefix}BlockStart`);
      if (!blockStart) {
        blockStart = [`${prefix}BlockStart`, undefined];
        styleEntries.push(blockStart);
      }
      blockStart[1] = blockStart[1] ?? block[1];
      let blockEnd = styleEntries.find(([k]) => k === `${prefix}BlockEnd`);
      if (!blockEnd) {
        blockEnd = [`${prefix}BlockEnd`, undefined];
        styleEntries.push(blockEnd);
      }
      blockEnd[1] = blockEnd[1] ?? block[1];
      styleEntries.splice(styleEntries.indexOf(block), 1);
    }
    const blockStart = styleEntries.find(([k]) => k === `${prefix}BlockStart`);
    if (blockStart) {
      let entry = styleEntries.find(([k]) => k === `${prefix}Top`);
      if (!entry) {
        entry = [`${prefix}Top`, undefined];
        styleEntries.push(entry);
      }
      entry[1] = entry[1] ?? blockStart[1];
      styleEntries.splice(styleEntries.indexOf(blockStart), 1);
    }
    const blockEnd = styleEntries.find(([k]) => k === `${prefix}BlockEnd`);
    if (blockEnd) {
      let entry = styleEntries.find(([k]) => k === `${prefix}Bottom`);
      if (!entry) {
        entry = [`${prefix}Bottom`, undefined];
        styleEntries.push(entry);
      }
      entry[1] = entry[1] ?? blockEnd[1];
      styleEntries.splice(styleEntries.indexOf(blockEnd), 1);
    }
  }
  const overflow = styleEntries.find(([k]) => k === "overflow");
  if (overflow) {
    let overflowX = styleEntries.find(([k]) => k === "overflowX");
    if (!overflowX) {
      overflowX = ["overflowX", undefined];
      styleEntries.push(overflowX);
    }
    overflowX[1] = overflowX[1] ?? overflow[1];
    let overflowY = styleEntries.find(([k]) => k === "overflowY");
    if (!overflowY) {
      overflowY = ["overflowY", undefined];
      styleEntries.push(overflowY);
    }
    overflowY[1] = overflowY[1] ?? overflow[1];
    styleEntries.splice(styleEntries.indexOf(overflow), 1);
  }
};
