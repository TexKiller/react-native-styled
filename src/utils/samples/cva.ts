export type PropsSample = {
  color: "red" | "blue" | "green" | "yellow" | "purple";
};
export type ValidCVASample = {
  variants: {
    color: {
      red: any;
      blue: any;
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
