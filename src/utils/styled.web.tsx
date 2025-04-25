import React from "react";
import styled from "styled-components";

export default (C: Parameters<typeof styled>[0]) =>
  styled(
    React.forwardRef((props, ref) => {
      const innerRef = React.useRef<any>(null);
      React.useImperativeHandle(ref, () => innerRef.current!, []);

      const onRef = (ref: any) => {
        if (typeof (props as any)?.className === "string") {
          ref.setAttribute("class", (props as any).className);
        }
        innerRef.current = ref;
      };

      return <C {...props} ref={onRef} />;
    }),
  );

export const SharedValue = {};
