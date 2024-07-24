/*********************************************************************/
import { frame_convert_pixfmt } from "../utils/rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class Spacer
{
  constructor(svg)
  {
    const g = document.createElementNS(svg_ns, "g");
    svg.append(g);
    this.g = g;
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
}
