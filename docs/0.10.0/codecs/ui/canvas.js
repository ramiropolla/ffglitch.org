/*********************************************************************/
import { frame_convert_pixfmt } from "../utils/rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class Canvas
{
  constructor(svg, width, height)
  {
    const g = document.createElementNS(svg_ns, "g");
    g.setAttribute("dominant-baseline", "central");
    g.setAttribute("text-anchor", "end");
    svg.append(g);

    // create elements
    const image = document.createElementNS(svg_ns, "image");
    g.append(image);

    // set attributes
    image.setAttribute("x", 1);
    image.setAttribute("y", 1);
    image.setAttribute("width", width);
    image.setAttribute("height", height);

    const border = document.createElementNS(svg_ns, "rect");
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", "black");
    border.setAttribute("x", 0);
    border.setAttribute("y", 0);
    border.setAttribute("width", 1 + width + 1);
    border.setAttribute("height", 1 + height + 1);
    g.append(border);

    this.border = border;
    this.image = image;
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
    // ensure input is rgb
    frame = frame_convert_pixfmt(frame, "rgb");

    const rgbBuffer = new Uint8ClampedArray(this.width * this.height * 4);
    for ( let i = 0; i < this.width * this.height; i++ )
    {
      rgbBuffer[i * 4 + 0] = frame.data[i][0];
      rgbBuffer[i * 4 + 1] = frame.data[i][1];
      rgbBuffer[i * 4 + 2] = frame.data[i][2];
      rgbBuffer[i * 4 + 3] = 0xFF;
    }

    // Create an off-screen canvas
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext("2d");

    // Create ImageData from RGB buffer
    const imageData = new ImageData(rgbBuffer, this.width, this.height);
    ctx.putImageData(imageData, 0, 0);

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL();

    this.image.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataUrl);
  }
}
