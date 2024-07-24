/*********************************************************************/
import { yuv_to_rgb } from "../utils/rgb2yuv.js";
import { Coeff, RleCoeff } from "./coeff.js";
import { Table } from "./table.js";
import { LinearSVG } from "./ffsvg.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class ZZDraw
{
  /*********************************************************************/
  static get zig_zag_direct()
  {
    return [
       0,  1,  8, 16,  9,  2,  3, 10,
      17, 24, 32, 25, 18, 11,  4,  5,
      12, 19, 26, 33, 40, 48, 41, 34,
      27, 20, 13,  6,  7, 14, 21, 28,
      35, 42, 49, 56, 57, 50, 43, 36,
      29, 22, 15, 23, 30, 37, 44, 51,
      58, 59, 52, 45, 38, 31, 39, 46,
      53, 60, 61, 54, 47, 55, 62, 63,
    ];
  }

  /*********************************************************************/
  static get identity()
  {
    return [
       0,  1,  2,  3,  4,  5,  6,  7,
       8,  9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28, 29, 30, 31,
      32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47,
      48, 49, 50, 51, 52, 53, 54, 55,
      56, 57, 58, 59, 60, 61, 62, 63,
    ];
  }

  /*********************************************************************/
  static coeffs(div, coeffs_data)
  {
    const ffsvg = new LinearSVG(div, 24);
    const svg = ffsvg.svg;

    const coeffs = new Table(svg, 8, 8, 1.2, "-00");

    coeffs.redraw_coeffs_zeros(coeffs_data);

    ffsvg.layout.add_to_row(coeffs);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static draw_zigzag(div)
  {
    const ffsvg = new LinearSVG(div, 24);
    const svg = ffsvg.svg;

    const coeffs = new Table(svg, 8, 8, 1.2, "-00");

    const identity = ZZDraw.identity;

    coeffs.redraw_signed_values_nocolor(identity);

    /* draw_zigzag */
    const zig_zag_direct = ZZDraw.zig_zag_direct;
    const text0 = coeffs.texts[0];
    const text0_b_box = text0.getBBox();
    const polyline = document.createElementNS(svg_ns, "polyline");
    coeffs.g.prepend(polyline);
    coeffs.polyline = polyline;
    polyline.setAttribute("stroke-width", 9);
    polyline.setAttribute("stroke-linecap", "round");
    polyline.setAttribute("stroke-linejoin", "round");
    polyline.setAttribute("stroke", "lightgreen");
    polyline.setAttribute("fill", "none");
    for ( let i = 0; i < 64; i++ )
    {
      const idx = zig_zag_direct[i];
      const cur = coeffs.texts[idx];
      const point = svg.createSVGPoint();
      const b_box = cur.getBBox();
      point.x = b_box.x + b_box.width - coeffs.w_half_char;
      point.y = b_box.y + (b_box.height / 2);
      polyline.points.appendItem(point);
    }

    ffsvg.layout.add_to_row(coeffs);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static draw_line_internal(div, line, do_coeff_line)
  {
    const _str = do_coeff_line ? "-00" : "00";

    const yuv0 = yuv_to_rgb([0,0,0]);
    const line_colour = `rgb(${yuv0[0]}, ${yuv0[1]}, ${yuv0[2]})`
    const ffsvg = new LinearSVG(div, 24, line_colour);
    const svg = ffsvg.svg;

    for ( let i = 0; i < line.length; i++ )
    {
      const coeff = new Coeff(svg, 1.2, _str, line[i], do_coeff_line);
      if ( i != 0 )
        ffsvg.layout.new_row();
      ffsvg.layout.add_to_row(coeff);
    }

    ffsvg.finish_up(true);
  }
  static draw_scan_line(div, line)
  {
    ZZDraw.draw_line_internal(div, line, false);
  }
  static draw_coeff_line(div, line)
  {
    ZZDraw.draw_line_internal(div, line, true);
  }

  /*********************************************************************/
  static draw_rle_line(div, line)
  {
    const yuv0 = yuv_to_rgb([0,0,0]);
    const line_colour = `rgb(${yuv0[0]}, ${yuv0[1]}, ${yuv0[2]})`
    const ffsvg = new LinearSVG(div, 24, line_colour);
    const svg = ffsvg.svg;

    for ( let i = 0; i < line.length; i++ )
    {
      const rle_coeff = new RleCoeff(svg, 1.2, line[i]);
      if ( i != 0 )
        ffsvg.layout.new_row();
      ffsvg.layout.add_to_row(rle_coeff);
    }

    ffsvg.finish_up(true);
  }
}
