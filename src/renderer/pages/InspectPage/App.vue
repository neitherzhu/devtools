<template>
  <div id="app">
    <div class="inspect-page">
      <div class="device">
        <span class="device-name">{{ device.name }}</span>
        <span class="device-id">#{{ device.id.toUpperCase() }}</span>
      </div>
      <div class="webview">
        <div class="webview-item" v-for="(x, i) in pageList" :key="i">
          <div class="webview-name">{{ x.title }}</div>
          <div class="webview-url">{{ x.url }}</div>
          <div
            class="webview-info"
            v-if="x.description"
            :class="{ disabled: x.description.empty || !x.description.visible }"
          >
            <template v-if="x.description.empty">empty</template>
            <template v-else>
              <template v-if="!x.description.visible">hidden </template>
              at ({{ x.description.screenX }}, {{ x.description.screenY }}) size
              {{ x.description.width }}x{{ x.description.height }}
            </template>
          </div>
          <div class="webview-inspect">
            <a href="javascript:;" @click="handleClick(x)">调试</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cmd from 'node-cmd'

const PORT = 9223

export default {
  name: 'inspect',
  data () {
    return {
      device: {
        name: '',
        id: ''
      },
      pageList: []
    }
  },
  mounted () {
    this.start()
  },
  methods: {
    start () {
      this.getDevice((err, device) => {
        if (err) {
          if (this.timer) {
            this.timer = null
            clearTimeout(this.timer)
          }
          return this.$message.info('连接已断开')
        }

        this.$message.success('已连接' + device.name)
        this.device = device

        this.getWebviews()
      })
    },

    /**
     * 检测连接的设备
     */
    getDevice (callback) {
      cmd.get('adb devices', (err, data, stderr) => {
        if (err) {
          return this.$message.info(err)
        }

        let devices = data.split(/\n/g).filter(x => x)
        devices.shift()

        if (!devices.length) {
          // 当不存在设备时，不重复调用callback
          if (this.deviceId !== -1) {
            this.deviceId = -1
            callback(true)
          }
        } else {
          const deviceId = devices[0].split(/\s+/g)[0]
          // 同一个设备，不重复调用callback
          if (this.deviceId !== deviceId) {
            // 缓存设备id
            this.deviceId = deviceId
            // 获取手机名称
            cmd.get(
              'adb shell getprop ro.product.model',
              (err, data, stderr) => {
                if (err) {
                  return callback(err)
                }

                const name = data
                  .split(/\r|\n/g)
                  .filter(x => x)
                  .join('')

                callback(false, { name, id: deviceId })
              }
            )
          }
        }
        // 定时检测设备连接状态
        setTimeout(() => {
          this.getDevice(callback)
        }, 5000)
      })
    },

    /**
     * 获取打开的app，并创建服务用于调试
     */
    getWebviews () {
      // 获取可调试的app列表，取最后一个打开的app
      cmd.get(
        'adb shell grep -a webview_devtools_remote /proc/net/unix',
        (err, data, stderr) => {
          if (err) {
            setTimeout(() => {
              this.getWebviews()
            }, 3000)
            return
          }

          const webviewId = data
            .trim()
            .split(/\s+/g)
            .pop()
            .substring(1)

          // 根据上面获取到的名称，创建连接，用于获取webview列表
          cmd.get(
            'adb forward tcp:' + PORT + ' localabstract:' + webviewId,
            (err, data) => {
              if (err) {
                return this.$message.info(err.message)
              }

              console.log(data)
              // 获取列表
              this.getTargetWebViewDevtoolsFrontendUrl()
            }
          )
        }
      )
    },

    /**
     * 获取可调式的webview列表
     */
    getTargetWebViewDevtoolsFrontendUrl () {
      return fetch(`http://127.0.0.1:${PORT}/json`)
        .then(res => res.json())
        .then(list => {
          this.pageList = list.map(x => {
            x.description && (x.description = JSON.parse(x.description))
            return x
          })

          console.log(this.pageList)
          // 定时获取列表，用于更新
          this.timer = setTimeout(() => {
            this.getTargetWebViewDevtoolsFrontendUrl()
          }, 3000)
        })
        .catch(e => {
          // 如果获取失败，表示app已被关闭
          // 置空列表
          // 检测下一个打开的app
          this.pageList = []
          this.timer = setTimeout(() => {
            this.getWebviews()
          }, 3000)
        })
    },

    /**
     * 点击调试
     */
    handleClick (page) {
      let urls = page.devtoolsFrontendUrl.split('?')

      // 替换成自己的调试器
      urls[0] = 'http://api.jituancaiyun.net/devtools/inspector.html'

      window.open(urls.join('?'))
    }
  }
}
</script>

<style lang="less">
.inspect-page {
  padding: 10px 20px;
  font-size: 12px;
  .device {
    &-name {
      font-size: 16px;
    }

    &-id {
      margin-left: 5px;
      color: #999;
    }
  }

  .webview {
    margin-top: 20px;

    &-item {
      margin-bottom: 10px;
    }

    &-name {
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-url {
      color: #999;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 3px 0;
    }

    &-inspect {
      margin-top: 6px;
      font-size: 14px;
    }
  }

  .disabled {
    color: #999;
  }
}
</style>
