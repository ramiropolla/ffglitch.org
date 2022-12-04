/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export function svg_defs_add_line(defs)
{
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
}

/*********************************************************************/
function polyline_add_point(svg, polyline, x, y)
{
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    polyline.points.appendItem(point);
}

/*********************************************************************/
export function svg_draw_line(svg, g, start_x, start_y, width, height)
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
