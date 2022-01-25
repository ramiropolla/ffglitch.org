/*********************************************************************/
import { BlockData } from "./utils/block_data.js";
import { frame_convert_pixfmt } from "./utils/rgb2yuv.js";
import { DCTQuant } from "./utils/dctquant.js";
import { DCTDraw } from "./ui/draw_dct.js";
import { YUVDraw } from "./ui/draw_yuv.js";
import { ZZDraw } from "./ui/draw_zigzag.js";
import { init_xnames, set_xnames } from "./utils/xnames.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
const dctquant = new DCTQuant(90);

/*********************************************************************/
/* block data in different pixel formats */
const frame_rgb = BlockData.monalisa_rgb;
const frame_yuv = frame_convert_pixfmt(frame_rgb, "yuv444p");
const frame_y = frame_convert_pixfmt(frame_yuv, "y");

/* dct data */
const dct_in = frame_y.data[0];
const dct_width = frame_y.width;
const dct_height = frame_y.height;
const dct_out = dctquant.DCT(dct_in);

/*********************************************************************/
const zz_block             = document.getElementById("zz_block");
const zz_dct               = document.getElementById("zz_dct");
const zz_quantize          = document.getElementById("zz_quantize");
const zz_zz                = document.getElementById("zz_zz");
const zz_zigzag_flat_split = document.getElementById("zz_zigzag_flat_split");
const zz_q_coeffs          = document.getElementById("zz_q_coeffs");
const zz_line_zigzag       = document.getElementById("zz_line_zigzag");
const zz_line_zigzag_rle_0 = document.getElementById("zz_line_zigzag_rle_0");
const p_rle                = document.getElementById("p_rle");
const zz_line_zigzag_rle_1 = document.getElementById("zz_line_zigzag_rle_1");
const zz_line_zigzag_rle_2 = document.getElementById("zz_line_zigzag_rle_2");
const zz_line_zigzag_rle_3 = document.getElementById("zz_line_zigzag_rle_3");
const zz_line_zigzag_rle_4 = document.getElementById("zz_line_zigzag_rle_4");

/*********************************************************************/
init_xnames(p_rle);

/*********************************************************************/
function redraw_zz_section(dct_out, frame_rgb, frame_yuv)
{
  /*********************************************************************/
  /* TODO deduplicate */
  const std_jpeg_luma_quant_tbl = DCTQuant.std_luminance_quant_tbl;
  const jpeg_q_coeffs = dctquant.quant_with_table(dct_out, std_jpeg_luma_quant_tbl);
  /*********************************************************************/
  const zigzag = ZZDraw.zig_zag_direct;
  /*********************************************************************/
  const line_zigzag = dctquant.do_scan(jpeg_q_coeffs, zigzag);
  const line_zigzag_rle_0 = dctquant.do_rle(line_zigzag, 0);
  const line_zigzag_rle_1 = dctquant.do_rle(line_zigzag, 1);
  const line_zigzag_rle_2 = dctquant.do_rle(line_zigzag, 2);

  /*********************************************************************/
  YUVDraw.rgb2yuv(zz_block, "RGB2YUV", [ frame_rgb, frame_yuv ], "Mona Lisa from RGB to YUV pixel values");
  DCTDraw.dct(zz_dct, frame_yuv, dct_out, "Mona Lisa luma plane to DCT coefficients");
  DCTDraw.quantization(zz_quantize, dct_out, std_jpeg_luma_quant_tbl, jpeg_q_coeffs, "Mona Lisa DCT coefficients quantized by JPEG luma table");
  ZZDraw.draw_zigzag(zz_zz);
  ZZDraw.draw_scan_line(zz_zigzag_flat_split, zigzag);
  ZZDraw.coeffs(zz_q_coeffs, jpeg_q_coeffs);
  ZZDraw.draw_coeff_line(zz_line_zigzag, line_zigzag);
  ZZDraw.draw_rle_line(zz_line_zigzag_rle_0, line_zigzag_rle_0);
  set_xnames(p_rle, "p", line_zigzag_rle_0.length);
  ZZDraw.draw_rle_line(zz_line_zigzag_rle_1, line_zigzag_rle_1);
  ZZDraw.draw_rle_line(zz_line_zigzag_rle_2, line_zigzag_rle_2);
}

/*********************************************************************/
redraw_zz_section(dct_out, frame_rgb, frame_yuv);
