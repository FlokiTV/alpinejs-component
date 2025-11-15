import { initStyles } from './initStyles'
import { initTemplate, initUrl } from './initTemplate'

export default function (Alpine) {
  class ComponentWrapper extends HTMLElement {
    connectedCallback() {
      // We prevent the component from being
      // initialized more than once
      if (this._hasInit) {
        return
      }

      let useShadow = window.xComponent?.useShadow ?? false
      if (this.hasAttribute('use-shadow')) {
        useShadow = this.getAttribute('use-shadow') === 'true'
      }

      const root = useShadow ? this.attachShadow({ mode: 'open' }) : this

      const hasDynamicTemplate = this.hasAttribute(':template')
      const hasDynamicUrl = this.hasAttribute(':url')

      if (hasDynamicTemplate || hasDynamicUrl) {
        Alpine.initTree(this)
      }

      const {
        template: componentTemplate,
        url: componentUrl,
        styles: componentStyles,
      } = this.attributes || {}

      const templateName = componentTemplate?.value || ''
      const urlName = componentUrl?.value || ''
      const styleNames = componentStyles?.value.split(',') || ''

      if (templateName.length) {
        initTemplate(Alpine, templateName, root)
      }

      if (urlName.length) {
        initUrl(Alpine, urlName, root)
      }

      if (styleNames.length) {
        initStyles(root, styleNames)
      }

      this._hasInit = true
    }
  }

  const { name: componentName } = window?.xComponent || { name: 'x-component' }

  if (window.customElements.get(componentName)) {
    return
  }

  customElements.define(componentName, ComponentWrapper)

  new ComponentWrapper()
}
