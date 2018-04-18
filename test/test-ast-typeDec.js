const parse = require('../syntax/parser');
const assert = require('assert');

/* eslint-disable no-undef */
describe('TypeDec', () => {
  const expected = {
    body: {
      statements: [
        {
          id: '',
          sumtype: {
            basicTypeOrId1: '',
            basicTypeOrId2: '',
            moreBasicTypesOrIds: [],
          },
        },
      ],
    },
  };

  beforeEach(() => {
    // Clear out the test object before each run.
    expected.body.statements[0] = {
      id: '',
      sumtype: {},
    };
  });
  it('should correctly parse TypeDec Expressions', () => {
    expected.body.statements[0].id = 'x';
    expected.body.statements[0].sumtype = {
      basicTypeOrId1: 'string',
      basicTypeOrId2: 'boolean',
      moreBasicTypesOrIds: [],
    };
    let result = parse('type x: string | boolean');
    assert.deepEqual(result, expected);

    expected.body.statements[0].id = 'y';
    expected.body.statements[0].sumtype = {
      basicTypeOrId1: 'string',
      basicTypeOrId2: 'boolean',
      moreBasicTypesOrIds: ['number', 'error'],
    };
    result = parse('type y: string | boolean | number | error');
    assert.deepEqual(result, expected);

    expected.body.statements[0].id = 'z';
    expected.body.statements[0].sumtype = {
      basicTypeOrId1: 'string',
      basicTypeOrId2: { id: 'y' },
      moreBasicTypesOrIds: [],
    };
    result = parse('type z: string | y');
    assert.deepEqual(result, expected);

    expected.body.statements[0].id = 'a';
    expected.body.statements[0].sumtype = {
      basicTypeOrId1: { id: 'b' },
      basicTypeOrId2: { id: 'c' },
      moreBasicTypesOrIds: [{ id: 'd' }, { id: 'e' }, { id: 'f' }, { id: 'g' }],
    };
    result = parse('type a: b | c | d | e | f | g');
    assert.deepEqual(result, expected);
  });
});
