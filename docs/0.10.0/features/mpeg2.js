import { json_output_frame } from "./json_output.js";

/*********************************************************************/
const mpeg2_info_entry = {
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
json_output_frame("mpeg2", "info", mpeg2_info_entry);

