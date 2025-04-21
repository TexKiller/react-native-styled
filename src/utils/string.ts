export const camel2kebab = (str: string) => {
  return str.replace(/[A-Z0-9]/g, (m) => "-" + m.toLowerCase());
};
