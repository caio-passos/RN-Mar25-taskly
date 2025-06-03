export function formatDate(value: string) {
    const newValue: Array<string> = [];

    for (let i = 0; i < value.length; i++) {
        newValue.push(value[i]);
    }

    if (Number(value.slice(0, 2)) > 31) {
        newValue[0] = '3';
        newValue[1] = '1';
    }

    if (Number(value.slice(3, 5)) > 12) {
        newValue[3] = '1';
        newValue[4] = '2';
    }

    if (Number(value.slice(3, 5)) === 4 || Number(value.slice(3, 5)) === 6 || Number(value.slice(3, 5)) === 9 || Number(value.slice(3, 5)) === 11) {
        newValue[0] = '3';
        newValue[1] = '0';
    }

    if (Number(value.slice(3, 5)) === 2) {
        newValue[0] = '2';
        newValue[1] = '9';
    }

    return newValue.join('')
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{2})(\d{0,4})/, (_, d, m, y) => {
            let res = `${d}/${m}`;
            if (y) res += `/${y}`;
            return res;
        });
}
