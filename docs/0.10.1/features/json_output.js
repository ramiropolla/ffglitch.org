/*********************************************************************/
const KeyType =
{
  INFORMATIVE: "informative",
  BEHAVIOURAL: "behavioural", // changes behaviour of FFglitch
  PASSTHROUGH: "passthrough",
};

/*********************************************************************/
function new_span(text)
{
  const span = document.createElement("span");
  span.innerHTML = text;
  return span;
}
function new_ahref(text, href)
{
  const a = document.createElement("a");
  a.innerHTML = text;
  a.setAttribute("href", href);
  return a;
}
function output_span(div, text)
{
  const span = new_span(text);
  div.append(span);
  return span;
}
function output_lf(div, entry, level)
{
  const span = document.createElement("span");
  if ( !entry.inline )
    span.innerHTML = `\n${" ".repeat(level * 2)}`;
  else /* if ( (jso->flags & JSON_PFLAGS_NO_SPACE) == 0 ) */
    span.innerHTML = ' ';
  div.append(span);
  return span;
}
function output_lf_array(div, entry, level, i)
{
  return output_lf(div, entry, level);
}
function setup_path_span_callback(span, path_span, newpath)
{
  span.onmouseenter = () => {
    path_span.innerHTML = newpath;
  };
}
function json_output(ctx, entry, level, curpath)
{
  const div = ctx.div;
  switch ( entry.type )
  {
  case "Object":
    output_span(div, '{');
    entry.fields.forEach((v, i) => {
      if ( i != 0 )
        output_span(div, ',');
      output_lf(div, entry, level+1);
      const key = output_span(div, `"${v.name}"`);
      let key_color = "brown";
      if ( v.informative )
        key_color = "orange";
      key.style.color = key_color;
      const newpath = `${curpath}.<span style="color:${key_color}">${v.name}</span>`;
      setup_path_span_callback(key, ctx.path_span, newpath);
      output_span(div, ": ");
      if ( v.informative )
      {
        const span = output_span(div, "(informative)");
        span.style.color = "gray";
        output_span(div, ' ');
      }
      if ( v.optional )
      {
        const span = output_span(div, "(optional)");
        span.style.color = "gray";
        output_span(div, ' ');
      }
      json_output(ctx, v, level+1, newpath);
    });
    output_lf(div, entry, level);
    output_span(div, '}');
    break;
  case "Array":
    output_span(div, '[');
    entry.fields.forEach((v, i) => {
      if ( i != 0 )
        output_span(div, ',');
      output_lf_array(div, entry, level+1, i);
      const newpath = `${curpath}[<span style="color:green">${entry.arridx}</span>]`;
      json_output(ctx, v, level+1, newpath);
    });
    if ( entry.arrlen )
    {
      output_span(div, ',');
      output_lf(div, entry, level+1);
      let spans = [];
      spans.push(new_span("…, "));
      spans.push(new_span("length"));
      spans.push(new_span(": "));
      spans.push(new_span(entry.arrlen));
      spans[1].style.color = "purple";
      spans[3].style.color = "green";
      const newpath = `${curpath}[<span style="color:purple">length</span>: <span style="color:green">${entry.arrlen}</span>]`
      setup_path_span_callback(spans[1], ctx.path_span, newpath);
      setup_path_span_callback(spans[3], ctx.path_span, newpath);
      json_output(ctx, { type: "spans", spans: spans }, level+1);
    }
    output_lf(div, entry, level);
    output_span(div, ']');
    break;
  case "spans":
    entry.spans.forEach(v => {
      div.append(v);
    });
    break;
  default:
    {
      let span_type = document.getElementById(`${ctx.prefix}_${entry.type}`);
      if ( !span_type )
        console.error(`could not find ${ctx.prefix}_${entry.type}`);
      span_type.style.color = "blue";
      const ahref = new_ahref(entry.type, `#${ctx.prefix}_${entry.type}`);
      const span = document.createElement("span");
      span.append(ahref);
      div.append(span);
      span.onmouseenter = () => {
        ctx.path_span.innerHTML = curpath;
        span_type.innerHTML = `▶ ${entry.type}`;
      };
      span.onmouseleave = () => {
        span_type.innerHTML = `▷ ${entry.type}`;
      };
      span.onmouseleave();
      // setup mouse actions on span_type
      if ( !span_type.onmouseenter )
      {
        span_type.onmouseenter = () => {
          span_type.references.forEach((s) => {
            span_type.innerHTML = `▶ ${entry.type}`;
            s.style.textDecoration = "underline";
            s.onmouseenter();
          });
        };
      }
      if ( !span_type.onmouseleave )
      {
        span_type.onmouseleave = () => {
          span_type.references.forEach((s) => {
            span_type.innerHTML = `▷ ${entry.type}`;
            s.style.textDecoration = "";
            s.onmouseleave();
          });
        };
      }
      if ( !span_type.references )
        span_type.references = [];
      span_type.references.push(span);
    }
    break;
  }
}

export function json_output_root(codec, feature, entry, _root)
{
  const prefix = `${codec}_${feature}`;
  const desc_div = document.getElementById(`${prefix}_desc`);
  if ( !desc_div )
    console.error(`could not find ${prefix}_desc`);
  desc_div.style.fontFamily = "monospace";
  desc_div.style.fontSize = "14px";
  desc_div.style.background = "#eeeeff";
  desc_div.style.border = "1px solid #e8e8e8";
  desc_div.style.padding = "8px 12px";
  desc_div.style.whiteSpace = "pre";
  const key = output_span(desc_div, `"${feature}"`);
  const newpath = _root ? `${_root}.${feature}` : `${feature}`;
  output_span(desc_div, ": ");
  const path_div = document.getElementById(`${prefix}_path`);
  path_div.style.fontFamily = "monospace";
  path_div.style.fontSize = "14px";
  path_div.style.background = "#eeeeff";
  path_div.style.border = "1px solid #e8e8e8";
  path_div.style.padding = "8px 12px";
  path_div.style.whiteSpace = "pre";
  const caption = _root ? `JavaScript path inside ${_root}` : "JavaScript path";
  output_span(path_div, caption);
  output_span(path_div, ": ");
  const path_span = output_span(path_div, "(hover mouse on fields above)");
  setup_path_span_callback(key, path_span, newpath);
  let ctx = { div: desc_div, path_span: path_span, prefix: prefix };
  json_output(ctx, entry, 0, newpath);
}

export function json_output_frame(codec, feature, entry)
{
  return json_output_root(codec, feature, entry, "frame");
}

// TODO optional chaining (?.)
//   let optional_str = "";
//   key_span.onmouseenter =
//   key_span.onmouseleave =
