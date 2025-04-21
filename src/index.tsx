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
} from "react-native";
import rnCSS, { SharedValue } from "rn-css";
import ShadowedText from "./components/ShadowedText";
import ShadowedView from "./components/ShadowedView";
import VariablesWrapper from "./components/VariablesWrapper";
import WebSelectors from "./components/WebSelectors";
import { fixFontStyle } from "./utils/fonts";
import { camel2kebab } from "./utils/string";
import { useTemplated } from "./utils/templated";

type TemplatedParameters = Parameters<ReturnType<typeof rnCSS>>;

export type CVA<P extends Record<string, any>> = {
  variants?: {
    [k in keyof P]?: {
      [j in P[k]]?: TemplatedParameters | TemplatedParameters[];
    };
  };
  compoundVariants?: ({ [k in keyof P]?: P[k] | P[k][] } & {
    css: TemplatedParameters | TemplatedParameters[];
  })[];
  defaultVariants?: Partial<P>;
};

type Props<P extends Record<string, any>> = {
  css?: ReturnType<typeof css>;
  cva?: Partial<CVA<P>>;
};

export type StyledComponent<P extends Record<string, any>> = {
  (...args: TemplatedParameters[]): StyledComponent<P>;
  (...args: TemplatedParameters): StyledComponent<P>;
  (props: { [k in keyof (P & Props<P>)]: (P & Props<P>)[k] }): React.ReactNode;
  cva: (arg: CVA<P>) => void;
};

const styled = <P extends { style?: S }, S>(
  OriginalComponent: React.ComponentType<P>,
): StyledComponent<P> => {
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
    for (const style of props.style instanceof Array
      ? props.style
      : [props.style]) {
      for (const key in style) {
        if (typeof style[key] === "string") {
          style[key] = style[key]
            .replace(/webcalc/g, "calc")
            .replace(/webvar/g, "var");
        }
        if (
          !key.startsWith("webhover") &&
          !key.startsWith("webactive") &&
          !key.startsWith("weboutline") &&
          !key.startsWith("-")
        ) {
          continue;
        }
        if (key.startsWith("-")) {
          variables +=
            camel2kebab(key) +
            ": " +
            (typeof style[key] === "string"
              ? style[key].replace(
                  /(\b\d+(\.\d+)?) ([a-z]+\b|%)/gi,
                  (_, a, _b, c) => `${a}${c}`,
                )
              : style[key]) +
            ";\n";
        } else if (key.startsWith("webhover")) {
          hover += style[key] + "§";
        } else if (key.startsWith("webactive")) {
          active += style[key] + "§";
        } else if (key.startsWith("weboutline")) {
          style[key.replace(/^weboutline/, "outline")] = style[key];
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
  let cva: CVA<P> = {};
  const styledComponent = (...args: any[]): any => {
    if (args[0] instanceof Array) {
      const newStyledComponent = styled(
        applyRnCSS(
          C,
          (O) => (OriginalComponent = O || OriginalComponent),
        )(...css(...args)),
      );
      newStyledComponent.cva(cva);
      return newStyledComponent;
    }
    const newCva: Required<CVA<P>> = {
      variants: Object.assign(cva.variants || {}, args[0]?.cva?.variants || {}),
      compoundVariants: [
        ...(cva.compoundVariants || []),
        ...(args[0]?.cva?.compoundVariants || []),
      ],
      defaultVariants: Object.assign(
        cva.defaultVariants || {},
        args[0]?.cva?.defaultVariants || {},
      ),
    };
    const props: P = {
      ...newCva.defaultVariants,
      ...(args[0] || {}),
    };
    delete (props as any).css;
    delete (props as any).cva;
    let styles: TemplatedParameters = css(...(args[0]?.css || [[""], []]));
    for (const prop in newCva.variants) {
      const variant: TemplatedParameters | TemplatedParameters[] | undefined =
        newCva.variants[prop]![props[prop]];
      if (variant) {
        styles = css(
          styles,
          ...(variant[0][0] instanceof Array
            ? (variant as TemplatedParameters[])
            : [variant as TemplatedParameters]),
        );
      }
    }
    for (const compoundVariant of newCva.compoundVariants) {
      if (
        (Object.keys(compoundVariant) as (keyof P)[]).find(
          (prop) =>
            prop !== "css" &&
            ![
              ...(compoundVariant[prop] instanceof Array
                ? compoundVariant[prop]
                : [compoundVariant[prop]]),
            ].includes(props[prop]),
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
    if (styles[0].find(Boolean)) {
      const StyledOriginalComponent = React.useMemo(
        () =>
          applyRnCSS(
            C,
            (O) => (OriginalComponent = O || OriginalComponent),
          )(...styles),
        [
          C,
          OriginalComponent,
          styles
            .flat()
            .map((e: any) => (typeof e === "function" ? e.toString() : e)),
        ],
      );
      return <StyledOriginalComponent {...args[0]} />;
    }
    return <C {...(args[0] || {})} />;
  };
  styledComponent.cva = (arg: CVA<P>) => {
    cva = arg;
  };
  return styledComponent;
};

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
styled.Text = styled((props: any) => (
  <RNText {...props} style={fixFontStyle(props.style)} />
));
styled.TextInput = styled((props: any) => (
  <RNTextInput {...props} style={fixFontStyle(props.style)} />
));
styled.TouchableHighlight = styled(RNTouchableHighlight);
styled.TouchableNativeFeedback = styled(RNTouchableNativeFeedback);
styled.TouchableOpacity = styled(RNTouchableOpacity);
styled.TouchableWithoutFeedback = styled(RNTouchableWithoutFeedback);
styled.View = styled(RNView);

export const css = (...args: TemplatedParameters | TemplatedParameters[]) => {
  if (args[0]?.[0] instanceof Array) {
    const first = args.shift() as TemplatedParameters;
    return [
      (args as TemplatedParameters[]).reduce(
        (acc, curr) => {
          acc[acc.length - 1] += curr[0][0];
          acc.push(...curr[0].slice(1));
          return acc;
        },
        [...first[0]],
      ) as any,
      ...first.slice(1),
      ...(args as TemplatedParameters[]).map((c) => c.slice(1)).flat(),
    ] as TemplatedParameters;
  }
  return args as TemplatedParameters;
};

export default styled;

function applyRnCSS<P extends { style?: S }, S>(
  C: React.FunctionComponent<P>,
  component: (C?: React.ComponentType<P>) => React.ComponentType<P>,
) {
  return (...args: TemplatedParameters) => {
    const templated = useTemplated(
      args,
      Platform.OS,
      Platform.OS !== "web" && /var\(--[^),]+/g.exec(args[0].join(","))
        ? (React.useContext(SharedValue) as any) || {}
        : {},
    );
    if (/&:active/.test(args[0].join(","))) {
      return rnCSS((props: P) => {
        const {
          onPressIn,
          onPressOut,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _onResponderStart,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _onResponderRelease,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _onStartShouldSetResponder,
          ...rest
        } = props as any;
        if (component() === RNPressable) {
          component(RNView as any);
        }
        return (
          <RNPressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <RNView>
              <C {...rest} />
            </RNView>
          </RNPressable>
        );
      })(...templated);
    }
    return rnCSS(C)(...templated);
  };
}
