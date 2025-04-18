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

type StyledComponent<P> = {
  (...args: TemplatedParameters[]): StyledComponent<P>;
  (...args: TemplatedParameters): StyledComponent<P>;
  (props: P & { css?: ReturnType<typeof css> }): React.ReactNode;
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
        if (
          !key.startsWith("webhover") &&
          !key.startsWith("webactive") &&
          !key.startsWith("-")
        ) {
          continue;
        }
        if (key.startsWith("-")) {
          variables += camel2kebab(key) + ": " + style[key] + ";";
        } else if (key.startsWith("webhover")) {
          hover += style[key] + "§";
        } else {
          active += style[key] + "§";
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
  return (...args: any[]): any => {
    if (args[0] instanceof Array) {
      if (args[0][0] instanceof Array) {
        if (args.length === 1) {
          args = args[0];
        } else {
          return styled(
            applyRnCSS(
              C,
              (O) => (OriginalComponent = O || OriginalComponent),
            )(...(args[0] as TemplatedParameters)),
          )(...args.slice(1));
        }
      }
      return styled(
        applyRnCSS(
          C,
          (O) => (OriginalComponent = O || OriginalComponent),
        )(...(args as TemplatedParameters)),
      );
    }
    if (args[0]?.css) {
      const StyledOriginalComponent = React.useMemo(
        () =>
          args[0].css[0][0] instanceof Array
            ? styled(
                applyRnCSS(
                  C,
                  (O) => (OriginalComponent = O || OriginalComponent),
                )(...(args[0].css[0] as TemplatedParameters)),
              )(...(args[0].css.slice(1) as TemplatedParameters[]))
            : applyRnCSS(
                C,
                (O) => (OriginalComponent = O || OriginalComponent),
              )(...(args[0].css as TemplatedParameters)),
        [
          C,
          OriginalComponent,
          args[0].css
            .flat()
            .flat()
            .map((e: any) => (typeof e === "function" ? e.toString() : e)),
        ],
      );
      return <StyledOriginalComponent {...args[0]} />;
    }
    return <C {...(args[0] || {})} />;
  };
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

export const css = (...args: TemplatedParameters) => args;

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
