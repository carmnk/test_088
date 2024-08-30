import { makeOptionsFromEnum } from '../utils/enum'

export enum CSS_BOX_SIZING {
  ContentBox = 'content-box',
  BorderBox = 'border-box',
}

export const CSS_BOX_SIZING_OPTIONS = makeOptionsFromEnum(CSS_BOX_SIZING)
