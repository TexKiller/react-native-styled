import React from "react";
import {
  Platform,
  ActivityIndicator as RNActivityIndicator,
  Image as RNImage,
  ImageBackground as RNImageBackground,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
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
  TextStyle,
  ViewProps,
} from "react-native";
import ShadowedText from "./components/ShadowedText";
import ShadowedView from "./components/ShadowedView";
import VariablesWrapper from "./components/VariablesWrapper";
import { applyStyled, css } from "./utils/css";
import { CVA, VariantProps } from "./utils/cva";
import { SharedValue, TemplatedParameters } from "./utils/styled";
import {
  fixFontStyle,
  fixStyleEntries,
  fixViewStyle,
  textProperties,
} from "./utils/styles";
import { RecursiveMap } from "./utils/types";

if (Platform.OS === "web") {
  const oldCreateElement = React.createElement;
  React.createElement = ((...args: Parameters<typeof React.createElement>) => {
    if (typeof args[0] === "string") {
      const className = (args[1] as any)?.["data-testid"] || "";
      args[1] = { ...(args[1] || {}), className } as any;
      if (!className) {
        delete (args[1] as any).className;
      }
      delete (args[1] as any)["data-testid"];
    }
    return oldCreateElement(...args);
  }) as any;
}

export { css } from "./utils/css";
export * from "./utils/cva";
export { TemplatedParameters } from "./utils/styled";

function styled<
  C extends React.ComponentType<any>,
  P = React.ComponentProps<C>,
>(
  OriginalComponent: C,
): (...temp: TemplatedParameters) => React.ForwardRefExoticComponent<
  { [p in keyof P]: P[p] } & {
    css?: TemplatedParameters;
  } & React.RefAttributes<
      C extends React.ComponentClass
        ? InstanceType<C>
        : C extends React.FunctionComponent
          ? ReturnType<C>
          : C
    >
>;
function styled<
  C extends React.ComponentType<any>,
  P = React.ComponentProps<C>,
>(
  OriginalComponent: C,
  ...args: Parameters<typeof css>
): React.ForwardRefExoticComponent<
  { [p in keyof P]: P[p] } & {
    css?: TemplatedParameters;
  } & React.RefAttributes<
      C extends React.ComponentClass
        ? InstanceType<C>
        : C extends React.FunctionComponent
          ? ReturnType<C>
          : C
    >
>;
function styled<
  C extends React.ComponentType<any>,
  V extends Record<string, any>,
  P = React.ComponentProps<C>,
>(
  OriginalComponent: C,
  cva: CVA<V>,
  ...args: Parameters<typeof css>
): React.ForwardRefExoticComponent<
  {
    [p in keyof P]: p extends keyof P
      ? p extends keyof V
        ? P[p] | VariantProps<CVA<V>>[p]
        : P[p]
      : p extends keyof V
        ? VariantProps<CVA<V>>[p]
        : never;
  } & Omit<VariantProps<CVA<V>>, keyof P> & {
      css?: TemplatedParameters;
    } & React.RefAttributes<
      C extends React.ComponentClass
        ? InstanceType<C>
        : C extends React.FunctionComponent
          ? ReturnType<C>
          : C
    >
>;
function styled<
  P extends { style?: S },
  S = P["style"],
  V extends Record<string, any> = P,
>(
  OriginalComponent: React.ComponentType<P>,
  ...args:
    | [Partial<CVA<V>>, ...Parameters<typeof css>]
    | [...Parameters<typeof css>]
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
    const overflowX = styleEntries.find(([k]) => k === "overflowX");
    if (overflowX) {
      if (overflowX[1] === "scroll") {
        OriginalComponent = RNScrollView as any;
        (props as any).horizontal = true;
      }
      styleEntries.splice(styleEntries.indexOf(overflowX), 1);
    }
    const overflowY = styleEntries.find(([k]) => k === "overflowY");
    if (overflowY) {
      if (overflowY[1] === "scroll") {
        OriginalComponent = RNScrollView as any;
        (props as any).horizontal = false;
      }
      styleEntries.splice(styleEntries.indexOf(overflowY), 1);
    }
    if ([overflowX?.[1], overflowY?.[1]].includes("hidden")) {
      styleEntries.push(["overflow", "hidden"]);
    }
    const newVars = styleEntries.filter(([k]) => k.startsWith("-"));
    const textProps = styleEntries.filter(([k]) =>
      textProperties.includes(k as any),
    );
    newVars.push(
      ...textProps.map(([k, v]) => [`-cssnative_${k}`, v] as [string, unknown]),
    );
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
          const styleEntries: [string, any][] = Object.entries(
            props.style instanceof Array
              ? props.style.reduce((s, c) => ({ ...c, ...s }), {})
              : (props.style ?? {}),
          );
          fixStyleEntries(styleEntries);
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
  ): React.ComponentType<
    P & VariantProps<CVA<V>> & { css?: TemplatedParameters }
  > => {
    const DefaultStyledComponent = applyStyled(
      C,
      (O) => (OriginalComponent = O || OriginalComponent),
    )(...temp);
    const variantProps = Array.from(
      new Set([
        ...Object.keys(cva.variants),
        ...cva.compoundVariants.flatMap((v) => Object.keys(v)),
      ]),
    );
    const cssIndex = variantProps.indexOf("css");
    if (cssIndex !== -1) {
      variantProps.splice(cssIndex, 1);
    }
    const variantValues = variantProps.map((p) =>
      Array.from(
        new Set([
          ...Object.keys(cva.variants[p] || {}),
          ...cva.compoundVariants.flatMap((v) =>
            v[p] instanceof Array ? v[p] : v[p] || ([] as any),
          ),
        ]),
      ),
    );
    const variantStyledComponents: RecursiveMap<typeof DefaultStyledComponent> =
      new Map();
    let stacks: any[][] = [[]];
    const none = Symbol("none");
    for (const variantValue of variantValues) {
      stacks = stacks.flatMap((v) => [
        ...variantValue.map((v2) => [...v, v2]),
        [...v, none],
      ]);
    }
    for (const stack of stacks) {
      if (!stack.find((s) => s !== none)) {
        continue;
      }
      const vProps: any = {};
      for (let i = 0; i < stack.length; i++) {
        vProps[variantProps[i]] = stack[i];
      }
      const styles: TemplatedParameters[] = [];
      for (const prop in cva.variants) {
        const variant: Parameters<typeof css> | undefined = (cva.variants[
          prop
        ] as any)![vProps[prop]];
        if (variant) {
          styles.push(
            ...(variant[0] instanceof Function || variant[0][0] instanceof Array
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
              ].includes(vProps[prop]),
          )
        ) {
          continue;
        }
        styles.push(
          ...(compoundVariant.css[0] instanceof Function ||
          compoundVariant.css[0][0] instanceof Array
            ? (compoundVariant.css as TemplatedParameters[])
            : [compoundVariant.css as TemplatedParameters]),
        );
      }
      if (!styles.length) {
        continue;
      }
      let node = variantStyledComponents;
      const lastS = stack.pop();
      for (const s of stack) {
        node.set(s, node.get(s) || new Map());
        node = node.get(s) as any;
      }
      node.set(
        lastS,
        applyStyled(
          C,
          (O) => (OriginalComponent = O || OriginalComponent),
        )(...css(temp, ...styles)),
      );
    }
    return React.forwardRef((props, ref) => {
      let StyledOriginalComponent = DefaultStyledComponent;
      if ((props as any).css) {
        StyledOriginalComponent = applyStyled(
          C,
          (O) => (OriginalComponent = O || OriginalComponent),
        )(...css(temp, (props as any).css));
      } else {
        if (variantStyledComponents.size) {
          const vProps = {
            ...cva.defaultVariants,
            ...props,
          };
          delete (vProps as any).css;
          let node = variantStyledComponents;
          for (const prop of variantProps) {
            node = (node?.get(`${vProps[prop]}`) || node?.get(none)) as any;
          }
          if (node) {
            StyledOriginalComponent = node as any;
          }
        }
      }
      return <StyledOriginalComponent {...(props as any)} ref={ref} />;
    }) as any;
  };
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
styled.Pressable = styled(RNPressable);
styled.ScrollView = styled(RNScrollView);
styled.Switch = styled(RNSwitch);
styled.RefreshControl = styled(RNRefreshControl);
styled.SafeAreaView = styled(RNSafeAreaView);
styled.Text = styled(
  Platform.OS === "web"
    ? RNText
    : React.forwardRef<RNText, TextProps>((props, ref) => {
        const vars = React.useContext(SharedValue);

        return (
          <RNText
            {...props}
            style={fixFontStyle(props.style, vars)}
            ref={ref}
          />
        );
      }),
);
styled.TextInput = styled(
  Platform.OS === "web"
    ? RNTextInput
    : React.forwardRef<RNTextInput, TextInputProps>((props, ref) => {
        if (!props.style) {
          props.style = [{}];
        }
        if (!(props.style instanceof Array)) {
          props.style = [props.style];
        }
        const firstStyle = (props.style[0] = {
          ...(props.style[0] as any),
        } as TextStyle);
        firstStyle.color = firstStyle.color ?? "black";
        firstStyle.letterSpacing = firstStyle.letterSpacing ?? 0;
        firstStyle.textTransform = firstStyle.textTransform ?? "none";
        firstStyle.textDecorationLine = firstStyle.textDecorationLine ?? "none";
        firstStyle.textAlign = firstStyle.textAlign ?? "left";
        firstStyle.fontWeight = firstStyle.fontWeight ?? "normal";
        firstStyle.paddingLeft = firstStyle.paddingLeft ?? 12;
        firstStyle.paddingRight = firstStyle.paddingRight ?? 12;
        firstStyle.paddingTop = firstStyle.paddingTop ?? 4;
        firstStyle.paddingBottom = firstStyle.paddingBottom ?? 4;

        const vars = React.useContext(SharedValue);

        return (
          <RNTextInput
            {...props}
            style={fixFontStyle(props.style, vars)}
            ref={ref}
          />
        );
      }),
);
styled.TouchableHighlight = styled(RNTouchableHighlight);
styled.TouchableNativeFeedback = styled(RNTouchableNativeFeedback);
styled.TouchableOpacity = styled(RNTouchableOpacity);
styled.TouchableWithoutFeedback = styled(RNTouchableWithoutFeedback);
styled.View = styled(
  Platform.OS === "web"
    ? RNView
    : React.forwardRef<RNView, ViewProps>((props, ref) => (
        <RNView {...props} style={fixViewStyle(props.style)} ref={ref} />
      )),
);

export default styled;
