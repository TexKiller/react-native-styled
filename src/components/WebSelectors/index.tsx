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
  const hash = React.useMemo(
    () => "id" + Math.random().toString(36).substring(2, 15),
    [],
  );
  return (
    <>
      <style id={hash}>
        {(variables &&
          `
            #${hash} + * {
              ${variables}
            }
          `) +
          (hover &&
            `
              #${hash} + *:hover {
                ${hover}
              }
            `) +
          (active &&
            `
              #${hash} + *:active {
                ${active}
              }
            `)}
      </style>
      <OriginalComponent {...props} />
    </>
  );
};

export default WebSelectors;
