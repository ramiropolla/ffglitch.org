/*
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

  * Neither the name of Adobe Systems Incorporated nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*
JPEG encoder ported to JavaScript and optimized by Andreas Ritter, www.bytestrom.eu, 11/2009

Basic GUI blocking jpeg encoder
*/

export const zig_zag = [
   0,  1,  5,  6, 14, 15, 27, 28,
   2,  4,  7, 13, 16, 26, 29, 42,
   3,  8, 12, 17, 25, 30, 41, 43,
   9, 11, 18, 24, 31, 40, 44, 53,
  10, 19, 23, 32, 39, 45, 52, 54,
  20, 22, 33, 38, 46, 51, 55, 60,
  21, 34, 37, 47, 50, 56, 59, 61,
  35, 36, 48, 49, 57, 58, 62, 63,
];

const std_luminance_quant_tbl = [
  16, 11, 10, 16, 24, 40, 51, 61,
  12, 12, 14, 19, 26, 58, 60, 55,
  14, 13, 16, 24, 40, 57, 69, 56,
  14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68,109,103, 77,
  24, 35, 55, 64, 81,104,113, 92,
  49, 64, 78, 87,103,121,120,101,
  72, 92, 95, 98,112,100,103, 99,
];

const std_chrominance_quant_tbl = [
  17, 18, 24, 47, 99, 99, 99, 99,
  18, 21, 26, 66, 99, 99, 99, 99,
  24, 26, 56, 99, 99, 99, 99, 99,
  47, 66, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99,
];

function clip_val(val, min, max)
{
  if ( val < min )
    val = min;
  else if ( val > max )
    val = max;
  return val;
}

/*********************************************************************/
function lround(x)
{
  const sign = Math.sign(x);
  x = Math.round(Math.abs(x));
  if ( x === 0 )
    return 0;
  return sign * x;
}

/*********************************************************************/
export class DCTQuant
{
  constructor(quality)
  {
    this.pre_aantable = new Float32Array(64);
    this.post_aantable = new Float32Array(64);
    this.YTable = new Uint8Array(64);
    this.UVTable = new Uint8Array(64);
    this.fdtbl_Y = new Float32Array(64);
    this.fdtbl_UV = new Float32Array(64);

    quality = clip_val(quality, 1, 100);

    let scale_factor = 0;
    if (quality < 50)
      scale_factor = Math.floor(5000 / quality);
    else
      scale_factor = Math.floor(200 - quality*2);

    this.initQuantTables(scale_factor);
  }

  initQuantTables(scale_factor)
  {
    for ( let i = 0; i < 64; i++ )
    {
      let y_val  = Math.floor((std_luminance_quant_tbl[i]   * scale_factor + 50) / 100);
      let uv_val = Math.floor((std_chrominance_quant_tbl[i] * scale_factor + 50) / 100);
      this.YTable [zig_zag[i]] = clip_val(y_val,  1, 255);
      this.UVTable[zig_zag[i]] = clip_val(uv_val, 1, 255);
      this.fdtbl_Y[i]  = 1.0 / this.YTable [zig_zag[i]];
      this.fdtbl_UV[i] = 1.0 / this.UVTable[zig_zag[i]];
    }

    this.cos2         = Math.cos((Math.PI * 2) / 16);
    this.cos4         = Math.cos((Math.PI * 4) / 16);
    this.cos6         = Math.cos((Math.PI * 6) / 16);
    this.cos2_sqrt2   = Math.cos((Math.PI * 2) / 16) * Math.SQRT2;
    this.cos6_sqrt2   = Math.cos((Math.PI * 6) / 16) * Math.SQRT2;

    this.cos2_2       = this.cos2 * 2.0;
    this.cos4_2       = this.cos4 * 2.0;
    this.cos6_2       = this.cos6 * 2.0;
    this.cos2_sqrt2_2 = this.cos2_sqrt2 * 2.0;
    this.cos6_sqrt2_2 = this.cos6_sqrt2 * 2.0;

    let aanscalefactor = new Float32Array(8);
    aanscalefactor[0] = 1;
    aanscalefactor[1] = Math.cos((Math.PI * 1) / 16) * Math.SQRT2;
    aanscalefactor[2] = this.cos2_sqrt2;
    aanscalefactor[3] = Math.cos((Math.PI * 3) / 16) * Math.SQRT2;
    aanscalefactor[4] = 1; // Math.cos((Math.PI * 4) / 16) * Math.SQRT2
    aanscalefactor[5] = Math.cos((Math.PI * 5) / 16) * Math.SQRT2;
    aanscalefactor[6] = this.cos6_sqrt2;
    aanscalefactor[7] = Math.cos((Math.PI * 7) / 16) * Math.SQRT2;
    for ( let row = 0; row < 8; row++ )
    {
      for ( let col = 0; col < 8; col++ )
      {
        this.post_aantable[row * 8 + col] = 1.0 / (aanscalefactor[row] * aanscalefactor[col] * 8.0);
        this.pre_aantable[row * 8 + col] = (aanscalefactor[row] * aanscalefactor[col]) / 8;
      }
    }
  }

  // Letters in the (I)DCT code

  // p =>       = +1.000 = plus one
  // A =>         +0.383 = +cos6
  // B =>         +0.541 = +cos6_sqrt2
  // C =>         +0.707 = +cos4
  // D =>         +1.307 = +cos2_sqrt2
  // E => A + B = +0.924 = +cos2
  // F => p + C = +1.707 = +1+cos4
  // G => p - C = +0.293 = +1-cos4
  // H => p + a = +0.617 = +1-cos6
  // I => C + A = +1.090 = +cos4+cos6
  // J => c + E = +0.217 = -cos4+cos2
  // K => p + E = +1.924 = +1+cos2
  // L => C + E = +1.631 = +cos4+cos2
  // N => p - E = +0.076 = +1-cos2
  // O => C - A = +0.324 = +cos4-cos6
  // Q => p - a = +1.383 = +1+cos6
  // R =>         +0.414 = (+1-cos4)*sqrt2
  // S =>         +1.414 = +1+(+1-cos4)*sqrt2

  // m =>       = -1.000 = minus one
  // a =>         -0.383 = -cos6
  // b =>         -0.541 = -cos6_sqrt2
  // c =>         -0.707 = -cos4
  // d =>         -1.307 = -cos2_sqrt2
  // e => a + b = -0.924 = -cos2
  // f => m + c = -1.707 = -1-cos4
  // g => m - c = -0.293 = -1+cos4
  // h => m + A = -0.617 = -1+cos6
  // i => c + a = -1.090 = -cos4-cos6
  // j => C + e = -0.217 = +cos4-cos2
  // k => m + e = -1.924 = -1-cos2
  // l => c + e = -1.631 = -cos4-cos2
  // n => m - e = -0.076 = -1+cos2
  // o => c - a = -0.324 = -cos4+cos6
  // q => m - A = -1.383 = -1-cos6
  // r =>         -0.414 = (-1+cos4)*sqrt2
  // s =>         -1.414 = -1-(+1-cos4)*sqrt2

  // forward DCT
  DCT(input)
  {
    // make a copy
    let coeffs = new Float32Array(input);

    // rows
    let p = 0;
    for ( let i = 0; i < 8; i++ )
    {
      // stage 0
      const p_______ = coeffs[p + 0];
      const _p______ = coeffs[p + 1];
      const __p_____ = coeffs[p + 2];
      const ___p____ = coeffs[p + 3];
      const ____p___ = coeffs[p + 4];
      const _____p__ = coeffs[p + 5];
      const ______p_ = coeffs[p + 6];
      const _______p = coeffs[p + 7];

      // stage 1
      const p______p = p_______ + _______p;
      const _p____p_ = _p______ + ______p_;
      const __p__p__ = __p_____ + _____p__;
      const ___pp___ = ___p____ + ____p___;
      const ___pm___ = ___p____ - ____p___;
      const __p__m__ = __p_____ - _____p__;
      const _p____m_ = _p______ - ______p_;
      const p______m = p_______ - _______p;

      // stage 2
      const p__pp__p = p______p + ___pp___;
      const _pp__pp_ = _p____p_ + __p__p__;
      const _pm__mp_ = _p____p_ - __p__p__;
      const p__mm__p = p______p - ___pp___;
      const __ppmm__ = __p__m__ + ___pm___;
      const _pp__mm_ = _p____m_ + __p__m__;
      const pp____mm = p______m + _p____m_;

      // stage 3
      const pppppppp = p__pp__p + _pp__pp_;
      const pmmppmmp = p__pp__p - _pp__pp_;
      const ppmmmmpp = _pm__mp_ + p__mm__p;

      // stage 3.33
      const mmppmmpp = __ppmm__ - pp____mm;

      // stage 3.67
      const CCccccCC = ppmmmmpp * this.cos4;
      const __BBbb__ = __ppmm__ * this.cos6_sqrt2;
      const _CC__cc_ = _pp__mm_ * this.cos4;
      const DD____dd = pp____mm * this.cos2_sqrt2;
      const aaAAaaAA = mmppmmpp * this.cos6;

      // stage 4
      const aaEEeeAA = aaAAaaAA + __BBbb__;
      const EEAAaaee = aaAAaaAA + DD____dd;

      // stage 5
      const FCcffcCF = p__mm__p + CCccccCC;
      const GcCggCcG = p__mm__p - CCccccCC;
      const pCC__ccm = p______m + _CC__cc_;
      const pcc__CCm = p______m - _CC__cc_;

      // stage 6
      const HiJEejIh = pcc__CCm + aaEEeeAA;
      const KLIAailk = pCC__ccm + EEAAaaee;
      const NjOaAoJn = pCC__ccm - EEAAaaee;
      const QoleELOq = pcc__CCm - aaEEeeAA;

      // stage 7
      coeffs[p + 0] = pppppppp;
      coeffs[p + 1] = KLIAailk;
      coeffs[p + 2] = FCcffcCF;
      coeffs[p + 3] = QoleELOq;
      coeffs[p + 4] = pmmppmmp;
      coeffs[p + 5] = HiJEejIh;
      coeffs[p + 6] = GcCggCcG;
      coeffs[p + 7] = NjOaAoJn;

      p += 8;
    }

    // columns
    p = 0;
    for ( let i = 0; i < 8; i++ )
    {
      // stage 0
      const p_______ = coeffs[p + 0*8];
      const _p______ = coeffs[p + 1*8];
      const __p_____ = coeffs[p + 2*8];
      const ___p____ = coeffs[p + 3*8];
      const ____p___ = coeffs[p + 4*8];
      const _____p__ = coeffs[p + 5*8];
      const ______p_ = coeffs[p + 6*8];
      const _______p = coeffs[p + 7*8];

      // stage 1
      const p______p = p_______ + _______p;
      const _p____p_ = _p______ + ______p_;
      const __p__p__ = __p_____ + _____p__;
      const ___pp___ = ___p____ + ____p___;
      const ___pm___ = ___p____ - ____p___;
      const __p__m__ = __p_____ - _____p__;
      const _p____m_ = _p______ - ______p_;
      const p______m = p_______ - _______p;

      // stage 2
      const p__pp__p = p______p + ___pp___;
      const _pp__pp_ = _p____p_ + __p__p__;
      const _pm__mp_ = _p____p_ - __p__p__;
      const p__mm__p = p______p - ___pp___;
      const __ppmm__ = __p__m__ + ___pm___;
      const _pp__mm_ = _p____m_ + __p__m__;
      const pp____mm = p______m + _p____m_;

      // stage 3
      const pppppppp = p__pp__p + _pp__pp_;
      const pmmppmmp = p__pp__p - _pp__pp_;
      const ppmmmmpp = _pm__mp_ + p__mm__p;

      // stage 3.33
      const mmppmmpp = __ppmm__ - pp____mm;

      // stage 3.67
      const CCccccCC = ppmmmmpp * this.cos4;
      const __BBbb__ = __ppmm__ * this.cos6_sqrt2;
      const _CC__cc_ = _pp__mm_ * this.cos4;
      const DD____dd = pp____mm * this.cos2_sqrt2;
      const aaAAaaAA = mmppmmpp * this.cos6;

      // stage 4
      const aaEEeeAA = aaAAaaAA + __BBbb__;
      const EEAAaaee = aaAAaaAA + DD____dd;

      // stage 5
      const FCcffcCF = p__mm__p + CCccccCC;
      const GcCggCcG = p__mm__p - CCccccCC;
      const pCC__ccm = p______m + _CC__cc_;
      const pcc__CCm = p______m - _CC__cc_;

      // stage 6
      const HiJEejIh = pcc__CCm + aaEEeeAA;
      const KLIAailk = pCC__ccm + EEAAaaee;
      const NjOaAoJn = pCC__ccm - EEAAaaee;
      const QoleELOq = pcc__CCm - aaEEeeAA;

      // stage 7
      coeffs[p + 0*8] = pppppppp;
      coeffs[p + 1*8] = KLIAailk;
      coeffs[p + 2*8] = FCcffcCF;
      coeffs[p + 3*8] = QoleELOq;
      coeffs[p + 4*8] = pmmppmmp;
      coeffs[p + 5*8] = HiJEejIh;
      coeffs[p + 6*8] = GcCggCcG;
      coeffs[p + 7*8] = NjOaAoJn;

      p++;
    }

    // Apply the scaling factor for AA&N IDCT method
    for ( let i = 0; i < 64; i++ )
      coeffs[i] *= this.post_aantable[i];

    return coeffs;
  }

  // inverse DCT
  IDCT(input)
  {
    // make a copy
    let coeffs = new Float32Array(input);

    // Apply the scaling factor for AA&N IDCT method
    for ( let i = 0; i < 64; i++ )
      coeffs[i] *= this.pre_aantable[i];

    // rows
    let p = 0;
    for ( let i = 0; i < 8; i++ )
    {
      // stage 0
      const pppppppp_8 = coeffs[p + 0];
      const KLIAailk_8 = coeffs[p + 1];
      const FCcffcCF_8 = coeffs[p + 2];
      const QoleELOq_8 = coeffs[p + 3];
      const pmmppmmp_8 = coeffs[p + 4];
      const HiJEejIh_8 = coeffs[p + 5];
      const GcCggCcG_8 = coeffs[p + 6];
      const NjOaAoJn_8 = coeffs[p + 7];

      // stage 1
      const aaEEeeAA_4 = HiJEejIh_8 - QoleELOq_8;
      const pCC__ccm_4 = KLIAailk_8 + NjOaAoJn_8;
      const EEAAaaee_4 = KLIAailk_8 - NjOaAoJn_8;
      const pcc__CCm_4 = HiJEejIh_8 + QoleELOq_8;

      // stage 2
      const CCccccCC_4 = FCcffcCF_8 - GcCggCcG_8;
      const p__mm__p_4 = FCcffcCF_8 + GcCggCcG_8;
      const _CC__cc__2 = pCC__ccm_4 - pcc__CCm_4;
      const p______m_2 = pCC__ccm_4 + pcc__CCm_4;
      const BBDDddbb_4 = aaEEeeAA_4 + EEAAaaee_4;

      // stage 3
      const ppmmmmpp_4 = CCccccCC_4 * this.cos4_2;
      const rrppmmRR_4 = aaEEeeAA_4 * this.cos6_sqrt2_2;
      const _pp__mm__2 = _CC__cc__2 * this.cos4_2;
      const SSppmmss_4 = EEAAaaee_4 * this.cos2_sqrt2_2;
      const RRppmmrr_4 = BBDDddbb_4 * this.cos6_2;

      // stage 4
      const p__pp__p_4 = pppppppp_8 + pmmppmmp_8;
      const _pp__pp__4 = pppppppp_8 - pmmppmmp_8;
      const _pm__mp__4 = ppmmmmpp_4 - p__mm__p_4;
      const __ppmm___2 = rrppmmRR_4 + RRppmmrr_4;
      const ppp__mmm_2 = _pp__mm__2 + p______m_2;
      const pp____mm_2 = SSppmmss_4 - RRppmmrr_4;

      // stage 4.5
      const __p__m___2 = ppp__mmm_2 - pp____mm_2;

      // stage 5
      const p______p_2 = p__pp__p_4 + p__mm__p_4;
      const _p____p__2 = _pp__pp__4 + _pm__mp__4;
      const __p__p___2 = _pp__pp__4 - _pm__mp__4;
      const ___pp____2 = p__pp__p_4 - p__mm__p_4;
      const ___pm____2 = __ppmm___2 - __p__m___2;
      const _p____m__2 = pp____mm_2 - p______m_2;

      // stage 6
      const p_______ = p______p_2 + p______m_2;
      const _p______ = _p____p__2 + _p____m__2;
      const __p_____ = __p__p___2 + __p__m___2;
      const ___p____ = ___pp____2 + ___pm____2;
      const ____p___ = ___pp____2 - ___pm____2;
      const _____p__ = __p__p___2 - __p__m___2;
      const ______p_ = _p____p__2 - _p____m__2;
      const _______p = p______p_2 - p______m_2;

      // stage 7
      coeffs[p + 0] = p_______;
      coeffs[p + 1] = _p______;
      coeffs[p + 2] = __p_____;
      coeffs[p + 3] = ___p____;
      coeffs[p + 4] = ____p___;
      coeffs[p + 5] = _____p__;
      coeffs[p + 6] = ______p_;
      coeffs[p + 7] = _______p;

      p += 8;
    }

    // columns
    p = 0;
    for ( let i = 0; i < 8; i++ )
    {
      // stage 0
      const pppppppp_8 = coeffs[p + 0*8];
      const KLIAailk_8 = coeffs[p + 1*8];
      const FCcffcCF_8 = coeffs[p + 2*8];
      const QoleELOq_8 = coeffs[p + 3*8];
      const pmmppmmp_8 = coeffs[p + 4*8];
      const HiJEejIh_8 = coeffs[p + 5*8];
      const GcCggCcG_8 = coeffs[p + 6*8];
      const NjOaAoJn_8 = coeffs[p + 7*8];

      // stage 1
      const aaEEeeAA_4 = HiJEejIh_8 - QoleELOq_8;
      const pCC__ccm_4 = KLIAailk_8 + NjOaAoJn_8;
      const EEAAaaee_4 = KLIAailk_8 - NjOaAoJn_8;
      const pcc__CCm_4 = HiJEejIh_8 + QoleELOq_8;

      // stage 2
      const CCccccCC_4 = FCcffcCF_8 - GcCggCcG_8;
      const p__mm__p_4 = FCcffcCF_8 + GcCggCcG_8;
      const _CC__cc__2 = pCC__ccm_4 - pcc__CCm_4;
      const p______m_2 = pCC__ccm_4 + pcc__CCm_4;
      const BBDDddbb_4 = aaEEeeAA_4 + EEAAaaee_4;

      // stage 3
      const ppmmmmpp_4 = CCccccCC_4 * this.cos4_2;
      const rrppmmRR_4 = aaEEeeAA_4 * this.cos6_sqrt2_2;
      const _pp__mm__2 = _CC__cc__2 * this.cos4_2;
      const SSppmmss_4 = EEAAaaee_4 * this.cos2_sqrt2_2;
      const RRppmmrr_4 = BBDDddbb_4 * this.cos6_2;

      // stage 4
      const p__pp__p_4 = pppppppp_8 + pmmppmmp_8;
      const _pp__pp__4 = pppppppp_8 - pmmppmmp_8;
      const _pm__mp__4 = ppmmmmpp_4 - p__mm__p_4;
      const __ppmm___2 = rrppmmRR_4 + RRppmmrr_4;
      const ppp__mmm_2 = _pp__mm__2 + p______m_2;
      const pp____mm_2 = SSppmmss_4 - RRppmmrr_4;

      // stage 4.5
      const __p__m___2 = ppp__mmm_2 - pp____mm_2;

      // stage 5
      const p______p_2 = p__pp__p_4 + p__mm__p_4;
      const _p____p__2 = _pp__pp__4 + _pm__mp__4;
      const __p__p___2 = _pp__pp__4 - _pm__mp__4;
      const ___pp____2 = p__pp__p_4 - p__mm__p_4;
      const ___pm____2 = __ppmm___2 - __p__m___2;
      const _p____m__2 = pp____mm_2 - p______m_2;

      // stage 6
      const p_______ = p______p_2 + p______m_2;
      const _p______ = _p____p__2 + _p____m__2;
      const __p_____ = __p__p___2 + __p__m___2;
      const ___p____ = ___pp____2 + ___pm____2;
      const ____p___ = ___pp____2 - ___pm____2;
      const _____p__ = __p__p___2 - __p__m___2;
      const ______p_ = _p____p__2 - _p____m__2;
      const _______p = p______p_2 - p______m_2;

      // stage 7
      coeffs[p + 0*8] = p_______;
      coeffs[p + 1*8] = _p______;
      coeffs[p + 2*8] = __p_____;
      coeffs[p + 3*8] = ___p____;
      coeffs[p + 4*8] = ____p___;
      coeffs[p + 5*8] = _____p__;
      coeffs[p + 6*8] = ______p_;
      coeffs[p + 7*8] = _______p;

      p++;
    }

    let pixels = new Uint8Array(64);
    for ( let i = 0; i < 64; i++ )
    {
      const val = Math.round(coeffs[i]);
      pixels[i] = (val <   0) ?   0
                : (val > 255) ? 255
                :               val;
    }

    return pixels;
  }

  Quant(coeffs, is_luma)
  {
    const fdtbl = is_luma ? this.fdtbl_Y : this.fdtbl_UV;
    // Apply the quantization and round to nearest integer
    let ret = new Int16Array(64);
    for ( let i = 0; i < 64; i++ )
      ret[i] = lround(coeffs[i] * fdtbl[i]);
    return ret;
  }
}
