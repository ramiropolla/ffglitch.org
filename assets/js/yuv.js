/*********************************************************************/
import { mario_rgb } from "./frame_data.js";
import { frame_rgb2yuv } from "./rgb2yuv.js";
import { Table } from "./table.js";
import { Pixels } from "./pixels.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
function draw_pixel(g, plane, i, j, x, y, color)
{
    let text = document.createElementNS(svg_ns, "text");
    text.setAttribute("dominant-baseline", "text-before-edge");
    text.setAttribute("x", x + 2);
    text.setAttribute("y", y + 2);
    g.append(text);

    let main = document.createElementNS(svg_ns, "tspan");
    main.textContent = plane;
    text.append(main);

    let index = document.createElementNS(svg_ns, "tspan");
    index.setAttribute("font-size", "0.5em");
    index.textContent = i + "," + j;
    text.append(index);

    index.setAttribute("dy", main.getBBox().height - (index.getBBox().height / 2));

    let rect = document.createElementNS(svg_ns, "rect");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", 1);
    rect.setAttribute("background-color", color);
    rect.setAttribute("fill", color);
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    const b_box = text.getBBox();
    rect.setAttribute("width", Math.ceil(b_box.width) + 4);
    rect.setAttribute("height", Math.ceil(b_box.height) + 4);
    g.prepend(rect);
    return rect;
}

function draw_ellipsis(g, x, y, width, height)
{
    let text = document.createElementNS(svg_ns, "text");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("x", x + (width/2));
    text.setAttribute("y", y + (height/2));
    g.append(text);

    let main = document.createElementNS(svg_ns, "tspan");
    main.textContent = "…";
    text.append(main);

    let rect = document.createElementNS(svg_ns, "rect");
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
    let ret = { "Y":[[],[],[]], "U":[[],[],[]], "V":[[],[],[]] };
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
        let j = Math.floor(Math.random() * (i+1));
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
let colors = build_colors();
shuffle_colors(colors);

function get_color(plane, ii, jj)
{
    const i = ((ii === "h") || (ii === "H")) ? 2 : (ii - 1);
    const j = ((jj === "w") || (jj === "W")) ? 2 : (jj - 1);
    // console.log(plane, i, j);
    return colors[plane][i][j];
}

function draw_frame(g, plane, x, y, is_half_h, is_half_v, is_full)
{
    const orig_x = x;
    let g2 = document.createElementNS(svg_ns, "g");
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
                let text = draw_pixel(g2, plane, ii, jj, x, y, color);
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

function draw_yuv(div, is_half_h, is_half_v)
{
    let svg = document.createElementNS(svg_ns, "svg");
    svg.setAttribute("font-family", "monospace");
    div.append(svg);
    div.append(document.createElement("p"));

    let g = document.createElementNS(svg_ns, "g");
    svg.append(g);

    let final_width = 0;
    let final_height = 0;
    {
        let x = 0;
        let y = 0;
        let Y = draw_frame(g, "Y", x, y, false, false, false);
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

function draw_yuv_reconstructed(div, is_half_h, is_half_v)
{
    let svg = document.createElementNS(svg_ns, "svg");
    svg.setAttribute("font-family", "monospace");
    div.append(svg);
    div.append(document.createElement("p"));

    let g = document.createElementNS(svg_ns, "g");
    svg.append(g);

    let final_width = 0;
    let final_height = 0;

    let x = 0;
    let y = 0;
    let Y = draw_frame(g, "Y", x, y, false, false, true);
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

let yuv444 = document.getElementById("div_yuv444");
let yuv422 = document.getElementById("div_yuv422");
let yuv420 = document.getElementById("div_yuv420");

draw_yuv(yuv444, false, false);
draw_yuv(yuv422, true, false);
draw_yuv(yuv420, true, true);

let yuv422_reconstructed = document.getElementById("div_yuv422_reconstructed");
let yuv420_reconstructed = document.getElementById("div_yuv420_reconstructed");

draw_yuv_reconstructed(yuv422_reconstructed, true, false);
draw_yuv_reconstructed(yuv420_reconstructed, true, true);





/*********************************************************************/
const frame_rgb = mario_rgb;
const frame_yuv = frame_rgb2yuv(frame_rgb);

/*********************************************************************/
function draw_pixel_numbers(div)
{
  let svg = document.createElementNS(svg_ns, "svg");
  svg.setAttribute("font-family", "monospace");
  svg.setAttribute("font-size", "11px");
  div.append(svg);
  div.append(document.createElement("p"));

  let pixels_rgb = new Pixels(svg, 8, 8);
  let pixels_rgb_y = new Pixels(svg, 8, 8);
  let pixels_rgb_u = new Pixels(svg, 8, 8);
  let pixels_rgb_v = new Pixels(svg, 8, 8);
  let values_false_y = new Table(svg, 8, 8, 1.2, "000");
  let values_false_u = new Table(svg, 8, 8, 1.2, "000");
  let values_false_v = new Table(svg, 8, 8, 1.2, "000");

  pixels_rgb.redraw_rgb(frame_rgb);
  pixels_rgb_y.redraw_yuv_compn(frame_yuv, 0);
  pixels_rgb_u.redraw_yuv_compn(frame_yuv, 1);
  pixels_rgb_v.redraw_yuv_compn(frame_yuv, 2);
  values_false_y.redraw_yuv_compn_values(frame_yuv, 0);
  values_false_u.redraw_yuv_compn_values(frame_yuv, 1);
  values_false_v.redraw_yuv_compn_values(frame_yuv, 2);

  const block_b_box = pixels_rgb_y.g.getBBox();
  const block_width = block_b_box.width;
  const block_height = block_b_box.height;
  const table_b_box = values_false_y.g.getBBox();
  const table_width = table_b_box.width;
  const table_height = table_b_box.height;

  const final_width = table_width + 16 + table_width + 16 + table_width;
  const final_height = block_height + 16 + block_height + 16 + table_height;

  const col0_x = ((table_width + 16) * 0) + (table_width / 2);
  const col1_x = ((table_width + 16) * 1) + (table_width / 2);
  const col2_x = ((table_width + 16) * 2) + (table_width / 2);
  const row0_y = ((block_height + 16) * 0);
  const row1_y = ((block_height + 16) * 1);
  const row2_y = ((block_height + 16) * 2);

  pixels_rgb    .set_g_pos(col1_x - (block_width / 2), row0_y);
  pixels_rgb_y  .set_g_pos(col0_x - (block_width / 2), row1_y);
  pixels_rgb_u  .set_g_pos(col1_x - (block_width / 2), row1_y);
  pixels_rgb_v  .set_g_pos(col2_x - (block_width / 2), row1_y);
  values_false_y.set_g_pos(col0_x - (table_width / 2), row2_y);
  values_false_u.set_g_pos(col1_x - (table_width / 2), row2_y);
  values_false_v.set_g_pos(col2_x - (table_width / 2), row2_y);

  svg.setAttribute("width", final_width + "px");
  svg.setAttribute("height", final_height + "px");

  svg.style.margin = "0 auto";
  svg.style.display = "block";
  svg.style.width = final_width;
  svg.style.height = final_height;
}

/*********************************************************************/
let pixel_numbers = document.getElementById("pixel_numbers");
draw_pixel_numbers(pixel_numbers);
