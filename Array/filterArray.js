/*
 * @Description:
 * @Author: Ray
 * @Date: 2021-07-08 16:14:55
 * @LastEditTime: 2021-07-08 17:04:22
 * @LastEditors: Ray
 */

/*
 * filtetArray 过滤数组
 * r 过滤规则，Array || string default:['', null]
 *
 */
function filtetArray(n, r = ['', null]) {
  switch (typeof r) {
    case 'object':
      return n.filter((item) => {
        return r.indexOf(item) == -1
      })
      break
    case 'string':
      return n.filter((item) => {
        return item !== r
      })
      break
    default:
      break
  }
}

/*
 * exampleCode: filter、concat、sort
 */

// let a = [1, 2, 3, 0, 0, null, '']
// let b = [3, 5, 7, 7, 3, 4, 0, 0, 1]
// let result = filtetArray(a, [0, '0', '', null])
//   .concat(filtetArray(b, [0, '0', '', null]))
//   .sort((a, b) => {
//     return a - b
//   })

// console.log(result)
