<template>
  <div class="create-form pt30">
    <div class="create-form-content">
      <a-form-model
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
        :hideRequiredMark="true"
        ref="form"
      >
        <a-form-model-item label="卡片中文名称" prop="name">
          <a-input v-model="form.name" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="卡片英文名称" prop="enName">
          <a-input v-model="form.enName" :maxLength="20" />
        </a-form-model-item>
        <a-form-model-item label="卡片描述" prop="desc">
          <a-textarea v-model="form.desc" />
        </a-form-model-item>
        <a-form-model-item label="小程序">
          <a-input :value="project && project.name" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item label="小程序目录">
          <a-input :value="project && project.locate" :disabled="true" />
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
import fs from 'fs-extra'
import path from 'path'
import { mapActions } from 'vuex'
import { copyTemplate, replaceInFile } from '@/utils'
import { CARD_PROJECT_TYPE, SINGLE_CARD_TYPE } from '@/constants'
import { createCard } from '@/services'

export default {
  name: 'create-card-form',
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        enName: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '卡片中文名称不能为空', trigger: 'blur' }
        ],
        enName: [
          { required: true, message: '卡片英文名称不能为空', trigger: 'blur' },
          {
            validator: (rule, val, callback) => {
              if (/^[a-zA-Z][a-zA-Z0-9_-]{1,19}$/.test(val)) {
                callback()
              } else {
                callback(
                  new Error(
                    '卡片名称为字母开始,2-20以内的包含字母或数字或_或-的字符'
                  )
                )
              }
            },
            trigger: 'blur'
          }
        ],
        desc: [{ required: true, message: '卡片描述不能为空', trigger: 'blur' }]
      }
    }
  },

  computed: {
    project () {
      return this.$store.state.projects.find(
        x => x.id === Number(this.$route.params.id)
      )
    }
  },
  mounted () {
    const { copyFrom } = this.$route.params

    if (copyFrom) {
      const sourceCard = this.$store.state.cards.find(x => x.id === copyFrom)
      this.sourceCard = { ...sourceCard }
      this.form.enName = sourceCard.enName
    }
  },

  methods: {
    ...mapActions('cards', ['create']),
    handleCancel () {
      history.back()
    },
    handleConfirm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { copyFrom } = this.$route.params
          const { name, enName } = this.form
          const { locate } = this.project
          const p = locate + '-cards'
          // 1.判断是否有卡片项目
          // 如果没有，需要复制一个卡片项目
          // 2.调服务端接口创建一个卡片，获得卡片id
          // 3.判断创建的卡片是复制的其他卡片还是新建卡片
          // 新建卡片从项目模板中复制，并将变量替换成具体的内容 label，id，name
          // 复制其他卡片的话，直接从其他卡片代码复制，并将label，id，name替换成新卡片的名字，id，symbol
          // 4.将创建的卡片symbol，添加到卡片小程序项目中去
          const isExistCardProjectTemplate = fs.pathExistsSync(p)

          new Promise(resolve => {
            // 如果不存在模板，则需要复制项目模板到指定位置
            if (!isExistCardProjectTemplate) {
              copyTemplate({ type: CARD_PROJECT_TYPE, destPath: p })
                .then(() => {
                  resolve()
                })
                .catch(err => {
                  this.$message.error(err && err.message ? err.message : err)
                })
            } else {
              resolve()
            }
          }).then(() => {
            // 创建一个卡片并且获取到卡片id
            createCard({
              appName: name,
              config: { componentSymbol: enName }
            })
              .then(cardId => {
                // 复制单个卡片模板
                const collectionPath = path.join(p, `src/card-collection`)
                const symbol = `${enName}-${cardId}`
                const destPath = path.join(collectionPath, symbol)
                let srcPath
                let srcDir
                let replaceKeys
                let replaceValues = [name, symbol, cardId]

                if (copyFrom) {
                  const soruceCardSymbol = `${this.sourceCard.enName}-${this.sourceCard.cardId}`
                  srcPath = path.join(collectionPath, soruceCardSymbol)
                  replaceKeys = [
                    new RegExp(this.sourceCard.name, 'g'),
                    new RegExp(soruceCardSymbol, 'g'),
                    new RegExp(this.sourceCard.cardId, 'g')
                  ]
                } else {
                  srcDir = 'base'
                  replaceKeys = [
                    new RegExp('%label%', 'g'),
                    new RegExp('%name%', 'g'),
                    new RegExp('%id%', 'g')
                  ]
                }

                copyTemplate({
                  type: SINGLE_CARD_TYPE,
                  destPath,
                  srcDir,
                  srcPath
                }).then(() => {
                  // 替换字符串
                  replaceInFile(
                    path.join(destPath, 'card.vue'),
                    replaceKeys,
                    replaceValues
                  ).then(() => {
                    try {
                      const dPath = path.join(locate, 'src/card-deps.json')
                      let dCards = fs.readFileSync(dPath, 'utf8')
                      dCards = JSON.parse(dCards)
                      dCards.push(symbol)
                      fs.writeFileSync(dPath, JSON.stringify(dCards, null, 2))
                      console.log(dCards)
                    } catch (e) {}

                    this.form.mpId = this.project.id
                    this.form.cardId = cardId
                    this.form.projectLocate = p
                    this.form.cardLocate = destPath
                    this.create(this.form)
                    history.back()
                  })
                })
              })
              .catch(e => {
                this.$message.error(e.message)
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
