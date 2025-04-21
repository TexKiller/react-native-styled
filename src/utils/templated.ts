export const useTemplated = (
  args: Parameters<ReturnType<typeof import("rn-css").default>>,
  platform: "ios" | "android" | "windows" | "macos" | "web",
  variables: Record<string, typeof args>,
) => {
  const chunks = [...args[0]] as string[];
  const functs = args.slice(1) as (typeof args)[1][];
  for (let i = 0; i < functs.length; i++) {
    if (typeof functs[i] === "string") {
      const s = functs.splice(i, 1)[0] as string;
      chunks[i] += s;
      chunks[i] += chunks.splice(i + 1, 1)[0];
      i--;
    }
  }
  let hoverCount = 0;
  let activeCount = 0;
  for (let i = 0; i < chunks.length; i++) {
    if (typeof chunks[i] !== "string") {
      continue;
    }
    if (platform === "web") {
      // on web only add a dash to variables
      chunks[i] = chunks[i].replace(/--/g, "---").replace(/var\(-/g, "var(");
      // and rename hover, active, calc and outline
      chunks[i] = chunks[i].replace(
        /&:hover\s*{([^}]*)}/g,
        (_, c) => `webhover${++hoverCount}: ${c.replace(/;/g, "§")};`,
      );
      chunks[i] = chunks[i].replace(
        /&:active\s*{([^}]*)}/g,
        (_, c) => `webactive${++activeCount}: ${c.replace(/;/g, "§")};`,
      );
      chunks[i] = chunks[i].replace(/calc\(/g, "webcalc(");
      chunks[i] = chunks[i].replace(
        /outline(-|:)/g,
        (_, c) => `weboutline${c}`,
      );
      continue;
    }
    chunks[i] = chunks[i].replace(
      /(?<!styled-)(box-|text-)shadow:/g,
      (m) => "styled-" + m,
    );
    const varRegExp = /var\(--[^),]+/g;
    const varMatch = varRegExp.exec(chunks[i]);
    if (!varMatch) {
      continue;
    }
    const varName = varMatch[0].slice(6).trim();
    chunks.splice(
      i + 1,
      0,
      chunks[i].slice(varMatch.index + varMatch[0].length).trim(),
    );
    if (chunks[i + 1].startsWith(",")) {
      chunks[i + 1] = chunks[i + 1].slice(1).trim();
    }
    chunks[i] = chunks[i].slice(0, varMatch.index);
    let varStrings: string[] = [];
    let varFuncts: typeof functs = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const closing = chunks[i + 1].indexOf(")");
      if (closing >= 0) {
        const varValue = chunks[i + 1].slice(0, closing).trim();
        if (varValue.length) {
          varStrings.push(varValue);
        }
        chunks[i + 1] = chunks[i + 1].slice(closing + 1);
        break;
      }
      varStrings.push(...chunks.splice(i + 1, 1));
      varFuncts.push(...functs.splice(i + 1, 1));
    }
    if (Object.keys(variables).includes(varName)) {
      varStrings = [variables[varName] as any];
      varFuncts = [];
    }
    if (!varStrings.length) {
      varStrings = ["variables" + Object.keys(variables).join("")];
    }
    chunks[i] += varStrings.shift();
    for (let j = 0; j < varStrings.length; j++) {
      chunks.splice(i + j + 1, 0, varStrings[j]);
      functs.splice(i + j + 1, 0, varFuncts[j]);
    }
    chunks[i + varStrings.length] += chunks.splice(
      i + varStrings.length + 1,
      1,
    )[0];
    i--;
  }
  return [chunks, functs] as any as [(typeof args)[0], (typeof args)[1]];
};
