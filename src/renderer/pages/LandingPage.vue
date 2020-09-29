<template>
  <div class="page">
    <div class="sider">
      <c-menu
        class="menu"
        :menus="menus"
        :active="type"
        @click="handleMenuClick"
      />
    </div>
    <div class="content">
      <div class="project">
        <div class="project-item project-create" @click="handleCreateProject">
          <i class="iconfont icon-add-bold" />创建
        </div>
        <c-project-item v-for="x in projects" :key="x.id" :project="x" />
      </div>
      <a-button type="primary" @click="handleRemoteInspect">真机调试</a-button>
      <div class="help" v-if="showHelp">
        请先安装ADB，<a
          href="https://atmb.top/guide/adb/install/"
          target="_blank"
          >查看教程</a
        >
      </div>
      <div class="create-form" v-if="showCreateForm">
        <create-mini-app-form
          v-if="
            type === NORMAL_MINI_APP_TYPE ||
              type === CARD_MINI_APP_TYPE ||
              type === TV_MINI_APP_TYPE
          "
          :type="type"
          @cancel="handleCancelCreate"
          @confirm="handleConfirmCreateNormalMiniApp"
        />
      </div>
    </div>
  </div>
</template>

<script>
import cmd from 'node-cmd'
import { mapMutations, mapActions } from 'vuex'
import db from '../db'
import CMenu from '../components/Menu'
import CProjectItem from '../components/ProjectItem'
import CreateMiniAppForm from '../components/CreateForm/MiniApp'
import {
  NORMAL_MINI_APP_TYPE,
  CARD_MINI_APP_TYPE,
  TV_MINI_APP_TYPE,
  CARD_PROJECT_TYPE
} from '../constants'
// import { checkAllTemplate } from '../utils'

export default {
  name: 'landing-page',
  components: {
    CMenu,
    CProjectItem,
    CreateMiniAppForm
  },
  data () {
    return {
      menus: [
        { title: '小屏小程序', key: NORMAL_MINI_APP_TYPE },
        { title: '智慧屏小程序', key: TV_MINI_APP_TYPE },
        { title: '卡片小程序', key: CARD_MINI_APP_TYPE }
        // {
        //   title: '小程序',
        //   subs: [
        //     { title: '小屏小程序', key: NORMAL_MINI_APP_TYPE },
        //     { title: '智慧屏小程序', key: TV_MINI_APP_TYPE }
        //   ]
        // },
        // {
        //   title: '卡片',
        //   subs: [
        //     { title: '卡片小程序', key: CARD_MINI_APP_TYPE },
        //     { title: '卡片', key: CARD_TYPE }
        //   ]
        // }
      ],
      type: NORMAL_MINI_APP_TYPE,
      showCreateForm: false,
      showHelp: false,
      NORMAL_MINI_APP_TYPE,
      CARD_MINI_APP_TYPE,
      TV_MINI_APP_TYPE,
      CARD_PROJECT_TYPE
    }
  },
  mounted () {
    db.find({}, (err, list) => {
      if (err) {
        return console.log('初始化数据失败')
      }
      this.init(list)
      // checkAllTemplate()
    })
  },
  computed: {
    projects () {
      return this.$store.state.projects.filter(x => x.type === this.type)
    }
  },
  methods: {
    ...mapMutations('projects', ['init']),
    ...mapActions('projects', ['create', 'remove']),
    handleMenuClick (active) {
      this.type = active
      this.showCreateForm = false
    },
    handleCreateProject () {
      this.showCreateForm = true
    },
    handleCancelCreate () {
      this.showCreateForm = false
    },
    handleConfirmCreateNormalMiniApp (project) {
      this.showCreateForm = false
      this.create(project)
    },
    handleRemoteInspect () {
      this.getDeviceList(devices => {
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
    },
    /**
     * 检测连接的设备列表
     */
    getDeviceList (callback) {
      cmd.get('adb devices', (err, data, stderr) => {
        if (err) {
          this.showHelp = true
          return this.$message.info(err || '未安装ADB，请根据教程安装ADB')
        }

        let devices = data.split(/\n/g).filter(x => x)
        devices.shift()

        if (!devices.length) {
          return this.$message.info('未检测到设备，请通过USB连接设备后重试')
        } else {
          callback && callback(devices)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../styles/index.less');
.page {
  height: 100vh;
  display: flex;

  .sider {
    width: 200px;
    height: 100%;
    padding: 20px;
    background: @background-color;
    border-right: 1px solid @border-color-base;
  }

  .content {
    position: relative;
    flex: 1;
    height: 100%;
    padding: 20px;
  }

  .create-form {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: @background-color;
  }

  .help {
    margin-top: 20px;
  }
}
</style>
