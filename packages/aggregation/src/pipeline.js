import { inspect } from 'node:util';

export class Pipeline {
  constructor() {
    /** @type {Document[]} */
    this.stages = [];
  }

  [Symbol.iterator]() {
    const { stages } = this;
    return {
      index: 0,
      next() {
        const value = stages[this.index];
        if (!value) return { done: true };
        this.index += 1;
        return { done: false, value };
      },
    };
  }

  get length() {
    return this.stages.length;
  }

  /**
   * @param {MaybeNullish<Document>} document
   */
  $addFields(document) {
    return this.push({ $addFields: document });
  }

  /**
   * @typedef BucketAutoParams
   * @prop {Document} groupBy
   * @prop {number} buckets
   * @prop {Document} [output]
   * @prop {string} [granularity]
   *
   * @param {MaybeNullish<BucketAutoParams>} params
   */
  $bucketAuto({
    groupBy,
    buckets,
    output,
    granularity,
  }) {
    return this.push({
      $bucketAuto: {
        groupBy,
        buckets,
        ...(output && { output }),
        ...(granularity && { granularity }),
      },
    });
  }

  /**
   * @param {MaybeNullish<string>} outputField
   */
  $count(outputField) {
    return this.push({ $count: outputField });
  }

  /**
   * @param {MaybeNullish<Document[]>} expression
   */
  $documents(expression) {
    return this.push({ $documents: expression });
  }

  /**
   * @param {MaybeNullish<Record<string, Document[]|Pipeline>>} output
   */
  $facet(output) {
    return this.push({
      $facet: Object.keys(output).reduce((o, name) => {
        const value = output[name];
        return {
          ...o,
          [name]: value instanceof Pipeline ? value.toArray() : value,
        };
      }, {}),
    });
  }

  /**
   * @typedef GraphLookupParams
   * @prop {string} from
   * @prop {Document|string} startWith
   * @prop {string} connectFromField
   * @prop {string} connectToField
   * @prop {string} as
   * @prop {number} [maxDepth]
   * @prop {string} [depthField]
   * @prop {Document} [restrictSearchWithMatch]
   *
   * @param {MaybeNullish<GraphLookupParams>} params
   */
  $graphLookup({
    from,
    startWith,
    connectFromField,
    connectToField,
    as,
    maxDepth,
    depthField,
    restrictSearchWithMatch,
  }) {
    return this.push({
      $graphLookup: {
        from,
        startWith,
        connectFromField,
        connectToField,
        as,
        ...(maxDepth && { maxDepth }),
        ...(depthField && { depthField }),
        ...(restrictSearchWithMatch && { restrictSearchWithMatch }),
      },
    });
  }

  /**
   * @param {string|object|null} _id
   * @param {Document} values
   */
  $group(_id, values) {
    return this.push({ $group: { _id, ...values } });
  }

  /**
   * @param {MaybeNullish<number>} integer
   */
  $limit(integer) {
    return this.push({ $limit: integer });
  }

  /**
   * @param {MaybeNullish<LookupOptions>} options
   */
  $lookup(options) {
    const { pipeline } = options;
    return this.push({
      $lookup: {
        as: options.as,
        ...(options.foreignField && {
          foreignField: options.foreignField,
        }),
        ...(options.from && {
          from: options.from,
        }),
        ...(options.let && {
          let: options.let,
        }),
        ...(options.localField && {
          localField: options.localField,
        }),
        ...(pipeline?.length && {
          pipeline: pipeline instanceof Pipeline ? pipeline.toArray() : pipeline,
        }),
      },
    });
  }

  /**
   * @param {MaybeNullish<Document>} filter
   */
  $match(filter) {
    return this.push({ $match: filter });
  }

  /**
   * @typedef MergeOptions
   * @prop {string|MergeOptionsInto} into
   * @prop {string|string[]} [on]
   * @prop {MergeOptionsWhenMatchedAction|Document|Pipeline} [whenMatched]
   * @prop {MergeOptionsWhenNotMatchedAction} [whenNotMatched]
   *
   * @typedef MergeOptionsInto
   * @prop {string} db
   * @prop {string} coll
   *
   * @typedef {("replace"|"keepExisting"|"merge"|"fail")} MergeOptionsWhenMatchedAction
   * @typedef {("insert"|"discard"|"fail")} MergeOptionsWhenNotMatchedAction
   *
   * @param {MaybeNullish<MergeOptions>} options
   */
  $merge(options) {
    return this.push({
      $merge: {
        ...options,
        ...(options?.whenMatched instanceof Pipeline && {
          whenMatched: options.whenMatched.toArray(),
        }),
      },
    });
  }

  /**
   * @param {MaybeNullish<Document>} document
   */
  $out(document) {
    return this.push({ $out: document });
  }

  /**
   * @param {MaybeNullish<Document>} document
   */
  $project(document) {
    return this.push({ $project: document });
  }

  /**
   * @param {MaybeNullish<string|Document>} pathOrExpr
   */
  $replaceRoot(pathOrExpr) {
    return this.push({ $replaceRoot: { newRoot: pathOrExpr } });
  }

  /**
   * @param {MaybeNullish<string|Document>} pathOrExpr
   */
  $replaceWith(pathOrExpr) {
    return this.push({ $replaceWith: pathOrExpr });
  }

  /**
   * @param {MaybeNullish<number>} size
   */
  $sample(size) {
    return this.push({ $sample: { size } });
  }

  /**
   * @param {SearchOptions} options
   */
  $search(options) {
    return this.push({ $search: options });
  }

  /**
   * @param {MaybeNullish<Document>} document
   */
  $set(document) {
    return this.push({ $set: document });
  }

  /**
   * @param {MaybeNullish<number>} integer
   */
  $skip(integer) {
    return this.push({ $skip: integer });
  }

  /**
   * @param {MaybeNullish<Record<string, (1|-1)>>} sort
   */
  $sort(sort) {
    return this.push({ $sort: sort });
  }

  /**
   * @param {MaybeNullish<string|UnionWithOptions>} collectionOrOptions
   */
  $unionWith(collectionOrOptions) {
    if (typeof collectionOrOptions === 'string') return this.push({ $unionWith: collectionOrOptions });

    const { coll, pipeline } = collectionOrOptions || {};

    return this.push({
      $unionWith: {
        ...(coll && { coll }),
        ...(pipeline && {
          pipeline: pipeline instanceof Pipeline ? pipeline.toArray() : pipeline,
        }),
      },
    });
  }

  /**
   * @param {MaybeNullish<string|string[]>} pathOrPaths
   */
  $unset(pathOrPaths) {
    return this.push({ $unset: pathOrPaths });
  }

  /**
   * @typedef UnwindOptions
   * @prop {string} path
   * @prop {string} [includeArrayIndex]
   * @prop {boolean} [preserveNullAndEmptyArrays]
   *
   * @param {MaybeNullish<string|UnwindOptions>} stringOrOptions
   */
  $unwind(stringOrOptions) {
    return this.push({ $unwind: stringOrOptions });
  }

  clone() {
    return new Pipeline().push(...this.stages);
  }

  /**
   * @param {import("node:util").InspectOptions} options
   */
  inspect(options) {
    return inspect(this.stages, { colors: true, ...options });
  }

  /**
   * @param {...(Document|Pipeline)} values
   */
  push(...values) {
    this.stages.push(...values.reduce((arr, value) => {
      if (value == null) return arr;
      if (value instanceof Pipeline) {
        arr.push(...value);
      } else if (value[Object.keys(value)[0]] == null) {
        return arr;
      } else {
        arr.push(value);
      }
      return arr;
    }, []));
    return this;
  }

  /**
   * @param {Pipeline} pipeline
   */
  pushPipeline(pipeline) {
    return this.push(...pipeline.toArray());
  }

  reset() {
    this.stages = [];
    return this;
  }

  toArray() {
    return this.stages;
  }

  /**
   * @param {...Document} values
   */
  unshift(...values) {
    this.stages.unshift(...values);
    return this;
  }

  /**
   * @param {...Pipeline} pipelines
   */
  static merge(...pipelines) {
    const pipeline = new Pipeline();
    pipelines.forEach((toMerge) => {
      pipeline.pushPipeline(toMerge);
    });
    return pipeline;
  }
}

/**
 * @typedef {import("@parameter1/mongodb-core").Document} Document
 *
 * @typedef LookupOptions
 * @prop {string} as
 * @prop {string} foreignField
 * @prop {string} from
 * @prop {Record<string, string|Document>} [let]
 * @prop {string} localField
 * @prop {Pipeline|Document[]} [pipeline]
 *
 * @typedef SearchOptions
 * @prop {Record<string, any>} [compound]
 * @prop {SearchCountOptions} [count] Document that specifies the count options for retrieving a
 * count of the results. To learn more, see Count Atlas Search Results.
 * @prop {string} [index] Name of the Atlas Search index to use. If omitted, defaults to `default`.
 *
 * If you name your index `default`, you don't need to specify an `index` parameter in the `$search`
 * pipeline stage. If you give a custom name to your index, you must specify this name in the
 * `index` parameter.
 *
 * Atlas Search doesn't return results if you misspell the index name or if the specified index
 * doesn't already exist on the cluster.
 * @prop {string} [searchAfter] Reference point for retrieving results. `searchAfter` returns
 * documents starting immediately following the specified reference point. The reference point
 * must be a Base64-encoded token generated by the `$meta` keyword `searchSequenceToken`. To learn
 * more, see Paginate the Results. This field is mutually exclusive with the `searchBefore` field.
 * @prop {string} [searchBefore] Reference point for retrieving results. `searchBefore` returns
 * documents starting immediately before the specified reference point. The reference point must
 * be a Base64-encoded token generated by the` $meta` keyword `searchSequenceToken`. To learn more,
 * see Paginate the Results. This field is mutually exclusive with the `searchAfter` field.
 * @prop {boolean} [scoreDetails] Flag that specifies whether to retrieve a detailed breakdown of
 * the score for the documents in the results. If omitted, defaults to `false`. To view the details,
 * you must use the `$meta` expression in the `$project` stage.
 * @prop {Record<string, 1|-1>} [sort] Document that specifies the fields to sort the Atlas Search
 * results by in ascending or descending order. You can sort by date, number (integer, float,
 * and double values), and string values. To learn more, see Sort Atlas Search Results.
 *
 * @typedef SearchCountOptions
 * @prop {"lowerBound"|"total"} [type] Type of count of the documents in the result set. Value can
 * be one of the following:
 * - `lowerBound` - for a lower bound count of the number of documents that match the query. You
 * can set the `threshold` for the lower bound number.
 * - `total` - for an exact count of the number of documents that match the query. If the result
 * set is large, Atlas Search might take longer than for `lowerBound` to return the count.
 *
 * If omitted, defaults to `lowerBound`.
 * @prop {number} [threshold] Number of documents to include in the exact count if `type` is
 * `lowerBound`. If omitted, defaults to `1000`, which indicates that any number up to `1000` is an
 * exact count and any number above `1000` is a rough count of the number of documents in the
 * result.
 *
 * @typedef UnionWithOptions
 * @prop {string} [coll]
 * @prop {Pipeline|Document[]} [pipeline]
 */

/**
 * @template T
 * @typedef {T|null|undefined} MaybeNullish
 */
