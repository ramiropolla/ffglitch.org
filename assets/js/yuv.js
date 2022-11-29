let svg_ns = "http://www.w3.org/2000/svg";

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

//     console.log("main", main.getBBox());
//     console.log("index", index.getBBox());
//     console.log("text", text.getBBox());
//     console.log("rect", rect.getBBox());

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

// const colors = [ [ "lightblue",            "lightcoral",    "lightcyan"    ],
//                  [ "lightgoldenrodyellow", "lightgreen",    "lightpink"    ],
//                  [ "lightsalmon",          "lightseagreen", "lightskyblue" ] ];
// const Y_colors = [ [ "#606060", "#707070", "#808080" ],
//                    [ "#909090", "#a0a0a0", "#b0b0b0" ],
//                    [ "#c0c0c0", "#d0d0d0", "#202020" ] ];

function lround(x)
{
    const sign = Math.sign(x);
    x = Math.round(Math.abs(x));
    if ( x === 0 )
        return 0;
    return sign * x;
}
function rgb2yuv(r, g, b)
{
    y = lround( 0.299 * r + 0.587 * g + 0.114 * b);
    u = lround(-0.169 * r - 0.331 * g + 0.500 * b) + 128;
    v = lround( 0.500 * r - 0.419 * g - 0.081 * b) + 128;
    return [ y, u, v ];
}
function yuv2rgb(y, u, v)
{
    u -= 128;
    v -= 128;
    r = lround(1.000 * y + 0.000 * u + 1.400 * v);
    g = lround(1.000 * y - 0.343 * u - 0.711 * v);
    b = lround(1.000 * y + 1.765 * u + 0.000 * v);
    return [ r, g, b ];
}
function yuv2falsergb(compn, val)
{
    let r;
    let g;
    let b;
    if ( compn == 0 )
    {
      r = val;
      g = val;
      b = val;
    }
    else if ( compn === 1 )
    {
      r = 0;
      g = 255 - val;
      b = val;
    }
    else if ( compn === 2 )
    {
      r = val;
      g = 255 - val;
      b = 0;
    }
    return `rgb(${r}, ${g}, ${b})`;
}
function makergbstr(rgb)
{
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    return `rgb(${r}, ${g}, ${b})`;
}
let colors = { "Y":[[],[],[]], "U":[[],[],[]], "V":[[],[],[]] };
function build_colors()
{
//     const str = "012345678910111213141516171819202122232425";
    // const str = "01123581321345589144233377";
    // const str = "141421356237309504880168872420969807856967187537694807317667973799";
    // const str = "173205080756887729352744634150"
    // const str = "3243F6A8885A308D313198A2E037073098098098";
    // const str = "271828182845904523536028747135266249775724709369995";
    // const str = "314159265358979323846264338327950288419716";
//     let q = 0;
//     function get_next_val(str, q) {
//         let val = str.charCodeAt(q);
//         val -= 0x30; /* 0 */
//         val <<= 4;
//         val += 0x30; /* 0x30 -> 0xc0 */
//         return val;
//     }
    for ( let i = 0; i < 3; i++ )
    {
        for ( let j = 0; j < 3; j++ )
        {
//             if ( 0 )
//             {
//                 const r = get_next_val(str, q++);
//                 const g = get_next_val(str, q++);
//                 const b = get_next_val(str, q++);
//                 const yuv = rgb2yuv(r, g, b);
//                 const rgb_Y = yuv2falsergb(0, yuv[0]);
//                 const rgb_U = yuv2falsergb(1, yuv[1]);
//                 const rgb_V = yuv2falsergb(2, yuv[2]);
//             }
//             else
//             {
            const q = (i * 3) + j;
            const rgb_Y = yuv2falsergb(0, 0x60 + (q * 16));
            const rgb_U = yuv2falsergb(1, 0x40 + (q * 12));
            const rgb_V = yuv2falsergb(2, 0x60 + (q * 16));
            colors["Y"][i][j] = rgb_Y;
            colors["U"][i][j] = rgb_U;
            colors["V"][i][j] = rgb_V;
//             }
        }
    }
}
build_colors();
function shuffle_colors()
{
    for ( let i = 8; i > 0; i-- )
    {
        // Pick a remaining element.
        let j = Math.floor(Math.random() * (i+1));
        const ii = Math.floor(i/3);
        const ij = Math.floor(i%3);
        const ji = Math.floor(j/3);
        const jj = Math.floor(j%3);
        let t;

        // And swap it with the current element.
        t = colors["Y"][ii][ij]; colors["Y"][ii][ij] = colors["Y"][ji][jj]; colors["Y"][ji][jj] = t;
        t = colors["U"][ii][ij]; colors["U"][ii][ij] = colors["U"][ji][jj]; colors["U"][ji][jj] = t;
        t = colors["V"][ii][ij]; colors["V"][ii][ij] = colors["V"][ji][jj]; colors["V"][ji][jj] = t;
    }
}
shuffle_colors()

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

function polyline_add_point(svg, polyline, x, y)
{
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    polyline.points.appendItem(point);
}

function draw_line(svg, g, start_x, start_y, width, height)
{
    let polyline = document.createElementNS(svg_ns, "polyline");
    polyline.setAttribute("class", "line_arrow");
    polyline.style.stroke = "grey";
    polyline.style.fill = "none";
    polyline.style.strokeLinecap = "round";
    polyline.style.strokeWidth = "4";
    polyline.style.markerEnd = "url(#arrowhead)";
    polyline_add_point(svg, polyline, start_x, start_y);
    polyline_add_point(svg, polyline, start_x + width, start_y + height);
    g.append(polyline);
}

function draw_yuv(div, is_half_h, is_half_v)
{
    let svg = document.createElementNS(svg_ns, "svg");
    svg.setAttribute("font-family", "monospace");
    div.append(svg);

    let defs = document.createElementNS(svg_ns, "defs");
    svg.append(defs);

    let arrowhead = document.createElementNS(svg_ns, "marker");
    arrowhead.setAttribute("id", "arrowhead");
    arrowhead.setAttribute("markerWidth", "2");
    arrowhead.setAttribute("markerHeight", "2");
    arrowhead.setAttribute("refX", "0");
    arrowhead.setAttribute("refY", "1");
    arrowhead.setAttribute("orient", "auto");
    defs.append(arrowhead);

    let polygon = document.createElementNS(svg_ns, "polygon");
    polygon.setAttribute("points", "0 0, 2 1, 0 2");
    polygon.setAttribute("fill", "grey");
    arrowhead.append(polygon);

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

    if ( is_half_h || is_half_v )
    {
        let x = 0;
        let y = final_height + 48;
        let Y = draw_frame(g, "Y", x, y, false, false, true);
        const b_box = Y.getBBox();
        const full_width = b_box.width;
        const full_height = b_box.height;
        const U_x = x + full_width + 16;
        const V_x = x + full_width + 16 + full_width + 16;
        draw_frame(g, "U", U_x, y, is_half_h, is_half_v, true);
        draw_frame(g, "V", V_x, y, is_half_h, is_half_v, true);
        draw_line(svg, g, (0 * (full_width + 16)) + (full_width / 2), final_height + 8, 0, 28);
        draw_line(svg, g, (1 * (full_width + 16)) + (full_width / 2), final_height + 8, 0, 28);
        draw_line(svg, g, (2 * (full_width + 16)) + (full_width / 2), final_height + 8, 0, 28);
        final_height = y + full_height;
    }

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
