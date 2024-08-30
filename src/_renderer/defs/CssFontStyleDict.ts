import { makeOptionsFromEnum } from "../utils/enum";

export enum HTML_FONT_STYLES {
  Normal = "normal",
  Italic = "italic",
  Oblique = "oblique",
}

export const HTML_FONT_STYLES_OPTIONS = makeOptionsFromEnum(HTML_FONT_STYLES);
