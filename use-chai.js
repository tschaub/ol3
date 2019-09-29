/**
 * A transform for use with jscodeshift that replaces expect.js assertions with
 * assert style assertions from Chai.
 *
 * Example use on a single file:
 *
 *     git checkout -- test && jscodeshift -t use-chai.js test/spec/ol/geom
 *
 */

// expect()
const expectCall = {
  type: 'CallExpression',
  callee: {
    type: 'Identifier',
    name: 'expect'
  }
};

// expect().to
const expectTo = {
  type: 'MemberExpression',
  object: expectCall,
  property: {
    type: 'Identifier',
    name: 'to'
  }
};

// expect().to.be
const expectToBe = {
  type: 'MemberExpression',
  object: expectTo,
  property: {
    type: 'Identifier',
    name: 'be'
  }
};

// expect().to.be()
const expectToBeCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: expectToBe
  }
};

// expect().to.be.ok()
const expectToBeOkCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: expectToBe,
      property: {
        type: 'Identifier',
        name: 'ok'
      }
    }
  }
};

// expect().to.equal()
const expectToEqualCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: expectTo,
      property: {
        type: 'Identifier',
        name: 'equal'
      }
    }
  }
};

// expect().to.eql()
const expectToEqlCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: expectTo,
      property: {
        type: 'Identifier',
        name: 'eql'
      }
    }
  }
};

// expect().to.be.an()
const expectToBeAnCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: expectToBe,
      property: {
        type: 'Identifier',
        name: 'an'
      }
    }
  }
};

// expect().to.be.a()
const expectToBeACall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: expectToBe,
      property: {
        type: 'Identifier',
        name: 'a'
      }
    }
  }
};

// expect().not.to.be()
const expectNotToBeCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: {
          type: 'MemberExpression',
          object: expectCall,
          property: {
            type: 'Identifier',
            name: 'not'
          }
        },
        property: {
          type: 'Identifier',
          name: 'to'
        }
      },
      property: {
        type: 'Identifier',
        name: 'be'
      }
    }
  }
};

// expect().to.roughlyEqual()
const expectToRoughlyEqualCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: expectTo,
      property: {
        type: 'Identifier',
        name: 'roughlyEqual'
      }
    }
  }
};

// expect().to.have.length()
const expectToHaveLengthCall = {
  type: 'ExpressionStatement',
  expression: {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        object: expectTo,
        property: {
          type: 'Identifier',
          name: 'have'
        }
      },
      property: {
        type: 'Identifier',
        name: 'length'
      }
    }
  }
};

module.exports = function(info, api) {
  const j = api.jscodeshift;
  const root = j(info.source);

  // replace `expect(actual).to.be(expected)` with `assert.strictEqual(actual, expected)`
  root.find(j.ExpressionStatement, expectToBeCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('strictEqual')), [actual, expected]
        )
      );
    });

  // replace `expect(actual).to.be.ok()` with `assert.isOk(actual)`
  root.find(j.ExpressionStatement, expectToBeOkCall)
    .replaceWith(path => {
      const actual = path.value.expression.callee.object.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('isOk')), [actual]
        )
      );
    });

  // replace `expect(actual).to.equal(expected)` with `assert.equal(actual, expected)`
  root.find(j.ExpressionStatement, expectToEqualCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('equal')), [actual, expected]
        )
      );
    });

  // replace `expect(actual).to.eql(expected)` with `assert.deepEqual(actual, expected)`
  root.find(j.ExpressionStatement, expectToEqlCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('deepEqual')), [actual, expected]
        )
      );
    });

  // replace `expect(actual).to.be.an(expected)` with `assert.instanceOf(actual, expected)`
  root.find(j.ExpressionStatement, expectToBeAnCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('instanceOf')), [actual, expected]
        )
      );
    });

  // replace `expect(actual).to.be.a(expected)` with `assert.instanceOf(actual, expected)`
  root.find(j.ExpressionStatement, expectToBeACall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('instanceOf')), [actual, expected]
        )
      );
    });

  // replace `expect(actual).not.to.be(expected)` with `assert.notEqual(actual, expected)`
  root.find(j.ExpressionStatement, expectNotToBeCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('notEqual')), [actual, expected]
        )
      );
    });

  // replace `expect(actual).to.roughlyEqual(expected, delta)` with `assert.approximately(actual, expected, delta)`
  root.find(j.ExpressionStatement, expectToRoughlyEqualCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const delta = path.value.expression.arguments[1];
      const actual = path.value.expression.callee.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('approximately')), [actual, expected, delta]
        )
      );
    });

  // replace `expect(actual).to.have.length(expected)` with `assert.lengthOf(actual, expected)`
  root.find(j.ExpressionStatement, expectToHaveLengthCall)
    .replaceWith(path => {
      const expected = path.value.expression.arguments[0];
      const actual = path.value.expression.callee.object.object.object.arguments[0];
      return j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.identifier('assert'), j.identifier('lengthOf')), [actual, expected]
        )
      );
    });

  // add the `import {assert} from 'chai';`
  const body = root.find(j.Program).get('body');
  body.unshift(
    j.importDeclaration([j.importSpecifier(j.identifier('assert'))], j.literal('chai'))
  );

  return root.toSource({quote: 'single'});
};
