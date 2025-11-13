module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code',
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const nextToken = context.sourceCode.getTokenAfter(node);
        const comment = context.sourceCode.getCommentsAfter(node)[0];
        let nextNode;

        if (nextToken && !comment) {
          nextNode = nextToken;
        } else if (!nextToken && comment) {
          nextNode = comment;
        } else if (nextToken && comment) {
          nextNode = nextToken.range[0] < comment.range[0] ? nextToken : comment;
        }

        if (nextNode) {
          const isImportNext = nextNode.type === 'Keyword' && nextNode.value === 'import';

          if (!isImportNext && nextNode.loc.start.line - node.loc.end.line !== 2) {
            context.report({
              node,
              message: '1 empty line after imports is required',
              fix(fixer) {
                return fixer.replaceTextRange([node.range[1], nextNode.range[0]], '\n\n');
              },
            });
          }
        }
      },
    };
  },
};
