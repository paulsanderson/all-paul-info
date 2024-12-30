export class Utilities {
  public static debounce = (fn: (...params: unknown[]) => unknown, wait: number, immed = false) => {
    let timer: number
    return function (this: unknown, ...args: unknown[]) {
      if (timer === undefined && immed) {
        fn.apply(this, args)
      }
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), wait)
      return timer
    }
  }
}
