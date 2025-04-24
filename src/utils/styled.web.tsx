import React from "react";
import styled from "styled-components";

export default (C: Parameters<typeof styled>[0]) =>
  styled(
    React.forwardRef((props, ref) => {
      const innerRef = React.useRef<any>(null);
      React.useImperativeHandle(ref, () => innerRef.current!, []);
      if (innerRef.current && (props as any)?.className) {
        innerRef.current.setNativeProps({
          className: (props as any).className,
        });
      }
      return <C {...props} ref={ref} />;
    }),
  );

export const SharedValue = {};
