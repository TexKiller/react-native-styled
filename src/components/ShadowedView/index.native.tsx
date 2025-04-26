import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import { cssToRNStyle } from "rn-css";
import Component from "./Component";

const ShadowedView = (
  props: ViewProps & { style?: { styledBoxShadow?: string } },
) => {
  const style = props.style as ViewStyle & { styledBoxShadow?: string };
  style.shadowOpacity = 1;
  if (!style.styledBoxShadow) {
    return <Component {...props} />;
  }
  const shadows = style.styledBoxShadow
    .replace(/(?<=(^[^(]*|\)[^(]*)),/g, "§")
    .split("§");
  delete style.styledBoxShadow;
  if (shadows.length === 1) {
    Object.assign(
      style,
      cssToRNStyle(`box-shadow: ${shadows[0]}; shadow-opacity: 1`),
    );
    return <Component {...props} />;
  }
  const styles = shadows.map((shadow) =>
    cssToRNStyle(
      `box-shadow: ${shadow}; shadow-opacity: 1;` +
        (style.borderTopLeftRadius
          ? ` border-top-left-radius: ${style.borderTopLeftRadius as number};`
          : "") +
        (style.borderTopRightRadius
          ? ` border-top-right-radius: ${style.borderTopRightRadius as number};`
          : "") +
        (style.borderBottomLeftRadius
          ? ` border-bottom-left-radius: ${style.borderBottomLeftRadius as number};`
          : "") +
        (style.borderBottomRightRadius
          ? ` border-bottom-right-radius: ${style.borderBottomRightRadius as number};`
          : ""),
    ),
  );
  for (const key of Object.keys(style).filter((k) => k.startsWith("margin"))) {
    styles[0][key as keyof ViewStyle] = style[key as keyof ViewStyle] as any;
    delete style[key as keyof ViewStyle];
  }
  const firstStyle = styles.shift();
  return styles.reduce(
    (child, style) => <Component style={style}>{child}</Component>,
    <Component {...props} style={{ ...style, ...firstStyle }} />,
  );
};

export default ShadowedView;
