<template>
  <div id="app">
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script>
const path = require('path')
const nodeRequire = global.require // 缓存原始require
const amdLoader = require('monaco-editor/min/vs/loader.js')
const amdRequire = amdLoader.require // 编辑器自定义的require
amdLoader.nodeRequire = nodeRequire // 将编辑器的nodeRequire设置为原始的require，否则会报错，无法引入node模块
global.require = nodeRequire
amdRequire.config({
  baseUrl: path.join(__dirname, '../../../../node_modules/monaco-editor/min')
})

export default {
  name: 'editor-page',
  props: {
    code: {
      type: String,
      default: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
        '\n'
      )
    }
  },
  mounted () {
    amdRequire(['vs/editor/editor.main'], () => {
      this.editor = global.monaco.editor.create(this.$refs.editor, {
        value: this.code,
        language: 'javascript',
        theme: 'vs-dark'
      })

      // 保存
      this.editor.addCommand(
        global.monaco.KeyMod.CtrlCmd | global.monaco.KeyCode.KEY_S,
        () => {
          console.log(this.editor.getValue())
        }
      )
    })

    window.addEventListener('resize', () => {
      this.editor && this.editor.layout()
    })
  }
}
</script>

<style lang="less">
.editor {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
