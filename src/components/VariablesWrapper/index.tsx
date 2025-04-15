import React from "react";
import { SharedValue } from "rn-css";
import { camel2kebab } from "../../utils/string";

function VariablesWrapper({
  newVars,
  OriginalComponent,
  ...props
}: Readonly<{
  newVars: [string, any][];
  OriginalComponent: React.ComponentType<any>;
  [k: string]: any;
}>) {
  const oldVariables: any = React.useContext(SharedValue);
  const variables: Record<string, any> = React.useMemo(
    () => ({
      ...(oldVariables || {}),
      ...newVars.reduce(
        (s, [k, v]) => ({
          ...s,
          [camel2kebab(k).substring(1)]: v,
        }),
        {},
      ),
    }),
    [oldVariables, newVars],
  );
  return (
    <SharedValue.Provider value={variables}>
      <OriginalComponent {...props} />
    </SharedValue.Provider>
  );
}

export default VariablesWrapper;
