import { i18n } from '@/lang'

export default {
  generateTitle
}

/**
 * 寻找parenttitle下的title，如果没有则返回title
 * @param {转换多语言} title
 */
export function generateTitle (title, parentTitle) {
  try {
    let key = ''
    if (parentTitle) key = `${parentTitle}.`
    key += title
    const hasKey = i18n.te(key)
    const translatedTitle = i18n.t(key)

    if (hasKey) return translatedTitle
    else return title
  } catch (e) { // console.log(e)
    return title
  }
}
