import { json_output_frame } from "./json_output.js";

/*********************************************************************/
const mpeg4_info_entry = {
  type: "Object",
  fields: [
    { name: "pict_type",  informative: true, type: "pict_type" },
    { name: "interlaced", informative: true, type: "interlaced" },
    { name: "field",      informative: true, type: "field", optional: true }, // TODO optional
    { name: "mb_type",    informative: true, type: "Array", arrlen: "mb_height", arridx: "mb_y",
      fields: [
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "mb_type" }, { type: "mb_type" } ] },
        { type: "Array", arrlen: "mb_width", arridx: "mb_x", inline: true, fields: [ { type: "mb_type" }, { type: "mb_type" } ] },
      ],
    },
  ],
};
json_output_frame("mpeg4", "info", mpeg4_info_entry);

/*********************************************************************/
const mpeg4_mv_entry = {
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
json_output_frame("mpeg4", "mv", mpeg4_mv_entry);

/*********************************************************************/
const mpeg4_mv_delta_entry = {
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
json_output_frame("mpeg4", "mv_delta", mpeg4_mv_delta_entry);

/*********************************************************************/
const mpeg4_mb_entry = {
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
json_output_frame("mpeg4", "mb", mpeg4_mb_entry);
