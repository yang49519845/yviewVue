import { reactive } from "../reactive"

describe('API reactive 使用', () => {

  it('查看基本流程', () => {
    const userState = reactive({
      name: 'Spider Man 🕷',
      age: 18,
      sex: 1,
      departments: ['公司', '以部门']
    })

    expect(userState.name).toBe('Spider Man 🕷');
  })


})
