import { makeOptionsFromEnum } from "../utils/enum";

export enum CSS_ALIGN {
  Stretch = "stretch",
  Center = "center",
  Start = "flex-start",
  End = "flex-end",
  Baseline = "baseline",
}

export const CSS_ALIGN_ITEMS_OPTIONS = makeOptionsFromEnum(CSS_ALIGN);
export const CSS_ALIGN_SELF_OPTIONS = CSS_ALIGN_ITEMS_OPTIONS;
export const CSS_JUSTIFY_ITEMS_OPTIONS = CSS_ALIGN_ITEMS_OPTIONS;

export enum CSS_JUSTIFY {
  Center = "center",
  Start = "flex-start",
  End = "flex-end",
  SpaceBetween = "space-between",
  SpaceAround = "space-around",
  SpaceEvenly = "space-evenly",
  Stretch = "stretch",
}

export const CSS_JUSTIFY_CONTENT_OPTIONS = makeOptionsFromEnum(CSS_JUSTIFY);
export const CSS_JUSTIFY_SELF_OPTIONS = CSS_JUSTIFY_CONTENT_OPTIONS;
export const CSS_ALIGN_CONTENT_OPTIONS = CSS_JUSTIFY_CONTENT_OPTIONS;
