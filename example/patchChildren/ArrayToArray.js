import {
  h,
  ref
} from '../../lib/guide-mini-vue.esm.js'

// 左侧对比
// (a b) c
// (a b) d e
// const prevChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'C', }, 'C'),
// ]
// const nextChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'D', }, 'D'),
//   h('div', { key: 'E', }, 'E'),
// ]

// 右侧对比
// a (b c)
// d e (b c) 
// const prevChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'C', }, 'C'),
// ]
// const nextChildren = [
//   h('div', { key: 'D', }, 'D'),
//   h('div', { key: 'E', }, 'E'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'C', }, 'C'),
// ]

// 左侧对比
// (a b) c
// (a b)
// const prevChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
// ]
// const nextChildren = [
//   h('div', { key: 'D', }, 'D'),
//   h('div', { key: 'C', }, 'C'),
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
// ]

// 右侧对比
// a (b c)
//   (b c) 
// const prevChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'C', }, 'C'),
// ]
// const nextChildren = [
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'C', }, 'C'),
// ]


// const prevChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'C', }, 'C'),
//   h('div', { key: 'D', }, 'D'),
//   h('div', { key: 'F', }, 'F'),
//   h('div', { key: 'G', }, 'G'),
// ]
// const nextChildren = [
//   h('div', { key: 'A', }, 'A'),
//   h('div', { key: 'B', }, 'B'),
//   h('div', { key: 'E', }, 'E'),
//   h('div', { key: 'C', nextChild: 'CC' }, 'C'),
//   h('div', { key: 'F', }, 'F'),
//   h('div', { key: 'G', }, 'G'),
// ]

const prevChildren = [
  h('div', { key: 'A', }, 'A'),
  h('div', { key: 'B', }, 'B'),
  h('div', { key: 'C', }, 'C'),
  h('div', { key: 'E', }, 'E'),
  h('div', { key: 'D', }, 'D'),
  h('div', { key: 'F', }, 'F'),
  h('div', { key: 'G', }, 'G'),
]
const nextChildren = [
  h('div', { key: 'A', }, 'A'),
  h('div', { key: 'B', }, 'B'),
  h('div', { key: 'E', }, 'E'),
  h('div', { key: 'C', nextChild: 'CC' }, 'C'),
  h('div', { key: 'F', }, 'F'),
  h('div', { key: 'G', }, 'G'),
]

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange

    return {
      isChange,
    }
  },
  render() {
    const self = this
    return self.isChange === true ? h('div', {}, nextChildren) : h('div', {}, prevChildren)
  },
}
