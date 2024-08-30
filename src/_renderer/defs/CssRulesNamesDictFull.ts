import { CSS_RULE_NAMES_DICT } from './CssRuleNamesDict'

const CSS_RULE_NAMES_DICT_CAMELCASE = Object.keys(CSS_RULE_NAMES_DICT).reduce(
  (acc, key) => ({
    ...acc,
    [key[0].toLowerCase() + key.slice(1)]:
      CSS_RULE_NAMES_DICT[key as keyof typeof CSS_RULE_NAMES_DICT] ?? '',
  }),
  {}
)

const CSS_RULE_NAMES_DICT_FULL_UNSORTED = {
  ...CSS_RULE_NAMES_DICT_CAMELCASE,
  color: '',
  bgcolor: '',
  fontSize: '16px',
  fontWeight: 'normal',
  lineHeight: '',
  letterSpacing: '',
  textAlign: '',
  fontStyle: '',
  textDecoration: '',
  textTransform: '',
  whiteSpace: '',
  wordBreak: '',
  wordSpacing: '',
  textOverflow: '',
  overflowWrap: '',
  overflow: '',
  display: '',
}

export const CSS_RULE_NAMES_DICT_FULL = Object.keys(
  CSS_RULE_NAMES_DICT_FULL_UNSORTED
)
  .sort((a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0))
  .reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        CSS_RULE_NAMES_DICT_FULL_UNSORTED[
          key as keyof typeof CSS_RULE_NAMES_DICT_FULL_UNSORTED
        ],
    }),
    {}
  )
