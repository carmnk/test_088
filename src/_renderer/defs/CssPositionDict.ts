import { makeOptionsFromEnum } from "../utils/enum";

export enum CSS_POSITION {
  Static = "static",
  Relative = "relative",
  Absolute = "absolute",
  Fixed = "fixed",
  Sticky = "sticky",
}

export const CSS_POSITION_OPTIONS = makeOptionsFromEnum(CSS_POSITION);
