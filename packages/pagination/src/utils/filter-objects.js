import sift from 'sift';

/**
 * @typedef {import("@parameter1/mongodb-core").Document} Document
 *
 * @param {Document[]} docs
 * @param {import("sift").Query} query
 * @returns {Document[]}
 */
export function filterObjects(docs, query) {
  return docs.filter(sift(query));
}
