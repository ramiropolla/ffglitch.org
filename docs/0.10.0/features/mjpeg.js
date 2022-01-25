import { json_output_frame } from "./json_output.js";

/*********************************************************************/
const mjpeg_q_dct_entry = {
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
json_output_frame("mjpeg", "q_dct", mjpeg_q_dct_entry);

/*********************************************************************/
const mjpeg_q_dct_delta_entry = {
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
json_output_frame("mjpeg", "q_dct_delta", mjpeg_q_dct_delta_entry);

/*********************************************************************/
const mjpeg_q_dc_entry = {
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
json_output_frame("mjpeg", "q_dc", mjpeg_q_dc_entry);

/*********************************************************************/
const mjpeg_q_dc_delta_entry = {
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
json_output_frame("mjpeg", "q_dc_delta", mjpeg_q_dc_delta_entry);

/*********************************************************************/
const mjpeg_dqt_entry = {
  type: "Object",
  fields: [
    { name: "tables", type: "Array", arrlen: "nb_tables", arridx: "table",
      fields: [
        { name: "bits", type: "Array", arrlen: "64", arridx: "i",
          fields: [ { type: "quant_value" }, ]
        },
      ],
    },
  ],
};
json_output_frame("mjpeg", "dqt", mjpeg_dqt_entry);

/*********************************************************************/
const mjpeg_dht_entry = {
  type: "Object",
  fields: [
    { name: "tables", type: "Array", arrlen: "nb_tables", arridx: "table",
      fields: [
        { type: "Object",
          fields: [
            { name: "class", type: "class" },
            { name: "index", type: "index" },
            { name: "bits", type: "Array", arrlen: "16", arridx: "i",
              fields: [
                { type: "Array", arrlen: "…", arridx: "j", inline: true, fields: [ { type: "value" } ] },
              ]
            },
          ]
        },
      ],
    },
  ],
};
json_output_frame("mjpeg", "dht", mjpeg_dht_entry);
