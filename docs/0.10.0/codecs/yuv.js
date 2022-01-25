/*********************************************************************/
import { BlockData } from "./utils/block_data.js";
import { frame_convert_pixfmt } from "./utils/rgb2yuv.js";
import { AtomHeartMother } from "./utils/AtomHeartMother.js";
import { frevo } from "./utils/frevo.js";
import { lena } from "./utils/lena.js";
import { eusofa } from "./utils/eusofa.js";
import { aflor } from "./utils/aflor.js";
import { aflor2 } from "./utils/aflor2.js";
import { CommonYUVDraw } from "./ui/draw_yuv.js";
import { div_append_caption } from "./ui/ffsvg.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
const frame_rgb = BlockData.mario_rgb;
const frame_yuv = frame_convert_pixfmt(frame_rgb, "yuv444p");
const frame_yuv420p = frame_convert_pixfmt(frame_yuv, "yuv420p");
const frame_yuv444p = frame_convert_pixfmt(frame_yuv420p, "yuv444p");

const lena_rgb = lena.get_frame_224();
const lena_yuv = frame_convert_pixfmt(lena_rgb, "yuv444p");
const lena_yuv420p = frame_convert_pixfmt(lena_yuv, "yuv420p");
const lena_yuv444p = frame_convert_pixfmt(lena_yuv420p, "yuv444p");

/*********************************************************************/
function fake_420p_to_444p(frame)
{
  // split components
  const frame_y = frame_convert_pixfmt(frame, "y");
  const frame_u = frame_convert_pixfmt(frame, "u");
  const frame_v = frame_convert_pixfmt(frame, "v");
  // convert to false_yuv
  const frame_false_y = frame_convert_pixfmt(frame_y, "false_y");
  const frame_false_u = frame_convert_pixfmt(frame_u, "false_u");
  const frame_false_v = frame_convert_pixfmt(frame_v, "false_v");
  // expand chroma planes
  const src_width = frame_false_u.width;
  const src_height = frame_false_u.height;
  const dst_width = frame_false_y.width;
  const dst_height = frame_false_y.height;
  const src_u = frame_false_u.data;
  const src_v = frame_false_v.data;
  const dst_u = new Array(dst_width * dst_height);
  const dst_v = new Array(dst_width * dst_height);
  const white = new Uint8ClampedArray(3);
  white.fill(0xFF);
  for ( let i = 0; i < dst_height; i++ )
  {
    const src_i_offset = (i * src_width);
    const dst_i_offset = (i * dst_width);
    for ( let j = 0; j < dst_width; j++ )
    {
      if ( i < src_width && j < src_height )
      {
        dst_u[dst_i_offset + j] = src_u[src_i_offset + j];
        dst_v[dst_i_offset + j] = src_v[src_i_offset + j];
      }
      else
      {
        dst_u[dst_i_offset + j] = white;
        dst_v[dst_i_offset + j] = white;
      }
    }
  }
  frame_false_u.width = dst_width;
  frame_false_u.height = dst_height;
  frame_false_u.data = dst_u;
  frame_false_v.width = dst_width;
  frame_false_v.height = dst_height;
  frame_false_v.data = dst_v;
  return [ frame_false_y, frame_false_u, frame_false_v ];
}

const frame_420p_fake = fake_420p_to_444p(frame_yuv420p);
const lena_420p_fake = fake_420p_to_444p(lena_yuv420p);

/*********************************************************************/
const rgb_orig            = document.getElementById("rgb_orig");
const yuv_orig            = document.getElementById("yuv_orig");
const yuv_values          = document.getElementById("yuv_values");
const yuv_lena            = document.getElementById("yuv_lena");
const yuv_subsampled      = document.getElementById("yuv_subsampled");
const yuv_upsampled       = document.getElementById("yuv_upsampled");
const yuv_merged          = document.getElementById("yuv_merged");
const yuv444              = document.getElementById("div_yuv444");
const yuv422              = document.getElementById("div_yuv422");
const yuv420              = document.getElementById("div_yuv420");
const yuv422_upsampled    = document.getElementById("div_yuv422_upsampled");
const yuv420_upsampled    = document.getElementById("div_yuv420_upsampled");

/*********************************************************************/
new CommonYUVDraw(rgb_orig, "8x8 Mario split into Red, Green, and Blue")
   .add_rgb(frame_rgb)
   .add_text("RGB split")
   .add_rgb_split(frame_rgb)
   .finalize();
new CommonYUVDraw(yuv_orig, "8x8 Mario split into Y, U, and V")
   .add_rgb(frame_rgb)
   .add_text("YUV split")
   .add_yuv_split(frame_yuv)
   .finalize();
new CommonYUVDraw(yuv_values, "8x8 Mario split into Y, U, and V (pixel values)")
   .add_yuv_split(frame_yuv)
   .add_yuv_split_values(frame_yuv)
   .finalize();
new CommonYUVDraw(yuv_lena, "224x224 Lena split into Y, U, and V")
   .add_canvas_rgb(lena_rgb)
   .add_text("YUV split")
   .add_canvas_yuv_split(lena_yuv)
   .finalize();
new CommonYUVDraw(yuv_subsampled, "224x224 Lena split into Y and subsampled U and V")
   .add_canvas_yuv_split(lena_yuv)
   .add_text("YUV subsampling")
   .add_canvas_3_rgb(lena_420p_fake)
   .add_text("Transmission")
   .finalize();
new CommonYUVDraw(yuv_upsampled, "224x224 Lena split into upsampled Y, U, and V")
   .add_canvas_3_rgb(lena_420p_fake)
   .add_text("YUV upsampling")
   .add_canvas_yuv_split(lena_yuv444p)
   .finalize();
new CommonYUVDraw(yuv_merged, "224x224 Lena merged from upsampled Y, U, and V")
   .add_canvas_yuv_split(lena_yuv444p)
   .add_text("YUV merge")
   .add_canvas_rgb(frame_convert_pixfmt(lena_yuv444p, "rgb"))
   .finalize();

/*********************************************************************/
function draw_pixel(g, plane, i, j, x, y, color)
{
  const text = document.createElementNS(svg_ns, "text");
  text.setAttribute("dominant-baseline", "text-before-edge");
  text.setAttribute("x", x + 2);
  text.setAttribute("y", y + 2);
  g.append(text);

  const main = document.createElementNS(svg_ns, "tspan");
  main.textContent = plane;
  text.append(main);

  const index = document.createElementNS(svg_ns, "tspan");
  index.setAttribute("font-size", "0.5em");
  index.textContent = i + "," + j;
  text.append(index);

  index.setAttribute("dy", main.getBBox().height - (index.getBBox().height / 2));

  const rect = document.createElementNS(svg_ns, "rect");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 1);
  rect.setAttribute("background-color", color);
  rect.setAttribute("fill", color);
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  const b_box = text.getBBox();
  const maxdim = Math.ceil((b_box.width > b_box.height) ? b_box.width : b_box.height);
  rect.setAttribute("width", maxdim + 4);
  rect.setAttribute("height", maxdim + 4);
  g.prepend(rect);
  return rect;
}

function draw_ellipsis(g, x, y, width, height)
{
  const text = document.createElementNS(svg_ns, "text");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("x", x + (width/2));
  text.setAttribute("y", y + (height/2));
  g.append(text);

  const main = document.createElementNS(svg_ns, "tspan");
  main.textContent = "…";
  text.append(main);

  const rect = document.createElementNS(svg_ns, "rect");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 1);
  rect.setAttribute("fill", "transparent");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  g.append(rect);

  return rect;
}

function yuv2falsergb(compn, val)
{
  if ( compn === 1 )
    return `rgb(${0}, ${255-val}, ${val})`;
  else if ( compn === 2 )
    return `rgb(${val}, ${255-val}, ${0})`;
  return `rgb(${val}, ${val}, ${val})`;
}
function build_colors()
{
  const ret = { "Y":[[],[],[]], "U":[[],[],[]], "V":[[],[],[]] };
  for ( let i = 0; i < 3; i++ )
  {
    for ( let j = 0; j < 3; j++ )
    {
      const q = (i * 3) + j;
      const rgb_Y = yuv2falsergb(0, 0x60 + (q * 16));
      const rgb_U = yuv2falsergb(1, 0x40 + (q * 12));
      const rgb_V = yuv2falsergb(2, 0x60 + (q * 16));
      ret["Y"][i][j] = rgb_Y;
      ret["U"][i][j] = rgb_U;
      ret["V"][i][j] = rgb_V;
    }
  }
  return ret;
}
function shuffle_colors(data)
{
  for ( let i = 8; i > 0; i-- )
  {
    const j = Math.floor(Math.random() * (i+1));
    const ii = Math.floor(i/3);
    const ij = Math.floor(i%3);
    const ji = Math.floor(j/3);
    const jj = Math.floor(j%3);
    let t;
    t = data["Y"][ii][ij]; data["Y"][ii][ij] = data["Y"][ji][jj]; data["Y"][ji][jj] = t;
    t = data["U"][ii][ij]; data["U"][ii][ij] = data["U"][ji][jj]; data["U"][ji][jj] = t;
    t = data["V"][ii][ij]; data["V"][ii][ij] = data["V"][ji][jj]; data["V"][ji][jj] = t;
  }
}
const colors = build_colors();
shuffle_colors(colors);

function get_color(plane, ii, jj)
{
  const i = ((ii === "h") || (ii === "H")) ? 2 : (ii - 1);
  const j = ((jj === "w") || (jj === "W")) ? 2 : (jj - 1);
  return colors[plane][i][j];
}
function draw_frame(g, plane, x, y, is_half_h, is_half_v, is_full)
{
  const orig_x = x;
  const g2 = document.createElementNS(svg_ns, "g");
  g.append(g2);
  let cell_width;
  let cell_height;
  const width = (is_half_h && !is_full) ? 3 : 6;
  const height = (is_half_v && !is_full) ? 3 : 6;
  for ( let i = 0; i < height; i++ )
  {
    const is_pixel_i = is_full
                     ? (is_half_v ? ((i <= 1) || (i >= 4)) : (i <= 1 || i >= 5))
                     : (is_half_v ? ((i == 0) || (i == 2)) : (i <= 1 || i >= 5));
    const is_last_i = is_full
                    ? (is_half_v ? (i >= 4) : (i >= 5))
                    : (is_half_v ? (i == 2) : (i == 5));
    for ( let j = 0; j < width; j++ )
    {
      const is_pixel_j = is_full
                        ? (is_half_h ? ((j <= 1) || (j >= 4)) : (j <= 1 || j >= 5))
                        : (is_half_h ? ((j == 0) || (j == 2)) : (j <= 1 || j >= 5));
      const is_last_j = is_full
                      ? (is_half_h ? (j >= 4) : (j >= 5))
                      : (is_half_h ? (j == 2) : (j == 5));
      const is_pixel = (is_pixel_i && is_pixel_j);
      if ( is_pixel )
      {
        const ii = is_full
                 ? (is_last_i ? (is_half_v ? "h" : "H") : ((is_half_v ? (i>>1) : i) + 1))
                 : (is_last_i ? (is_half_v ? "h" : "H") : (i + 1));
        const jj = is_full
                 ? (is_last_j ? (is_half_h ? "w" : "W") : ((is_half_h ? (j>>1) : j) + 1))
                 : (is_last_j ? (is_half_h ? "w" : "W") : (j + 1));
        const color = get_color(plane, ii, jj);
        const text = draw_pixel(g2, plane, ii, jj, x, y, color);
        if ( cell_width === undefined )
        {
          const b_box = text.getBBox();
          cell_width = Math.ceil(b_box.width);
          cell_height = Math.ceil(b_box.height);
        }
      }
      else
      {
        draw_ellipsis(g2, x, y, cell_width, cell_height);
      }
      x += cell_width;
    }
    x = orig_x;
    y += cell_height;
  }
  return g2;
}

function draw_yuv(div, is_half_h, is_half_v, caption)
{
  const svg = document.createElementNS(svg_ns, "svg");
  svg.setAttribute("font-family", "monospace");
  div.append(svg);

  div_append_caption(div, caption);

  const g = document.createElementNS(svg_ns, "g");
  svg.append(g);

  let final_width = 0;
  let final_height = 0;
  {
    const x = 0;
    const y = 0;
    const Y = draw_frame(g, "Y", x, y, false, false, false);
    const b_box = Y.getBBox();
    const full_width = b_box.width;
    const full_height = b_box.height;
    const U_x = x + full_width + 16 + (is_half_h ? (full_width / 4) : 0);
    const U_y = (is_half_v ? (full_height / 4) : 0)
    const V_x = x + full_width + 16 + full_width + 16 + (is_half_h ? (full_width / 4) : 0);
    const V_y = (is_half_v ? (full_height / 4) : 0)
    final_width = x + full_width + 16 + full_width + 16 + full_width;
    final_height = y + full_height;
    draw_frame(g, "U", U_x, U_y, is_half_h, is_half_v, false);
    draw_frame(g, "V", V_x, V_y, is_half_h, is_half_v, false);
  }

  svg.setAttribute("width", final_width + "px");
  svg.setAttribute("height", final_height + "px");

  svg.style.margin = "0 auto";
  svg.style.display = "block";
  svg.style.width = final_width;
  svg.style.height = final_height;
}

function draw_yuv_upsampled(div, is_half_h, is_half_v, caption)
{
  const svg = document.createElementNS(svg_ns, "svg");
  svg.setAttribute("font-family", "monospace");
  div.append(svg);

  div_append_caption(div, caption);

  const g = document.createElementNS(svg_ns, "g");
  svg.append(g);

  let final_width = 0;
  let final_height = 0;

  const x = 0;
  const y = 0;
  const Y = draw_frame(g, "Y", x, y, false, false, true);
  const b_box = Y.getBBox();
  const full_width = b_box.width;
  const full_height = b_box.height;
  const U_x = x + full_width + 16;
  const V_x = x + full_width + 16 + full_width + 16;
  draw_frame(g, "U", U_x, y, is_half_h, is_half_v, true);
  draw_frame(g, "V", V_x, y, is_half_h, is_half_v, true);
  final_width = x + full_width + 16 + full_width + 16 + full_width;
  final_height = y + full_height;

  svg.setAttribute("width", final_width + "px");
  svg.setAttribute("height", final_height + "px");

  svg.style.margin = "0 auto";
  svg.style.display = "block";
  svg.style.width = final_width;
  svg.style.height = final_height;
}

draw_yuv(yuv444, false, false, "Y, U, and V planes for YUV444");
draw_yuv(yuv422, true,  false, "Y and subsampled U and V planes for YUV422");
draw_yuv(yuv420, true,  true,  "Y and subsampled U and V planes for YUV420");
draw_yuv_upsampled(yuv422_upsampled, true, false, "Y and upsampled U and V planes for YUV422");
draw_yuv_upsampled(yuv420_upsampled, true, true,  "Y and upsampled U and V planes for YUV420");
