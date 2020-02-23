import { i18n } from '@/lang'
import { Message, MessageBox } from 'element-ui'
// import store from '@/store'
import main from '@/main'

const WINDOWGROUP = { // 窗口管理
  'messageUniq': {}
}

export default {
  eleMessage,
  eleMessageBox,
  successMsg,
  generateTitle
}

/**
 * elementui的message组件的封装
 * @param {*} option
 */
export function eleMessage (option) {
  let {
    message = '', type = 'info', iconClass = '', dangerouslyUseHTMLString = false, customClass = '', duration = 3000,
    showClose = false, center = '', onClose = null
  } = option || {}
  let _mark = `_toast${customClass}${type}${message}`// 在全局管理modal里面保存
  if (WINDOWGROUP['messageUniq'][_mark]) { // 不重复弹出相同mark的toast
    return false
  }
  let _mes = Message({
    message, type, iconClass, dangerouslyUseHTMLString, duration, showClose, center, customClass,
    onClose: (data) => {
      WINDOWGROUP['messageUniq'][_mark] = null
      delete WINDOWGROUP['messageUniq'][_mark]
      if (onClose && typeof onClose === 'function') {
        onClose(data)
      }
    }
    // message: text || main.$t('member.submit_suc')
  })
  WINDOWGROUP['messageUniq'][_mark] = _mes
  return _mes
}

export function successMsg (text) {
  eleMessage({
    type: 'success',
    message: text || main.$t('submitSuc')
  })
}

// 确认弹窗'confirm','prompt','alert'
export function eleMessageBox ({ action = 'confirm', content = '', title = main.$t('tips'), confirm = main.$t('confirm'), cancel = main.$t('cancel'), dangerouslyUseHTMLString = false, distinguishCancelAndClose = false, inputValidator = null, inputErrorMessage = '', inputValue = null }, type = 'info') {
  return MessageBox[action](content, title, {
    confirmButtonText: confirm,
    cancelButtonText: cancel,
    type: action === 'confirm' && type,
    dangerouslyUseHTMLString,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    inputValidator,
    inputErrorMessage,
    inputValue,
    distinguishCancelAndClose
  })
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
