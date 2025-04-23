import React from "react";
import {
  Keyboard,
  Platform,
  Pressable as RNPressable,
  TextInput as RNTextInput,
  TouchableHighlight as RNTouchableHighlight,
  TouchableOpacity as RNTouchableOpacity,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  View as RNView,
} from "react-native";
import rnCSS, { SharedValue } from "rn-css";
import { useTemplated } from "./templated";

type TemplatedParameters = Parameters<ReturnType<typeof rnCSS>>;

export const css = (...args: TemplatedParameters | TemplatedParameters[]) => {
  if (args[0]?.[0] instanceof Array) {
    if (args.length === 1) {
      return args[0] as TemplatedParameters;
    }
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

export const applyRnCSS = <P extends { style?: S }, S>(
  C: React.FunctionComponent<P>,
  component: (C?: React.ComponentType<P>) => React.ComponentType<P>,
) => {
  return (...args: TemplatedParameters) => {
    const templated = useTemplated(
      args,
      Platform.OS,
      Platform.OS !== "web" && /var\(--[^),]+/g.exec(args[0].join(","))
        ? (React.useContext(SharedValue) as any) || {}
        : {},
    );
    if (/&:(active|focus)/.test(args[0].join(","))) {
      return rnCSS((props: P) => {
        const {
          onPress,
          onPressIn,
          onPressOut,
          onFocus,
          onBlur,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _onResponderStart,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _onResponderRelease,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _onStartShouldSetResponder,
          ...rest
        } = props as any;
        if (
          Platform.OS === "web" ||
          (!onPress &&
            !onPressIn &&
            !onPressOut &&
            ((!onFocus && !onBlur) || (component() as any) === RNTextInput))
        ) {
          return (
            <C
              {...rest}
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          );
        }
        if (
          [
            RNPressable,
            RNTouchableHighlight,
            RNTouchableOpacity,
            RNTouchableWithoutFeedback,
          ].includes(component() as any)
        ) {
          component(RNView as any);
        }
        let newOnPressIn = onPressIn;
        let ref: React.RefObject<RNTextInput | null> | undefined;
        if ((component() as any) === RNTextInput) {
          rest.onFocus = onFocus;
          rest.onBlur = onBlur;
        } else if (onFocus || onBlur) {
          ref = React.useRef<RNTextInput>(null);
          newOnPressIn = function (this: any, ...args: any[]) {
            Keyboard.dismiss();
            ref!.current?.focus();
            return onPressIn?.apply(this, args);
          };
        }
        return (
          <RNPressable
            onPress={onPress}
            onPressIn={newOnPressIn}
            onPressOut={onPressOut}
          >
            {ref && (
              <RNTextInput
                ref={ref}
                style={{
                  width: 1,
                  height: 1,
                  position: "absolute",
                  top: -999999,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                showSoftInputOnFocus={false}
              />
            )}
            <RNView>
              <C {...rest} />
            </RNView>
          </RNPressable>
        );
      })(...templated);
    }
    return rnCSS(C)(...templated);
  };
};
