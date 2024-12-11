export class AggregationOperators {
  /**
   * Adds numbers together or adds numbers and a date. If one of the arguments is a date,
   * `$add` treats the other arguments as milliseconds to add to the date.
   *
   * The arguments can be any valid expression as long as they resolve to either all numbers
   * or to numbers and a date. For more information on expressions, see Expression Operators.
   *
   * Starting in MongoDB 6.1 you can optimize the $add operation. To improve performance,
   * group references at the end of the argument list. For example:
   *
   * ```
   * $add: [ 1, 2, 3, '$a', '$b', '$c' ]
   * ```
   *
   * @param {...Expression<number|Date>} expressions
   */
  static $add(...expressions) {
    return { $add: expressions };
  }

  /**
   * Evaluates one or more expressions and returns `true` if _all_ of the expressions are `true`
   * or if run with no argument expressions. Otherwise, `$and` returns `false`.
   *
   * In addition to the `false` boolean value, `$and` evaluates as `false` the following: `null`,
   * `0`, and `undefined` values. The `$and` evaluates all other values as `true`, including
   * non-zero numeric values and arrays.
   *
   * @param {...Expression<any>} expressions
   */
  static $and(...expressions) {
    return { $and: expressions };
  }

  /**
   * Returns the element at the specified array index.
   *
   * - If the `<idx>` expression resolves to zero or a positive integer, `$arrayElemAt`
   * returns the element at the `idx` position, counting from the start of the array.
   * - If the `<idx>` expression resolves to a negative integer, `$arrayElemAt` returns the\
   * element at the `idx` position, counting from the end of the array.
   * - If `idx` exceeds the array bounds, `$arrayElemAt` does not return a result.
   * - If the `<array>` expression resolves to an undefined array, `$arrayElemAt` returns `null`.
   *
   * @param {Expression<any[]>} array Can be any valid expression that resolvesto an array.
   * @param {Expression<number>} idx Can be any valid expression that resolves to an integer.
   */
  static $arrayElemAt(array, idx) {
    return { $arrayElemAt: [array, idx] };
  }

  /**
   * Converts an array into a single document; the array must be either:
   * - An array of two-element arrays where the first element is the field name, and the second
   * element is the field value:
   * ```
   * [ [ [ "item", "abc123" ], [ "qty", 25 ] ] ]
   * ```
   * _- OR -_
   * - An array of documents that contains two fields, k and v where:
   *   - The `k` field contains the field name.
   *   - The `v` field contains the value of the field.
   * ```
   * [ [ { "k": "item", "v": "abc123" }, { "k": "qty", "v": 25 } ] ]
   * ```
   *
   * The `<expression>` can be any valid expression that resolves to an array of two-element arrays
   * or array of documents that contains "k" and "v" fields.
   *
   * @param {Expression<([[string, any],[string, any]]|[{ k: string, v: any }])[]>} expression
   */
  static $arrayToObject(expression) {
    return { $arrayToObject: expression };
  }

  /**
   * Returns the smallest integer greater than or equal to the specified number.
   *
   * The` <number>` expression can be any valid expression as long as it resolves to a number.
   *
   * If the argument resolves to a value of `null` or refers to a field that is missing,
   * `$ceil` returns `null`. If the argument resolves to `NaN`, `$ceil` returns `NaN`.
   *
   * @param {Expression<number>} expression
   */
  static $ceil(expression) {
    return { $ceil: expression };
  }

  /**
   * Concatenates strings and returns the concatenated string.
   *
   * The arguments can be any valid expression as long as they resolve to strings.
   *
   * If the argument resolves to a value of `null` or refers to a field that is
   * missing,` $concat` returns `null`.
   *
   * @param  {...Expression<?any[]>} expressions
   */
  static $concat(...expressions) {
    return { $concat: expressions };
  }

  /**
   * Concatenates arrays to return the concatenated array.
   *
   * The `<array>` expressions can be any valid expression as long as they resolve to an array.
   *
   * If any argument resolves to a value of `null` or refers to a field that is missing,
   * ` $concatArrays` returns `null`.
   *
   * @param  {...Expression<?any[]>} expressions
   */
  static $concatArrays(...expressions) {
    return { $concatArrays: expressions };
  }

  /**
   * If the `<boolean-expression>` evaluates to true, then `$cond` evaluates and returns
   * the value of the `<true-case>` expression. Otherwise, `$cond` evaluates and returns
   * the value of the `<false-case>` expression.
   *
   * The arguments can be any valid expression, and all three arguments are required.
   *
   * @param {Expression<any>} booleanExpression
   * @param {Expression<any>} trueCase
   * @param {Expression<any>} falseCase
   */
  static $cond(booleanExpression, trueCase, falseCase) {
    return { $cond: [booleanExpression, trueCase, falseCase] };
  }

  /**
   * @param {object} params
   * @param {Expression<string>} params.dateString
   * @param {Expression<string>} [params.format]
   * @param {Expression<string>} [params.timezone]
   * @param {Expression<any>} [params.onError]
   * @param {Expression<any>} [params.onNull]
   */
  static $dateFromString({
    dateString,
    format,
    timezone,
    onError,
    onNull,
  }) {
    return {
      $dateFromString: {
        dateString,
        ...(format && { format }),
        ...(timezone && { timezone }),
        ...(onError && { onError }),
        ...(onNull && { onNull }),
      },
    };
  }

  /**
   * Converts a date object to a string according to a user-specified format.
   *
   * @param {object} params
   * @param {Expression<Date|ObjectId|Timestamp>} params.date The date to convert
   * to string. `<dateExpression>` must be a valid expression that resolves to a
   * `Date`, a `Timestamp`, or an `ObjectID`.
   * @param {string} [params.format] Optional. The date format specification.
   * `<formatString>` can be any string literal, containing 0 or more format specifiers.
   * If unspecified, `$dateToString` uses `"%Y-%m-%dT%H:%M:%S.%LZ"` as the default format.
   * @param {Expression<string>} [params.timezone] Optional. The timezone of the operation result.
   * `<tzExpression>` must be a valid expression that resolves to a string formatted as either
   * an Olson Timezone Identifier or a UTC Offset. If no `timezone` is provided, the result is
   * displayed in `UTC`.
   * @param {Expression<any>} [params.onNull] Optional. The value to return if the `date` is null
   * or missing. The arguments can be any valid expression. If unspecified, `$dateToString` returns
   * `null` if the `date` is null or missing.
   */
  static $dateToString({
    date,
    format,
    timezone,
    onNull,
  }) {
    return {
      $dateToString: {
        date,
        ...(format && { format }),
        ...(timezone && { timezone }),
        ...(onNull && { onNull }),
      },
    };
  }

  /**
   * @typedef DayOfMonthParams
   * @prop {Expression<Date>} date An expression that resolves to a Date, a Timestamp,
   * or an ObjectID.
   * @prop {Expression<string>} [timezone]
   *
   * @param {DayOfMonthParams|Expression<Date>}
   */
  static $dayOfMonth(exprOrParams) {
    return { $dayOfMonth: exprOrParams };
  }

  /**
   * Divides one number by another and returns the result.
   *
   * The first argument is the dividend, and the second argument is the divisor; i.e. the
   * first argument is divided by the second argument.
   *
   * The arguments can be any valid expression as long as they resolve to numbers.
   *
   * @param {Expression<number>} expr1
   * @param {Expression<number>} expr2
   */
  static $divide(expr1, expr2) {
    return { $divide: [expr1, expr2] };
  }

  /**
   * Compares two values and returns:
   * - `true` when the values are equivalent.
   * - `false` when the values are not equivalent.
   *
   * The `$eq` compares both value and type, using the specified BSON comparison order for values
   * of different types.
   *
   * @param {Expression<any>} expression1
   * @param {Expression<any>} expression2
   */
  static $eq(expression1, expression2) {
    return { $eq: [expression1, expression2] };
  }

  /**
   * Selects a subset of an array to return based on the specified condition. Returns an array with
   * only those elements that match the condition. The returned elements are in the original order.
   *
   * @param {object} params
   * @param {Expression<any[]>} params.input An expression that resolves to an array.
   * @param {string} [params.as] Optional. A name for the variable that represents each individual
   * element of the `input` array. If no name is specified, the variable name defaults to `this`.
   * @param {Expression<any>} params.cond An expression that resolves to a boolean value used to
   * determine if an element should be included in the output array. The expression references each
   * element of the `input` array individually with the variable name specified in `as`.
   * @param {?number} [params.limit] Optional. A number expression that restricts the number of
   * matching array elements that `$filter` returns. You cannot specify a limit less than `1`.
   * The matching array elements are returned in the order they appear in the input array.
   * If the specified `limit` is greater than the number of matching array elements, `$filter`
   * returns all matching array elements. If the limit is `null`, `$filter` returns all matching
   * array elements.
   */
  static $filter({
    input,
    as,
    cond,
    limit,
  }) {
    return {
      $filter: {
        ...(as && { as }),
        cond,
        input,
        ...(limit && { limit }),
      },
    };
  }

  /**
   * Returns the result of an expression for the first document in a group of documents. Only
   * meaningful when documents are in a defined order.
   *
   * @param {Expression<any>} expression
   */
  static $first(expression) {
    return { $first: expression };
  }

  /**
   * @param {object} params
   * @param {Expression<any[]>} params.input
   * @param {Expression<number>} params.n
   */
  static $firstN({ input, n }) {
    return { $firstN: { input, n } };
  }

  /**
   * Defines a custom aggregation function or expression in JavaScript.
   *
   * You can use the `$function` operator to define custom functions to implement behavior not
   * supported by the MongoDB Query Language.
   *
   * @param {object} params
   * @param {string|Function} params.body
   * @param {Expression<any>[]} params.args
   * @param {"js"} params.lang
   */
  static $function({ body, args }) {
    return {
      $function: {
        body: typeof body === 'function' ? body.toString() : body,
        args,
        lang: 'js',
      },
    };
  }

  /**
   * Compares two values and returns:
   * - `true` when the first value is _greater than_ the second value.
   * - `false` when the first value is _less than or equivalent_ to the second value.
   *
   * The `$gt` compares both value and type, using the specified BSON comparison order
   * for values of different types.
   *
   * @param {Expression<any>} expr1
   * @param {Expression<any>} expr2
   */
  static $gt(expr1, expr2) {
    return { $gt: [expr1, expr2] };
  }

  /**
   * Compares two values and returns:
   * - `true` when the first value is _greater than or equivalent to_ the second value.
   * - `false` when the first value is _less than_ the second value.
   *
   * The `$gte` compares both value and type, using the specified BSON comparison order
   * for values of different types.
   *
   * @param {Expression<any>} expr1
   * @param {Expression<any>} expr2
   */
  static $gte(expr1, expr2) {
    return { $gte: [expr1, expr2] };
  }

  /**
   * The `$ifNull` expression evaluates input expressions for null values and returns:
   * - The first non-null input expression value found.
   * - A replacement expression value if all input expressions evaluate to null.
   *
   * `$ifNull` treats undefined values and missing fields as null.
   *
   * @param {...Expression<any>} expressions
   */
  static $ifNull(...expressions) {
    return { $ifNull: expressions };
  }

  /**
   * Returns a boolean indicating whether a specified value is in an array.
   *
   * Unlike the `$in` query operator, the aggregation `$in` operator does not support matching
   * by regular expressions.
   *
   * `$in` fails with an error in either of the following cases: if the `$in` expression is not
   * given exactly two arguments, or if the second argument does not resolve to an array.
   *
   * @param {Expression<any>} expression Any valid expression expression.
   * @param {Expression<any[]>} arrayExpression Any valid expression that resolves to an array.
   */
  static $in(expression, arrayExpression) {
    return { $in: [expression, arrayExpression] };
  }

  /**
   * Searches an array for an occurrence of a specified value and returns the array index of the
   * first occurrence. Array indexes start at zero.
   *
   * If the `<search expression>` is found multiple times within the `<array expression>`, then
   * `$indexOfArray` returns the index of the first `<search expression>` from the starting
   * index position.
   *
   * @param {Expression<any[]>} arrayExpression
   * @param {Expression<string>} searchExpression
   * @param {Expression<number>} start
   * @param {Expression<number>} end
   */
  static $indexOfArray(arrayExpression, searchExpression, start, end) {
    return {
      $indexOfArray: [
        arrayExpression,
        searchExpression,
        ...(start !== undefined ? [start] : []),
        ...(end !== undefined ? [end] : []),
      ],
    };
  }

  /**
   * Determines if the operand is an array. Returns a boolean.
   *
   * @param {Expression<any>} expression
   */
  static $isArray(expression) {
    return { $isArray: [expression] };
  }

  /**
   * `$isNumber` checks if the specified expression resolves to one of the following numeric BSON
   * types:
   * - Integer
   * - Decimal
   * - Double
   * - Long
   *
   * `$isNumber` returns:
   * - `true` if the expression resolves to a number.
   * - `false` if the expression resolves to any other BSON type, `null`, or a missing field.
   *
   * @param {Expression<any>} expression
   */
  static $isNumber(expression) {
    return { $isNumber: [expression] };
  }

  static $last(expression) {
    return { $last: expression };
  }

  /**
   * Returns a value without parsing. Use for values that the aggregation pipeline may interpret
   * as an expression.
   *
   * If the `value` is an expression, `$literal` does not evaluate the expression but instead
   * returns the unparsed expression.
   *
   * @param {any} value
   */
  static $literal(value) {
    return { $literal: value };
  }

  /**
   *
   * @param {Expression<any>} expr1
   * @param {Expression<any>} expr2
   */
  static $lt(expr1, expr2) {
    return { $lt: [expr1, expr2] };
  }

  /**
   *
   * @param {Expression<any>} expr1
   * @param {Expression<any>} expr2
   */
  static $lte(expr1, expr2) {
    return { $lte: [expr1, expr2] };
  }

  /**
   * Applies an expression to each item in an array and returns an array with the applied results.
   *
   * @param {object} params
   * @param {Expression<any[]>} params.input An expression that resolves to an array.
   * @param {string} [params.as] Optional. A name for the variable that represents each individual
   * element of the `input` array. If no name is specified, the variable name defaults to `this`.
   * @param {Expression<any>} params.in An expression that is applied to each element of the `input`
   * array. The expression references each element individually with the variable name specified
   * in `as`.
   */
  static $map({ input, as, in: inValue }) {
    return { $map: { input, ...(as && { as }), in: inValue } };
  }

  /**
   * Returns the maximum value. `$max` compares both value and type.
   *
   * `$max` is available in these stages:
   * - `$addFields`
   * - `$bucket`
   * - `$bucketAuto`
   * - `$group`
   * - `$match` stage that includes an `$expr` expression
   * - `$project`
   * - `$replaceRoot`
   * - `$replaceWith`
   * - `$set`
   * - `$setWindowFields` (Available starting in MongoDB 5.0)
   *
   * When used in the `$bucket`, `$bucketAuto`, `$group`, and `$setWindowFields`
   * stages, `$max` has this syntax:
   * ```
   * $max(<expression>)
   * ```
   *
   * When used in other supported stages, `$max` has one of two syntaxes:
   * - `$max` has one specified expression as its operand:
   *     ```
   *     $max(<expression>)
   *     ```
   * - `$max` has a list of specified expressions as its operand:
   *     ```
   *     $max([ <expression1>, <expression2> ... ])
   *     ```
   *
   * @param {Expression<any>} expression
   */
  static $max(expression) {
    return { $max: expression };
  }

  /**
   * Combines multiple documents into a single document.
   *
   * `$mergeObjects` overwrites the field values as it merges the documents.
   * If documents to merge include the same field name, the field, in the
   * resulting document, has the value from the last document merged for the field.
   *
   * @param {...Expression<?Record<string, any>>} expressions
   */
  static $mergeObjects(...expressions) {
    return { $mergeObjects: expressions };
  }

  /**
   * @typedef MonthParams
   * @prop {Expression<Date>} date An expression that resolves to a Date, a Timestamp,
   * or an ObjectID.
   * @prop {Expression<string>} [timezone]
   *
   * @param {MonthParams|Expression<Date>}
   */
  static $month(exprOrParams) {
    return { $month: exprOrParams };
  }

  /**
   * Multiplies numbers together and returns the result.
   *
   * The arguments can be any valid expression as long as they resolve to numbers.
   *
   * Starting in MongoDB 6.1 you can optimize the $multiply operation. To improve
   * performance, group references at the end of the argument list. For example:
   *
   * ```
   * $multiply: [ 1, 2, 3, '$a', '$b', '$c' ]
   * ```
   *
   * @param {...Expression<number>} expressions
   */
  static $multiply(...expressions) {
    return { $multiply: expressions };
  }

  /**
   * Compares two values and returns:
   * - `true` when the values are not equivalent.
   * - `false` when the values are equivalent.
   *
   * The `$ne` compares both value and type, using the specified BSON comparison order for
   * values of different types.
   *
   * @param {Expression<any>} expr1
   * @param {Expression<any>} expr2
   */
  static $ne(expr1, expr2) {
    return { $ne: [expr1, expr2] };
  }

  /**
   * Evaluates a boolean and returns the opposite boolean value; i.e. when passed an expression
   * that evaluates to `true`, `$not` returns `false`; when passed an expression that evaluates to
   * `false`, `$not` returns `true`.
   *
   * In addition to the `false` boolean value, `$not` evaluates as `false` the following: `null`,
   * `0`, and `undefined` values. The `$not` evaluates all other values as `true`, including
   * non-zero numeric values and arrays.
   *
   * @param {Expression<any>} expression
   */
  static $not(expression) {
    return { $not: [expression] };
  }

  /**
   * Converts a document to an array. The return array contains an element for each field/value
   * pair in the original document. Each element in the return array is a document that contains
   * two fields `k` and `v`:
   *
   * - The `k` field contains the field name in the original document.
   * - The `v` field contains the value of the field in the original document.
   *
   * The `<object>` expression can be any valid expression as long as it resolves to a document
   * object. `$objectToArray` applies to the top-level fields of its argument. If the argument
   * is a document that itself contains embedded document fields, the `$objectToArray` does not
   * recursively apply to the embedded document fields.
   *
   * @param {Expression<Record<string, any>>} expression
   */
  static $objectToArray(expression) {
    return { $objectToArray: expression };
  }

  /**
   * Evaluates one or more expressions and returns `true` if _any_ of the expressions are `true`.
   * Otherwise, `$or` returns `false`.
   *
   * In addition to the `false` boolean value, `$or` evaluates as `false` the following: `null`,
   * `0`, and `undefined` values. The `$or` evaluates all other values as `true`, including non-zero
   * numeric values and arrays.
   *
   * @param {...Expression<any>} expressions
   */
  static $or(...expressions) {
    return { $or: expressions };
  }

  /**
   * Raises a number to the specified exponent and returns the result.
   *
   * If either argument resolves to a value of `null` or refers to a field that is missing, `$pow`
   * returns `null`. If either argument resolves to `NaN`, `$pow` returns `NaN`.
   *
   * @param {Expression<number>} number
   * @param {Expression<number>} exponent
   */
  static $pow(number, exponent) {
    return { $pow: [number, exponent] };
  }

  /**
   * Returns an array whose elements are a generated sequence of numbers. `$range` generates the
   * sequence from the specified starting number by successively incrementing the starting number
   * by the specified step value up to but not including the end point.
   *
   * The` <start>` and `<end>` arguments are required and must be integers. The `<non-zero step>`
   * argument is optional, and defaults to `1` if omitted.
   *
   * @param {Expression<number>} start An integer that specifies the start of the sequence. Can
   * be any valid expression that resolves to an integer.
   * @param {Expression<number>} end An integer that specifies the exclusive upper limit of the
   * sequence. Can be any valid expression that resolves to an integer.
   * @param {Expression<number>} [nonZeroStep=1] Optional. An integer that specifies the increment
   * value. Can be any valid expression that resolves to a non-zero integer. Defaults to `1`.
   */
  static $range(start, end, nonZeroStep) {
    const $range = [start, end];
    if (nonZeroStep) $range.push(nonZeroStep);
    return { $range };
  }

  /**
   * Applies an expression to each element in an array and combines them into a single value.
   *
   * If `input` resolves to an empty array, `$reduce` returns `initialValue`.
   *
   * @param {object} params
   * @param {Expression<?any[]>} params.input Can be any valid expression that resolves to an array.
   * If the argument resolves to a value of `null` or refers to a missing field, `$reduce` returns
   * `null`.
   * @param {Expression<any>} params.initialValue The initial cumulative `value` set before `in` is
   * applied to the first element of the `input` array.
   * @param {Expression<any>} params.in A valid expression that `$reduce` applies to each element in
   * the input array in left-to-right order. Wrap the `input` value with `$reverseArray` to yield
   * the equivalent of applying the combining expression from right-to-left. During evaluation of
   * the `in` expression, two variables will be available: 1) `value` is the variable that
   * represents the cumulative value of the expression; 2) `this` is the variable that refers to the
   * element being processed.
   */
  static $reduce({ input, initialValue, in: inValue }) {
    return { $reduce: { input, initialValue, in: inValue } };
  }

  /**
   * Performs a regular expression (regex) pattern matching and returns:
   * - `true` if a match exists.
   * - `false` if a match doesn't exist.
   *
   * @param {object} params
   * @param {Expression<string>} params.input The string on which you wish to apply the regex
   * pattern.
   * Can be a string or any valid expression that resolves to a string.
   * @param {string|RegExp} params.regex The regex pattern to apply. Can be any valid expression
   * that resolves to either a string or regex pattern` /<pattern>/`. When using the regex
   * `/<pattern>/`, you can also specify the regex options `i` and `m` (but not the `s`
   * or `x` options):
   * - `"pattern"`
   * - `/<pattern>/`
   * - `/<pattern>/<options>`
   *
   * Alternatively, you can also specify the regex options with the options field. To specify
   * the `s` or `x` options, you must use the options field.
   *
   * You cannot specify options in both the `regex` and the `options` field.
   * @param {string} [params.options]
   */
  static $regexMatch({ input, regex, options }) {
    return {
      $regexMatch: {
        input,
        regex,
        ...(options && { options }),
      },
    };
  }

  /**
   * Replaces the input document with the specified document. The operation replaces all existing
   * fields in the input document, including the _id field. With `$replaceWith`, you can promote
   * an embedded document to the top-level. You can also specify a new document as the replacement.
   *
   * The `$replaceWith` stage performs the same action as the `$replaceRoot` stage, but the stages
   * have different forms.
   *
   * The replacement document can be any valid expression that resolves to a document.
   *
   * If the `<replacementDocument> `is not a document, `$replaceWith` errors and fails.
   *
   * If the` <replacementDocument>` resolves to a missing document (i.e. the document does not
   * exist), `$replaceWith` errors and fails.
   *
   * @param {Expression<Document>} replacementDocument
   */
  static $replaceWith(replacementDocument) {
    return { $replaceWith: replacementDocument };
  }

  /**
   * Accepts an array expression as an argument and returns an array with the elements
   * in reverse order.
   *
   * The argument can be any valid expression as long as it resolves to an array.
   *
   * If the argument resolves to a value of `null` or refers to a missing field, `$reverseArray`
   * returns `null`.
   *
   * If the argument does not resolve to an array or `null` nor refers to a missing field,
   * `$reverseArray` returns an error.
   *
   * `$reverseArray` returns an empty array when the argument is an empty array.
   *
   * If the argument contains subarrays, `$reverseArray` only operates on the top level array
   * elements and will not reverse the contents of subarrays.
   *
   * @param {Expression<any[]>} expression
   */
  static $reverseArray(expression) {
    return { $reverseArray: expression };
  }

  /**
   * Takes two or more arrays and returns an array containing the elements that appear
   * in all input arrays.
   *
   * `$setIntersection` performs set operation on arrays, treating arrays as sets.
   * If an array contains duplicate entries, `$setIntersection` ignores the duplicate entries.
   * `$setIntersection` ignores the order of the elements.
   *
   * `$setIntersection` filters out duplicates in its result to output an array that contain
   * only unique entries. The order of the elements in the output array is unspecified.
   *
   * If a set contains a nested array element, `$setIntersection` does not descend into the nested
   * array but evaluates the array at top-level.
   *
   * @param {...Expression<any[]>} expressions
   */
  static $setIntersection(...expressions) {
    return { $setIntersection: expressions };
  }

  /**
   * Takes two or more arrays and returns an array containing the elements that appear
   * in any input array.
   *
   * `$setUnion` performs set operation on arrays, treating arrays as sets.
   * If an array contains duplicate entries, `$setUnion` ignores the duplicate entries.
   * `$setUnion` ignores the order of the elements.
   *
   * `$setUnion` filters out duplicates in its result to output an array that contain
   * only unique entries. The order of the elements in the output array is unspecified.
   *
   * If a set contains a nested array element, `$setUnion` does not descend into the nested
   * array but evaluates the array at top-level.
   *
   * @param {...Expression<any[]>} expressions
   */
  static $setUnion(...expressions) {
    return { $setUnion: expressions };
  }

  /**
   * Returns a subset of an array.
   *
   * {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation/slice/#mongodb-expression-exp.-slice `$slice`}
   * has one of two syntax forms:
   *
   * The following syntax returns elements from either the start or end of the array:
   * ```js
   * $slice( <array>, <n> )
   * ```
   *
   * The following syntax returns elements from the specified position in the array:
   * ```js
   * $slice( <array>, <position>, <n> )
   * ```
   *
   * @param {Expression<Array>} array Any valid expression as long as it resolves to an array.
   * @param {Expression<number>} [position] Optional. Any valid expression as long as it resolves to
   * an integer.
   *
   * - If positive, `$slice` determines the starting position from the start of the array. If
   * `<position>` is greater than the number of elements, the `$slice` returns an empty array.
   *
   * - If negative, `$slice` determines the starting position from the end of the array. If the
   * absolute value of the `<position>` is greater than the number of elements, the starting
   * position is the start of the array.
   * @param {Expression<number>} n Any valid expression as long as it resolves to an integer. If
   * `<position>` is specified, `<n>` must resolve to a positive integer.
   *
   * - If positive, `$slice` returns up to the first n elements in the array. If the `<position>` is
   * specified, `$slice` returns the first n elements starting from the position.
   *
   * - If negative, `$slice` returns up to the last `n` elements in the array. `n` cannot resolve to
   * a negative number _if_ `<position>` is specified.
   *
   */
  static $slice(array, position, n) {
    const parts = [array, position];
    if (n != null) parts.push(n);
    return { $slice: parts };
  }

  /**
   * @param {Expression<any[]>} expression The argument for $size can be any expression as
   * long as it resolves to an array. If the argument for $size is missing or does not
   * resolve to an array, $size errors.
   */
  static $size(expression) {
    return { $size: expression };
  }

  /**
   * @param {object} params
   * @param {Expression} params.input The array to be sorted.
   * @param {number|Document} params.sortBy The document specifies a sort ordering.
   */
  static $sortArray({ input, sortBy }) {
    return { $sortArray: { input, sortBy } };
  }

  /**
   * Divides a string into an array of substrings based on a delimiter. `$split` removes
   * the delimiter and returns the resulting substrings as elements of an array. If the
   * delimiter is not found in the string, `$split` returns the original string as the
   * only element of an array.
   *
   * @param {Expression<string>} expr The string to be split. `expr` can be
   * any valid expression as long as it resolves to a string.
   * @param {Expression<string>} delimiter The delimiter to use when splitting the string
   * expression. `delimiter` can be any valid expression as long as it resolves to a string.
   */
  static $split(expr, delimiter) {
    return { $split: [expr, delimiter] };
  }

  /**
   * Returns the number of UTF-8 code points in the specified string.
   *
   * The argument can be any valid expression that resolves to a string.
   *
   * If the argument resolves to a value of `null` or refers to a missing field, `$strLenCP`
   * returns an error.
   *
   * @param {Expression<string>} expr
   */
  static $strLenCP(expr) {
    return { $strLenCP: expr };
  }

  /**
   * Returns the substring of a string. The substring starts with the character at the specified
   * UTF-8 code point (CP) index (zero-based) in the string for the number of code points specified.
   *
   * @param {Expression<string>} expr The string from which the substring will be extracted.
   * `string expression` can be any valid expression as long as it resolves to a string.
   *
   * If the argument resolves to a value of `null` or refers to a field that is missing,
   * `$substrCP` returns an empty string.
   *
   * If the argument does not resolve to a string or `null` nor refers to a missing field,
   * `$substrCP` returns an error.
   *
   * @param {Expression<number} codePointIndex Indicates the starting point of the substring.
   * `code point index` can be any valid expression as long as it resolves to a non-negative
   * integer.
   * @param {Expression<number} codePointCount
   * Can be any valid expression as long as it resolves to a non-negative integer or number that can
   * be represented as an integer (such as 2.0).
   */
  static $substrCP(expr, codePointIndex, codePointCount) {
    return { $substrCP: [expr, codePointIndex, codePointCount] };
  }

  /**
   * Subtracts two numbers to return the difference, or two dates to return the difference in
   * milliseconds, or a date and a number in milliseconds to return the resulting date.
   *
   * The second argument is subtracted from the first argument.
   *
   * The arguments can be any valid expression as long as they resolve to numbers and/or dates.
   * To subtract a number from a date, the date must be the first argument.
   *
   * @param {Expression<number|Date>} expr1
   * @param {Expression<number|Date>} expr2
   */
  static $subtract(expr1, expr2) {
    return { $subtract: [expr1, expr2] };
  }

  /**
   * @param {object} params
   * @param {SwitchBranch[]} params.branches An array of control branch documents.
   * @param {Expression<any>} [params.default] Optional. The path to take if no branch
   * `case` expression evaluates to `true`. Although optional, if `default` is unspecified
   * and no branch `case` evaluates to true, `$switch` returns an error.
   */
  static $switch({ branches, default: defaultValue }) {
    return {
      $switch: {
        branches,
        ...(defaultValue != null && { default: defaultValue }),
      },
    };
  }

  /**
   * Converts a value to a boolean.
   *
   * @param {Expression<any>} expression
   */
  static $toBool(expression) {
    return { $toBool: expression };
  }

  /**
   * Converts a value to a date. If the value cannot be converted to a date, `$toDate` errors.
   * If the value is `null` or missing, `$toDate` returns `null`.
   *
   * @param {Expression<any>} expression
   */
  static $toDate(expression) {
    return { $toDate: expression };
  }

  /**
   * Converts a value to an integer. If the value cannot be converted to an integer,
   * `$toInt` errors. If the value is `null` or missing, `$toInt` returns `null`.
   *
   * @param {Expression<any>} expression
   */
  static $toInt(expression) {
    return { $toInt: expression };
  }

  /**
   * Converts a value to an `ObjectId()`. If the value cannot be converted to an ObjectId,
   * `$toObjectId` errors. If the value is `null` or missing, `$toObjectId` returns `null`.
   *
   * @param {Expression<any>} expression
   */
  static $toObjectId(expression) {
    return { $toObjectId: expression };
  }

  /**
   * Computes and returns the hash value of the input expression using the same hash function that
   * MongoDB uses to create a hashed index. A hash function maps a key or string to a fixed-size
   * numeric value.
   *
   * @param {Expression<any>} expression
   */
  static $toHashedIndexKey(expression) {
    return { $toHashedIndexKey: expression };
  }

  /**
   * Converts a value to a long. If the value cannot be converted to a long, `$toLong` errors.
   * If the value is `null` or missing, `$toLong` returns `null`.
   *
   * @param {Expression<any>} expression
   */
  static $toLong(expression) {
    return { $toLong: expression };
  }

  /**
   * Converts a string to lowercase, returning the result.
   *
   * The argument can be any expression as long as it resolves to a string.
   *
   * If the argument resolves to `null`, `$toLower` returns an empty string `""`.
   *
   * @param {Expression<stirng|null>} expression
   */
  static $toLower(expression) {
    return { $toLower: expression };
  }

  /**
   * Converts a value to a string. If the value cannot be converted to a string, `$toString`
   * errors. If the value is `null` or missing, `$toString` returns `null`.
   *
   * @param {Expression<any>} expression
   */
  static $toString(expression) {
    return { $toString: expression };
  }

  /**
   * Converts a string to uppercase, returning the result.
   *
   * If the argument resolves to `null`, $toUpper returns an empty string `""`.
   *
   *1 only has a well-defined behavior for strings of ASCII characters.
   *
   * @param {Expression<?string>} expression
   */
  static $toUpper(expression) {
    return { $toUpper: expression };
  }

  /**
   * Removes whitespace characters, including null, or the specified characters from
   * the beginning and end of a string.
   *
   * @param {Expression<string>} expr
   * @param {object} [options]
   * @param {Expression<string>} [options.chars]
   */
  static $trim(expr, options) {
    return { $trim: { input: expr, ...options } };
  }

  /**
   * Returns a string that specifies the BSON type of the argument.
   *
   * Unlike the `$type` query operator, which matches array elements based on their BSON type,
   * the `$type` aggregation operator does not examine array elements. Instead, when passed an
   * array as its argument, the `$type` aggregation operator returns the type of the argument,
   * i.e. `"array"`.
   *
   * If the argument is a field that is missing in the input document, `$type` returns the string
   * `"missing"`.
   *
   * @param {Expression<any>} expr
   */
  static $type(expr) {
    return { $type: expr };
  }

  /**
   * @typedef YearParams
   * @prop {Expression<Date>} date An expression that resolves to a Date, a Timestamp,
   * or an ObjectID.
   * @prop {Expression<string>} [timezone]
   *
   * @param {YearParams|Expression<Date>}
   */
  static $year(exprOrParams) {
    return { $year: exprOrParams };
  }
}

/**
 * @typedef {import("@parameter1/mongodb-core").Document} Document
 * @typedef {import("@parameter1/mongodb-core").ObjectId} ObjectId
 * @typedef {import("@parameter1/mongodb-core").Timestamp} Timestamp
 *
 * @typedef {string} Timezone
 *
 * @typedef SwitchBranch
 * @prop {Expression<boolean>} case Can be any valid expression that resolves to a `boolean`.
 * If the result is not a `boolean`, it is coerced to a boolean value
 * @prop {Expression<any>} then Can be any valid expression.
 */

/**
 * @template T
 * @typedef {T} Expression
 */
