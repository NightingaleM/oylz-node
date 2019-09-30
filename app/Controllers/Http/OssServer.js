'use strict'
const crypto = require("crypto")
// const initTime = require("Public/initTime")
const initTimeF = use("Public/initTime")
// import { initTime } from "Public/initTime"

const initTime = initTimeF()

const Env = use('Env')
const client = {
  region: Env.get('REGION'),
  accessKeyId: Env.get('ACCESS_KEY_ID'),
  accessKeySecret: Env.get('ACCESS_KEY_SECRET'),
  bucket: Env.get('BUCKET'),
  callBackIp: Env.get('CALLBACK_IP'),
  callBakcPort: Env.get('CALLBACK_PORT'),
}

class OssServer {
  signaOss({ request, response }) {
    const {
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
      callBackIp,
      callBakcPort,
    } = client
    const { baseType } = request.all()
    let basePath
    switch (baseType) {
      case 'blog':
        basePath = `blog/${initTime.format('Y-M-D')}/`
        break;
      case 'easyNote':
        basePath = `easyNote/${initTime.format('Y-M-D')}/`
        break;
      default:
        basePath = `others/${initTime.format('Y-M-D')}/`
        break;
    }
    const host = `http://${bucket}.${region}.aliyuncs.com`
    const end = new Date().getTime() + 600000
    const expiration = new Date(end).toISOString()
    let policyString = {
      expiration,
      conditions: [
        ['content-length-range', 0, 1048576000],
        ['starts-with', '$key', basePath]
      ]
    }
    policyString = JSON.stringify(policyString)
    const policy = Buffer(policyString).toString('base64')
    const Signature = crypto.createHmac('sha1', accessKeySecret).update(policy).digest("base64")
    // let callbackUrl = `http://${callBackIp}${callBakcPort ? ':' + callBakcPort : ''}/acapi/be/ossCallback`
    let callbackUrl = `http://${callBackIp}${callBakcPort ? ':' + callBakcPort : ''}/oy/api/ossCallback`
    const callbackBody = {
      "callbackUrl": callbackUrl,
      "callbackHost": `${callBackIp}`,
      "callbackBody": "{\"filename\": ${object},\"size\": ${size}}",
      "callbackBodyType": "application/json"
    }
    const callback = Buffer(JSON.stringify(callbackBody)).toString('base64')
    response.json({
      statusCode: 200,
      message: '成功',
      result: {
        Signature,
        policy,
        host,
        'OSSAccessKeyId': accessKeyId,
        'key': end,
        'success_action_status': 200,
        dirPath: basePath,
        callback
      }
    })
  }
  ossCallback({ request, response }) {
    response.json({
      statusCode: 200,
      message: 'oss参数回调',
      result: {
        ...request.all()
      }
    })
  }
}


module.exports = OssServer


