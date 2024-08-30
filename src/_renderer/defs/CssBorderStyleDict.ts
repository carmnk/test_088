import { makeOptionsFromEnum } from "../utils/enum";

export enum HTML_BORDER_STYLES {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
  Double = "double",
  Groove = "groove",
  Ridge = "ridge",
  Inset = "inset",
  Outset = "outset",
  None = "none",
  Hidden = "hidden",
}

export const HTML_BORDER_STYLES_OPTIONS =
  makeOptionsFromEnum(HTML_BORDER_STYLES);

