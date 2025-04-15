export const camel2kebab = (str: string) => {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
};
