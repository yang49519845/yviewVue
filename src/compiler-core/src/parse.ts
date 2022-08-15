import { NodeTypes } from "./ast";

const enum TagType {
  Start, End
}

export function baseParse(content: string) {
  const context = createParserContext(content);

  return createRoot(parserChildren(context, []));
}

/**
 * 将数据格式化后统一处理
 *
 * @param {string} content
 * @return { source: string }
 */
function createParserContext(content: string) {
  return {
    source: content
  }
}

function createRoot(children) {
  return {
    children
  }
}

/**
 * 更新未解析的模板内容，大致过程如下
 * 
 * 模板内容 <div>hi, {{ message }}</div>
 * 
 * 
 *
 * @param {*} context
 * @param {number} length
 */
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

/**
 * 解析模板入口
 *
 * @param {*} context
 * @return {*} 
 */
function parserChildren(context, ancestors) {
  const nodes: any = [];
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source;

    if (s.startsWith('{{')) {
      node = parserInterPolation(context);
    } else if (s[0] === '<' && /[a-z]/i.test(s[1])) {
      node = parserElement(context, ancestors)
    }

    if (!node) {
      node = parseText(context)
    }

    nodes.push(node);
  }

  return nodes
}

function isEnd(context, ancestors) {
  // 1. 存在结束标签
  const s = context.source

  if (s.startsWith("</")) {
    for (let i = ancestors.length -1; i >= 0 ; i--) {
      const tag = ancestors[i].tag
      if (startsWithEndTagOpen(s, tag)) {
        return true
      }
    }
  }
  // if (parentTag && s.startsWith(`</${parentTag}>`)) {
  //   return true
  // }
  // 2. source有值
  return !s

}

/**
 * 解析数据节点
 *
 * @param {*} context
 * @return {*} 
 */
function parserInterPolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = parseTextData(context, rawContentLength)
  const content = rawContent.trim()
  advanceBy(context, closeDelimiter.length)
  return {
    type: NodeTypes.INTERPOLATION, // 'interpolation',
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    }
  }
}

/**
 * 解析DOM
 *
 * @param {*} context
 * @return {*} 
 */
function parserElement(context: any, ancestors) {
  const element: any = parserTag(context, TagType.Start);
  ancestors.push(element);
  element.children = parserChildren(context, ancestors);
  ancestors.pop();
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parserTag(context, TagType.End);
  } else {
    throw new Error(`缺少Element close code`)
  }
  return element;
}

function startsWithEndTagOpen(source, tag) {
  return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
}

function parserTag(context: any, type: TagType) {
  const reg = /^<\/?([a-z]*)/i;
  const match: any = reg.exec(context.source);
  const tag = match[1];

  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.End) return

  return {
    type: NodeTypes.ELEMENT,
    tag
  };
}

/**
 * 解析Text节点
 *
 * @param {*} context
 * @return {*} 
 */
function parseText(context: any) {
  let endIndex = context.source.length;
  let endToken = ["{{", "<"];

  for (let i = 0; i < endToken.length; i++) {
    const index = context.source.indexOf(endToken[i]);
    if (index !== -1 && endIndex > index) {

      endIndex = index
    }
  }



  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content
  }
}


/**
 * 获取文本信息，推进解π析长度
 *
 * @param {*} context
 * @param {*} length
 * @return {*} 
 */
function parseTextData(context, length) {
  const content = context.source.slice(0, length);

  advanceBy(context, length)

  return content
}


