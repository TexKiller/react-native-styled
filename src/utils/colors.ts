import parse from "color-parse";
import space from "color-space";

const toRgb: Record<string, (c: any) => number[]> = {
  cmy: space.cmy.rgb,
  cmyk: space.cmyk.rgb,
  coloroid: (c) => space.xyz.rgb(space.coloroid.xyz(c)),
  cubehelix: space.cubehelix.rgb,
  hcg: space.hcg.rgb,
  hcy: space.hcy.rgb,
  hpluv: (c) => space.xyz.rgb(space.hpluv.xyz(c)),
  hsi: space.hsi.rgb,
  hsl: space.hsl.rgb,
  hsluv: (c) => space.xyz.rgb(space.hsluv.xyz(c)),
  hsp: space.hsp.rgb,
  hsv: space.hsv.rgb,
  hwb: space.hwb.rgb,
  jpeg: space.jpeg.rgb,
  lab: (c) => space.xyz.rgb(space.lab.xyz(c)),
  labh: (c) => space.xyz.rgb(space.labh.xyz(c)),
  lchab: (c) => space.xyz.rgb(space.lchab.xyz(c)),
  lchuv: (c) => space.xyz.rgb(space.lchuv.xyz(c)),
  lms: (c) => space.xyz.rgb(space.lms.xyz(c)),
  luv: (c) => space.xyz.rgb(space.luv.xyz(c)),
  lrgb: space.lrgb.rgb,
  munsell: (c) => space.xyz.rgb(space.coloroid.xyz(space.munsell.coloroid(c))),
  osaucs: (c) => space.xyz.rgb(space.osaucs.xyz(c)),
  oklab: (c) => space.xyz.rgb(space.oklab.xyz(c)),
  oklch: (c) => space.xyz.rgb(space.lchab.xyz(c)),
  rgb: (c) => c,
  tsl: space.tsl.rgb,
  ucs: (c) => space.xyz.rgb(space.ucs.xyz(c)),
  uvw: (c) => space.xyz.rgb(space.uvw.xyz(c)),
  xvycc: space.xvycc.rgb,
  xyz: space.xyz.rgb,
  xyy: (c) => space.xyz.rgb(space.xyy.xyz(c)),
  ycbcr: space.ycbcr.rgb,
  yccbccrc: space.yccbccrc.rgb,
  ycgco: space.ycgco.rgb,
  ydbdr: space.ydbdr.rgb,
  yes: space.yes.rgb,
  yiq: space.yiq.rgb,
  ypbpr: space.ypbpr.rgb,
  yuv: space.yuv.rgb,
};

const colorRegExp = new RegExp(
  `(?<=^|\\s)(${Object.keys(toRgb).join("|")})\\([^)]*\\)`,
  "gi",
);

export const parseColors = (styles: string) =>
  styles.replace(colorRegExp, (c, s) => {
    const color = parse(c);
    const rgb = toRgb[s](color.values);
    return `rgba(${rgb.join(",")},${color.alpha})`;
  });
