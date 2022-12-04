/*********************************************************************/
import { log_colormap } from "./colormap.js";
import { false_yuv } from "./rgb2yuv.js";

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
    let cur = document.createElementNS(svg_ns, "rect");
    cur.setAttribute("class", "rect_cur");
    g.append(cur);
    let sel = document.createElementNS(svg_ns, "rect");
    sel.setAttribute("class", "rect_sel");
    g.append(sel);

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
    this.sel = sel;
    this.cur = cur;
    this.width = width;
    this.height = height;
    this.length = length;
    this.g = g;
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
  redraw_yuv_compn_values(yuv_data, compn)
  {
    const length = this.length;
    let texts = this.texts;
    let rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      const val = yuv_data[i][compn];
      const rgb = false_yuv(yuv_data[i], compn);
      const y = yuv_data[i][0];
      const rect_fill = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      rects[i].setAttribute("fill", rect_fill);
      texts[i].setAttribute("fill", y > 0x80 ? "black" : "white");
      texts[i].textContent = val;
    }
  }
  redraw_coeffs(coeff_data)
  {
    const length = this.length;
    // -1024 .. 1016
    let texts = this.texts;
    let rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      const val = lround(coeff_data[i]);
      texts[i].textContent = val;
      const c = log_colormap(-1024, 1016, val);
      const rect_fill = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
      const y = c[3];
      texts[i].setAttribute("fill", y > 0x80 ? "black" : "white");
      rects[i].setAttribute("fill", rect_fill);
    }
  }
}
