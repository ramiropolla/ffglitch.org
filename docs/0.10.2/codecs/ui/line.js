/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
function arrowhead_name(colour)
{
  return `arrowhead_${colour}`.replace(/[, ()]/g,"_");
}

/*********************************************************************/
export function svg_defs_add_line(defs, colour, scale = 1)
{
  const arrowhead = document.createElementNS(svg_ns, "marker");
  if ( colour === undefined )
    colour = "grey";
  arrowhead.setAttribute("id", arrowhead_name(colour));
  arrowhead.setAttribute("markerWidth", `${2 * scale}`);
  arrowhead.setAttribute("markerHeight", `${2 * scale}`);
  arrowhead.setAttribute("refX", "0");
  arrowhead.setAttribute("refY", `${scale}`);
  arrowhead.setAttribute("orient", "auto");
  defs.append(arrowhead);

  const polygon = document.createElementNS(svg_ns, "polygon");
  if ( scale === undefined )
    scale = 1;
  polygon.setAttribute("points", `0 0, ${2 * scale} ${scale}, 0 ${2 * scale}`);
  polygon.setAttribute("fill", colour);
  arrowhead.append(polygon);
}

/*********************************************************************/
export class ArrowLine
{
  constructor(svg, g, colour, start_x, start_y, width, height)
  {
    this.svg = svg;
    this.g = g;
    const polyline = document.createElementNS(svg_ns, "polyline");
    if ( colour === undefined )
      colour = "grey";
    polyline.style.stroke = colour;
    polyline.style.fill = "none";
    polyline.style.strokeLinecap = "round";
    polyline.style.strokeWidth = "4";
    polyline.style.markerEnd = `url(#${arrowhead_name(colour)})`;
    g.append(polyline);
    this.last_x = 0;
    this.last_y = 0;
    this.polyline = polyline;
    if ( start_x !== undefined && start_y !== undefined )
    {
      this.add_point(start_x, start_y);
      if ( width !== undefined && height !== undefined )
        this.add_point(start_x + width, start_y + height);
    }
  }
  add_point(x, y)
  {
    const point = this.svg.createSVGPoint();
    point.x = x;
    point.y = y;
    this.polyline.points.appendItem(point);
    this.last_x = x;
    this.last_y = y;
    return this;
  }
  start(x, y)
  {
    this.clear();
    return this.add_point(x, y);
  }
  add_x(x)
  {
    return this.add_point(x, this.last_y);
  }
  add_y(y)
  {
    return this.add_point(this.last_x, y);
  }
  add_w(w)
  {
    return this.add_point(this.last_x + w, this.last_y);
  }
  add_h(h)
  {
    return this.add_point(this.last_x, this.last_y + h);
  }
  clear()
  {
    this.polyline.points.clear();
  }
}
