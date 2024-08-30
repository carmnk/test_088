import { makeOptionsFromEnum } from "../utils/enum";

export enum CSS_DISPLAY {
  Block = "block",
  Inline = "inline",
  InlineBlock = "inline-block",
  Flex = "flex",
  InlineFlex = "inline-flex",
  Grid = "grid",
  InlineGrid = "inline-grid",
  Table = "table",
  TableRow = "table-row",
  TableCell = "table-cell",
  None = "none",
  Initial = "initial",
  Inherit = "inherit",
}

export const CSS_DISPLAY_OPTIONS = makeOptionsFromEnum(CSS_DISPLAY);

export enum _CSS_DISPLAY_UI_VALUES {
  Block = "block",
  Inline = "inline",
  Flex = "flex",
  Grid = "grid",
  None = "none",
  "Inline-" = "inline-",
}
