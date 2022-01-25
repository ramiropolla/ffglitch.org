import { json_output_root } from "./features/json_output.js";

/*********************************************************************/
const ffedit_setup_args_entry = {
  type: "Object",
  fields: [
    { name: "features", optional: true, type: "Array", arrlen: "nb_features", arridx: "i",
      fields: [
        { type: "feature" },
      ],
    },
    { name: "input",  informative: true, type: "input" },
    { name: "output", optional:    true, type: "output" },
    { name: "params", optional:    true, type: "params" },
  ],
};
json_output_root("ffedit_setup", "args", ffedit_setup_args_entry);

/*********************************************************************/
const ffedit_glitch_frame_frame_entry = {
  type: "Object",
  fields: [
    { name: "&lt;feature&gt;", optional: true, type: "feature" },
  ],
};
json_output_root("ffedit_glitch_frame", "frame", ffedit_glitch_frame_frame_entry);

/*********************************************************************/
const ffedit_glitch_frame_stream_entry = {
  type: "Object",
  fields: [
    { name: "codec",        informative: true, type: "codec" },
    { name: "stream_index", informative: true, type: "stream_index" },
  ],
};
json_output_root("ffedit_glitch_frame", "stream", ffedit_glitch_frame_stream_entry);

/*********************************************************************/
const ffedit_json_root_entry = {
  type: "Object",
  fields: [
    { name: "ffedit_version", informative: true, type: "ffedit_version" },
    { name: "filename",       informative: true, type: "filename" },
    { name: "sha1sum",        informative: true, type: "sha1sum" },
    { name: "features",                          type: "Array", arrlen: "nb_features", arridx: "i",
      fields: [
        { type: "feature" },
      ],
    },
    { name: "streams",                           type: "Array", arrlen: "nb_streams", arridx: "i",
      fields: [
        { type: "Object",
          fields: [
            { name: "codec", type: "stream_codec" },
            { name: "frames",                    type: "Array", arrlen: "nb_frames", arridx: "j",
              fields: [
                { type: "Object",
                  fields: [
                    { name: "pkt_pos", type: "frame_pkt_pos" },
                    { name: "pts",     type: "frame_pts" },
                    { name: "dst",     type: "frame_dts" },
                    { name: "&lt;feature&gt;", optional: true, type: "frame_feature" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
json_output_root("ffedit_json", "root", ffedit_json_root_entry);
