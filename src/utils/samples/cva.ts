export type PropsSample = {
  color: "red" | "blue" | "green" | "yellow" | "purple";
  disabled: "true";
};
export type VariantPropsSample = {
  color?: "red" | "blue" | "green" | "yellow" | "purple";
  disabled?: "true" | boolean;
};
export type ValidCVASample = {
  variants: {
    color: {
      red: any;
      blue: any;
    };
    disabled: {
      true: any;
    };
  };
  compoundVariants: [
    {
      color: ["green", "yellow"];
      css: any;
    },
  ];
  defaultVariants: {
    color: "purple";
  };
};

export type InvalidCVASample = {
  variants: {
    color: {
      black: any;
    };
  };
  compoundVariants: [];
  defaultVariants: object;
};
