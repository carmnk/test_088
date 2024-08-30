import { makeOptionsFromEnum } from '../utils/enum'

export enum HTML_VOID_TAG_NAMES {
  Area = 'area',
  Base = 'base',
  Br = 'br',
  Col = 'col',
  Command = 'command',
  Embed = 'embed',
  Hr = 'hr',
  Img = 'img',
  Input = 'input',
  Link = 'link',
  Meta = 'meta',
  Param = 'param',
  Source = 'source',
  Track = 'track',
  Wbr = 'wbr',
}

export enum HTML_TAG_NAMES_EMBEDDED_CONTENT {
  Audio = 'audio',
  Canvas = 'canvas',
  Embed = 'embed',
  Figcaption = 'figcaption',
  Figure = 'figure',
  Iframe = 'iframe',
  Img = 'img',
  Object = 'object',
  Picture = 'picture',
  Svg = 'svg',
  Source = 'source',
  Track = 'track',
  Video = 'video',
  Param = 'param',
  Map = 'map',
  Area = 'area',
}

export enum HTML_TAG_NAMES_INTERACTIVE_CONTENT {
  Button = 'button',
  Details = 'details',
  Fieldset = 'fieldset',
  Legend = 'legend',
  Input = 'input',
  Label = 'label',
  Select = 'select',
  Textarea = 'textarea',
  Optgroup = 'optgroup',
  Option = 'option',
  Form = 'form',
  Output = 'output',
  Datalist = 'datalist',
  Progress = 'progress',
  Summary = 'summary',
  Meter = 'meter',
}

export enum HTML_TAG_NAMES_TABLE_CONTENT {
  Caption = 'caption',
  Col = 'col',
  Colgroup = 'colgroup',
  Table = 'table',
  Tbody = 'tbody',
  Td = 'td',
  Tfoot = 'tfoot',
  Th = 'th',
  Thead = 'thead',
  Tr = 'tr',
}

export enum HTML_TAG_NAMES_DOCUMENT_ELEMENTS {
  Html = 'html',
  Head = 'head',
  Body = 'body',
}

export enum HTML_TAG_NAMES_LAYOUT_ELEMENTS {
  Article = 'article',
  Aside = 'aside',
  Footer = 'footer',
  Header = 'header',
  Main = 'main',
  Nav = 'nav',
  Section = 'section',
  Dialog = 'dialog',
}

export enum HTML_TAG_NAMES_HEADING_ELEMENTS {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum HTML_TAG_NAMES_METADATA_ELEMENTS {
  Base = 'base',
  Link = 'link',
  Meta = 'meta',
  Noscript = 'noscript',
  Style = 'style',
  Title = 'title',
  Script = 'script',
  Template = 'template',
}

export enum HTML_TAG_NAMES_LIST_ELEMENTS {
  Dd = 'dd',
  Dl = 'dl',
  Dt = 'dt',
  Li = 'li',
  Ol = 'ol',
  Ul = 'ul',
}

export enum HTML_TAG_NAMES_FORMATTING_ELEMENTS {
  Abbr = 'abbr',
  Address = 'address',
  B = 'b',
  Blockquote = 'blockquote',
  Bdi = 'bdi',
  Bdo = 'bdo',
  Cite = 'cite',
  Code = 'code',
  Data = 'data',
  Dfn = 'dfn',
  Em = 'em',
  I = 'i',
  Kbd = 'kbd',
  Mark = 'mark',
  Q = 'q',
  Rp = 'rp',
  Rt = 'rt',
  Ruby = 'ruby',
  S = 's',
  Samp = 'samp',
  Small = 'small',
  Strong = 'strong',
  Sub = 'sub',
  Sup = 'sup',
  Time = 'time',
  U = 'u',
  Var = 'var',
  Wbr = 'wbr',
  Del = 'del',
  Ins = 'ins',
}

export enum HTML_TAG_NAMES_BASIC {
  A = 'a',
  Br = 'br',
  Div = 'div',
  Hr = 'hr',
  P = 'p',
  Pre = 'pre',
  Span = 'span',
  Img = 'img',
}

export const HTML_TAG_NAMES = {
  ...HTML_TAG_NAMES_TABLE_CONTENT,
  ...HTML_TAG_NAMES_INTERACTIVE_CONTENT,
  ...HTML_TAG_NAMES_EMBEDDED_CONTENT,
  ...HTML_TAG_NAMES_METADATA_ELEMENTS,
  ...HTML_TAG_NAMES_DOCUMENT_ELEMENTS,

  ...HTML_TAG_NAMES_BASIC,
  ...HTML_TAG_NAMES_LAYOUT_ELEMENTS,
  ...HTML_TAG_NAMES_HEADING_ELEMENTS,
  ...HTML_TAG_NAMES_FORMATTING_ELEMENTS,
  ...HTML_TAG_NAMES_LIST_ELEMENTS,
}

export const HTML_TAG_NAMES_BASIC_OPTIONS =
  makeOptionsFromEnum(HTML_TAG_NAMES_BASIC)

export const HTML_TAG_NAMES_OPTIONS = makeOptionsFromEnum(HTML_TAG_NAMES)

export const HTML_TAG_NAMES_STRUCTURED_OPTIONS = [
  ...makeOptionsFromEnum(HTML_TAG_NAMES_BASIC).map((item) => ({
    ...item,
    category: 'basic',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_LAYOUT_ELEMENTS).map((item) => ({
    ...item,
    category: 'Layout',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_HEADING_ELEMENTS).map((item) => ({
    ...item,
    category: 'Headings',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_FORMATTING_ELEMENTS).map((item) => ({
    ...item,
    category: 'Formatting',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_LIST_ELEMENTS).map((item) => ({
    ...item,
    category: 'Lists',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_TABLE_CONTENT).map((item) => ({
    ...item,
    category: 'Table',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_INTERACTIVE_CONTENT).map((item) => ({
    ...item,
    category: 'Interactive Content',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_EMBEDDED_CONTENT).map((item) => ({
    ...item,
    category: 'Embedded Content',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_METADATA_ELEMENTS).map((item) => ({
    ...item,
    category: 'Meta Data',
  })),
  ...makeOptionsFromEnum(HTML_TAG_NAMES_DOCUMENT_ELEMENTS).map((item) => ({
    ...item,
    category: 'HTML Document',
  })),
]

export const HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS =
  HTML_TAG_NAMES_STRUCTURED_OPTIONS.filter(
    (item) => !Object.values(HTML_VOID_TAG_NAMES).includes(item.value as any)
  )
