import { BooleanLiteral } from '../ast/boolean-literal';
import { NumericLiteral } from '../ast/numeric-literal';
import { StringLiteral } from '../ast/string-literal';
import { BinaryExpression } from '../ast/binary-expression';
import { UnaryExpression } from '../ast/unary-expression';
import { SubscriptedExpression } from '../ast/subscripted-expression';
import { TernaryExpression } from '../ast/ternary-expression';
import { ListExpression } from '../ast/list';
import { ErrorLiteral } from '../ast/error-literal';
import { IdentifierExpression } from '../ast/identifier-expression';
import { Call } from '../ast/function-call';

export type Expression = NumericLiteral | BooleanLiteral | StringLiteral | BinaryExpression | UnaryExpression
    | SubscriptedExpression | Call | TernaryExpression | ErrorLiteral | ListExpression | IdentifierExpression;

export type Initializers = Expression[];
