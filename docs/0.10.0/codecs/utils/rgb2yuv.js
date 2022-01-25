/*********************************************************************/
/* Functions to convert frames from rgb to yuv and false yuv         */
/*********************************************************************/

// https://web.archive.org/web/20180423091842/http://www.equasys.de/colorconversion.html

/*********************************************************************/
export function rgb_to_yuv(rgb)
{
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  const yuv = new Uint8ClampedArray(3);
  yuv[0] = Math.round(      0.299 * r + 0.587 * g + 0.114 * b); // Y
  yuv[1] = Math.round(128 - 0.169 * r - 0.331 * g + 0.500 * b); // U
  yuv[2] = Math.round(128 + 0.500 * r - 0.419 * g - 0.081 * b); // V
  return yuv;
}

/*********************************************************************/
export function yuv_to_rgb(yuv)
{
  const y = yuv[0];
  const u = yuv[1] - 128;
  const v = yuv[2] - 128;
  const rgb = new Uint8ClampedArray(3);
  rgb[0] = Math.round(y +             1.400 * v); // R
  rgb[1] = Math.round(y - 0.343 * u - 0.711 * v); // G
  rgb[2] = Math.round(y + 1.765 * u            ); // B
  return rgb;
}

/*********************************************************************/
/* NOTE: false yuv is packed rgb */
function yuv_to_false_y(val)
{
  const rgb = new Uint8Array(3);
  rgb[0] = val;
  rgb[1] = val;
  rgb[2] = val;
  return rgb;
}

function yuv_to_false_u(val)
{
  const rgb = new Uint8Array(3);
  rgb[0] = 0;
  rgb[1] = 255 - val;
  rgb[2] = val;
  return rgb;
}

function yuv_to_false_v(val)
{
  const rgb = new Uint8Array(3);
  rgb[0] = val;
  rgb[1] = 255 - val;
  rgb[2] = 0;
  return rgb;
}

/*********************************************************************/
/* packed colorspace conversion */

/* packed rgb -> packed yuv444 */
function rgb___yuv444(src, width, height)
{
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
      dst[i_offset + j] = rgb_to_yuv(src[i_offset + j]);
  }
  return dst;
}

/* packed yuv444 -> packed rgb */
function yuv444___rgb(src, width, height)
{
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
      dst[i_offset + j] = yuv_to_rgb(src[i_offset + j]);
  }
  return dst;
}

/* packed rgb (or false_yuv) to rgb string */
function rgb___rgb_str(src, width, height)
{
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
    {
      const rgb = src[i_offset + j];
      dst[i_offset + j] = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return dst;
}

/* packed rgb (or false_yuv) compn to rgb string */
function rgb_compn___rgb_str(src, width, height, compn)
{
  src = src[0]; // src has only one component
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
    {
      const rgb = new Uint8Array(3);
      rgb[compn] = src[i_offset + j];
      dst[i_offset + j] = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return dst;
}

/*********************************************************************/
/* packed/planar conversion */

/* packed -> planar */
function packed___planar_3(src, width, height)
{
  const length = (width * height);
  const dst = [
    new Uint8Array(length),
    new Uint8Array(length),
    new Uint8Array(length),
  ];
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
    {
      dst[0][i_offset + j] = src[i_offset + j][0];
      dst[1][i_offset + j] = src[i_offset + j][1];
      dst[2][i_offset + j] = src[i_offset + j][2];
    }
  }
  return dst;
}

/* planar -> packed */
function planar___packed_3(src, width, height)
{
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
    {
      const yuv = new Uint8Array(3);
      yuv[0] = src[0][i_offset + j];
      yuv[1] = src[1][i_offset + j];
      yuv[2] = src[2][i_offset + j];
      dst[i_offset + j] = yuv;
    }
  }
  return dst;
}

/*********************************************************************/
/* planar channel extraction */

function extract_planar_compn(src, width, height, compn)
{
  return [ new Uint8Array(src[compn]) ];
}

function y___yuv444p(src, width, height)
{
  const length = (width * height);
  const dst = [
    new Uint8Array(src[0]),
    new Uint8Array(length),
    new Uint8Array(length),
  ];
  dst[1].fill(0x80);
  dst[2].fill(0x80);
  return dst;
}

/*********************************************************************/
/* planar yuv {up,sub}sampling */

/* planar yuv subsampling (444 -> 440) */
function yuv444p___yuv440p(src, width, height)
{
  const length = (width * height);
  const dst = [
    new Uint8Array(src[0]),
    new Uint8Array(length / 2),
    new Uint8Array(length / 2),
  ];
  for ( let i = 0; i < height / 2; i++ )
  {
    const i_offset_0 = ((i * 2) + 0) * width;
    const i_offset_1 = ((i * 2) + 1) * width;
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
    {
      dst[1][i_offset + j] = Math.round((src[1][i_offset_0 + j] + src[1][i_offset_1 + j]) / 2);
      dst[2][i_offset + j] = Math.round((src[2][i_offset_0 + j] + src[2][i_offset_1 + j]) / 2);
    }
  }
  return dst;
}

/* planar yuv subsampling (444 -> 420) */
function yuv444p___yuv420p(src, width, height)
{
  const length = (width * height);
  const dst = [
    new Uint8Array(src[0]),
    new Uint8Array(length / 4),
    new Uint8Array(length / 4),
  ];
  for ( let i = 0; i < height / 2; i++ )
  {
    const i_offset_0 = ((i * 2) + 0) * width;
    const i_offset_1 = ((i * 2) + 1) * width;
    const i_offset = (i * width / 2);
    for ( let j = 0; j < width / 2; j++ )
    {
      const j_0 = j * 2;
      const j_1 = j_0 + 1;
      dst[1][i_offset + j] = Math.round((src[1][i_offset_0 + j_0] + src[1][i_offset_0 + j_1]
                                       + src[1][i_offset_1 + j_0] + src[1][i_offset_1 + j_1]) / 4);
      dst[2][i_offset + j] = Math.round((src[2][i_offset_0 + j_0] + src[2][i_offset_0 + j_1]
                                       + src[2][i_offset_1 + j_0] + src[2][i_offset_1 + j_1]) / 4);
    }
  }
  return dst;
}

/* planar yuv upsampling (440 -> 444) */
function yuv440p___yuv444p(src, width, height)
{
  const length = (width * height);
  const dst = [
    new Uint8Array(src[0]),
    new Uint8Array(length),
    new Uint8Array(length),
  ];
  if ( false )
  {
    // nearest neighbour
    for ( let i = 0; i < height; i++ )
    {
      const i_offset_0 = Math.floor(i / 2) * width;
      const i_offset = (i * width);
      for ( let j = 0; j < width; j++ )
      {
        dst[1][i_offset + j] = src[1][i_offset_0 + j];
        dst[2][i_offset + j] = src[2][i_offset_0 + j];
      }
    }
  }
  else
  {
    // linear interpolation
    for ( let i = 0; i < height; i++ )
    {
      const i_offset_0 = Math.floor(i / 2) * width;
      const i_offset = (i * width);
      for ( let j = 0; j < width; j++ )
      {
        if ( ((i & 1) == 0) || (i == (height - 1)) )
        {
          dst[1][i_offset + j] = src[1][i_offset_0 + j];
          dst[2][i_offset + j] = src[2][i_offset_0 + j];
        }
        else
        {
          dst[1][i_offset + j] = Math.round((src[1][i_offset_0 + j] + src[1][i_offset_0 + j + 1]) / 2);
          dst[2][i_offset + j] = Math.round((src[2][i_offset_0 + j] + src[2][i_offset_0 + j + 1]) / 2);
        }
      }
    }
  }
  return dst;
}

/* planar yuv upsampling (420 -> 444) */
function yuv420p___yuv444p(src, width, height)
{
  const length = (width * height);
  const dst = [
    new Uint8Array(src[0]),
    new Uint8Array(length),
    new Uint8Array(length),
  ];
  if ( true )
  {
    // nearest neighbour
    for ( let i = 0; i < height; i++ )
    {
      const i_offset_0 = Math.floor(i / 2) * (width / 2);
      const i_offset = (i * width);
      for ( let j = 0; j < width; j++ )
      {
        const j_offset = Math.floor(j / 2);
        dst[1][i_offset + j] = src[1][i_offset_0 + j_offset];
        dst[2][i_offset + j] = src[2][i_offset_0 + j_offset];
      }
    }
  }
  else
  {
    // linear interpolation
    for ( let i = 0; i < height; i++ )
    {
      const i_offset_0 = Math.floor(i / 2) * (width / 2);
      const i_offset = (i * width);
      for ( let j = 0; j < width; j++ )
      {
        const j_offset = Math.floor(j / 2);
        if ( ((i & 1) == 0) || (i == (height - 1)) )
        {
          dst[1][i_offset + j] = src[1][i_offset_0 + j_offset];
          dst[2][i_offset + j] = src[2][i_offset_0 + j_offset];
        }
        else
        {
          dst[1][i_offset + j] = Math.round((src[1][i_offset_0 + j_offset] + src[1][i_offset_0 + j_offset + 1]) / 2);
          dst[2][i_offset + j] = Math.round((src[2][i_offset_0 + j_offset] + src[2][i_offset_0 + j_offset + 1]) / 2);
        }
      }
    }
  }
  return dst;
}

/*********************************************************************/
/* packed component extraction */

function extract_packed_compn(src, width, height, compn)
{
  const length = (width * height);
  const dst = [ new Uint8Array(length) ];
  const dst0 = dst[0];
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
      dst0[i_offset + j] = src[i_offset + j][compn];
  }
  return dst;
}

// function intract_packed_compn(src, width, height, compn)
// {
//   src = src[0]; // src has only one component
//   const length = (width * height);
//   const dst = new Array(length);
//   for ( let i = 0; i < height; i++ )
//   {
//     const i_offset = (i * width);
//     for ( let j = 0; j < width; j++ )
//     {
//       const rgb = new Uint8Array(3);
//       rgb[compn] = src[i_offset + j];
//       dst[i_offset + j] = rgb;
//     }
//   }
//   return dst;
// }

/*********************************************************************/
/* combinations */

function rgb___yuv444p(src, width, height)
{
  const yuv444 = rgb___yuv444(src, width, height);
  return packed___planar_3(yuv444, width, height);
}

function yuv444p___rgb(src, width, height)
{
  const yuv444 = planar___packed_3(src, width, height);
  return yuv444___rgb(yuv444, width, height);
}

function yuv440p___yuv444(src, width, height)
{
  const yuv444p = yuv440p___yuv444p(src, width, height);
  return planar___packed_3(yuv444p, width, height);
}

function yuv420p___yuv444(src, width, height)
{
  const yuv444p = yuv420p___yuv444p(src, width, height);
  return planar___packed_3(yuv444p, width, height);
}

/*********************************************************************/
/* false yuv */

function yuv444___false_yuv(src, width, height, compn)
{
  const fn = [ yuv_to_false_y, yuv_to_false_u, yuv_to_false_v ][compn];
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
      dst[i_offset + j] = fn(src[i_offset + j][compn]);
  }
  return dst;
}

function yuv444p___false_yuv(src, width, height, compn)
{
  const fn = [ yuv_to_false_y, yuv_to_false_u, yuv_to_false_v ][compn];
  const length = (width * height);
  const dst = new Array(length);
  for ( let i = 0; i < height; i++ )
  {
    const i_offset = (i * width);
    for ( let j = 0; j < width; j++ )
      dst[i_offset + j] = fn(src[i_offset + j]);
  }
  return dst;
}

function false_yuv___rgb(src, width, height)
{
  return src;
}

function yuv444p___false_yuv_str(src, width, height, compn)
{
  const false_yuv = yuv444p___false_yuv(src, width, height, compn);
  return rgb___rgb_str(false_yuv, width, height);
}

/*********************************************************************/
/* dataurl */

function rgb___dataurl(src, width, height, compn)
{
  const img_buffer = new Uint8ClampedArray(width * height * 4);
  for ( let i = 0; i < width * height; i++ )
  {
    img_buffer[i * 4 + 0] = src[i][0];
    img_buffer[i * 4 + 1] = src[i][1];
    img_buffer[i * 4 + 2] = src[i][2];
    img_buffer[i * 4 + 3] = 0xFF;
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const img_data = new ImageData(img_buffer, width, height);
  ctx.putImageData(img_data, 0, 0);
  return canvas.toDataURL();
}

/*********************************************************************/
const convert_size_functions =
{
  "yuv420p => u":           (width, height) => { return { width: width / 2, height: height / 2 } },
  "yuv420p => v":           (width, height) => { return { width: width / 2, height: height / 2 } },
};

/*********************************************************************/
const convert_pixfmt_functions =
{
  /* planar channel extraction */
  "yuv444p => y":           (src, width, height) => extract_planar_compn   (src, width, height, 0),
  "y => yuv444p":           y___yuv444p,
  "yuv420p => y":           (src, width, height) => extract_planar_compn   (src, width, height, 0),
  "yuv420p => u":           (src, width, height) => extract_planar_compn   (src, width, height, 1),
  "yuv420p => v":           (src, width, height) => extract_planar_compn   (src, width, height, 2),

  /* planar yuv {up,sub}sampling */
  "yuv444p => yuv440p":     yuv444p___yuv440p,
  "yuv444p => yuv420p":     yuv444p___yuv420p,
  "yuv440p => yuv444p":     yuv440p___yuv444p,
  "yuv420p => yuv444p":     yuv420p___yuv444p,

  /* combinations */
  "rgb => yuv444p":         rgb___yuv444p,
  "yuv444p => rgb":         yuv444p___rgb,

  /* packed component extraction */
  "rgb => r":               (src, width, height) => extract_packed_compn   (src, width, height, 0),
  "rgb => g":               (src, width, height) => extract_packed_compn   (src, width, height, 1),
  "rgb => b":               (src, width, height) => extract_packed_compn   (src, width, height, 2),
//   "r => rgb":               (src, width, height) => intract_packed_compn   (src, width, height, 0),
//   "g => rgb":               (src, width, height) => intract_packed_compn   (src, width, height, 1),
//   "b => rgb":               (src, width, height) => intract_packed_compn   (src, width, height, 2),

  /* false yuv */
  "yuv444p => false_y":     (src, width, height) => yuv444p___false_yuv    (src[0], width, height, 0),
  "yuv444p => false_u":     (src, width, height) => yuv444p___false_yuv    (src[1], width, height, 1),
  "yuv444p => false_v":     (src, width, height) => yuv444p___false_yuv    (src[2], width, height, 2),
  "y => false_y":           (src, width, height) => yuv444p___false_yuv    (src[0], width, height, 0),
  "u => false_u":           (src, width, height) => yuv444p___false_yuv    (src[0], width, height, 1),
  "v => false_v":           (src, width, height) => yuv444p___false_yuv    (src[0], width, height, 2),
  "false_y => rgb":         (src, width, height) => false_yuv___rgb        (src, width, height),
  "false_u => rgb":         (src, width, height) => false_yuv___rgb        (src, width, height),
  "false_v => rgb":         (src, width, height) => false_yuv___rgb        (src, width, height),

  /* rgb (or false_yuv) str */
  "rgb => rgb_str":         rgb___rgb_str,
  "false_y => rgb_str":     rgb___rgb_str,
  "false_u => rgb_str":     rgb___rgb_str,
  "false_v => rgb_str":     rgb___rgb_str,
  "r => rgb_str":           (src, width, height) => rgb_compn___rgb_str    (src, width, height, 0),
  "g => rgb_str":           (src, width, height) => rgb_compn___rgb_str    (src, width, height, 1),
  "b => rgb_str":           (src, width, height) => rgb_compn___rgb_str    (src, width, height, 2),
  "yuv444p => false_y_str": (src, width, height) => yuv444p___false_yuv_str(src[0], width, height, 0),
  "yuv444p => false_u_str": (src, width, height) => yuv444p___false_yuv_str(src[1], width, height, 1),
  "yuv444p => false_v_str": (src, width, height) => yuv444p___false_yuv_str(src[2], width, height, 2),
  "y => false_y_str":       (src, width, height) => yuv444p___false_yuv_str(src[0], width, height, 0),

  /* dataurl */
  "rgb => dataurl":         rgb___dataurl,



  // packed yuv444 has been removed

  /* packed colorspace conversion */
  // "rgb => yuv444":          rgb___yuv444,
  // "yuv444 => rgb":          yuv444___rgb,

  /* packed/planar conversion */
  // "yuv444 => yuv444p":      packed___planar_3,
  // "yuv444p => yuv444":      planar___packed_3,

  /* combinations */
  // "yuv440p => yuv444":      yuv440p___yuv444,
  // "yuv420p => yuv444":      yuv420p___yuv444,

  /* packed component extraction */
  // "yuv444 => y":            (src, width, height) => extract_packed_compn   (src, width, height, 0),
  // "yuv444 => u":            (src, width, height) => extract_packed_compn   (src, width, height, 1),
  // "yuv444 => v":            (src, width, height) => extract_packed_compn   (src, width, height, 2),

  /* false yuv */
  // "yuv444 => false_y":      (src, width, height) => yuv444___false_yuv     (src, width, height, 0),
  // "yuv444 => false_u":      (src, width, height) => yuv444___false_yuv     (src, width, height, 1),
  // "yuv444 => false_v":      (src, width, height) => yuv444___false_yuv     (src, width, height, 2),
};

/*********************************************************************/
export function frame_convert_pixfmt(frame, pixfmt)
{
  // no-op
  if ( frame.pixfmt == pixfmt )
    return frame;

  // Get convert pixfmt function
  const convert_pixfmt_fname = `${frame.pixfmt} => ${pixfmt}`;
  const convert_pixfmt_fn = convert_pixfmt_functions[convert_pixfmt_fname];
  if ( !convert_pixfmt_fn )
  {
    console.error(`pixel format conversion function "${convert_pixfmt_fname}" not found`);
    return;
  }

  // Run convert pixfmt function
  console.log(`performing "${convert_pixfmt_fname}"`);
  const dst_data = convert_pixfmt_fn(frame.data, frame.width, frame.height);

  // Convert size if needed
  let convert_size_fn = convert_size_functions[convert_pixfmt_fname];
  if ( !convert_size_fn )
    convert_size_fn = (width, height) => { return { width, height }; };
  const { width, height } = convert_size_fn(frame.width, frame.height);

  // Return new Frame object
  return {
    width: width,
    height: height,
    pixfmt: pixfmt,
    data: dst_data
  };
}

/*********************************************************************/
export function frame_from_data(data, width, height)
{
  return {
    width: width,
    height: height,
    pixfmt: "y",
    data: [ new Uint8Array(data) ]
  };
}
