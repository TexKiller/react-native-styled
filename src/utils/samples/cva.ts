export type PropsSample = {
  color: "red" | "blue" | "green" | "yellow" | "purple";
};
export type ValidCVASample = {
  variants: {
    color: {
      red: [];
      blue: [];
    };
  };
  compoundVariants: [
    {
      color: ["green", "yellow"];
      css: [];
    },
  ];
  defaultVariants: {
    color: "purple";
  };
};

export type InvalidCVASample = {
  variants: {
    color: {
      black: [];
    };
  };
  compoundVariants: [];
  defaultVariants: object;
};
