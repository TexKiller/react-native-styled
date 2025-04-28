import { parseColors } from "./colors";

export const parseTemplated = (
  args: Parameters<ReturnType<typeof import("./styled").default>>,
) => {
  const chunks = [...args[0]] as string[];
  const functs = args.slice(1) as (typeof args)[1][];
  for (let i = 0; i < chunks.length; i++) {
    if (typeof chunks[i] !== "string") {
      continue;
    }
    const pieces = chunks[i]
      .replace(
        /((^|;)[^:]+:\s*)([^;]*)(?=var\(--[^)]+\))/gi,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (...[_, prop, __, before]: string[]) => `${prop}§${before}`,
      )
      .split("§");
    const chunkPieces = pieces.map((piece, i) =>
      !i
        ? piece
        : piece.replace(
            /^[^;]*(;|$)/gi,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (...[_, end]: string[]) => end,
          ),
    );
    const functsPieces = pieces
      .slice(1)
      .map(
        (piece) =>
          piece
            .replace(
              /(?<=^[^;]+)(;|$)/gi,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (...[_, end]: string[]) => `§${end}`,
            )
            .split("§")[0],
      )
      .map(
        (piece) =>
          ({ shared }: any) =>
            parseColors(
              piece.replace(
                /var\(--([^)]*)(,[^)]*|)\)/gi,
                (_, varName, def) => shared[varName] || def?.substring(1) || "",
              ),
            ),
      );
    chunks.splice(i, 1, ...chunkPieces);
    functs.splice(i, 0, ...functsPieces);
    i += functsPieces.length;
  }
  for (let i = 0; i < chunks.length; i++) {
    if (typeof chunks[i] !== "string") {
      continue;
    }
    chunks[i] = parseColors(chunks[i]).replace(
      /(?<!styled-)(box-|text-)shadow:/g,
      (m) => "styled-" + m,
    );
  }
  return [chunks, ...functs] as any as typeof args;
};
