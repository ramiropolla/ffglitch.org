/*********************************************************************/
import { BlockData } from "./utils/block_data.js";
import { frame_convert_pixfmt } from "./utils/rgb2yuv.js";
import { DCTQuant } from "./utils/dctquant.js";
import { ZZDraw } from "./ui/draw_zigzag.js";

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
/* TODO deduplicate */
const std_jpeg_luma_quant_tbl = DCTQuant.std_luminance_quant_tbl;
const jpeg_q_coeffs = dctquant.quant_with_table(dct_out, std_jpeg_luma_quant_tbl);
/*********************************************************************/
const zigzag = ZZDraw.zig_zag_direct;
/*********************************************************************/
const line_zigzag = dctquant.do_scan(jpeg_q_coeffs, zigzag);
const line_zigzag_rle = dctquant.do_rle(line_zigzag, 2);

/*********************************************************************/
const zz_line_zigzag_rle = document.getElementById("zz_line_zigzag_rle");

/*********************************************************************/
ZZDraw.draw_rle_line(zz_line_zigzag_rle, line_zigzag_rle);
