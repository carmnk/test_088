import { makeOptionsFromEnum } from "../utils/enum";
import { CSS_ALIGN, CSS_JUSTIFY } from "./CssAlignJustifyDict";
import { HTML_BORDER_STYLES } from "./CssBorderStyleDict";
import { CSS_BOX_SIZING } from "./CssBoxSizingDict";
import { CSS_DISPLAY } from "./CssDisplayDict";
import { HTML_FONT_STYLES } from "./CssFontStyleDict";
import { CSS_POSITION } from "./CssPositionDict";

export enum StandardLonghandPropertyNames {
  //   AccentColor = "accentColor",
  AlignContent = "alignContent",
  AlignItems = "alignItems",
  AlignSelf = "alignSelf",
  BackgroundColor = "backgroundColor",
  BorderColor = "borderColor",
  BorderStyle = "borderStyle",
  BorderWidth = "borderWidth",
  Bottom = "bottom",
  BoxShadow = "boxShadow",
  Color = "color",
  Display = "display",
  FlexBasis = "flexBasis",
  FlexGrow = "flexGrow",
  FlexShrink = "flexShrink",
  FontFamily = "fontFamily",
  FontSize = "fontSize",
  FontWeight = "fontWeight",
  Height = "height",
  JustifyContent = "justifyContent",
  Left = "left",
  LineHeight = "lineHeight",
  MarginBottom = "marginBottom",
  MarginLeft = "marginLeft",
  MarginRight = "marginRight",
  MarginTop = "marginTop",
  MaxHeight = "maxHeight",
  MaxWidth = "maxWidth",
  MinHeight = "minHeight",
  MinWidth = "minWidth",
  Opacity = "opacity",
  Order = "order",
  PaddingBottom = "paddingBottom",
  PaddingLeft = "paddingLeft",
  PaddingRight = "paddingRight",
  PaddingTop = "paddingTop",
  Position = "position",
  Right = "right",
  TextAlign = "textAlign",
  TextDecoration = "textDecoration",
  TextTransform = "textTransform",
  Top = "top",
  VerticalAlign = "verticalAlign",
  Width = "width",
  ZIndex = "zIndex",
}

export const CSS_RULE_NAMES_DICT = {
  ...StandardLonghandPropertyNames,
};

export const CSS_RULE_NAMES_OPTIONS = makeOptionsFromEnum(CSS_RULE_NAMES_DICT);

export enum CSS_GUIDED_VALUES {
  color = "color",
  size = "size",
  opacity = "opacity",
  zIndex = "zIndex",
  // boxShadow = "boxShadow",
  // fontWeight --> CSS dropdown
  // textAlign
}

export const CSS_RULES_VALUES_DICT = {
  alignItems: CSS_ALIGN,
  alignSelf: CSS_ALIGN,
  justifyItems: CSS_ALIGN,
  justifyContent: CSS_JUSTIFY,
  justifySelf: CSS_JUSTIFY,
  alignContent: CSS_JUSTIFY,
  fontStyle: HTML_FONT_STYLES,
  borderStyle: HTML_BORDER_STYLES,
  display: CSS_DISPLAY,
  position: CSS_POSITION,
  boxSizing: CSS_BOX_SIZING,
};

export const CSS_RULES_VALUES_OPTIONS = Object.keys(
  CSS_RULES_VALUES_DICT
).reduce((acc, key: any) => {
  const value = (CSS_RULES_VALUES_DICT as any)[key];
  return {
    ...acc,
    [key]: typeof value === "object" ? makeOptionsFromEnum(value) : value,
  };
}, {});
