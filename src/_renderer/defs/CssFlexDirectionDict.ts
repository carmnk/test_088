import { makeOptionsFromEnum } from "../utils/enum";

export enum CSS_FLEX_DIRECTION {
  Row = "row",
  RowReverse = "row-reverse",
  Column = "column",
  ColumnReverse = "column-reverse",
}

export const CSS_FLEX_DIRECTION_OPTIONS =
  makeOptionsFromEnum(CSS_FLEX_DIRECTION);

export enum _CSS_DIRECTION_UI_VALUES {
  Row = "row",
  Column = "column",
  "-reverse" = "-reverse",
}
