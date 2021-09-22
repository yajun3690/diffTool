/*
 * @Description:
 * @Author: Ray
 * @Date: 2021-07-19 11:13:29
 * @LastEditTime: 2021-09-22 10:06:59
 * @LastEditors: Ray
 */
//1，数据存储模块
/*
key:ReadArticleId //页面特征键值
value:{
  readStartDate: Date.now(),//开始埋点时间戳
  readTime: 0,//阅读时长
  readPercent: 0,//阅读百分比
  visibileDate: '',//页面激活时间戳
  hiddenDate: '',//页面隐藏时间戳
  invalidTime: '',//无效阅读时间
  validReadTime:''//有效阅读时间
}
*/
/*埋点信息
behavirorData:{
  behavirorId:'43534534',
  articleId:'123423423',
  startTime:'3442342352523523',
  BehaviorDetail:{
    percent0: 0,
    percent5: 0,
    percent10: 0,
    percent15: 0,
    percent20: 0,
    percent25: 0,
    percent30: 0,
    percent35: 0,
    percent40: 0,
    percent45: 0,
    percent50: 0,
    percent55: 0,
    percent60: 0,
    percent65: 0,
    percent70: 0,
    percent75: 0,
    percent80: 0,
    percent85: 0,
    percent90: 0,
    percent95: 0,
    percent100: 0
  }
}
*/

const setLocalStorage = (key, value) => {
  value = typeof value === 'object' ? JSON.stringify(value) : value
  window.localStorage.setItem(key, value)
}

const getLocalStorage = (key, format) => {
  const res = window.localStorage.getItem(key)
  return format ? JSON.parse(res) : res
}

const removeLocalStorage = (key) => {
  window.localStorage.removeItem(key)
}

//2，有效阅读时长计算模块
//页面特征键值
var articleId = window.location.href.split('/')[
  window.location.href.split('/').length - 1
]
var guid = Guid()
//页面加载,初始化数据
window.onload = function () {
  let oldStorage = getLocalStorage('behavirorData', true)
  //是否有历史记录，判断是否为刷新
  if (oldStorage) {
    // 重置结束时间
    removeLocalStorage('articleData')
    removeLocalStorage('behavirorData')
  }
  let createData = {
    readStartDate: Date.now(),
    readTime: 0,
    readPercent: 0,
    visibileDate: '',
    hiddenDate: '',
    invalidTime: '',
    validReadTime: '',
    percent100Readed: false,
  }
  setLocalStorage('articleData', createData)
  CalculationReadPercent()
  // var F = document.getElementById('footer')
  var F = document.getElementsByClassName('slide_content')[0]
  var scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  //短页面进入后内容阅读完毕判定
  if (getScrollHeight() - F.offsetHeight <= getViewPortHeight() + scrollTop) {
    setReadData(null, null, 1, null, null, null, null)
    CalculationReadPercent()
  }
}
function setReadData(
  readStartDateParm,
  readTimeParm,
  readPercentParm,
  readVisibileDateParm,
  readHiddenDateParm,
  readInvalidTimeParm,
  ReadValidReadTime,
  percent100Readed
) {
  let oldStorage = getLocalStorage('articleData', true)
  //开始阅读时间
  readStartDateParm ? (oldStorage.readStartDate = readStartDateParm) : false
  //阅读时长
  readTimeParm ? (oldStorage.readTime = readTimeParm) : false
  //阅读百分比
  readPercentParm
    ? readPercentParm > oldStorage.readPercent
      ? (oldStorage.readPercent = readPercentParm)
      : false
    : false
  // 显示时间 visibileDate
  readVisibileDateParm != 'null'
    ? (oldStorage.visibileDate = readVisibileDateParm)
    : false
  // 隐藏时间 hiddenDate
  readHiddenDateParm != 'null'
    ? (oldStorage.hiddenDate = readHiddenDateParm)
    : false
  // 无效阅读 invalidTime
  readInvalidTimeParm ? (oldStorage.invalidTime = readInvalidTimeParm) : false
  ReadValidReadTime ? (oldStorage.validReadTime = ReadValidReadTime) : false
  if (percent100Readed) {
    oldStorage.percent100Readed = true
  }
  setLocalStorage('articleData', oldStorage)
}

//3，文章阅读百分比模块
/*
scrollTop: 滚动条距顶部高度
F.offsetHeight: footer高度
getViewPortHeight():窗口高度
getScrollHeight():文档高度
getViewPortHeight() + scrollTop: 计算文章已滑动的文档高度
getScrollHeight() - F.offsetHeight - getViewPortHeight(): 读完文章所需滑动高度
*/

// 获取设备视图高度
function getViewPortHeight() {
  return document.documentElement.clientHeight || document.body.clientHeight
}
//获取文档完整高度
function getScrollHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  )
}

//guid
function Guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    // '-' +
    S4() +
    // '-' +
    S4() +
    // '-' +
    S4() +
    // '-' +
    S4() +
    S4() +
    S4()
  )
}

//节流函数
function throttling(fn, wait, maxTimelong) {
  var timeout = null,
    startTime = Date.parse(new Date())

  return function () {
    if (timeout !== null) clearTimeout(timeout)
    var curTime = Date.parse(new Date())
    if (curTime - startTime >= maxTimelong) {
      fn()
      startTime = curTime
    } else {
      timeout = setTimeout(fn, wait)
    }
  }
}
//计算阅读文章百分比函数
function CalculationReadPercent() {
  // var C = document.getElementById('content')
  // var F = document.getElementById('footer')
  var C = document.getElementsByClassName('newsContent')[0]
  var F = document.getElementsByClassName('slide_content')[0]
  var scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  var readHight = getScrollHeight() - F.offsetHeight - getViewPortHeight()
  var readPercent = Number((scrollTop / readHight).toFixed(2))
  if (readPercent <= 1 && readPercent > 0) {
    setReadData(null, null, readPercent, null, null, null, null)
  }
  if (getScrollHeight() - F.offsetHeight <= getViewPortHeight() + scrollTop) {
    //判断埋点信息即发
    if (getLocalStorage('articleData', true).percent100Readed) {
      setReadData(null, null, 1, null, null, null, null)
    } else {
      setReadData(null, null, 1, null, null, null, null, true)
      complutebehavirorData()
      saveData()
    }
  }
  //记录百分比时触发
  complutebehavirorData()
  onbeforeunload_handler()
}

//behavirorData处理

//向下去数算法逻辑templete
// let a = percent
// step1 : 取整。保留一位小数 let b = a.toFixed(1) + 0.5
// step2 : Math.min(a , b)
// templete1 a=0.79 Math.min(0.79,0.75) => 0.75 return b
// templete2 a=0.72 Math.min(0.72,0.75) => 0.72 return a.toFixed(1) => 0.7
//保留指定小数位，不进行四舍五入
function toFixed(num, decimal) {
  num = num.toString()
  let index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  return parseFloat(num).toFixed(decimal)
}

function compluteMin(percent) {
  let compluteNum = toFixed(percent, 1) - 0 + 0.05

  return Math.min(percent, compluteNum) == compluteNum
    ? compluteNum
    : toFixed(percent, 1)
}

//计算当前埋点信息behavirorData
function complutebehavirorData() {
  // CalculationReadPercent()
  //percent
  //readTime
  if (getLocalStorage('behavirorData', true)) {
    let data = getLocalStorage('behavirorData', true)
    if (getLocalStorage('articleData', true).validReadTime > 0) {
      data.BehaviorDetail[
        'percent' +
          Number(
            toFixed(
              compluteMin(getLocalStorage('articleData', true).readPercent),
              2
            ) * 100
          ).toFixed(0)
      ] = getLocalStorage('articleData', true).validReadTime
    }
    setLocalStorage('behavirorData', data)
  } else {
    let data = {
      BehaviroId: guid,
      BehaviroType: 'TimerReport',
      OpenId: 'string',
      UnionId: 'string',
      MdmCode: 'string',
      Email: 'string',
      ContentId: articleId,
      ContentTitle: $('.ContentTitle').text(),
      Role: 'hcp',
      PageUrl: window.location.href,
      // startTime: getLocalStorage('articleData', true).readStartDate,
      BehaviorDetail: {
        percent0: 0,
        percent5: 0,
        percent10: 0,
        percent15: 0,
        percent20: 0,
        percent25: 0,
        percent30: 0,
        percent35: 0,
        percent40: 0,
        percent45: 0,
        percent50: 0,
        percent55: 0,
        percent60: 0,
        percent65: 0,
        percent70: 0,
        percent75: 0,
        percent80: 0,
        percent85: 0,
        percent90: 0,
        percent95: 0,
        percent100: 0,
      },
    }
    setLocalStorage('behavirorData', data)
  }
}

//页面显示与隐藏触发函数，暂停/继续计算阅读时长
document.addEventListener('visibilitychange', function () {
  var isHidden = document.hidden
  if (isHidden) {
    setReadData(null, null, null, null, Date.now(), null, null)
  } else {
    var AllInvalidTime
    if (getLocalStorage('articleData', true).invalidTime) {
      if (getLocalStorage('articleData', true).hiddenDate) {
        AllInvalidTime =
          getLocalStorage('articleData', true).invalidTime +
          Number(
            (
              (Date.now() - getLocalStorage('articleData', true).hiddenDate) /
              1000
            ).toFixed(1)
          )
      } else {
        AllInvalidTime = getLocalStorage('articleData', true).invalidTime
      }
    } else {
      AllInvalidTime = Number(
        (
          (Date.now() - getLocalStorage('articleData', true).hiddenDate) /
          1000
        ).toFixed(1)
      )
    }

    setReadData(null, null, null, Date.now(), null, AllInvalidTime, null)
  }
})
function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')

  if ((arr = window.document.cookie.match(reg))) return unescape(arr[2])
  else return null
}
// Api模块
function saveData() {
  axios
    .post(
      'https://vhomeapitst.organonchina.com.cn/api/UserBehavior/ReportBehavior',
      getLocalStorage('behavirorData', true),
      {
        headers: {
          Authorization: 'Bearer ' + getCookie('vhomeToken'),
        },
      }
    )
    .then((res) => {})
    .catch((err) => {
      console.log(err)
    })
}
//step1: 滑动监听，到达点位触发
// 监听滚动函数
window.addEventListener('scroll', throttling(CalculationReadPercent, 80, 100))

//step2: 定时推送埋点信息
var buriedPointInterval = setInterval(() => {
  CalculationReadPercent()
  saveData()
}, 3000)

//step3:
//页面即将刷新与关闭时触发函数
function onbeforeunload_handler() {
  readTime = Number(
    (
      (Date.now() - getLocalStorage('articleData', true).readStartDate) /
      1000
    ).toFixed(1)
  )
  if (readTime - getLocalStorage('articleData', true).invalidTime > 0) {
    validReadTime = readTime - getLocalStorage('articleData', true).invalidTime
    setReadData(null, readTime, null, null, null, null, validReadTime)
  }
  //调用Api传递数据
  //清除存储数据
}
function sendAndDeleteData() {
  CalculationReadPercent()
  //发送埋点信息
  //清除数据
  DeleteData('articleData')
}
window.onbeforeunload = sendAndDeleteData
//回收清理数据
function DeleteData() {
  if (buriedPointInterval) {
    clearInterval(buriedPointInterval)
  }
  removeLocalStorage('articleData')
  removeLocalStorage('behavirorData')
}
