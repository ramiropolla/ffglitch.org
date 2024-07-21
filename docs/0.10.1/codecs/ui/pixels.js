/*********************************************************************/
import { frame_convert_pixfmt } from "../utils/rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class Pixels
{
  constructor(svg, width, height, mult = 10)
  {
    const g = document.createElementNS(svg_ns, "g");
    g.setAttribute("dominant-baseline", "central");
    g.setAttribute("text-anchor", "end");
    svg.append(g);

    // create elements
    const rects = new Array(height);
    for ( let i = 0; i < height; i++ )
    {
      const rects_row = new Array(width);
      for ( let j = 0; j < width; j++ )
      {
        const rect = document.createElementNS(svg_ns, "rect");
        g.prepend(rect);
        rects_row[j] = rect;
      }
      rects[i] = rects_row;
    }

    // set attributes
    let cur_y = 1;
    for ( let i = 0; i < height; i++ )
    {
      const rects_row = rects[i];
      let cur_x = 1;
      for ( let j = 0; j < width; j++ )
      {
        const rect = rects_row[j];
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("x", cur_x);
        rect.setAttribute("y", cur_y);
        rect.setAttribute("width", mult);
        rect.setAttribute("height", mult);
        cur_x += mult;
      }
      cur_y += mult;
    }

    const border = document.createElementNS(svg_ns, "rect");
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
    this.g = g;
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
  redraw_rgb(frame)
  {
    // convert to rgb_str and get frame data
    const data_rgb_str = frame_convert_pixfmt(frame, "rgb_str").data;
    // populate rects
    for ( let i = 0; i < frame.height; i++ )
    {
      const i_offset = (i * this.width);
      for ( let j = 0; j < frame.width; j++ )
        this.rects[i][j].setAttribute("fill", data_rgb_str[i_offset + j]);
    }
  }
}
