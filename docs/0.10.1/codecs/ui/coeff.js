/*********************************************************************/
import { log_colormap } from "../utils/colormap.js";
import { yuv_to_rgb } from "../utils/rgb2yuv.js";

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
export class Coeff
{
  constructor(svg, row_space, placeholder, _val, do_coeff_line)
  {
    let g = document.createElementNS(svg_ns, "g");
    g.setAttribute("dominant-baseline", "central");
    g.setAttribute("text-anchor", "end");
    svg.append(g);

    // create elements
    let rect = document.createElementNS(svg_ns, "rect");
    g.prepend(rect);
    let text = document.createElementNS(svg_ns, "text");
    text.textContent = placeholder;
    g.append(text);

    // calculate geometry
    const col_space = 1 + (1 / placeholder.length);
    const b_box = text.getBBox();
    const w_half_char = Math.round((b_box.width / placeholder.length) / 2);
    const h_half_row = Math.round((b_box.height * row_space) / 2);
    const h_row = h_half_row * 2;
    const w_col = Math.ceil(b_box.width * col_space);

    // set attributes
    text.setAttribute("y", 1 + h_half_row);
    text.setAttribute("x", 1 + w_col - w_half_char);

    rect.setAttribute("fill", "transparent");
    rect.setAttribute("x", 1);
    rect.setAttribute("y", 1);
    rect.setAttribute("width", w_col);
    rect.setAttribute("height", h_row);

    let border = document.createElementNS(svg_ns, "rect");
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", "black");
    border.setAttribute("x", 0);
    border.setAttribute("y", 0);
    border.setAttribute("width", 1 + w_col + 1);
    border.setAttribute("height", 1 + h_row + 1);
    g.append(border);

    // update textContext and background
    if ( do_coeff_line )
    {
      // -2040 .. 2040
      const val = lround(_val);
      text.textContent = val;
      if ( val === 0 )
      {
        text.setAttribute("fill", "white");
        rect.setAttribute("fill", "black");
      }
      else
      {
        const c = log_colormap(-2040, 2040, val);
        const rect_fill = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        const y = c[3];
        text.setAttribute("fill", y > 0x80 ? "black" : "white");
        rect.setAttribute("fill", rect_fill);
      }
    }
    else
    {
      text.textContent = _val;
    }

    this.border = border;
    this.w_half_char = w_half_char;
    this.text = text;
    this.rect = rect;
    this.g = g;
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
}

/*********************************************************************/
function add_tspan(text, val)
{
  let tspan = document.createElementNS(svg_ns, "tspan");
  tspan.textContent = val;
  text.append(tspan);
  return tspan;
}

/*********************************************************************/
export class RleCoeff
{
  constructor(svg, row_space, val)
  {
    let g = document.createElementNS(svg_ns, "g");
    g.setAttribute("dominant-baseline", "central");
    g.setAttribute("text-anchor", "end");
    svg.append(g);

    const is_eob = (val[0] === -1) && (val[1] === -1);
    const is_dc  = (val[0] === -1) && (val[1] !== -1);
    if ( is_eob )
    {
      this.g1 = new Coeff(g, 1.2, "EOB", "EOB");
      this.g1.text.setAttribute("fill", "black");
      this.g1.rect.setAttribute("fill", "red");
    }
    else
    {
      if ( is_dc )
      {
        this.g1 = new Coeff(g, 1.2, "DC", "DC");
        this.g1.text.setAttribute("fill", "black");
        this.g1.rect.setAttribute("fill", "red");
      }
      else
      {
        this.g1 = new Coeff(g, 1.2, "00", val[0]);
        if ( val[0] === 0 )
        {
          this.g1.text.setAttribute("fill", "black");
          this.g1.rect.setAttribute("fill", "white");
        }
        else
        {
          this.g1.text.setAttribute("fill", "white");
          this.g1.rect.setAttribute("fill", "black");
        }
      }
      this.g2 = new Coeff(g, 1.2, "-00", val[1], true);
      this.g2.set_g_pos(this.g1.g.getBBox().width + 1, 0);
    }

    this.g = g;
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
}
