/**
 * Wrapper class for Playwright objects, or the objects themselves.
 * In classes that extends Wrap, exclude the class itself.
 */
export type Wrappable<T> = T extends Wrap<infer U> ? Exclude<{ $raw: U }, T> | U : { $raw: T } | T;

export default class Wrap<T> {
  $raw: T;

  constructor(raw: { $raw: T } | T) {
    this.$raw = Wrap.unwrap(raw);
  }

  static unwrap(instance?: undefined): undefined;
  static unwrap<R>(instance: { $raw: R } | R): R;
  static unwrap<R>(instance?: { $raw: R } | R) {
    // @ts-ignore
    return instance?.$raw ?? instance;
  }
}
