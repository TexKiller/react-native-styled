import React from "react";
import {
  Platform,
  ActivityIndicator as RNActivityIndicator,
  Image as RNImage,
  ImageBackground as RNImageBackground,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Modal as RNModal,
  Pressable as RNPressable,
  RefreshControl as RNRefreshControl,
  SafeAreaView as RNSafeAreaView,
  ScrollView as RNScrollView,
  Switch as RNSwitch,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableHighlight as RNTouchableHighlight,
  TouchableNativeFeedback as RNTouchableNativeFeedback,
  TouchableOpacity as RNTouchableOpacity,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  View as RNView,
  TextInputProps,
  TextProps,
} from "react-native";
import rnCSS from "rn-css";
import ShadowedText from "./components/ShadowedText";
import ShadowedView from "./components/ShadowedView";
import VariablesWrapper from "./components/VariablesWrapper";
import WebSelectors from "./components/WebSelectors";
import { applyRnCSS, css } from "./utils/css";
import { CVA } from "./utils/cva";
import { fixFontStyle } from "./utils/fonts";
import { camel2kebab } from "./utils/string";

export { css } from "./utils/css";
export * from "./utils/cva";

type TemplatedParameters = Parameters<ReturnType<typeof rnCSS>>;

function styled<P extends { style?: S }, S = P["style"]>(
  OriginalComponent: React.ComponentType<P>,
): (
  ...temp: TemplatedParameters
) => React.FunctionComponent<P & { css?: TemplatedParameters }>;
function styled<
  P extends { style?: S },
  S = P["style"],
  V extends Record<string, any> = P,
>(
  OriginalComponent: React.ComponentType<P>,
  ...args:
    | [Partial<CVA<V>>, ...TemplatedParameters[]]
    | [...TemplatedParameters[]]
): React.FunctionComponent<P & V & { css?: TemplatedParameters }>;
function styled<
  P extends { style?: S },
  S = P["style"],
  V extends Record<string, any> = P,
>(
  OriginalComponent: React.ComponentType<P>,
  ...args:
    | [Partial<CVA<V>>, ...TemplatedParameters[]]
    | [...TemplatedParameters[]]
) {
  const Component = ({
    OriginalComponent,
    ...props
  }: P & { OriginalComponent: React.ComponentType<P> }) => {
    const styleEntries = Object.entries(
      props.style instanceof Array
        ? props.style.reduce((s, c) => ({ ...c, ...s }), {})
        : (props.style ?? {}),
    );
    if (Platform.OS !== "web") {
      const newVars = styleEntries.filter(([k]) => k.startsWith("-"));
      if (newVars.length) {
        return (
          <VariablesWrapper
            {...props}
            newVars={newVars}
            OriginalComponent={OriginalComponent}
          />
        );
      }
      return <OriginalComponent {...(props as any)} />;
    }
    let variables = "";
    let hover = "";
    let active = "";
    let focus = "";
    for (const style of props.style instanceof Array
      ? props.style
      : [props.style]) {
      for (const key in style) {
        if (typeof style[key] === "string") {
          style[key] = style[key]
            .replace(/webcalc/g, "calc")
            .replace(/webvar/g, "var")
            .replace(
              /(\b\d+(\.\d+)?)§([a-z]+\b|%)/gi,
              (_, a, _b, c) => `${a}${c}`,
            )
            .replace(/weboutline/g, "outline")
            .replace(/webbackground/g, "background")
            .replace(/webborder/g, "border");
        }
        if (
          !key.startsWith("webhover") &&
          !key.startsWith("webactive") &&
          !key.startsWith("webfocus") &&
          !key.startsWith("weboutline") &&
          !key.startsWith("webbackground") &&
          !key.startsWith("webborder") &&
          !key.startsWith("-")
        ) {
          continue;
        }
        if (key.startsWith("-")) {
          variables += camel2kebab(key) + ": " + style[key] + ";\n";
        } else if (key.startsWith("webhover")) {
          hover += style[key] + "§";
        } else if (key.startsWith("webactive")) {
          active += style[key] + "§";
        } else if (key.startsWith("webfocus")) {
          focus += style[key] + "§";
        } else if (key.startsWith("weboutline")) {
          style[key.replace(/^weboutline/, "outline")] = style[key];
        } else if (key.startsWith("webbackground")) {
          style[key.replace(/^webbackground/, "background")] = style[key];
        } else if (key.startsWith("webborder")) {
          style[key.replace(/^webborder/, "border")] = style[key];
        }
        delete style[key];
      }
    }
    if (variables || hover || active) {
      return (
        <WebSelectors
          variables={variables}
          hover={hover
            .substring(0, hover.length - 1)
            .replace(/§/g, " !important;")
            .replace(/---/g, "--")}
          active={active
            .substring(0, active.length - 1)
            .replace(/§/g, " !important;")
            .replace(/---/g, "--")}
          focus={focus
            .substring(0, focus.length - 1)
            .replace(/§/g, " !important;")
            .replace(/---/g, "--")}
          {...props}
          OriginalComponent={OriginalComponent}
        />
      );
    }
    return <OriginalComponent {...(props as any)} />;
  };
  const C: React.FunctionComponent<P> = (props: P) => {
    const styleEntries = Object.entries(
      props.style instanceof Array
        ? props.style.reduce((s, c) => ({ ...c, ...s }), {})
        : (props.style ?? {}),
    );
    const shadowedTextEntries = styleEntries.filter(
      ([k]) => k === "styledTextShadow",
    );
    if (shadowedTextEntries.length) {
      OriginalComponent = ShadowedText as any;
    }
    const shadowedViewEntries = styleEntries.filter(
      ([k]) => k.startsWith("shadow") || k === "styledBoxShadow",
    );
    if (!shadowedViewEntries.length) {
      return (
        <Component
          {...props}
          style={Object.fromEntries(styleEntries)}
          OriginalComponent={OriginalComponent}
        />
      );
    }
    if ((OriginalComponent as any) === RNView) {
      return (
        <Component
          {...props}
          style={Object.fromEntries(styleEntries)}
          OriginalComponent={ShadowedView as any}
        />
      );
    }
    const nonShadowEntries = styleEntries.filter(
      ([k]) => !k.startsWith("shadow") && k !== "styledBoxShadow",
    );
    return (
      <ShadowedView style={Object.fromEntries(shadowedViewEntries)}>
        <Component
          {...props}
          style={Object.fromEntries(nonShadowEntries)}
          OriginalComponent={OriginalComponent}
        />
      </ShadowedView>
    );
  };
  const cvaParam: Partial<CVA<V>> =
    args[0] instanceof Array ? {} : (args.shift() as CVA<V>);
  const cva: CVA<V> = {
    variants: cvaParam.variants || {},
    compoundVariants: cvaParam.compoundVariants || [],
    defaultVariants: cvaParam.defaultVariants || {},
  };
  const styledComponent =
    (
      ...temp: TemplatedParameters
    ): React.FunctionComponent<P & V & { css?: TemplatedParameters }> =>
    (props) => {
      let styles: TemplatedParameters = css(
        temp,
        ...(props.css ? [props.css] : []),
        ...(args as TemplatedParameters[]),
      );
      if (cvaParam.variants || cvaParam.compoundVariants) {
        const variantProps: P & V = {
          ...cva.defaultVariants,
          ...props,
        };
        delete (variantProps as any).css;
        for (const prop in cva.variants) {
          const variant:
            | TemplatedParameters
            | TemplatedParameters[]
            | undefined = cva.variants[prop]![variantProps[prop]];
          if (variant) {
            styles = css(
              styles,
              ...(variant[0][0] instanceof Array
                ? (variant as TemplatedParameters[])
                : [variant as TemplatedParameters]),
            );
          }
        }
        for (const compoundVariant of cva.compoundVariants) {
          if (
            (Object.keys(compoundVariant) as (keyof V)[]).find(
              (prop) =>
                prop !== "css" &&
                ![
                  ...(compoundVariant[prop] instanceof Array
                    ? compoundVariant[prop]
                    : [compoundVariant[prop]]),
                ].includes(variantProps[prop]),
            )
          ) {
            continue;
          }
          styles = css(
            styles,
            ...(compoundVariant.css[0][0] instanceof Array
              ? (compoundVariant.css as TemplatedParameters[])
              : [compoundVariant.css as TemplatedParameters]),
          );
        }
      }
      if (styles[0].length > 1 || styles[0][0]) {
        const StyledOriginalComponent = applyRnCSS(
          C,
          (O) => (OriginalComponent = O || OriginalComponent),
        )(...styles);
        return <StyledOriginalComponent {...props} />;
      }
      return <C {...props} />;
    };
  if (
    cvaParam.variants ||
    cvaParam.compoundVariants ||
    cvaParam.defaultVariants
  ) {
    return styledComponent([[""]] as any);
  }
  return styledComponent;
}

styled.ActivityIndicator = styled(RNActivityIndicator);
styled.Image = styled(RNImage);
styled.ImageBackground = styled(RNImageBackground);
styled.KeyboardAvoidingView = styled(RNKeyboardAvoidingView);
styled.Modal = styled(RNModal);
styled.Pressable = styled(RNPressable);
styled.ScrollView = styled(RNScrollView);
styled.Switch = styled(RNSwitch);
styled.RefreshControl = styled(RNRefreshControl);
styled.SafeAreaView = styled(RNSafeAreaView);
styled.Text = styled((props: TextProps) => (
  <RNText {...props} style={fixFontStyle(props.style)} />
));
styled.TextInput = styled((props: TextInputProps) => {
  const style: any[] = [
    ...(props.style instanceof Array
      ? (props.style.length && props.style) || [{}]
      : [props.style || {}]),
  ];
  style[0] = {
    ...style[0],
    width: style[0].width || "100%",
    boxSizing: style[0].boxSizing || "border-box",
    flex: style[0].flex || 1,
  };
  return <RNTextInput {...props} style={fixFontStyle(style)} />;
});
styled.TouchableHighlight = styled(RNTouchableHighlight);
styled.TouchableNativeFeedback = styled(RNTouchableNativeFeedback);
styled.TouchableOpacity = styled(RNTouchableOpacity);
styled.TouchableWithoutFeedback = styled(RNTouchableWithoutFeedback);
styled.View = styled(RNView);

export default styled;
