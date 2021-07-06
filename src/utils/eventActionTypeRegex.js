import { capitalize, hyphens2camel } from './function.js'
import { generalBtn } from './state.js'

const clickGeneralBtnRegex = generalBtn.reduce(
  (obj, btnType) => ({
    ...obj,
    [`click${capitalize(hyphens2camel(btnType))}`]: new RegExp(`^btn-${btnType}`, 'gm'),
  }),
  {}
)

export default {
  clickMenu: /^menu-[a-z]/gm,
  clickTabMenu: /^tab-[a-z]/gm,
  clickBreadcrumb: /^breadcrumb-[0-9]/gm,
  clickClose: /^btn-ico-close/gm,
  clickCard: /^card-[0-9]/gm,
  clickEditRow: /^r[0-9]+-btn-ico-edit/gm,
  clickDetailRow: /^r[0-9]+-btn-ico-detail/gm,
  clickButton: /^btn-/gm,
  ...clickGeneralBtnRegex,

  hoverBtnGroup: /^btn-group-[a-z]/gm,
}
