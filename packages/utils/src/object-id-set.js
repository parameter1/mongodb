import { ObjectId } from '@parameter1/mongodb-bson';

/**
 * @extends {Set<ObjectId>}
 */
export class ObjectIdSet extends Set {
  /**
   * @param {string|ObjectId} value
   */
  add(value) {
    return super.add(`${value}`);
  }

  /**
   * @returns {IterableIterator<ObjectId>}
   */
  keys() {
    return this.values();
  }

  /**
   * @param {ObjectIdSetForEachCallbackFn} callbackFn
   */
  forEach(callbackFn) {
    super.forEach((value, value2, set) => {
      const v1 = new ObjectId(value);
      const v2 = value2 ? new ObjectId(value2) : value2;
      callbackFn(v1, v2, set);
    });
  }

  /**
   * @param {string|ObjectId} value
   */
  has(value) {
    return super.has(`${value}`);
  }

  /**
   * @returns {IterableIterator<ObjectId>}
   */
  values() {
    return {
      [Symbol.iterator]: this[Symbol.iterator].bind(this),
    };
  }

  [Symbol.iterator]() {
    const iterator = super[Symbol.iterator]();
    return {
      next() {
        const { value, done } = iterator.next();
        if (!done) return { value: new ObjectId(value), done };
        return { done };
      },
    };
  }
}

/**
 * @callback ObjectIdSetForEachCallbackFn
 * @param {value} ObjectId
 * @param {value2} ObjectId
 * @param {set} ObjectIdSet
 */
