import { NodeTypes } from "./ast";

const enum TagType {
  Start, End
}

export function baseParse(content: string) {
  const context = createParserContext(content);

  return createRoot(parserChildren(context));
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

  console.log(context.source)

  context.source = context.source.slice(length);
}


/**
 * 解析模板入口
 *
 * @param {*} context
 * @return {*} 
 */
function parserChildren(context) {
  const nodes: any = [];
  let node;
  if (context.source.startsWith('{{')) {
    node = parserInterPolation(context);
  } else if (context.source[0] === '<') {
    if (/[a-z]/i.test(context.source[1])) {

      node = parserElement(context)
    }
  }

  if(!node) {
    node = parseText(context)
  }

  nodes.push(node);

  return nodes
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
  advanceBy(context, rawContentLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION, // 'interpolation',
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    }
  }
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

/**
 * 解析DOM
 *
 * @param {*} context
 * @return {*} 
 */
function parserElement(context: any) {
  const tag = parserTag(context, TagType.Start);
  parserTag(context, TagType.End);

  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function parserTag(context: any, type: TagType) {
  const reg = /^<\/?([a-z]*)/i;
  const match: any = reg.exec(context.source);
  const tag = match[1];

  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.End) return

  return tag;

}

/**
 * 解析Text节点
 *
 * @param {*} context
 * @return {*} 
 */
function parseText(context: any) {
  const content = parseTextData(context, context.source.length)
  
  return {
    type: NodeTypes.TEXT,
    content
  }
}


/**
 * 获取文本信息，推进解析长度
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


