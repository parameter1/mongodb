import { ObjectId } from '@parameter1/mongodb-bson';

/**
 * @template V
 * @extends {Map<ObjectId, V>}
 */
export class ObjectIdMap extends Map {
  /**
   * @param {ObjectIdLike} key
   */
  delete(key) {
    return super.delete(`${key}`);
  }

  /**
   * @returns {V|undefined}
   */
  first() {
    return [...this.values()][0];
  }

  /**
   * @param {ObjectIdLike} key
   */
  has(key) {
    return super.has(`${key}`);
  }

  /**
   * @param {ObjectIdLike[]} keys
   */
  hasAll(keys) {
    return keys.every((key) => this.has(key));
  }

  /**
   * @param {ObjectIdLike} key
   */
  get(key) {
    return super.get(`${key}`);
  }

  /**
   * @param {ObjectIdLike[]} keys
   */
  getMissing(keys) {
    return keys.filter((key) => !this.has(key));
  }

  /**
   * @returns {Map<V, ObjectId>}
   */
  invert() {
    return new Map([...this].map(([_id, v]) => ([v, _id])));
  }

  /**
   * @param {ObjectIdLike} key
   * @param {V} value
   */
  set(key, value) {
    return super.set(`${key}`, value);
  }

  /**
   * @param {ObjectIdLike} key
   * @param {V} value
   */
  setWhenUnset(key, value) {
    if (this.has(key)) return this;
    return this.set(key, value);
  }

  /**
   * @returns {MapIterator<ObjectId>}
   */
  keys() {
    const iterator = this[Symbol.iterator]();
    return {
      [Symbol.iterator]() {
        return {
          next() {
            const { value, done } = iterator.next();
            if (!done) {
              /** @type {[ObjectId, V]} */
              const [k] = value;
              return { value: k, done };
            }
            return { done };
          },
        };
      },
    };
  }

  /**
   * @returns {MapIterator<[ObjectId, V]>}
   */
  [Symbol.iterator]() {
    const iterator = super[Symbol.iterator]();
    return {
      next() {
        const { value, done } = iterator.next();
        if (!done) {
          /** @type {[string, V]} */
          const [k, v] = value;
          return { value: [new ObjectId(k), v], done };
        }
        return { done };
      },
    };
  }

  /**
   * @template V
   * @param {?import("@parameter1/mongodb-core").WithId<V>[]} [docs]
   * @returns {ObjectIdMap<V>}
   */
  static createFromDocuments(docs) {
    if (!docs) return new ObjectIdMap();
    return new ObjectIdMap(docs.map((doc) => [
      doc._id,
      doc,
    ]));
  }
}

/**
 * @typedef {ObjectId|string} ObjectIdLike
 */
