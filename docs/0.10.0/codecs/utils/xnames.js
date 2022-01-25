/*********************************************************************/
export function init_xnames(el)
{
  for ( let code of el.getElementsByTagName("code") )
      code.setAttribute("xname", code.textContent);
}

/*********************************************************************/
export function set_xnames(el, name, str)
{
  for ( let code of el.children )
    if ( code.getAttribute("xname") == name )
      code.textContent = str;
}
