import { json_output_frame } from "./json_output.js";

/*********************************************************************/
const png_headers_entry = {
  type: "Object",
  fields: [
    { name: "IHDR", optional: true, type: "Object",
      fields: [
        { name: "width",            type: "number" },
        { name: "height",           type: "number" },
        { name: "bit_depth",        type: "number" },
        { name: "color_type",       type: "number" },
        { name: "compression_type", type: "number" },
        { name: "filter_type",      type: "number" },
        { name: "interlace_type",   type: "number" },
      ]
    },
    { name: "PLTE", optional: true, type: "Array", arrlen: "nb_entries", arridx: "i",
      fields: [
        { name: "interlace_type",   type: "rgb" },
      ]
    },
    { name: "bKGD", optional: true, type: "bkgd" },
    { name: "cHRM", optional: true, type: "Object",
      fields: [
        { name: "white_point_x",    type: "number" },
        { name: "white_point_y",    type: "number" },
        { name: "red_x",            type: "number" },
        { name: "red_y",            type: "number" },
        { name: "green_x",          type: "number" },
        { name: "green_y",          type: "number" },
        { name: "blue_x",           type: "number" },
        { name: "blue_y",           type: "number" },
      ]
    },
    { name: "cICP", optional: true, type: "Object",
      fields: [
        { name: "colour_primaries", type: "number" },
        { name: "transfer_function", type: "number" },
        { name: "matrix_coeffs",    type: "number" },
        { name: "video_full_range", type: "number" },
      ]
    },
    { name: "cLLi", optional: true, type: "Object",
      fields: [
        { name: "max_cll",          type: "number" },
        { name: "max_fall",         type: "number" },
      ]
    },
    { name: "gAMA", optional: true, type: "Object",
      fields: [
        { name: "image_gamma",      type: "number" },
      ]
    },
    { name: "hIST", optional: true, type: "hist" },
    { name: "mDCv", optional: true, type: "Object",
      fields: [
        { name: "red_x",            type: "number" },
        { name: "red_y",            type: "number" },
        { name: "green_x",          type: "number" },
        { name: "green_y",          type: "number" },
        { name: "blue_x",           type: "number" },
        { name: "blue_y",           type: "number" },
        { name: "white_point_x",    type: "number" },
        { name: "white_point_y",    type: "number" },
        { name: "max_luminance",    type: "number" },
        { name: "min_luminance",    type: "number" },
      ]
    },
    { name: "pHYs", optional: true, type: "Object",
      fields: [
        { name: "pixels_per_unit_x", type: "number" },
        { name: "pixels_per_unit_y", type: "number" },
        { name: "unit_specifier",   type: "number" },
      ]
    },
    { name: "sBIT", optional: true, type: "sbit" },
    { name: "sPLT", optional: true, type: "Object",
      fields: [
        { name: "name",             type: "string" },
        { name: "sample_depth",     type: "number" },
        { name: "entries",          type: "splt_entry" },
      ]
    },
    { name: "sRGB", optional: true, type: "Object",
      fields: [
        { name: "rendering_intent", type: "number" },
      ]
    },
    { name: "sTER", optional: true, type: "Object",
      fields: [
        { name: "mode",             type: "number" },
      ]
    },
    { name: "sTER", optional: true, type: "Object",
      fields: [
        { name: "year",             type: "number" },
        { name: "month",            type: "number" },
        { name: "day",              type: "number" },
        { name: "hour",             type: "number" },
        { name: "minute",           type: "number" },
        { name: "second",           type: "number" },
      ]
    },
    { name: "tRNS", optional: true, type: "trns" },
    { name: "iCCP", optional: true, type: "Object",
      fields: [
        { name: "name",             type: "string" },
        { name: "method",           type: "number" },
        { name: "profile",          type: "zdata" },
      ]
    },
    { name: "iTXt", optional: true, type: "Array", arrlen: "nb_entries", arridx: "i",
      fields: [
        { type: "Object",
          fields: [
            { name: "keyword",          type: "string" },
            { name: "flag",             type: "number" },
            { name: "method",           type: "number" },
            { name: "language",         type: "string" },
            { name: "translated",       type: "string" },
            { name: "text",             type: "itext" },
          ]
        },
      ]
    },
    { name: "tEXt", optional: true, type: "Array", arrlen: "nb_entries", arridx: "i",
      fields: [
        { type: "Object",
          fields: [
            { name: "keyword",          type: "string" },
            { name: "text",             type: "string" },
          ]
        },
      ]
    },
    { name: "zTXt", optional: true, type: "Array", arrlen: "nb_entries", arridx: "i",
      fields: [
        { type: "Object",
          fields: [
            { name: "keyword",          type: "string" },
            { name: "method",           type: "number" },
            { name: "text",             type: "string" },
          ]
        },
      ]
    },
    { name: "acTL", optional: true, type: "Object",
      fields: [
        { name: "num_frames",           type: "number" },
        { name: "num_plays",            type: "number" },
      ]
    },
    { name: "fcTL", optional: true, type: "Object",
      fields: [
        { name: "sequence_number",      type: "number" },
        { name: "width",                type: "number" },
        { name: "height",               type: "number" },
        { name: "x_offset",             type: "number" },
        { name: "y_offset",             type: "number" },
        { name: "delay_num",            type: "number" },
        { name: "delay_den",            type: "number" },
        { name: "dispose_op",           type: "number" },
        { name: "blend_op",             type: "number" },
      ]
    },
  ],
};
json_output_frame("png", "headers", png_headers_entry);

/*********************************************************************/
const png_idat_entry = {
  type: "Object",
  fields: [
    { name: "rows",        type: "Array", arrlen: "height", arridx: "y", optional: true,
      fields: [
        { name: "row",     type: "row" },
        { name: "row",     type: "row" },
      ],
    },
    { name: "compression_level", type: "compression_level" },
    { name: "sequence_number", type: "sequence_number" },
  ],
};
json_output_frame("png", "idat", png_idat_entry);
