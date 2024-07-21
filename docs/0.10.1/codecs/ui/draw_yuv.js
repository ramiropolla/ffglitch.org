/*********************************************************************/
import { Canvas } from "./canvas.js";
import { Table } from "./table.js";
import { Text } from "./text.js";
import { Pixels } from "./pixels.js";
import { div_append_caption } from "./ffsvg.js";
import { svg_defs_add_line, ArrowLine } from "./line.js";
import { SplitSVG } from "./ffsvg.js";
import { frame_convert_pixfmt } from "../utils/rgb2yuv.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
export class CommonYUVDraw
{
  constructor(div, caption)
  {
    this.ffsvg = new SplitSVG(div, 24, "grey", caption);
    // this.ffsvg = new SplitSVG(div, 16, "grey", caption);
    this.svg = this.ffsvg.svg;
  }
  add_rgb(frame)
  {
    const pixels = new Pixels(this.svg, frame.width, frame.height);
    pixels.redraw_rgb(frame);
    this.ffsvg.layout.add_to_row(pixels);
    this.ffsvg.layout.new_row();
    return this;
  }
  add_3_rgb(frames)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const frame = frames[i];
      const pixels = new Pixels(this.svg, frame.width, frame.height);
      pixels.redraw_rgb(frame);
      this.ffsvg.layout.add_to_row(pixels);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  add_canvas_rgb(frame)
  {
    const canvas = new Canvas(this.svg, frame.width, frame.height);
    canvas.redraw_rgb(frame);
    this.ffsvg.layout.add_to_row(canvas);
    this.ffsvg.layout.new_row();
    return this;
  }
  add_canvas_3_rgb(frames)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const frame = frames[i];
      const canvas = new Canvas(this.svg, frame.width, frame.height);
      canvas.redraw_rgb(frame);
      this.ffsvg.layout.add_to_row(canvas);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  add_text(text_str)
  {
    const text = new Text(this.svg, text_str, 8);
    text.rect.setAttribute("fill", "grey");
    this.ffsvg.layout.add_to_row(text);
    this.ffsvg.layout.new_row();
    return this;
  }
  add_rgb_split(frame)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const pixels = new Pixels(this.svg, frame.width, frame.height);
      const frame_compn = frame_convert_pixfmt(frame, "rgb"[i])
      pixels.redraw_rgb(frame_compn);
      this.ffsvg.layout.add_to_row(pixels);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  add_canvas_rgb_split(frame)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const canvas = new Canvas(this.svg, frame.width, frame.height);
      const frame_compn = frame_convert_pixfmt(frame, "rgb"[i])
      canvas.redraw_rgb(frame_compn);
      this.ffsvg.layout.add_to_row(canvas);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  add_yuv_split(frame)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const pixels = new Pixels(this.svg, frame.width, frame.height);
      const frame_compn = frame_convert_pixfmt(frame, `false_${"yuv"[i]}`);
      pixels.redraw_rgb(frame_compn);
      this.ffsvg.layout.add_to_row(pixels);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  add_canvas_yuv_split(frame)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const canvas = new Canvas(this.svg, frame.width, frame.height);
      const frame_compn = frame_convert_pixfmt(frame, `false_${"yuv"[i]}`);
      canvas.redraw_rgb(frame_compn);
      this.ffsvg.layout.add_to_row(canvas);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  add_yuv_split_values(frame)
  {
    for ( let i = 0; i < 3; i++ )
    {
      const table = new Table(this.svg, frame.width, frame.height, 1.2, "000");
      table.redraw_yuv_compn_values(frame, i);
      this.ffsvg.layout.add_to_row(table);
    }
    this.ffsvg.layout.new_row();
    return this;
  }
  finalize()
  {
    this.ffsvg.finish_up();
  }
}

/*********************************************************************/
export class YUVDraw
{
  /*********************************************************************/
  static rgb_split(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    common.add_rgb(frames[0]);
    common.add_text(text);
    common.add_rgb_split(frames[0]);
    common.finalize();
  }
  /*********************************************************************/
  static rgb_split_canvas(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    common.add_canvas_rgb(frames[0]);
    common.add_text(text);
    common.add_canvas_rgb_split(frames[0]);
    common.finalize();
  }
  /*********************************************************************/
  static yuv_split(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    common.add_rgb(frames[0]);
    common.add_text(text);
    if ( frames.length == 4 )
      common.add_3_rgb(frames.slice(1, 4));
    else
      common.add_yuv_split(frames[1]);
    common.finalize();
  }
  /*********************************************************************/
  static yuv_split_canvas(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    common.add_canvas_rgb(frames[0]);
    common.add_text(text);
    if ( frames.length == 4 )
      common.add_canvas_3_rgb(frames.slice(1, 4));
    else
      common.add_canvas_yuv_split(frames[1]);
    common.finalize();
  }

  /*********************************************************************/
  static yuv_join(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    const frame_0 = frames.shift();
    const frames_mid = frames.slice(0, 3);
    const frame_3 = frames[3];
    const frame_3_rgb = frame_convert_pixfmt(frame_3, "rgb");
    common.add_3_rgb(frames_mid);
    common.add_yuv_split(frame_0);
    common.add_text(text);
    common.add_rgb(frame_3_rgb);
    common.finalize();
  }
  /*********************************************************************/
  static backup_yuv_join(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    // TODO simplify
    if ( frames.length == 4 )
    {
      common.add_3_rgb(frames.slice(0, 3));
      common.add_text(text);
      const frame_rgb = frame_convert_pixfmt(frames[3], "rgb")
      common.add_rgb(frame_rgb);
    }
    else
    {
      common.add_yuv_split(frames[0]);
      common.add_text(text);
      const frame_rgb = frame_convert_pixfmt(frames[1], "rgb")
      common.add_rgb(frame_rgb);
    }
    common.finalize();
  }
  /*********************************************************************/
  static yuv_join_canvas(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    common.add_canvas_yuv_split(frames[0]);
    common.add_text(text);
    common.add_canvas_rgb(frames[1]);
    common.finalize();
  }

  /*********************************************************************/
  static rgb2yuv(div, text, frames, caption)
  {
    const common = new CommonYUVDraw(div, caption);
    common.add_rgb(frames[0]);
    common.add_text(text);
    common.add_yuv_split(frames[1]);
    common.add_yuv_split_values(frames[1]);
    common.finalize();
  }
}
