// Source: https://github.com/rauschma/enumify/blob/master/ts/src/index.ts
// I update it to best fit my needs

export class Enumify<ValueType extends any = any> {

    //#################### Static
    static enumKeys: Array<string>;
    static enumValues: Array<Enumify>;
    static closeEnum(): null {
        const enumKeys: Array<string> = this.enumKeys || [];
        const enumValues: Array<Enumify> = this.enumValues || [];

        // Traverse the enum entries
        for (const [key, value] of Object.entries(this)) {
            enumKeys.push(key);

            value.enumKey = key;
            value.enumOrdinal = enumValues.length;
            enumValues.push(value);
        }
        // Important: only add more static properties *after* processing the enum entries
        this.enumKeys = enumKeys;
        this.enumValues = enumValues;
        // TODO: prevent instantiation now. Freeze `this`?

        return null;
    }

    /** Use case: parsing enum values */
    static enumValueOf(str: string):undefined|Enumify {
        const index = this.enumKeys.indexOf(str);
        if (index >= 0) {
            return this.enumValues[index];
        }
        return undefined;
    }

    /**
     * Try to parse a given param to an enum value.
     * @throws {Error} if no match
     * @param valueOrKey
     */
    static tryParse<T extends Enumify>(valueOrKey: any): T {
        if (valueOrKey instanceof this) {
            // @ts-ignore
            return valueOrKey;
        }

        // Consider the param as a key
        const index = this.enumKeys.indexOf(valueOrKey);
        if (index >= 0) {
            // @ts-ignore - resolve to the Enumify's child class
            return this.enumValues[index];
        }

        // Consider the param as a value
        const val = this.enumValues.find(v => v.value === valueOrKey);
        if (val) {
            // @ts-ignore - resolve to the Enumify's child class
            return val;
        }

        // Consider the param as a object with a key
        if (typeof valueOrKey === 'object' && valueOrKey !== null) {
            // Consider the param as a value
            const val = this.enumValues[valueOrKey.value];
            if (val) {
                // @ts-ignore - resolve to the Enumify's child class
                return val;
            }

            const key = valueOrKey.enumKey;
            if (key) {
                const index = this.enumKeys.indexOf(key);
                if (index >= 0) {
                    // @ts-ignore - resolve to the Enumify's child class
                    return this.enumValues[index];
                }
            }
        }

        throw new Error(`${valueOrKey} is not a valid value nor key for ${this.name}`);
    }

    /**
     * A null safe alias of tryParse
     * @param value
     */
    static parse<T extends Enumify>(value: any): T | null {
        try {
            // @ts-ignore
            return this.tryParse(value);
        } catch (e) {
            return null;
        }
    }

    static isValid(value: any): boolean {
        return this.parse(value) !== null;
    }

    /**
     * Get all items between 2 values
     * @param ClassConcerned
     * @param a
     * @param b
     * @param includeTopBorder whether or not to include the higher value (either a or b)
     */
    static getItemsBetween<T extends Enumify>(ClassConcerned: any, a: T, b: T, includeTopBorder = true): T[] {
        let diffs;
        if (a.enumOrdinal === b.enumOrdinal) return [];
        if (a.enumOrdinal < b.enumOrdinal) {
            diffs = ClassConcerned.enumValues.slice(a.enumOrdinal, b.enumOrdinal);
            if (includeTopBorder)
                diffs.push(b);
        } else {
            diffs = ClassConcerned.enumValues.slice(b.enumOrdinal, a.enumOrdinal);
            if (includeTopBorder)
                diffs.push(a);
        }

        // @ts-ignore
        return diffs;
    }

    static [Symbol.iterator]() {
        return this.enumValues[Symbol.iterator]();
    }

    //#################### Instance
    // @ts-ignore
    value: ValueType = undefined;
    enumKey!: string;
    enumOrdinal!: number;

    toString() {
        return this.constructor.name + '.' + this.enumKey;
    }
}