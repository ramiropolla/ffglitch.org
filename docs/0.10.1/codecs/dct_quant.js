/*********************************************************************/
import { BlockData } from "./utils/block_data.js";
import { frame_convert_pixfmt, frame_from_data } from "./utils/rgb2yuv.js";
import { DCTDraw } from "./ui/draw_dct.js";
import { DCTQuant } from "./utils/dctquant.js";
import { init_xnames, set_xnames } from "./utils/xnames.js";

/*********************************************************************/
const svg_ns = "http://www.w3.org/2000/svg";

/*********************************************************************/
const dctquant = new DCTQuant(90);

/*********************************************************************/
/* block data in different pixel formats */
const frame_rgb = BlockData.mario_rgb;
const frame_yuv = frame_convert_pixfmt(frame_rgb, "yuv444p");
const frame_y = frame_convert_pixfmt(frame_yuv, "y");

/* dct data */
const dct_in = frame_y.data[0];
const dct_width = frame_y.width;
const dct_height = frame_y.height;
const dct_out = dctquant.DCT(dct_in);

/*********************************************************************/
const dct_magic            = document.getElementById("dct_magic");
const idct_magic           = document.getElementById("idct_magic");
const idct_dc              = document.getElementById("idct_dc");
const idct_ac              = document.getElementById("idct_ac");
const quantized_coeffs     = document.getElementById("quantized_coeffs");
const dequantized_coeffs   = document.getElementById("dequantized_coeffs");
const quant_idct_value     = document.getElementById("quant_idct_value");
const diff_blocks          = document.getElementById("diff_blocks");
const diff_values          = document.getElementById("diff_values");
const p_ac_dc_math         = document.getElementById("p_ac_dc_math");
const p_quant              = document.getElementById("p_quant");
const p_dequant            = document.getElementById("p_dequant");
const quantizer_slide      = document.getElementById("quantizer_slide");
const quantizer_span       = document.getElementById("quantizer_span");
const jpeg_quant_tables    = document.getElementById("jpeg_quant_tables");
const jpeg_example_quant   = document.getElementById("jpeg_example_quant");
const jpeg_example_dequant = document.getElementById("jpeg_example_dequant");
const jpeg_example_idct    = document.getElementById("jpeg_example_idct");
const mpeg2_quant_tables   = document.getElementById("mpeg2_quant_tables");
const mpeg4_quant_tables   = document.getElementById("mpeg4_quant_tables");

/*********************************************************************/
quantizer_slide.onchange = function()
{
  redraw_quant_section(frame_yuv, dct_out, this.value);
}

/*********************************************************************/
init_xnames(p_ac_dc_math);
init_xnames(p_quant);
init_xnames(p_dequant);

/*********************************************************************/
function redraw_dct_section(frame_yuv, dct_in, dct_out)
{
  /*********************************************************************/
  const idct_in = dct_out;
  const idct_out = dctquant.IDCT(idct_in);
  const frame_idct = frame_from_data(idct_out, dct_width, dct_height);
  /*********************************************************************/
  const idct_in_dc = dct_out.slice().fill(0, 1);
  const idct_out_dc = dctquant.IDCT(idct_in_dc);
  const frame_idct_dc = frame_from_data(idct_out_dc, dct_width, dct_height);
  /*********************************************************************/
  const idct_in_ac = dct_out.slice().fill(0, 0, 1);
  const idct_out_ac = dctquant.IDCT(idct_in_ac);
  const frame_idct_ac = frame_from_data(idct_out_ac, dct_width, dct_height);
  /*********************************************************************/
  DCTDraw.dct (dct_magic,  frame_yuv,  dct_out,       "Mario luma plane to DCT coefficients");
  DCTDraw.idct(idct_magic, dct_out,    frame_idct,    "Mario DCT coefficients back to luma plane");
  DCTDraw.idct(idct_dc,    idct_in_dc, frame_idct_dc, "Mario DC DCT coefficient back to luma plane");
  DCTDraw.idct(idct_ac,    idct_in_ac, frame_idct_ac, "Mario AC DCT coefficients back to luma plane");
  set_xnames(p_ac_dc_math, "orig0", dct_in[0]);
  set_xnames(p_ac_dc_math, "dc0",   idct_out_dc[0]);
  set_xnames(p_ac_dc_math, "ac0",   idct_out_ac[0]);
}

/*********************************************************************/
function redraw_quant_section(frame_yuv, dct_out, dquant)
{
  /*********************************************************************/
  const quantization_table = new Int16Array(64).fill(dquant);
  const q_coeffs = dctquant.quant_with_table(dct_out, quantization_table);
  /*********************************************************************/
  const dq_coeffs = dctquant.dequant_with_table(q_coeffs, quantization_table);
  /*********************************************************************/
  const idct_out = dctquant.IDCT(dq_coeffs);
  const dq_frame = frame_from_data(idct_out, dct_width, dct_height);
  /*********************************************************************/
  DCTDraw.q_coeffs   (quantized_coeffs,   dct_out,   dquant, q_coeffs,  `Mario DCT coefficients quantized by ${dquant}`);
  DCTDraw.dq_coeffs  (dequantized_coeffs, q_coeffs,  dquant, dq_coeffs, `Mario quantized DCT coefficients dequantized by ${dquant}`);
  DCTDraw.idct       (quant_idct_value,   dq_coeffs, dq_frame,          `Mario DCT coefficients, quantized and dequantized by ${dquant}, back to luma plane`);
  DCTDraw.blocks     (diff_blocks,        frame_yuv, dq_frame,          "Mario, original and reconstructed");
  DCTDraw.diff_values(diff_values,        frame_yuv, dq_frame,          "Mario, original and reconstructed values, and their difference");
  set_xnames(p_quant, "q", dquant);
  set_xnames(p_dequant, "q", dquant);
  /*********************************************************************/
  quantizer_span.innerText = dquant;
}

/*********************************************************************/
function redraw_quant_table_section(dct_out)
{
  /*********************************************************************/
  const std_mpeg2_intra_quant_tbl = DCTQuant.std_mpeg2_intra_quant_tbl;
  const std_mpeg2_non_intra_quant_tbl = DCTQuant.std_mpeg2_non_intra_quant_tbl;
  /*********************************************************************/
  const std_mpeg4_intra_quant_tbl = DCTQuant.std_mpeg4_intra_quant_tbl;
  const std_mpeg4_non_intra_quant_tbl = DCTQuant.std_mpeg4_non_intra_quant_tbl;
  /*********************************************************************/
  const std_jpeg_luma_quant_tbl = DCTQuant.std_luminance_quant_tbl;
  const std_jpeg_chroma_quant_tbl = DCTQuant.std_chrominance_quant_tbl;
  /*********************************************************************/
  const jpeg_q_coeffs = dctquant.quant_with_table(dct_out, std_jpeg_luma_quant_tbl);
  /*********************************************************************/
  const jpeg_dq_coeffs = dctquant.dequant_with_table(jpeg_q_coeffs, std_jpeg_luma_quant_tbl);
  /*********************************************************************/
  const jpeg_dq_frame = frame_from_data(dctquant.IDCT(jpeg_dq_coeffs), dct_width, dct_height);

  /*********************************************************************/
  DCTDraw.quant_tables  (mpeg2_quant_tables,   std_mpeg2_intra_quant_tbl, std_mpeg2_non_intra_quant_tbl,                 "MPEG-2 quantization tables");
  DCTDraw.quant_tables  (mpeg4_quant_tables,   std_mpeg4_intra_quant_tbl, std_mpeg4_non_intra_quant_tbl,                 "MPEG-4 quantization tables");
  DCTDraw.quant_tables  (jpeg_quant_tables,    std_jpeg_luma_quant_tbl,   std_jpeg_chroma_quant_tbl,                     "JPEG quantization tables");
  DCTDraw.quantization  (jpeg_example_quant,   dct_out,                   std_jpeg_luma_quant_tbl,       jpeg_q_coeffs,  "Mario DCT coefficients quantized by JPEG luma table");
  DCTDraw.dequantization(jpeg_example_dequant, jpeg_q_coeffs,             std_jpeg_luma_quant_tbl,       jpeg_dq_coeffs, "Mario quantized DCT coefficients dequantized by JPEG luma table");
  DCTDraw.idct          (jpeg_example_idct,    jpeg_dq_coeffs,                                           jpeg_dq_frame,  "Mario DCT coefficients, quantized and dequantized by JPEG luma table, back to luma plane");
}

/*********************************************************************/
redraw_dct_section(frame_yuv, dct_in, dct_out);
redraw_quant_section(frame_yuv, dct_out, quantizer_slide.value);
redraw_quant_table_section(dct_out);
