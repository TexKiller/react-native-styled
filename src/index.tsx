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
  ViewProps,
} from "react-native";
import originalStyled from "./utils/styled";
import ShadowedText from "./components/ShadowedText";
import ShadowedView from "./components/ShadowedView";
import VariablesWrapper from "./components/VariablesWrapper";
import { applyStyled, css } from "./utils/css";
import { CVA } from "./utils/cva";
import { fixFontStyle, fixViewStyle } from "./utils/styles";

export { css } from "./utils/css";
export * from "./utils/cva";

type TemplatedParameters = Parameters<ReturnType<typeof originalStyled>>;

function styled<P extends { style?: S }, S = P["style"]>(
  OriginalComponent: React.ComponentType<P>,
): (
  ...temp: TemplatedParameters
) => React.ForwardRefExoticComponent<
  { [p in keyof P]: P[p] } & { css?: TemplatedParameters }
>;
function styled<P extends { style?: S }, S = P["style"]>(
  OriginalComponent: React.ComponentType<P>,
  ...args: [...TemplatedParameters[]]
): React.ForwardRefExoticComponent<
  { [p in keyof P]: P[p] } & { css?: TemplatedParameters }
>;
function styled<
  P extends { style?: S },
  V extends Record<string, any>,
  S = P["style"],
>(
  OriginalComponent: React.ComponentType<P>,
  cva: CVA<V>,
  ...args: [...TemplatedParameters[]]
): React.ForwardRefExoticComponent<
  { [p in keyof P]: P[p] } & { [v in keyof V]?: V[v] } & {
    css?: TemplatedParameters;
  }
>;
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
  const Component = React.forwardRef<
    React.ComponentType<P>,
    P & { OriginalComponent: React.ComponentType<P> }
  >(({ OriginalComponent, ...props }, ref) => {
    const styleEntries = Object.entries(
      props.style instanceof Array
        ? props.style.reduce((s, c) => ({ ...c, ...s }), {})
        : (props.style ?? {}),
    );
    const newVars = styleEntries.filter(([k]) => k.startsWith("-"));
    if (newVars.length) {
      return (
        <VariablesWrapper
          {...props}
          newVars={newVars}
          OriginalComponent={OriginalComponent}
          ref={ref}
        />
      );
    }
    return <OriginalComponent {...(props as any)} ref={ref} />;
  });
  const C: React.ComponentType<P> =
    Platform.OS === "web"
      ? OriginalComponent
      : (React.forwardRef<React.ReactNode, P>((props, ref) => {
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
                {...(props as any)}
                style={Object.fromEntries(styleEntries)}
                OriginalComponent={OriginalComponent}
                ref={ref}
              />
            );
          }
          if ((OriginalComponent as any) === RNView) {
            return (
              <Component
                {...(props as any)}
                style={Object.fromEntries(styleEntries)}
                OriginalComponent={ShadowedView as any}
                ref={ref}
              />
            );
          }
          const nonShadowEntries = styleEntries.filter(
            ([k]) => !k.startsWith("shadow") && k !== "styledBoxShadow",
          );
          return (
            <ShadowedView style={Object.fromEntries(shadowedViewEntries)}>
              <Component
                {...(props as any)}
                style={Object.fromEntries(nonShadowEntries)}
                OriginalComponent={OriginalComponent}
                ref={ref}
              />
            </ShadowedView>
          );
        }) as any);
  const cvaParam: Partial<CVA<V>> =
    !args[0] || args[0] instanceof Array ? {} : (args.shift() as any);
  const cva: CVA<V> = {
    variants: cvaParam.variants || {},
    compoundVariants: cvaParam.compoundVariants || [],
    defaultVariants: cvaParam.defaultVariants || {},
  };
  const styledComponent = (
    ...temp: TemplatedParameters
  ): React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P & V & { css?: TemplatedParameters }>
  > =>
    React.forwardRef((props, ref) => {
      let styles: TemplatedParameters = css(
        temp[0] ? temp : ([[""]] as any),
        ...(props.css ? [props.css] : []),
      );
      if (cvaParam.variants || cvaParam.compoundVariants) {
        const variantProps = {
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
        const StyledOriginalComponent = applyStyled(
          C,
          (O) => (OriginalComponent = O || OriginalComponent),
        )(...styles);
        return <StyledOriginalComponent {...(props as any)} ref={ref} />;
      }
      return <C {...(props as any)} ref={ref} />;
    });
  if (
    cvaParam.variants ||
    cvaParam.compoundVariants ||
    cvaParam.defaultVariants ||
    args[0]
  ) {
    return styledComponent(...css(...(args as TemplatedParameters[])));
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
styled.Text = styled(
  React.forwardRef<RNText, TextProps>((props, ref) => (
    <RNText {...props} style={fixFontStyle(props.style)} ref={ref} />
  )),
);
styled.TextInput = styled(
  React.forwardRef<RNTextInput, TextInputProps>((props, ref) => {
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
    return <RNTextInput {...props} style={fixFontStyle(style)} ref={ref} />;
  }),
);
styled.TouchableHighlight = styled(RNTouchableHighlight);
styled.TouchableNativeFeedback = styled(RNTouchableNativeFeedback);
styled.TouchableOpacity = styled(RNTouchableOpacity);
styled.TouchableWithoutFeedback = styled(RNTouchableWithoutFeedback);
styled.View = styled(
  React.forwardRef<RNView, ViewProps>((props, ref) => (
    <RNView {...props} style={fixViewStyle(props.style)} ref={ref} />
  )),
);

export default styled;
