// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle (title) {
  const hasKey = this.$te('module.' + title)
  const translatedTitle = this.$t('module.' + title) // $t :this method from vue-i18n, inject in @/lang/index.js

  if (hasKey) {
    return translatedTitle
  }
  return title
}
