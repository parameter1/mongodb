export function invertSort(sort) {
  return Object.keys(sort).reduce((o, key) => ({
    ...o,
    [key]: sort[key] * -1,
  }), {});
}
