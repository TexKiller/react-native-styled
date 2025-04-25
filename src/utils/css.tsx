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
import styled, { SharedValue, TemplatedParameters } from "./styled";
import { useTemplated } from "./templated";

export const css = (
  ...args:
    | TemplatedParameters
    | (
        | TemplatedParameters
        | ((
            ...args: [
              TemplatedParameters[0] | undefined,
              ...(TemplatedParameters[1] | undefined)[],
            ]
          ) => TemplatedParameters)
      )[]
) => {
  if (args[0] instanceof Function || args[0][0] instanceof Array) {
    const templated: TemplatedParameters[] = args.map((arg) =>
      arg instanceof Function ? (arg as any)() : arg,
    );
    if (templated.length === 1) {
      return templated[0];
    }
    const first = templated.shift()!;
    return [
      templated.reduce(
        (acc, curr) => {
          acc[acc.length - 1] += curr[0][0];
          acc.push(...curr[0].slice(1));
          return acc;
        },
        [...first[0]],
      ) as any,
      ...first.slice(1),
      ...templated.map((c) => c.slice(1)).flat(),
    ] as TemplatedParameters;
  }
  return args as TemplatedParameters;
};

export const applyStyled =
  <P extends { style?: S }, S = P["style"]>(
    C: React.ComponentType<P>,
    component: (C?: React.ComponentType<P>) => React.ComponentType<P>,
  ) =>
  (...args: TemplatedParameters) => {
    if (Platform.OS === "web") {
      const Component = React.forwardRef<any, any>((props, ref) => (
        <C {...({ ...props, ref, testId: props.className } as any)} />
      ));
      if (args[0].length === 1 && !args[0][0]) {
        return Component;
      }
      return styled(Component)(...args);
    }
    const templated = useTemplated(
      args,
      (/var\(--[^),]+/g.exec(args[0].join(",")) &&
        (React.useContext(SharedValue) as any)) ||
        {},
    );
    if (templated[0].length === 1 && !templated[0][0]) {
      return C;
    }
    if (!/&:(active|focus)/.test(args[0].join(","))) {
      return styled(C)(...templated);
    }
    return styled((props: P) => {
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
        !onPress &&
        !onPressIn &&
        !onPressOut &&
        ((!onFocus && !onBlur) || (component() as any) === RNTextInput)
      ) {
        return <C {...rest} onFocus={onFocus} onBlur={onBlur} />;
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
  };
