/*********************************************************************/
/* Functions to convert frames from rgb to yuv and false yuv         */
/*********************************************************************/

export function rgb2yuv(rgb)
{
  let ret = new Uint8Array(3);
  ret[0] =       0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]; // Y
  ret[1] = 128 - 0.169 * rgb[0] - 0.331 * rgb[1] + 0.500 * rgb[2]; // U
  ret[2] = 128 + 0.500 * rgb[0] - 0.419 * rgb[1] - 0.081 * rgb[2]; // V
  return ret;
}

export function frame_rgb2yuv(data)
{
  const length = data.length;
  let ret = new Array(length);
  for ( let i = 0; i < length; i++ )
    ret[i] = rgb2yuv(data[i]);
  return ret;
}

export function frame_get_compn(data, compn)
{
  const length = data.length;
  let ret = new Uint8Array(length);
  for ( let i = 0; i < length; i++ )
    ret[i] = data[i][compn];
  return ret;
}

export function false_yuv(yuv, compn)
{
  const val = yuv[compn];
  let ret = new Uint8Array(3);
  if ( compn === 0 )
  {
    ret[0] = val;
    ret[1] = val;
    ret[2] = val;
  }
  else if ( compn === 1 )
  {
    ret[0] = 0;
    ret[1] = 255 - val;
    ret[2] = val;
  }
  else if ( compn === 2 )
  {
    ret[0] = val;
    ret[1] = 255 - val;
    ret[2] = 0;
  }
  return ret;
}

// export function frame_false_yuv(data, compn)
// {
//   const length = data.length;
//   let ret = new Array(length);
//   for ( let i = 0; i < length; i++ )
//     ret[i] = false_yuv(data[i], compn);
//   return ret;
// }
