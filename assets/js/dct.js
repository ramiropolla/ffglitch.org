/*********************************************************************/
import { eye_rgb, tip_rgb, mario_rgb } from "./frame_data.js";
import { frame_rgb2yuv, frame_get_compn } from "./rgb2yuv.js";
import { DCTQuant } from "./dctquant.js";
import { Table } from "./table.js";
import { Pixels } from "./pixels.js";
import { Text } from "./text.js";
import { svg_defs_add_line, svg_draw_line } from "./line.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
let dctquant = new DCTQuant(90);

/*********************************************************************/
const frame_rgb = mario_rgb;
const frame_yuv = frame_rgb2yuv(frame_rgb);
const frame_y = frame_get_compn(frame_yuv, 0);
const frame_coeffs = dctquant.DCT(frame_y);
const frame_q_coeffs = dctquant.Quant(frame_coeffs, true);

let modified_coeffs = new Float32Array(frame_coeffs);
for ( let i = 0; i < 1; i++ )
// for ( let i = 1; i < 64; i++ )
  modified_coeffs[i] = 0;
const reframe = dctquant.IDCT(modified_coeffs);
let reframe_yuv = new Array(64);
for ( let i = 0; i < 64; i++ )
  reframe_yuv[i] = new Uint8Array([ reframe[i], 128, 128 ]);

/*********************************************************************/
function draw_dct_magic(div, yuv_data, coeffs_data, inverse)
{
  let svg = document.createElementNS(svg_ns, "svg");
  svg.setAttribute("font-family", "monospace");
  svg.setAttribute("font-size", "11px");
  div.append(svg);
  div.append(document.createElement("p"));

  let values = new Table(svg, 8, 8, 1.2, "000");
  let text = new Text(svg, (inverse ? "I" : "") + "DCT MAGIC", 12);
  // NOTE I know coeffs should be -0000 since it goes from -1024 .. 1016,
  //      but coeffs with four digits rarely happen and I don't mind if
  //      they look weird.
  let coeffs = new Table(svg, 8, 8, 1.2, "-000");

  let defs = document.createElementNS(svg_ns, "defs");
  svg_defs_add_line(defs);
  svg.append(defs);

  values.redraw_yuv_compn_values(yuv_data, 0);
  // animate DCT MAGIC
  if ( 0 )
  {
    let animate = document.createElementNS(svg_ns, "animate");
    animate.setAttribute("attributeName", "fill");
    animate.setAttribute("values", "red;orange;yellow;green;blue;indigo;violet;red");
    animate.setAttribute("dur", "5s");
    animate.setAttribute("repeatCount", "indefinite");
    text.rect.append(animate);
  }
  if ( 1 )
  {
    let linear_gradient = document.createElementNS(svg_ns, "linearGradient");
    const colors = [ "red", "orange", "yellow", "green", "blue", "indigo", "violet" ];
    if ( 0 )
    {
      function add_stop(element, offset, stop_color)
      {
        let stop = document.createElementNS(svg_ns, "stop");
        stop.setAttribute("offset", offset + "%");
        stop.setAttribute("stop-color", stop_color);
        element.append(stop);
      }
      for ( let i = 0; i < colors.length; i++ )
        add_stop(linear_gradient, (i / colors.length) * 100, colors[i]);
      add_stop(linear_gradient, 100, colors[0]);
    }
    else
    {
      const colors_length = colors.length;
      const colors_twice = colors.concat(colors);
      // console.log(colors_twice);
      function add_stop(element, i)
      {
        const colors_chunk = inverse
                           ? colors_twice.slice(i, colors_length + i)
                           : colors_twice.slice(colors_length - i, colors_length + colors_length - i);
        const colors_str = colors_chunk.join(';') + ';' + colors_chunk[0];
        // console.log(colors_str);
        const offset = (i / colors_length) * 100;
        const stop_color = colors_twice[i];
        let stop = document.createElementNS(svg_ns, "stop");
        stop.setAttribute("offset", offset + "%");
        stop.setAttribute("stop-color", stop_color);
        let animate = document.createElementNS(svg_ns, "animate");
        animate.setAttribute("attributeName", "stop-color");
        animate.setAttribute("values", colors_str);
        animate.setAttribute("dur", "10s");
        animate.setAttribute("repeatCount", "indefinite");
        stop.append(animate);
        element.append(stop);
      }
      for ( let i = 0; i <= colors_length; i++ )
        add_stop(linear_gradient, i);
    }
    const rainbow = (inverse ? "i" : "") + "rainbow";
    linear_gradient.setAttribute("id", rainbow);
    text.g.append(linear_gradient);
    text.fill(`url(#${rainbow})`);
  }
  // end of animation
  coeffs.redraw_coeffs(coeffs_data);

  const values_b_box = values.g.getBBox();
  const text_b_box = text.g.getBBox();
  const coeffs_b_box = coeffs.g.getBBox();

  const spacer = 32;
  const final_width = values_b_box.width + spacer + text_b_box.width + spacer + coeffs_b_box.width;
  const final_height = Math.max(values_b_box.height, coeffs_b_box.height);

  if ( inverse )
  {
    coeffs.set_g_pos(0, 0);
    svg_draw_line(svg, svg, coeffs_b_box.width + 4, final_height/2, spacer - 12, 0);
    text.set_g_pos(coeffs_b_box.width + spacer, (final_height-text_b_box.height)/2);
    svg_draw_line(svg, svg, coeffs_b_box.width + spacer + text_b_box.width + 4, final_height/2, spacer - 12, 0);
    values.set_g_pos(coeffs_b_box.width + spacer + text_b_box.width + spacer, 0);
  }
  else
  {
    values.set_g_pos(0, 0);
    svg_draw_line(svg, svg, values_b_box.width + 4, final_height/2, spacer - 12, 0);
    text.set_g_pos(values_b_box.width + spacer, (final_height-text_b_box.height)/2);
    svg_draw_line(svg, svg, values_b_box.width + spacer + text_b_box.width + 4, final_height/2, spacer - 12, 0);
    coeffs.set_g_pos(values_b_box.width + spacer + text_b_box.width + spacer, 0);
  }

  svg.setAttribute("width", final_width + "px");
  svg.setAttribute("height", final_height + "px");

  svg.style.margin = "0 auto";
  svg.style.display = "block";
  svg.style.width = final_width;
  svg.style.height = final_height;
}

/*********************************************************************/
let dct_magic = document.getElementById("dct_magic");
draw_dct_magic(dct_magic, frame_yuv, frame_coeffs, false);

/*********************************************************************/
let idct_magic = document.getElementById("idct_magic");
draw_dct_magic(idct_magic, reframe_yuv, modified_coeffs, true);
