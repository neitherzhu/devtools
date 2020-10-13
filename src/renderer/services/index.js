import Request from 'request'
import { message } from 'ant-design-vue'

const j = Request.jar()
let request = Request.defaults({
  jar: j,
  headers: {
    'content-type': 'application/json'
  },
  json: true,
  baseUrl: 'http://baas.uban360.net:21006'
})

const APIS = {
  LOGIN: '/baas-login/open/pwdLogin',
  CREATE_CARD: '/open/smallapp/cardManager/save.json',
  CREATE_MP: '/open/smallapp/appManager/quickCreate'
}

const postRequest = (url, body) => {
  return new Promise((resolve, reject) => {
    request.post(
      {
        url,
        body
      },
      function (err, _, data) {
        if (err) {
          message.error('网络错误')
          return reject(new Error('网络错误'))
        }

        console.log('服务端返回：', data)

        if (data.code === 200) {
          resolve(data.data)
        } else {
          reject(new Error(data.msg || data.message))
        }
      }
    )
  })
}

export const login = (domain, params) => {
  request = request.defaults({
    baseUrl: domain
  })

  return postRequest(APIS.LOGIN, params)
}

export const createCard = params => {
  return postRequest(APIS.CREATE_CARD, params)
}
