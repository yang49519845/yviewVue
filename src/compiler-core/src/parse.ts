import { NodeTypes } from "./ast";

const enum TagType {
  Start, End
}

export function baseParse(content: string) {
  const context = createParserContext(content);

  return createRoot(parserChildren(context));
}

function parserChildren(context) {
  const nodes: any = [];
  let node;
  if (context.source.startsWith('{{')) {
    node = parserInterPolation(context);
  } else if (context.source[0] === '<') {
    if (/[a-z]/i.test(context.source[1])) {
      console.log('parse element')

      node = parserElement(context)
    }
  }

  nodes.push(node);

  return nodes
}

function parserInterPolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length);

  advanceBy(context, openDelimiter.length)

  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContentLength);
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

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function parserElement(context: any) {
  const tag = parserTag(context, TagType.Start);
  parserTag(context, TagType.End);

  console.log(context.source)

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

