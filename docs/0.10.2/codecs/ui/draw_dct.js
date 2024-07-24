/*********************************************************************/
import { Table } from "./table.js";
import { Pixels } from "./pixels.js";
import { Text } from "./text.js";
import { LinearSVG } from "./ffsvg.js";
import { frame_convert_pixfmt } from "../utils/rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class DCTDraw
{
  /*********************************************************************/
  static animate_dct_magic(text, inverse)
  {
    const linear_gradient = document.createElementNS(svg_ns, "linearGradient");
    const colors = [ "red", "orange", "yellow", "green", "blue", "indigo", "violet" ];
    const colors_length = colors.length;
    const colors_twice = colors.concat(colors);
    function add_stop(element, i)
    {
      const colors_chunk = inverse
                         ? colors_twice.slice(i, colors_length + i)
                         : colors_twice.slice(colors_length - i, colors_length + colors_length - i);
      const colors_str = colors_chunk.join(';') + ';' + colors_chunk[0];
      const offset = (i / colors_length) * 100;
      const stop_color = colors_twice[i];
      const stop = document.createElementNS(svg_ns, "stop");
      stop.setAttribute("offset", offset + "%");
      stop.setAttribute("stop-color", stop_color);
      const animate = document.createElementNS(svg_ns, "animate");
      animate.setAttribute("attributeName", "stop-color");
      animate.setAttribute("values", colors_str);
      animate.setAttribute("dur", "8s");
      animate.setAttribute("repeatCount", "indefinite");
      stop.append(animate);
      element.append(stop);
    }
    for ( let i = 0; i <= colors_length; i++ )
      add_stop(linear_gradient, i);
    const rainbow = (inverse ? "i" : "") + "rainbow";
    linear_gradient.setAttribute("id", rainbow);
    text.g.append(linear_gradient);
    text.fill(`url(#${rainbow})`);
  }

  /*********************************************************************/
  static dct(div, frame, coeffs_data, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    // create elements
    const pixels = new Pixels(svg, 8, 8);
    const values = new Table(svg, 8, 8, 1.2, "000");
    const text   = new Text(svg, "DCT", 12);
    const coeffs = new Table(svg, 8, 8, 1.2, "-000");

    // draw elements
    const frame_rgb = frame_convert_pixfmt(frame, "false_y");
    pixels.redraw_rgb(frame_rgb);
    values.redraw_yuv_compn_values(frame, 0);
    DCTDraw.animate_dct_magic(text, false);
    coeffs.redraw_coeffs(coeffs_data);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(pixels);
    ffsvg.layout.add_to_row(values);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(text);
    ffsvg.layout.add_to_row(coeffs);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static idct(div, coeffs_data, frame, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    // create elements
    const coeffs = new Table(svg, 8, 8, 1.2, "-000");
    const text   = new Text(svg, "IDCT", 12);
    const values = new Table(svg, 8, 8, 1.2, "000");
    const pixels = new Pixels(svg, 8, 8);

    // draw elements
    coeffs.redraw_coeffs(coeffs_data);
    DCTDraw.animate_dct_magic(text, true);
    values.redraw_yuv_compn_values(frame, 0);
    const frame_rgb = frame_convert_pixfmt(frame, "false_y");
    pixels.redraw_rgb(frame_rgb);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(coeffs);
    ffsvg.layout.add_to_row(text);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(values);
    ffsvg.layout.add_to_row(pixels);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static q_coeffs(div, coeffs_data, quantizer, q_coeffs_data, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    const q_coeffs_n = Math.max(...q_coeffs_data.map(v => String(v).length));
    const q_coeffs_str = (q_coeffs_n == 4) ? "-000" : "-00";

    // create elements
    const coeffs   = new Table(svg, 8, 8, 1.2, "-000");
    const text     = new Text(svg, `÷${quantizer}`, 12);
    const q_coeffs = new Table(svg, 8, 8, 1.2, q_coeffs_str);

    // draw elements
    coeffs.redraw_coeffs(coeffs_data);
    q_coeffs.redraw_coeffs(q_coeffs_data);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(coeffs);
    ffsvg.layout.add_to_row(text);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(q_coeffs);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static dq_coeffs(div, q_coeffs_data, quantizer, dq_coeffs_data, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    const q_coeffs_n = Math.max(...q_coeffs_data.map(v => String(v).length));
    const q_coeffs_str = (q_coeffs_n == 4) ? "-000" : "-00";

    // create elements
    const q_coeffs  = new Table(svg, 8, 8, 1.2, q_coeffs_str);
    const text      = new Text(svg, `×${quantizer}`, 12);
    const dq_coeffs = new Table(svg, 8, 8, 1.2, "-000");

    // draw elements
    q_coeffs.redraw_coeffs(q_coeffs_data);
    dq_coeffs.redraw_coeffs(dq_coeffs_data);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(q_coeffs);
    ffsvg.layout.add_to_row(text);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(dq_coeffs);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static blocks(div, frame1, frame2, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    // create elements
    const block1 = new Pixels(svg, 8, 8);
    const block2 = new Pixels(svg, 8, 8);

    // draw elements
    const frame1_rgb = frame_convert_pixfmt(frame1, "false_y");
    block1.redraw_rgb(frame1_rgb);
    const frame2_rgb = frame_convert_pixfmt(frame2, "false_y");
    block2.redraw_rgb(frame2_rgb);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(block1);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(block2);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static diff_values(div, frame1, frame2, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    const block1_data = frame1.data[0];
    const block2_data = frame2.data[0];
    const block_diff = new Int16Array(64);
    for ( let i = 0; i < 64; i++ )
      block_diff[i] = block1_data[i] - block2_data[i];

    // create elements
    const block1 = new Table(svg, 8, 8, 1.2, "000");
    const minus  = new Text(svg, "−", 12);
    const block2 = new Table(svg, 8, 8, 1.2, "000");
    const equals = new Text(svg, "=", 12);
    const diff   = new Table(svg, 8, 8, 1.2, "-00");

    // draw elements
    block1.redraw_yuv_compn_values(frame1, 0);
    block2.redraw_yuv_compn_values(frame2, 0);
    diff.redraw_signed_values(block_diff);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(block1);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(minus);
    ffsvg.layout.add_to_row(block2);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(equals);
    ffsvg.layout.add_to_row(diff);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static quant_tables(div, luma, chroma, caption)
  {
    const ffsvg = new LinearSVG(div, 24, undefined, caption);
    const svg = ffsvg.svg;

    // create elements
    const luma_table   = new Table(svg, 8, 8, 1.2, "000");
    const chroma_table = new Table(svg, 8, 8, 1.2, "000");

    // draw elements
    luma_table.redraw_signed_values(luma);
    chroma_table.redraw_signed_values(chroma);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(luma_table);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(chroma_table);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static quantization(div, coeffs_data, quantization_table, q_coeffs_data, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    // create elements
    const coeffs   = new Table(svg, 8, 8, 1.2, "-000");
    const _div     = new Text(svg, "÷", 12);
    const quant    = new Table(svg, 8, 8, 1.2, "000");
    const equals   = new Text(svg, "=", 12);
    const q_coeffs = new Table(svg, 8, 8, 1.2, "-00");

    // draw elements
    coeffs.redraw_coeffs(coeffs_data);
    quant.redraw_signed_values(quantization_table);
    q_coeffs.redraw_coeffs(q_coeffs_data);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(coeffs);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(_div);
    ffsvg.layout.add_to_row(quant);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(equals);
    ffsvg.layout.add_to_row(q_coeffs);

    ffsvg.finish_up();
  }

  /*********************************************************************/
  static dequantization(div, q_coeffs_data, quantization_table, dq_coeffs_data, caption)
  {
    const ffsvg = new LinearSVG(div, 24, "grey", caption);
    const svg = ffsvg.svg;

    // create elements
    const q_coeffs  = new Table(svg, 8, 8, 1.2, "-00");
    const _mul      = new Text(svg, "×", 12);
    const quant     = new Table(svg, 8, 8, 1.2, "000");
    const equals    = new Text(svg, "=", 12);
    const dq_coeffs = new Table(svg, 8, 8, 1.2, "-000");

    // draw elements
    q_coeffs.redraw_coeffs(q_coeffs_data);
    quant.redraw_signed_values(quantization_table);
    dq_coeffs.redraw_coeffs(dq_coeffs_data);

    // add elements to ffsvg
    ffsvg.layout.add_to_row(q_coeffs);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(_mul);
    ffsvg.layout.add_to_row(quant);
    ffsvg.layout.new_row();
    ffsvg.layout.add_to_row(equals);
    ffsvg.layout.add_to_row(dq_coeffs);

    ffsvg.finish_up();
  }
}
