export function charCode(str) {
    for (var arr = str.split(''), i = str.length - 1; i >= 0; i--) {
        arr[i] = arr[i].charCodeAt(0);
    }

    return arr;
};
