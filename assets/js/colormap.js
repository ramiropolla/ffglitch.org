// based on code from https://github.com/yuki-koyama/tinycolormap.git
// Copyright (c) 2018-2020 Yuki Koyama
// MIT License

const JetColor = [
  [ 0.0, 0.0, 0.5 ],
  [ 0.0, 0.0, 1.0 ],
  [ 0.0, 0.5, 1.0 ],
  [ 0.0, 1.0, 1.0 ],
  [ 0.5, 1.0, 0.5 ],
  [ 1.0, 1.0, 0.0 ],
  [ 1.0, 0.5, 0.0 ],
  [ 1.0, 0.0, 0.0 ],
  [ 0.5, 0.0, 0.0 ],
];
let JetColor_LUT;

function interpolate(val, array, offset)
{
  const a = val * (array.length - 1);
  const f = Math.floor(a);
  const c = Math.ceil(a);
  const t = a - f;
  const c0 = array[f];
  const c1 = array[c];
  const interpolated = (1.0 - t) * c0[offset] + t * c1[offset];
  return Math.round(interpolated * 255);
}
export function log_colormap(min, max, val)
{
  if ( JetColor_LUT === undefined )
    JetColor_LUT = new Array(max - min);
  let rgb_val = JetColor_LUT[val - min];
  if ( rgb_val === undefined )
  {
    const array = JetColor;
    const log_min = -Math.log(-min);
    const log_max =  Math.log( max);
    const sign = (val < 0) ? -1 : 1;
    const log_val = (val === 0) ? 0 : sign * Math.log(sign * val);
    const norm = (log_val - log_min) / (log_max - log_min);
    const r = interpolate(norm, array, 0);
    const g = interpolate(norm, array, 1);
    const b = interpolate(norm, array, 2);
    const y = Math.round(0.299*r + 0.587*g + 0.114*b);
    rgb_val = [ r, g, b, y ];
    JetColor_LUT[val - min] = rgb_val;
  }
  return rgb_val;
}
