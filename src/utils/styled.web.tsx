import React from "react";
import styled from "styled-components";

export default (C: Parameters<typeof styled>[0]) =>
  styled(
    React.forwardRef((props, ref) => {
      const onRef = (r: any) => {
        if (r) {
          let className = r.getAttribute("class") || "";
          if (typeof (props as any)?.className === "string") {
            className += " " + (props as any).className;
          }
          r.setAttribute(
            "class",
            className.replace(/(?<=^|\s)css-[^ ]*\s/, "").trim(),
          );
          if (typeof ref === "function") {
            ref(r);
          } else if (ref) {
            ref.current = r;
          }
        }
      };

      return <C {...props} ref={onRef} />;
    }),
  );

export const SharedValue = {};
