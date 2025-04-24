import React from "react";

function VariablesWrapper({
  OriginalComponent,
  ...props
}: Readonly<{
  newVars: [string, any][];
  OriginalComponent: React.ComponentType<any>;
  [k: string]: any;
}>) {
  return <OriginalComponent {...props} />;
}

export default VariablesWrapper;
