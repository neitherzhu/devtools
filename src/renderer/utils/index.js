import fs from 'fs-extra'
import path from 'path'
import cmd from 'node-cmd'
import { APP_DATA_PATH, TEMPLATE_GIT, TYPES } from '../constants'

/**
 * 根据本地路径获取图片base64
 * @param {string} p 图片本地路径
 */
export const getImageBase64FromPath = p => {
  return new Promise((resolve, reject) => {
    fs.readFile(p, (err, data) => {
      if (err) {
        return reject(err)
      }
      const t = p
        .split('/')
        .slice(-1)[0]
        .split('.')
        .slice(-1)[0]
      const file = new File([data], 'icon.' + t, { type: 'image/' + t })
      const reader = new FileReader(file)
      reader.readAsDataURL(file)

      reader.onload = ev => {
        resolve(ev.currentTarget.result)
      }
    })
  })
}

/**
 * 复制模板到目标路径
 * @param {number} type 模板类型
 * @param {string} destPath 目标路径
 * @param {string} srcDir 复制模板的srcDir文件夹
 * @param {string} srcPath 源路径
 */
export const copyTemplate = ({ type, destPath, srcDir, srcPath }) => {
  return new Promise((resolve, reject) => {
    if ((!type && !srcPath) || !destPath) return reject(new Error('入参错误'))

    if (!srcPath) {
      const name = TEMPLATE_GIT[type]
        .split('/')
        .slice(-1)[0]
        .split('.')[0]

      if (!name) {
        return reject(new Error('项目模板不存在'))
      }

      srcPath = path.join(APP_DATA_PATH, name)

      if (srcDir) {
        srcPath = path.join(srcPath, srcDir)
      }
    }

    console.log(srcPath, destPath)

    fs.copy(srcPath, destPath).then(err => {
      if (err) {
        return reject(new Error(err))
      }

      fs.remove(path.join(destPath, '.git'), e => {
        if (e) {
          return reject(new Error(e))
        }

        resolve()
      })
    })
  })
}

/**
 * 拉取/更新项目模板
 * @param {string} git 项目模板git地址
 * https://github.com/shinemofe/mp-template.git
 */
export const templateCheck = git => {
  return new Promise(resolve => {
    if (!git) return resolve()

    const name = git
      .split('/')
      .slice(-1)[0]
      .split('.')[0]

    console.log(name)

    const desPath = path.join(APP_DATA_PATH, name)
    // 如果已经存在目录，则更新
    if (fs.pathExistsSync(desPath)) {
      cmd.get(
        `
        cd ${desPath}
        git pull origin master
      `,
        function (err) {
          console.log(err)
          resolve()
        }
      )
    } else {
      cmd.get(
        `
        cd ${APP_DATA_PATH}
        git clone ${git}
      `,
        function (err) {
          console.log(err)
          resolve()
        }
      )
    }
  })
}

const doCheck = i => {
  if (!TYPES[i]) return
  // 一个一个更新
  templateCheck(TEMPLATE_GIT[TYPES[i]]).then(() => {
    console.log(i)
    i++
    doCheck(i)
  })
}

/**
 * 更新全部模板
 */
export const checkAllTemplate = () => {
  doCheck(0)
}

const isArray = arr => Object.prototype.toString.call(arr) === '[object Array]'

export const replaceInFile = (filePath, from, to) => {
  return new Promise(resolve => {
    fs.readFile(filePath, 'utf8').then(fileStr => {
      if (!isArray(from)) {
        from = [from]
      }

      if (!isArray(to)) {
        to = [to]
      }

      from.forEach((f, i) => {
        fileStr = fileStr.replace(f, to[i])
      })

      fs.writeFile(filePath, fileStr, 'utf8').then(() => {
        resolve()
      })
    })
  })
}

/**
 * 检测连接的设备列表
 */
export const getDeviceList = () => {
  return new Promise((resolve, reject) => {
    cmd.get('adb devices', (err, data, stderr) => {
      if (err) {
        return reject(new Error(err || '未安装ADB，请根据教程安装ADB'))
      }

      let devices = data.split(/\n/g).filter(x => x)
      devices.shift()

      if (!devices.length) {
        return reject(new Error('未检测到设备，请通过USB连接设备后重试'))
      } else {
        resolve(devices)
      }
    })
  })
}
