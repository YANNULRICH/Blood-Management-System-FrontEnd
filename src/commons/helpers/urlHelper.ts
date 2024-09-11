
/**
 * Get all query parameter from url
 */
export const getAllQueryParams = <Filters>(): Partial<Filters> => {
    const params = new URLSearchParams(window.location.search);

    // @ts-ignore
    return Array.from(params.keys()).reduce(
        // @ts-ignore
        (acc: Record<keyof Filters, string | null>, val: string) => ({
            ...acc,
            [val]: val.includes('[]') ? params.getAll(val) : params.get(val)
        }),
        {}
    );
}

export const setValuesToQueryParams = <Filters>(values: Partial<Filters>) => {
    const url = new URL(window.location.href);
    Object.entries(values).forEach(elt => {
        // @ts-ignore
        if (![undefined, null, NaN, ''].includes(elt[1])) {
            // Handle array case
            if (elt[0].includes('[]') && Array.isArray(elt[1])) {
                url.searchParams.delete(elt[0]);
                elt[1].forEach((item) => {
                    url.searchParams.append(elt[0], `${item}`);
                });
            }
            // literal value case
            else url.searchParams.set(elt[0], `${elt[1]}`);
        } else {
            url.searchParams.delete(elt[0]);
        }
    });

    window.history.replaceState(null, '', url.toString());
}