export const SYSTEM_FONTS_CSS_STRINGS = [
  "Arial, Helvetica, sans-serif",
  "'Arial Black', Gadget, sans-serif",
  "Tahoma, Verdana, sans-serif",
  `"Times New Roman", Times, serif`,
  "Verdana, Tahoma, sans-serif",
  `"Courier New", Courier, monospace`,
];

export const SYSTEM_FONTS_NAMES = SYSTEM_FONTS_CSS_STRINGS.map((font) =>
  font.split(",")[0]?.replaceAll("'", "")?.replaceAll('"', "")
);
