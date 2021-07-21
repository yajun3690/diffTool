/*
 * @Description:
 * @Author: Ray
 * @Date: 2021-07-19 11:13:29
 * @LastEditTime: 2021-07-21 11:09:13
 * @LastEditors: Ray
 */
//1，数据存储模块
/*
key:ReadArticleId //页面特征键值
value:{
  status: 'Created',//埋点状态
  readStartDate: Date.now(),//开始埋点时间戳
  endDate: '',//结束埋点时间戳
  readTime: 0,//阅读时长
  readPercent: 0,//阅读百分比
  visibileDate: '',//页面激活时间戳
  hiddenDate: '',//页面隐藏时间戳
  invalidTime: '',//无效阅读时间
  validReadTime:''//有效阅读时间
}
status:
数据状态
  1, 创建 Created
  2, 进行 InProgress
  3, 完成 Completed
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
var atticleId = 'ReadArticleId0'
//页面加载,初始化数据
window.onload = function () {
  let oldStorage = getLocalStorage(atticleId, true)
  //是否有历史记录，判断是否为刷新
  if (oldStorage) {
    // 重置结束时间
    setReadData('InProgress', null, null, null, null, null, null, null, null)
  } else {
    let createData = {
      status: 'Created',
      readStartDate: Date.now(),
      endDate: '',
      readTime: 0,
      readPercent: 0,
      visibileDate: '',
      hiddenDate: '',
      invalidTime: '',
      validReadTime: '',
    }
    setLocalStorage(atticleId, createData)
  }

  var F = document.getElementById('footer')
  var scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  //内容阅读完毕判定
  if (getScrollHeight() - F.offsetHeight <= getViewPortHeight() + scrollTop) {
    setReadData(null, null, null, null, 1, null, null, null, null)
  }
}
function setReadData(
  readStatusParm,
  readStartDateParm,
  readEndDateParm,
  readTimeParm,
  readPercentParm,
  readVisibileDateParm,
  readHiddenDateParm,
  readInvalidTimeParm,
  ReadValidReadTime
) {
  let oldStorage = getLocalStorage(atticleId, true)
  //阅读状态
  readStatusParm ? (oldStorage.status = readStatusParm) : false
  //开始阅读时间
  readStartDateParm ? (oldStorage.readStartDate = readStartDateParm) : false
  //阅读结束时间
  readEndDateParm != 'null' ? (oldStorage.endDate = readEndDateParm) : false
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
  setLocalStorage(atticleId, oldStorage)
}
//页面显示与隐藏触发函数，暂停/继续计算阅读时长
document.addEventListener('visibilitychange', function () {
  var isHidden = document.hidden
  if (isHidden) {
    setReadData(null, null, null, null, null, null, Date.now(), null, null)
  } else {
    var AllInvalidTime
    if (getLocalStorage(atticleId, true).invalidTime) {
      AllInvalidTime =
        getLocalStorage(atticleId, true).invalidTime +
        Number(
          (
            (Date.now() - getLocalStorage(atticleId, true).hiddenDate) /
            1000
          ).toFixed(1)
        )
    } else {
      AllInvalidTime = Number(
        (
          (Date.now() - getLocalStorage(atticleId, true).hiddenDate) /
          1000
        ).toFixed(1)
      )
    }

    setReadData(
      null,
      null,
      null,
      null,
      null,
      Date.now(),
      null,
      AllInvalidTime,
      null
    )
  }
})

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
  var C = document.getElementById('content')
  var F = document.getElementById('footer')
  var scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop

  var readHight = getScrollHeight() - F.offsetHeight - getViewPortHeight()
  var readPercent = Number((scrollTop / readHight).toFixed(2))
  if (readPercent <= 1 && readPercent > 0) {
    setReadData(
      'InProgress',
      null,
      null,
      null,
      readPercent,
      null,
      null,
      null,
      null
    )
  }
  if (getScrollHeight() - F.offsetHeight <= getViewPortHeight() + scrollTop) {
    setReadData('InProgress', null, null, null, 1, null, null, null, null)
  }
}
// 监听滚动函数
window.addEventListener('scroll', throttling(CalculationReadPercent, 1000, 500))

// Api模块

//页面即将刷新与关闭时触发函数
window.onbeforeunload = onbeforeunload_handler
function onbeforeunload_handler() {
  readTime = Number(
    (
      (Date.now() - getLocalStorage(atticleId, true).readStartDate) /
      1000
    ).toFixed(1)
  )
  validReadTime = readTime - getLocalStorage(atticleId, true).invalidTime
  setReadData(
    'Completed',
    null,
    Date.now(),
    readTime,
    null,
    null,
    null,
    null,
    validReadTime
  )
  //调用Api传递数据

  //清除存储数据
}
