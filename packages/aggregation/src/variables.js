/**
 * A variable that returns the current datetime value. `NOW` returns the same value for all members
 * of the deployment and remains the same throughout all stages of the aggregation pipeline.
 */
export const $$NOW = '$$NOW';

/**
 * A variable which evaluates to the missing value. Allows for the exclusion of fields in
 * `$addFields` and `$project` stages.
 *
 * For examples that use `$$REMOVE`, see:
 * - {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/#std-label-addFields-remove-example Remove Fields}
 * - {@link https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#std-label-remove-example Conditionally Exclude Fields}
 */
export const $$REMOVE = '$$REMOVE';

/**
 * References the root document, i.e. the top-level document, currently being processed in the
 * aggregation pipeline stage.
 */
export const $$ROOT = '$$ROOT';
