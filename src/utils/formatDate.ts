export function formatDate(valor: string) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{2})(\d{0,4})/, (_, d, m, y) => {
            let res = `${d}/${m}`;
            if (y) res += `/${y}`;
            return res;
        });
}
