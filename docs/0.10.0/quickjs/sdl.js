import { json_output_root } from "../features/json_output.js";

/*********************************************************************/
const SDL_KeyboardEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "state",     informative: true, type: "state" },
    { name: "repeat",    informative: true, type: "repeat" },
    { name: "keysym",    informative: true, type: "Object",
      fields: [
        { name: "scancode",  informative: true, type: "scancode" },
        { name: "sym",       informative: true, type: "sym" },
        { name: "mod",       informative: true, type: "mod" },
      ]
    },
  ],
};
json_output_root("SDL_KeyboardEvent", "event", SDL_KeyboardEvent_event_entry);

/*********************************************************************/
const SDL_JoyAxisEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "which",     informative: true, type: "which" },
    { name: "axis",      informative: true, type: "axis" },
    { name: "value",     informative: true, type: "value" },
  ],
};
json_output_root("SDL_JoyAxisEvent", "event", SDL_JoyAxisEvent_event_entry);

/*********************************************************************/
const SDL_JoyBallEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "which",     informative: true, type: "which" },
    { name: "ball",      informative: true, type: "ball" },
    { name: "xrel",      informative: true, type: "xrel" },
    { name: "yrel",      informative: true, type: "yrel" },
  ],
};
json_output_root("SDL_JoyBallEvent", "event", SDL_JoyBallEvent_event_entry);

/*********************************************************************/
const SDL_JoyHatEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "which",     informative: true, type: "which" },
    { name: "hat",       informative: true, type: "hat" },
    { name: "value",     informative: true, type: "value" },
  ],
};
json_output_root("SDL_JoyHatEvent", "event", SDL_JoyHatEvent_event_entry);

/*********************************************************************/
const SDL_JoyButtonEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "which",     informative: true, type: "which" },
    { name: "button",    informative: true, type: "button" },
    { name: "state",     informative: true, type: "state" },
  ],
};
json_output_root("SDL_JoyButtonEvent", "event", SDL_JoyButtonEvent_event_entry);

/*********************************************************************/
const SDL_ControllerAxisEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "which",     informative: true, type: "which" },
    { name: "axis",      informative: true, type: "axis" },
    { name: "value",     informative: true, type: "value" },
  ],
};
json_output_root("SDL_ControllerAxisEvent", "event", SDL_ControllerAxisEvent_event_entry);

/*********************************************************************/
const SDL_ControllerButtonEvent_event_entry = {
  type: "Object",
  fields: [
    { name: "type",      informative: true, type: "type" },
    { name: "timestamp", informative: true, type: "timestamp" },
    { name: "which",     informative: true, type: "which" },
    { name: "button",    informative: true, type: "button" },
    { name: "state",     informative: true, type: "state" },
  ],
};
json_output_root("SDL_ControllerButtonEvent", "event", SDL_ControllerButtonEvent_event_entry);
