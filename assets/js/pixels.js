/*********************************************************************/
import { false_yuv } from "./rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class Pixels
{
  constructor(svg, width, height)
  {
    const length = width * height;
    const mult = 10;

    let g = document.createElementNS(svg_ns, "g");
    g.setAttribute("dominant-baseline", "central");
    g.setAttribute("text-anchor", "end");
    svg.append(g);

    // create elements
    let rects = new Array(length);
    for ( let i = 0; i < length; i++ )
    {
      let rect = document.createElementNS(svg_ns, "rect");
      g.prepend(rect);
      rects[i] = rect;
    }

    // set attributes
    let cur_y = 1;
    for ( let i = 0; i < height; i++ )
    {
      let cur_x = 1;
      for ( let j = 0; j < width; j++ )
      {
        let rect = rects[(i * width) + j];
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("x", cur_x);
        rect.setAttribute("y", cur_y);
        rect.setAttribute("width", mult);
        rect.setAttribute("height", mult);
        cur_x += mult;
      }
      cur_y += mult;
    }

    let border = document.createElementNS(svg_ns, "rect");
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", "black");
    border.setAttribute("x", 0);
    border.setAttribute("y", 0);
    border.setAttribute("width", 1 + width * mult + 1);
    border.setAttribute("height", 1 + height * mult + 1);
    g.append(border);

    this.border = border;
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
  redraw_rgb(rgb_data)
  {
    const length = this.length;
    let rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      const rgb = rgb_data[i];
      const rect_fill = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      rects[i].setAttribute("fill", rect_fill);
    }
  }
  redraw_yuv_compn(yuv_data, compn)
  {
    const length = this.length;
    let rects = this.rects;
    for ( let i = 0; i < length; i++ )
    {
      const rgb = false_yuv(yuv_data[i], compn);
      const rect_fill = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      rects[i].setAttribute("fill", rect_fill);
    }
  }
}
