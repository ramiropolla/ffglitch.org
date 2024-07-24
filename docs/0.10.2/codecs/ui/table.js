/*********************************************************************/
import { log_colormap } from "../utils/colormap.js";
import { frame_convert_pixfmt, frame_from_data, yuv_to_rgb } from "../utils/rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
function lround(x)
{
  const sign = Math.sign(x);
  x = Math.round(Math.abs(x));
  if ( x === 0 )
    return 0;
  return sign * x;
}

/*********************************************************************/
export class Table
{
  constructor(svg, width, height, row_space, str)
  {
    const length = width * height;

    /* make sure str is a String */
    str = `${str}`;

    let g = document.createElementNS(svg_ns, "g");
    g.setAttribute("dominant-baseline", "central");
    g.setAttribute("text-anchor", "end");
    svg.append(g);

    // create elements
    let rects = new Array(length);
    let texts = new Array(length);
    for ( let i = 0; i < length; i++ )
    {
      let rect = document.createElementNS(svg_ns, "rect");
      g.prepend(rect);
      rects[i] = rect;
      let text = document.createElementNS(svg_ns, "text");
      text.textContent = str;
      g.append(text);
      texts[i] = text;
    }

    // calculate geometry
    const col_space = 1 + (1 / str.length);
    const b_box = texts[0].getBBox();
    const w_half_char = Math.round((b_box.width / str.length) / 2);
    const h_half_row = Math.round((b_box.height * row_space) / 2);
    const h_row = h_half_row * 2;
    const w_col = Math.ceil(b_box.width * col_space);

    // set attributes
    let cur_y = 1;
    for ( let i = 0; i < height; i++ )
    {
      let cur_x = 1;
      for ( let j = 0; j < width; j++ )
      {
        let text = texts[(i * width) + j];
        text.setAttribute("y", cur_y + h_half_row);
        text.setAttribute("x", cur_x + w_col - w_half_char);

        let rect = rects[(i * width) + j];
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("x", cur_x);
        rect.setAttribute("y", cur_y);
        rect.setAttribute("width", w_col);
        rect.setAttribute("height", h_row);
        cur_x += w_col;
      }
      cur_y += h_row;
    }

    let border = document.createElementNS(svg_ns, "rect");
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", "black");
    border.setAttribute("x", 0);
    border.setAttribute("y", 0);
    border.setAttribute("width", 1 + width * w_col + 1);
    border.setAttribute("height", 1 + height * h_row + 1);
    g.append(border);

    this.border = border;
    this.w_half_char = w_half_char;
    this.texts = texts;
    this.rects = rects;
    this.width = width;
    this.height = height;
    this.length = length;
    this.g = g;
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
  redraw_yuv_compn_values(frame, compn)
  {
    const data_compn = frame.data[compn];
    const data_y = frame.data[0];
    // convert to false_yuv_str
    const data_false_yuv_str = frame_convert_pixfmt(frame, `false_${"yuv"[compn]}_str`).data;
    // populate texts and rects
    const length = this.length;
    const texts = this.texts;
    const rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      texts[i].textContent = data_compn[i];
      texts[i].setAttribute("fill", data_y[i] > 0x80 ? "black" : "white");
      rects[i].setAttribute("fill", data_false_yuv_str[i]);
    }
  }
  redraw_signed_values_internal(data, data_abs, data_abs_false_yuv_str)
  {
    const length = this.length;
    let texts = this.texts;
    let rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      texts[i].textContent = data[i];
      if ( data_abs )
        texts[i].setAttribute("fill", data_abs[i] > 0x80 ? "black" : "white");
      if ( data_abs_false_yuv_str )
        rects[i].setAttribute("fill", data_abs_false_yuv_str[i]);
    }
  }
  redraw_signed_values(data)
  {
    // TODO hardcoded 8x8
    const data_abs = new Uint8Array(64);
    for ( let i = 0; i < 64; i++ )
      data_abs[i] = Math.abs(data[i]);
    const frame_abs = frame_from_data(data_abs, 8, 8);
    const data_abs_false_yuv_str = frame_convert_pixfmt(frame_abs, "false_y_str").data;
    return this.redraw_signed_values_internal(data, data_abs, data_abs_false_yuv_str);
  }
  redraw_signed_values_nocolor(data)
  {
    return this.redraw_signed_values_internal(data);
  }
  redraw_coeffs_internal(coeff_data, do_bg_color, highligh_zeros)
  {
    const length = this.length;
    // -2040 .. 2040
    let texts = this.texts;
    let rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      const coeff = coeff_data[i];
      const is_eob = (coeff === "<eob>");
      const is_run = (coeff[0] === "<");
      const is_rle = is_run && coeff.includes(",");
      const is_dc  = is_run && coeff.includes("DC");
      const val = (is_eob || is_run || is_rle) ? coeff : lround(coeff);
      texts[i].textContent = val;
      if ( do_bg_color === false )
        continue;
      const c = is_eob ? [ 255,   0,   0, 255 ] /* red */
              : is_dc  ? yuv_to_rgb([0,0,0])    /* yuv0 */
              : is_rle ? [ 255, 255, 255, 255 ] /* white */
              : is_run ? [   0,   0,   0,   0 ] /* black */
              :          log_colormap(-2040, 2040, val);
      const rect_fill = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      const y = is_dc ? 255 : c[3];
      if ( highligh_zeros && val === 0 )
      {
        texts[i].setAttribute("fill", "white");
        rects[i].setAttribute("fill", "black");
      }
      else
      {
        texts[i].setAttribute("fill", y > 0x80 ? "black" : "white");
        rects[i].setAttribute("fill", rect_fill);
      }
    }
  }
  redraw_coeffs(coeff_data)
  {
    this.redraw_coeffs_internal(coeff_data, true, false);
  }
  redraw_coeffs_zeros(coeff_data)
  {
    this.redraw_coeffs_internal(coeff_data, true, true);
  }
  redraw_coeffs_nocolor(coeff_data)
  {
    this.redraw_coeffs_internal(coeff_data, false, false);
  }
}
