import React from "react";

const WebSelectors = ({
  OriginalComponent,
  variables,
  hover,
  active,
  ...props
}: {
  OriginalComponent: React.ComponentType<any>;
  [k: string]: any;
}) => {
  const ref = React.useRef<typeof OriginalComponent>(null);
  const [hash, setHash] = React.useState("");
  React.useEffect(() => {
    setHash(
      (ref.current as any).className
        .split(" ")
        .find((c: string) => c.startsWith("css-")) ||
        (ref.current as any).className,
    );
  }, [setHash]);
  (props as any).ref = ref;
  return (
    <>
      <style>
        {(variables &&
          `
            .${hash} {
              ${variables}
            }
          `) +
          (hover &&
            `
              .${hash}:hover {
                ${hover}
              }
            `) +
          (active &&
            `
            .${hash}:active {
              ${active}
            }
          `)}
      </style>
      <OriginalComponent {...props} />
    </>
  );
};

export default WebSelectors;
