export function debounce<F extends Function>(fn: F, delay: number, immediate = false): F {
    let timeoutId: NodeJS.Timeout | undefined;

    function debouncedFn(this: any, ...args: any[]) {
        return new Promise((resolve) => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }

            if (immediate && timeoutId === undefined) {
                timeoutId = setTimeout(() => {
                    timeoutId = undefined;
                }, delay);
                resolve(fn.apply(this, args));
            } else {
                timeoutId = setTimeout(() => {
                    resolve(fn.apply(this, args));
                    timeoutId = undefined;
                }, delay);
            }
        });
    }

    debouncedFn.cancel = function () {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
        }
    };

    return debouncedFn as unknown as F;
}
