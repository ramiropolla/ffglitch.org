/*********************************************************************/
import { svg_defs_add_line, ArrowLine } from "./line.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
class CommonLayout
{
  constructor(spacer, line_colour)
  {
    this.draw_lines = (line_colour !== undefined);
    this.line_colour = this.draw_lines ? line_colour : "grey";
    this.spacer = spacer;

    this.rows = [[]];
  }
  new_row()
  {
    this.rows.push([]);
  }
  add_to_row(el)
  {
    this.rows[this.rows.length-1].push(el);
  }
  get_b_boxes()
  {
    const b_boxes = [];
    for ( const row of this.rows )
    {
      b_boxes.push([]);
      for ( const el of row )
        b_boxes[b_boxes.length-1].push(el.g.getBBox());
    }
    return b_boxes;
  }
  get_row_dimensions(spacer, b_boxes)
  {
    const rows_wh = [];
    for ( const b_box_row of b_boxes )
    {
      let row_width = -spacer;
      let row_height = 0;
      for ( const b_box of b_box_row )
      {
        row_width += spacer + b_box.width;
        row_height = Math.max(row_height, b_box.height);
      }
      rows_wh.push([ row_width, row_height ]);
    }
    return rows_wh;
  }
  calculate_final_dimensions(spacer, rows_wh)
  {
    let final_width = 0;
    let final_height = -spacer;
    for ( const row_wh of rows_wh )
    {
      final_width = Math.max(final_width, row_wh[0]);
      final_height += spacer + row_wh[1];
    }
    this.final_width = final_width;
    this.final_height = final_height;
  }
  position(div, svg, lines_g)
  {
    const spacer = this.spacer;

    /* remove last row if it is empty */
    if ( this.rows[this.rows.length - 1].length === 0 )
      this.rows.pop();

    /* get bounding boxes */
    const b_boxes = this.get_b_boxes();

    /* calculate dimensions for each row */
    const rows_wh = this.get_row_dimensions(spacer, b_boxes);

    /* merge all rows to fit into div.clientWidth */
    this.merge_rows(div, spacer, b_boxes, rows_wh);

    /* calculate final dimensions */
    this.calculate_final_dimensions(spacer, rows_wh);

    /* position elements */
    this.position_elements(svg, lines_g, spacer, b_boxes, rows_wh);

    /* draw lines between rows */
    if ( this.draw_lines )
      this.draw_lines_between_rows(svg, lines_g, spacer, rows_wh);

    /* adjust final dimensions (border) */
    this.final_width += 1 + 1;
    this.final_height += 1 + 1;
  }
}

/*********************************************************************/
class LinearLayout extends CommonLayout
{
  calculate_final_dimensions(spacer, rows_wh)
  {
    super.calculate_final_dimensions(spacer, rows_wh);
    // Add half a spacer margin to each side (to allow for arrow lines)
    if ( this.rows.length > 1 )
      this.final_width += spacer;
  }
  merge_rows(div, spacer, b_boxes, rows_wh)
  {
    const max_width = div.clientWidth - spacer;
    let i = 0;
    while ( i < (this.rows.length - 1) )
    {
      const single_row_width = rows_wh[i][0] + spacer + rows_wh[i+1][0];
      if ( single_row_width < max_width )
      {
        this.rows[i].push(...this.rows[i+1]);
        b_boxes[i].push(...b_boxes[i+1]);
        rows_wh[i] = [ single_row_width, Math.max(rows_wh[i][1], rows_wh[i+1][1]) ];
        this.rows.splice(i+1, 1);
        b_boxes.splice(i+1, 1);
        rows_wh.splice(i+1, 1);
        continue;
      }
      i++;
    }
  }
  position_elements(svg, lines_g, spacer, b_boxes, rows_wh)
  {
    const final_width = this.final_width;
    const line_width = spacer - 10;
    let y = 1;
    this.rows.forEach((row, i) =>
    {
      const row_height = rows_wh[i][1];
      const y_line_off = row_height / 2;

      let x = 1 + ((final_width - rows_wh[i][0]) / 2);
      row.forEach((el, j) =>
      {
        const b_box = b_boxes[i][j];
        const y_off = (row_height - b_box.height) / 2;
        if ( j != 0 )
        {
          /* draw line between elements */
          if ( this.draw_lines )
            new ArrowLine(svg, lines_g, this.line_colour, x + 2, y + y_line_off, line_width, 0);
          x += spacer;
        }
        el.set_g_pos(x, y + y_off);
        x += b_box.width;
      });
      y += row_height + spacer;
    });
  }
  draw_lines_between_rows(svg, lines_g, spacer, rows_wh)
  {
    const final_width = this.final_width;
    let y = 1;
    for ( let i = 1; i < rows_wh.length; i++ )
    {
      const row0w = rows_wh[i - 1][0];
      const row0h = rows_wh[i - 1][1];
      const row1w = rows_wh[i][0];
      const row1h = rows_wh[i][1];
      const row0x = ((final_width - row0w) / 2);
      const row1x = ((final_width - row1w) / 2);
      y += (row0h / 2);
      new ArrowLine(svg, lines_g, this.line_colour, (row0x + row0w +  2), y)
             .add_x((final_width - 2))
             .add_h((row0h / 2) + (spacer / 2))
             .add_x((              2))
             .add_h((spacer / 2) + (row1h / 2))
             .add_x((row1x       - 7));
      y += (row0h / 2) + spacer;
    }
  }
}

/*********************************************************************/
class SplitLayout extends CommonLayout
{
  merge_rows(div, spacer, b_boxes, rows_wh)
  {
    // NOTE: no-op
  }
  position_elements(svg, lines_g, spacer, b_boxes, rows_wh)
  {
    const final_width = this.final_width;
    let y = 1;
    const positions = [];
    this.rows.forEach((row, i) =>
    {
      const row_positions = [];
      const row_height = rows_wh[i][1];
      const nb_cols = row.length;
      const width_without_spacers = final_width - ((nb_cols - 1) * spacer);
      const width_per_col = width_without_spacers / nb_cols;

      let x = 1;
      row.forEach((el, j) =>
      {
        const b_box = b_boxes[i][j];
        const x_off = (width_per_col - b_box.width) / 2;
        const y_off = (row_height - b_box.height) / 2;
        if ( j != 0 )
          x += spacer;
        const cur_x = x + x_off;
        const cur_y = y + y_off;
        el.set_g_pos(cur_x, cur_y);
        x += width_per_col;

        const left_x   = cur_x;
        const center_x = cur_x + (b_box.width / 2);
        const right_x  = cur_x + b_box.width;
        const top_y    = cur_y;
        const center_y = cur_y + (b_box.height / 2);
        const bottom_y = cur_y + b_box.height;
        row_positions.push({
          top:    { x: center_x, y: top_y    },
          bottom: { x: center_x, y: bottom_y },
          left:   { x: left_x,   y: center_y },
          right:  { x: right_x,  y: center_y },
        });
      });
      y += row_height + spacer;
      positions.push(row_positions);
    });
    this.positions = positions;
  }
  draw_lines_between_rows(svg, lines_g, spacer, rows_wh)
  {
    const positions = this.positions;
    const line_height = spacer - 10;
    let prev_positions = positions[0];
    let nb_prev = prev_positions.length;
    for ( let i = 1; i < positions.length; i++ )
    {
      const cur_positions = positions[i];
      const nb_cur = cur_positions.length;
      if ( nb_prev == nb_cur )
      {
        // straight down
        for ( let j = 0; j < nb_cur; j++ )
        {
          new ArrowLine(svg, svg, this.line_colour, prev_positions[j].bottom.x, prev_positions[j].bottom.y + 2)
                 .add_y(cur_positions[j].top.y - 8);
        }
      }
      else if ( nb_prev == 1 )
      {
        // split
        const prev_position = prev_positions[0];
        for ( let j = 0; j < nb_cur; j++ )
        {
          const cur_position = cur_positions[j];
          const line = new ArrowLine(svg, svg, this.line_colour, prev_position.bottom.x, prev_position.bottom.y + 2);
          if ( cur_position.top.x != prev_position.bottom.x )
          {
            line.add_y(cur_position.top.y - 15);
            line.add_x(cur_position.top.x);
          }
          line.add_y(cur_position.top.y - 8);
        }
      }
      else if ( nb_cur == 1 )
      {
        // join
        const cur_position = cur_positions[0];
        for ( let j = 0; j < nb_prev; j++ )
        {
          const prev_position = prev_positions[j];
          const line = new ArrowLine(svg, svg, this.line_colour, prev_position.bottom.x, prev_position.bottom.y + 2);
          if ( cur_position.top.x != prev_position.bottom.x )
          {
            line.add_y(cur_position.top.y - 15);
            line.add_x(cur_position.top.x);
          }
          line.add_y(cur_position.top.y - 8);
        }
      }
      else
      {
        console.error("wtf??");
      }
      prev_positions = cur_positions;
      nb_prev = nb_cur;
    }
  }
  backup_draw_lines_between_rows(svg, lines_g, spacer, rows_wh)
  {
    const positions = this.positions;
    const line_height = spacer - 10;
    let prev_positions = positions[0];
    let nb_prev = prev_positions.length;
    for ( let i = 1; i < positions.length; i++ )
    {
      const cur_positions = positions[i];
      const nb_cur = cur_positions.length;
      if ( nb_prev == nb_cur )
      {
        // straight down
        for ( let j = 0; j < nb_cur; j++ )
        {
          new ArrowLine(svg, svg, this.line_colour, prev_positions[j].bottom.x, prev_positions[j].bottom.y + 2)
                 .add_y(cur_positions[j].top.y - 8);
        }
      }
      else if ( nb_prev == 1 )
      {
        // split
        const prev_position = prev_positions[0];
        for ( let j = 0; j < nb_cur; j++ )
        {
          const cur_position = cur_positions[j];
          if ( cur_position.top.x == prev_position.bottom.x )
          {
            // straight down
            new ArrowLine(svg, svg, this.line_colour, prev_position.bottom.x, prev_position.bottom.y + 2)
                   .add_y(cur_position.top.y - 8);
          }
          else if ( cur_position.top.x < prev_position.left.x )
          {
            new ArrowLine(svg, svg, this.line_colour, prev_position.left.x - 2, prev_position.left.y)
                   .add_x(cur_position.top.x)
                   .add_y(cur_position.top.y - 8);
          }
          else if ( cur_position.top.x > prev_position.right.x )
          {
            new ArrowLine(svg, svg, this.line_colour, prev_position.right.x + 2, prev_position.right.y)
                   .add_x(cur_position.top.x)
                   .add_y(cur_position.top.y - 8);
          }
          else
          {
            console.error("wtf?");
          }
        }
      }
      else if ( nb_cur == 1 )
      {
        // join
        const cur_position = cur_positions[0];
        for ( let j = 0; j < nb_prev; j++ )
        {
          const prev_position = prev_positions[j];
          if ( prev_position.bottom.x == cur_position.top.x )
          {
            // straight down
            new ArrowLine(svg, svg, this.line_colour, prev_position.bottom.x, prev_position.bottom.y + 2)
                   .add_y(cur_position.top.y - 8);
          }
          else if ( prev_position.bottom.x < cur_position.left.x )
          {
            new ArrowLine(svg, svg, this.line_colour, prev_position.bottom.x, prev_position.bottom.y + 2)
                   .add_y(cur_position.left.y)
                   .add_x(cur_position.left.x - 8);
          }
          else if ( prev_position.bottom.x > cur_position.top.x )
          {
            new ArrowLine(svg, svg, this.line_colour, prev_position.bottom.x, prev_position.bottom.y + 2)
                   .add_y(cur_position.right.y)
                   .add_x(cur_position.right.x + 8);
          }
          else
          {
            console.error("wtf?");
          }
        }
      }
      else
      {
        console.error("wtf??");
      }
      prev_positions = cur_positions;
      nb_prev = nb_cur;
    }
  }
}

/*********************************************************************/
export function div_append_caption(div, caption)
{
  const p = document.createElement("p");
  if ( caption !== undefined )
  {
    p.style.textAlign = "center";
    p.style.fontSize = "0.8em";
    p.style.display = "block";
    const em = document.createElement("em");
    em.innerText = `(${caption})`;
    p.append(em);
  }
  div.append(p);
}

/*********************************************************************/
class FFSvg
{
  constructor(div, spacer, line_colour, caption)
  {
    this.draw_lines = (line_colour !== undefined);

    /* clear div */
    div.innerHTML = "";

    const svg = document.createElementNS(svg_ns, "svg");
    svg.setAttribute("font-family", "monospace");
    svg.setAttribute("font-size", "12px");
    div.append(svg);

    div_append_caption(div, caption);

    if ( this.draw_lines )
    {
      const defs = document.createElementNS(svg_ns, "defs");
      svg_defs_add_line(defs, line_colour);
      svg.append(defs);
    }

    this.svg = svg;
    this.div = div;
  }
  finish_up(prepend_lines)
  {
    if ( this.draw_lines )
    {
      const lines_g = document.createElementNS(svg_ns, "g");
      if ( prepend_lines )
        this.svg.prepend(lines_g);
      else
        this.svg.append(lines_g);
      this.lines_g = lines_g;
    }
    this.layout.position(this.div, this.svg, this.lines_g);
    const final_width = this.layout.final_width;
    const final_height = this.layout.final_height;
    this.svg.setAttribute("width", final_width + "px");
    this.svg.setAttribute("height", final_height + "px");
    this.svg.style.width = final_width + "px";
    this.svg.style.height = final_height + "px";
    this.svg.style.margin = "0 auto";
    this.svg.style.display = "block";
  }
}

/*********************************************************************/
export class LinearSVG extends FFSvg
{
  constructor(div, spacer, line_colour, caption)
  {
    super(div, spacer, line_colour, caption);
    this.layout = new LinearLayout(spacer, line_colour);
  }
}

/*********************************************************************/
export class SplitSVG extends FFSvg
{
  constructor(div, spacer, line_colour, caption)
  {
    super(div, spacer, line_colour, caption);
    this.layout = new SplitLayout(spacer, line_colour);
  }
}
