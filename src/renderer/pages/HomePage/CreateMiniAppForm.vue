<template>
  <div class="create-form">
    <div class="tc p10">
      <a-radio-group v-model="action" button-style="solid">
        <a-radio-button value="new">新建项目</a-radio-button>
        <a-radio-button value="import">导入项目</a-radio-button>
      </a-radio-group>
    </div>
    <div class="create-form-content">
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
        :hideRequiredMark="true"
        ref="form"
      >
        <a-form-model-item label="项目名称" prop="name">
          <a-input v-model="form.name" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="项目目录" prop="locate">
          <a-input v-model="form.locate">
            <a-icon
              slot="addonAfter"
              type="down"
              @click="handleOpenDirectory"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="项目图标" prop="iconPath">
          <div class="icon-choose" @click="handleOpenImage">
            <img :src="form.iconSrc" v-if="form.iconSrc" />
            <a-icon v-else type="plus" class="f30" />
          </div>
        </a-form-model-item>
        <a-form-model-item label="项目描述" prop="desc">
          <a-textarea v-model="form.desc" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="create-form-action">
      <a-button class="mr20" @click="handleCancel">取消</a-button>
      <a-button class="mr20" @click="handleConfirm" type="primary"
        >确定</a-button
      >
    </div>
  </div>
</template>

<script>
import path from 'path'
import fs from 'fs-extra'
import { remote } from 'electron'
import { mapActions } from 'vuex'
import { getImageBase64FromPath, copyTemplate } from '@/utils'
import { DEFAULT_PROJECT_PATH } from '@/constants'

const { dialog, BrowserWindow } = remote

export default {
  name: 'create-mini-app-form',

  data () {
    const name = 'mp-' + Math.floor(Date.now() / 1000)
    return {
      action: 'new',
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name,
        iconPath: '',
        locate: path.join(
          localStorage.getItem('projectPath') || DEFAULT_PROJECT_PATH,
          name
        ),
        desc: '',
        iconSrc: '',
        type: Number(this.$route.params.type)
      },
      rules: {
        name: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' },
          {
            validator: (rule, val, callback) => {
              if (/^[a-zA-Z][a-zA-Z0-9_-]{1,19}$/.test(val)) {
                callback()
              } else {
                callback(
                  new Error(
                    '项目名称为字母开始,2-20以内的包含字母或数字或_或-的字符'
                  )
                )
              }
            },
            trigger: 'blur'
          }
        ],
        locate: [
          { required: true, message: '项目目录不能为空', trigger: 'blur' },
          {
            validator: (rule, val, callback) => {
              if (this.action === 'import' && !fs.pathExistsSync(val)) {
                callback(new Error('不存在导入的项目目录'))
              } else if (this.action === 'new' && fs.pathExistsSync(val)) {
                callback(new Error('已存在项目目录，请更换目录'))
              } else {
                callback()
              }
            }
          }
        ],
        iconPath: [
          { required: true, message: '项目图标不能为空', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    ...mapActions('projects', ['create']),
    handleOpenDirectory () {
      const paths = dialog.showOpenDialogSync(
        BrowserWindow.getFocusedWindow(),
        {
          properties: ['openDirectory']
        }
      )

      if (paths) {
        this.form.locate = paths[0]
      }
    },
    handleOpenImage () {
      const paths = dialog.showOpenDialogSync(
        BrowserWindow.getFocusedWindow(),
        {
          properties: ['openFile'],
          filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        }
      )

      if (paths && paths.length) {
        getImageBase64FromPath(paths[0])
          .then(src => {
            this.form.iconPath = paths[0]
            this.form.iconSrc = src
            this.$refs.form.clearValidate('iconPath')
          })
          .catch(err => {
            this.$message.error('选择项目图标失败，请重试')
            console.log(err)
          })
      }
    },
    handleCancel () {
      history.back()
    },
    handleConfirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 缓存创建目录
          const paths = this.form.locate.split('/')
          localStorage.setItem(
            'projectPath',
            paths.slice(0, paths.length - 1).join('/')
          )
          // 将模板复制到目录文件夹
          fs.ensureDir(this.form.locate).then(err => {
            if (err) {
              return this.$message.error('创建项目文件夹失败，请重试')
            }

            copyTemplate({ type: this.form.type, destPath: this.form.locate })
              .then(() => {
                this.create(this.form)
                history.back()
              })
              .catch(err => {
                this.$message.error(err && err.message ? err.message : err)
              })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
@import url('./form.less');
</style>
