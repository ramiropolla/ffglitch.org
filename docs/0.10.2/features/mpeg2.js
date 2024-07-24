import { json_output_frame } from "./json_output.js";

/*********************************************************************/
const mpeg2_info_entry = {
  type: "Object",
  fields: [
    { name: "pict_type",   informative: true, type: "pict_type" },
    { name: "interlaced",  informative: true, type: "interlaced" },
    { name: "field",       informative: true, type: "field", optional: true }, // TODO optional
    { name: "mb_type",     informative: true, type: "Array", arrlen: "mb_height", arridx: "mb_y",
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "mb_type" }, { type: "mb_type" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "mb_type" }, { type: "mb_type" } ] },
      ],
    },
  ],
};
json_output_frame("mpeg2", "info", mpeg2_info_entry);

/*********************************************************************/
const mpeg2_q_dct_entry = {
  type: "Object",
  fields: [
    { name: "data", type: "Array", arrlen: "nb_planes", arridx: "plane",
      fields: [
        { type: "Array", arrlen: "block_height", arridx: "block_y",
          fields: [
            { type: "Array", arrlen: "block_width", arridx: "block_x",
              fields: [
                { type: "Array", arrlen: "64", arridx: "coeff", inline: true, fields: [ { type: "dct_coeff_dc" }, { type: "dct_coeff_ac" }, { type: "dct_coeff_ac" } ] },
                { type: "Array", arrlen: "64", arridx: "coeff", inline: true, fields: [ { type: "dct_coeff_dc" }, { type: "dct_coeff_ac" }, { type: "dct_coeff_ac" } ] },
              ]
            },
          ]
        },
      ],
    },
    { name: "v_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "v_count" } ] },
    { name: "h_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "h_count" } ] },
    { name: "quant_index", informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "quant_index" } ] },
  ],
};
json_output_frame("mpeg2", "q_dct", mpeg2_q_dct_entry);

/*********************************************************************/
const mpeg2_q_dct_delta_entry = {
  type: "Object",
  fields: [
    { name: "data", type: "Array", arrlen: "nb_planes", arridx: "plane",
      fields: [
        { type: "Array", arrlen: "block_height", arridx: "block_y",
          fields: [
            { type: "Array", arrlen: "block_width", arridx: "block_x",
              fields: [
                { type: "Array", arrlen: "64", arridx: "coeff", inline: true, fields: [ { type: "dct_coeff_dc_delta" }, { type: "dct_coeff_ac" }, { type: "dct_coeff_ac" } ] },
                { type: "Array", arrlen: "64", arridx: "coeff", inline: true, fields: [ { type: "dct_coeff_dc_delta" }, { type: "dct_coeff_ac" }, { type: "dct_coeff_ac" } ] },
              ]
            },
          ]
        },
      ],
    },
    { name: "v_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "v_count" } ] },
    { name: "h_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "h_count" } ] },
    { name: "quant_index", informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "quant_index" } ] },
  ],
};
json_output_frame("mpeg2", "q_dct_delta", mpeg2_q_dct_delta_entry);

/*********************************************************************/
const mpeg2_q_dc_entry = {
  type: "Object",
  fields: [
    { name: "data", type: "Array", arrlen: "nb_planes", arridx: "plane",
      fields: [
        { type: "Array", arrlen: "block_height", arridx: "block_y",
          fields: [
            { type: "Array", arrlen: "block_width", arridx: "block_x", inline: true, fields: [ { type: "dct_coeff_dc" }, { type: "dct_coeff_dc" } ] },
            { type: "Array", arrlen: "block_width", arridx: "block_x", inline: true, fields: [ { type: "dct_coeff_dc" }, { type: "dct_coeff_dc" } ] },
          ]
        },
      ],
    },
    { name: "v_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "v_count" } ] },
    { name: "h_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "h_count" } ] },
    { name: "quant_index", informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "quant_index" } ] },
  ],
};
json_output_frame("mpeg2", "q_dc", mpeg2_q_dc_entry);

/*********************************************************************/
const mpeg2_q_dc_delta_entry = {
  type: "Object",
  fields: [
    { name: "data", type: "Array", arrlen: "nb_planes", arridx: "plane",
      fields: [
        { type: "Array", arrlen: "block_height", arridx: "block_y",
          fields: [
            { type: "Array", arrlen: "block_width", arridx: "block_x", inline: true, fields: [ { type: "dct_coeff_dc_delta" }, { type: "dct_coeff_dc_delta" } ] },
            { type: "Array", arrlen: "block_width", arridx: "block_x", inline: true, fields: [ { type: "dct_coeff_dc_delta" }, { type: "dct_coeff_dc_delta" } ] },
          ]
        },
      ],
    },
    { name: "v_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "v_count" } ] },
    { name: "h_count",     informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "h_count" } ] },
    { name: "quant_index", informative: true, type: "Array", arrlen: "nb_planes", arridx: "plane", inline: true, fields: [ { type: "quant_index" } ] },
  ],
};
json_output_frame("mpeg2", "q_dc_delta", mpeg2_q_dc_delta_entry);

/*********************************************************************/
const mpeg2_mv_entry = {
  type: "Object",
  fields: [
    { name: "forward",     type: "Array", arrlen: "mb_height", arridx: "mb_y", optional: true,
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV" }, { type: "MV" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV" }, { type: "MV" } ] },
      ],
    },
    { name: "backward",    type: "Array", arrlen: "mb_height", arridx: "mb_y", optional: true,
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV" }, { type: "MV" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV" }, { type: "MV" } ] },
      ],
    },
    { name: "fcode",       informative: true, type: "fcode" },
    { name: "overflow",    type: "overflow" },
  ],
};
json_output_frame("mpeg2", "mv", mpeg2_mv_entry);

/*********************************************************************/
const mpeg2_mv_delta_entry = {
  type: "Object",
  fields: [
    { name: "forward",     type: "Array", arrlen: "mb_height", arridx: "mb_y", optional: true,
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV_delta" }, { type: "MV_delta" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV_delta" }, { type: "MV_delta" } ] },
      ],
    },
    { name: "backward",    type: "Array", arrlen: "mb_height", arridx: "mb_y", optional: true,
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV_delta" }, { type: "MV_delta" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "MV_delta" }, { type: "MV_delta" } ] },
      ],
    },
    { name: "fcode",       informative: true, type: "fcode" },
    { name: "overflow",    type: "overflow" },
  ],
};
json_output_frame("mpeg2", "mv_delta", mpeg2_mv_delta_entry);

/*********************************************************************/
const mpeg2_mb_entry = {
  type: "Object",
  fields: [
    { name: "data",        type: "Array", arrlen: "mb_height", arridx: "mb_y", optional: true,
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "macroblock" }, { type: "macroblock" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "macroblock" }, { type: "macroblock" } ] },
      ],
    },
    { name: "sizes",       type: "Array", arrlen: "mb_height", arridx: "mb_y", optional: true,
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "size" }, { type: "size" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "size" }, { type: "size" } ] },
      ],
    },
  ],
};
json_output_frame("mpeg2", "mb", mpeg2_mb_entry);
