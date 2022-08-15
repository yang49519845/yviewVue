import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe('happy path', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const ast = baseParse("{{ message }}")

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'message'
        }
      })
    })
  })

  describe('element', () => {
    test('simple element', () => {
      const ast = baseParse("<div></div>")

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: []
      })
    })
  })

  describe('text', () => {
    test('simple text', () => {
      const ast = baseParse("foo")

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'foo'
      })
    })
  })

  test('hello world', () => {
    const ast = baseParse('<div>hi,{{message}}</div>');
    const ast2 = baseParse('<p>hi,{{message}}</p>');

    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.TEXT,
          content: 'hi,'
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })

    expect(ast2.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'p',
      children: [
        {
          type: NodeTypes.TEXT,
          content: 'hi,'
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })
  })

  test('Nested element ', () => {
    const ast = baseParse('<div><p>hi,</p>{{message}}</div>')

    expect(ast.children[0]).toStrictEqual({
      type: NodeTypes.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NodeTypes.TEXT,
              content: 'hi,'
            },
          ]
        },
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'message'
          }
        }
      ]
    })
  })

  test('should throw error when lack end tag', () => {
    expect(() => {
      baseParse('<div><span></div>')
    }).toThrow(`缺少Element close code`);
  })
})
