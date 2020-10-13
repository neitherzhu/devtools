<template>
  <div class="page flex">
    <div class="sider height-100 p20">
      <c-menu
        class="menu"
        :menus="menus"
        :active="type"
        @click="handleMenuClick"
      />
      <div class="icon-actions p10">
        <a-tooltip placement="top" title="真机调试">
          <a-icon type="android" class="ml10" @click="handleRemoteInspect" />
        </a-tooltip>
        <a-tooltip placement="top" title="退出">
          <a-icon type="logout" class="ml10" @click="handleLogout" />
        </a-tooltip>
      </div>
    </div>
    <div class="oa height-100 flex1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { projectDB, cardDB } from '@/db'
import CMenu from '@/components/Menu'
import { checkAllTemplate, getDeviceList } from '@/utils'
import {
  NORMAL_MINI_APP_TYPE,
  CARD_MINI_APP_TYPE,
  TV_MINI_APP_TYPE
} from '@/constants'

export default {
  name: 'home-page',
  components: {
    CMenu
  },
  data () {
    return {
      menus: [
        { title: '小屏小程序', key: NORMAL_MINI_APP_TYPE },
        { title: '智慧屏小程序', key: TV_MINI_APP_TYPE },
        { title: '卡片小程序', key: CARD_MINI_APP_TYPE }
      ],
      type: NORMAL_MINI_APP_TYPE
    }
  },
  mounted () {
    const { type } = this.$route.params
    type && (this.type = Number(type))
    this.initListFromDB()
  },
  methods: {
    ...mapMutations('projects', { initProject: 'init' }),
    ...mapMutations('cards', { initCard: 'init' }),
    ...mapActions('projects', ['remove']),
    initListFromDB () {
      projectDB.find({}, (err, list) => {
        if (err) return this.$message.error('初始化小程序项目数据失败')

        this.initProject(list)
      })

      cardDB.find({}, (err, list) => {
        if (err) return this.$message.error('初始化卡片数据失败')

        this.initCard(list)
      })

      // 检查模板更新
      checkAllTemplate()
    },
    handleMenuClick (active) {
      this.type = active
      this.$router.push({ name: 'mp-list', params: { type: active } })
    },
    handleLogout () {
      this.$router.push({ name: 'login-page' })
    },
    handleRemoteInspect () {
      getDeviceList()
        .then(devices => {
          const inspectPage =
            process.env.NODE_ENV !== 'production'
              ? 'http://127.0.0.1:9080/inspect.html'
              : `${__dirname}/inspect.html`
          if (!this.inspectWindow || this.inspectWindow.closed) {
            this.inspectWindow = window.open(inspectPage)
          } else {
            this.inspectWindow.focus()
          }
        })
        .catch(e => {
          this.$message.info(e.message)
        })
    }
  }
}
</script>

<style lang="less">
@import url('@/styles/index.less');

.page {
  height: 100vh;

  .sider {
    position: relative;
    width: 200px;
    background: @background-color;
    border-right: 1px solid @border-color-base;

    .icon-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: right;
    }
  }
}
</style>
