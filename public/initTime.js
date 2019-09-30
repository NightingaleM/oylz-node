'use strict'
const initTime = (t) => {
  t = t ? t : new Date()
  let time = new Date(t)
  let format = getFormat
  return {
    time,
    format,
  }
}

let getFormat = function (format = 'Y-M-D(W) H:m:s', lag = 'zh') {
  let time = this.time
  // let time = new Date()
  let formatList = format.split('')
  let initTime = ''
  for (let i = 0; i < formatList.length; i++) {
    let keyWorld = formatList[i]
    switch (keyWorld) {
      case 'Y':
        initTime += time.getFullYear()
        break;
      case 'M':
        if (time.getMonth() + 1 < 10) {
          initTime += '0' + (time.getMonth() + 1)
        } else {
          initTime += time.getMonth() + 1
        }
        break;
      case 'D':
        if (time.getDate() < 10) {
          initTime += '0' + time.getDate()
        } else {
          initTime += time.getDate()
        }
        break;
      case 'W':
        let weekList = []
        if (lag === 'zh') {
          weekList = ['日', '一', '二', '三', '四', '五', '六']
        } else {
          weekList = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.']
        }
        initTime += weekList[time.getDay()]
        break;
      case 'H':
        if (time.getHours() < 10) {
          initTime += '0' + time.getHours()
        } else {
          initTime += time.getHours()
        }
        break;
      case 'm':
        if (time.getMinutes() < 10) {
          initTime += '0' + time.getMinutes()
        } else {
          initTime += time.getMinutes()
        }
        break;
      case 's':
        if (time.getSeconds() < 10) {
          initTime += '0' + time.getSeconds()
        } else {
          initTime += time.getSeconds()
        }
        break;
      default:
        initTime += keyWorld
    }
  }
  return initTime
}




// export { initTime }
module.exports = initTime
