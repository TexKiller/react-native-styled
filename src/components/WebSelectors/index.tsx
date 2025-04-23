import React from "react";

const WebSelectors = ({
  OriginalComponent,
  variables,
  hover,
  active,
  focus,
  media,
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
            #${hash} + *:not(style),
            #${hash} + style + *:not(style),
            #${hash} + style + style + *:not(style),
            #${hash} + style + style + style + *:not(style),
            #${hash} + style + style + style + style + *:not(style),
            #${hash} + style + style + style + style + style + *:not(style),
            #${hash} + style + style + style + style + style + style + *:not(style),
            #${hash} + style + style + style + style + style + style + style + *:not(style),
            #${hash} + style + style + style + style + style + style + style + style + *:not(style),
            #${hash} + style + style + style + style + style + style + style + style + style + *:not(style)
            {
              ${variables}
            }
          `) +
          (hover &&
            `
              #${hash} + *:hover:not(style),
              #${hash} + style + *:hover:not(style),
              #${hash} + style + style + *:hover:not(style),
              #${hash} + style + style + style + *:hover:not(style),
              #${hash} + style + style + style + style + *:hover:not(style),
              #${hash} + style + style + style + style + style + *:hover:not(style),
              #${hash} + style + style + style + style + style + style + *:hover:not(style),
              #${hash} + style + style + style + style + style + style + style + *:hover:not(style),
              #${hash} + style + style + style + style + style + style + style + style + *:hover:not(style),
              #${hash} + style + style + style + style + style + style + style + style + style + *:hover:not(style)
              {
                ${hover}
              }
            `) +
          (active &&
            `
              #${hash} + *:active:not(style),
              #${hash} + style + *:active:not(style),
              #${hash} + style + style + *:active:not(style),
              #${hash} + style + style + style + *:active:not(style),
              #${hash} + style + style + style + style + *:active:not(style),
              #${hash} + style + style + style + style + style + *:active:not(style),
              #${hash} + style + style + style + style + style + style + *:active:not(style),
              #${hash} + style + style + style + style + style + style + style + *:active:not(style),
              #${hash} + style + style + style + style + style + style + style + style + *:active:not(style)
              {
                ${active}
              }
            `) +
          (focus &&
            `
              #${hash} + *:focus:not(style),
              #${hash} + style + *:focus:not(style),
              #${hash} + style + style + *:focus:not(style),
              #${hash} + style + style + style + *:focus:not(style),
              #${hash} + style + style + style + style + *:focus:not(style),
              #${hash} + style + style + style + style + style + *:focus:not(style),
              #${hash} + style + style + style + style + style + style + *:focus:not(style),
              #${hash} + style + style + style + style + style + style + style + *:focus:not(style),
              #${hash} + style + style + style + style + style + style + style + style + *:focus:not(style),
              #${hash} + style + style + style + style + style + style + style + style + style + *:focus:not(style)
              {
                ${focus}
              }
            `) +
          (media &&
            `
            ${media
              .replace(
                /§/g,
                `
                  #${hash} + *:not(style),
                  #${hash} + style + *:not(style),
                  #${hash} + style + style + *:not(style),
                  #${hash} + style + style + style + *:not(style),
                  #${hash} + style + style + style + style + *:not(style),
                  #${hash} + style + style + style + style + style + *:not(style),
                  #${hash} + style + style + style + style + style + style + *:not(style),
                  #${hash} + style + style + style + style + style + style + style + *:not(style),
                  #${hash} + style + style + style + style + style + style + style + style + *:not(style),
                  #${hash} + style + style + style + style + style + style + style + style + style + *:not(style)
                `,
              )
              .replace(/---/g, "--")}
          `)}
      </style>
      <OriginalComponent {...props} />
    </>
  );
};

export default WebSelectors;
