export enum UI_POINTER_MODE {
  mixed = "mixed",
  //   design = "design",
  production = "production",
}

export const UI_POINTER_MODE_OPTIONS: {
  value: string;
  label: string;
  tooltip: string;
}[] = [
  {
    value: UI_POINTER_MODE.mixed,
    label: "Mixed",
    tooltip:
      "Enables all pointer features of the editor and limited pointer features of the app",
  },
  {
    value: UI_POINTER_MODE.production,
    label: "Production",
    tooltip: "Enables all pointer features of the app",
  },
];
