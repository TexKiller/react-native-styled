import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { cssToRNStyle } from "rn-css";

const ShadowedView = (
  props: TextProps & { style?: { styledTextShadow?: string } },
) => {
  const style = props.style as TextStyle & { styledTextShadow?: string };
  style.shadowOpacity = 1;
  if (!style.styledTextShadow) {
    return <Text {...props} />;
  }
  const shadows = style.styledTextShadow
    .replace(/(?<=(^[^(]*|\)[^(]*)),/g, "§")
    .split("§");
  delete style.styledTextShadow;
  const firstStyle = cssToRNStyle(`text-shadow: ${shadows.shift()}`);
  const styles = shadows.map((shadow) =>
    cssToRNStyle(`text-shadow: ${shadow}; position: absolute;`),
  );
  return styles.reduce(
    (texts, s, i) => [
      <Text key={JSON.stringify(s) + i} {...props} style={{ ...style, ...s }}>
        {props.children}
      </Text>,
      ...texts,
    ],
    [
      <Text
        key={JSON.stringify(firstStyle)}
        {...props}
        style={{ ...style, ...firstStyle }}
      />,
    ],
  );
};

export default ShadowedView;
