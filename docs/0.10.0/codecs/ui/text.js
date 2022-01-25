/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class Text
{
  constructor(svg, str, extra)
  {
    let g = document.createElementNS(svg_ns, "g");
    g.setAttribute("font-size", "14px");
    g.setAttribute("font-weight", "bold");
    g.setAttribute("dominant-baseline", "hanging");
    svg.append(g);

    let text = document.createElementNS(svg_ns, "text");
    text.textContent = str;
    g.append(text);

    if ( extra === undefined )
      extra = 0;

    const text_b_box = text.getBBox();
    const width = Math.ceil(text_b_box.width);
    const height = Math.ceil(text_b_box.height);

    text.setAttribute("y", extra - text_b_box.y);
    text.setAttribute("x", extra);

    let rect = document.createElementNS(svg_ns, "rect");
    rect.setAttribute("fill", "transparent");
    rect.setAttribute("x", 1);
    rect.setAttribute("y", 1);
    rect.setAttribute("width", extra + width + extra);
    rect.setAttribute("height", extra + height + extra);
    g.prepend(rect);

    let border = document.createElementNS(svg_ns, "rect");
    border.setAttribute("fill", "transparent");
    border.setAttribute("stroke", "black");
    border.setAttribute("x", 0);
    border.setAttribute("y", 0);
    border.setAttribute("width", 1 + extra + width + extra + 1);
    border.setAttribute("height", 1 + extra + height + extra + 1);
    g.append(border);

    this.border = border;
    this.rect = rect;
    this.text = text;
    this.g = g;
  }
  fill(color)
  {
    this.rect.setAttribute("fill", color);
  }
  set_g_pos(x, y)
  {
    this.g.setAttribute("transform", "translate(" + x + "," + y + ")");
  }
}
