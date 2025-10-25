export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * Eine Name-Instanz besteht aus mehreren String-Komponenten,
 * die durch ein Trennzeichen (Delimiter) getrennt sind.
 * Intern werden die Komponenten mit Escape-Zeichen maskiert,
 * falls sie Sonderzeichen enthalten.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /**
     * @methodtype constructor
     * @methodprop regular
     * Erwartet, dass alle Komponenten bereits korrekt für das verwendete Trennzeichen maskiert sind.
     */
    constructor(other: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            Name.assertValidDelimiter(delimiter);
            this.delimiter = delimiter;
        }
        this.components = [...other];
    }

    /**
     * @methodtype query-method (conversion)
     * @methodprop regular
     * Gibt eine menschenlesbare Darstellung des Namens zurück.
     */
    public asString(delimiter: string = this.delimiter): string {
        Name.assertValidDelimiter(delimiter);
        const raw = this.components.map(c => Name.unescapeForDelimiter(c, this.delimiter));
        return raw.join(delimiter);
    }

    /**
     * @methodtype query-method (conversion)
     * @methodprop regular
     * Gibt eine maschinenlesbare Darstellung des Namens zurück.
     */
    public asDataString(): string {
        const raw = this.components.map(c => Name.unescapeForDelimiter(c, this.delimiter));
        const escapedForDefault = raw.map(c => Name.escapeForDelimiter(c, DEFAULT_DELIMITER));
        return escapedForDefault.join(DEFAULT_DELIMITER);
    }

    /**
     * @methodtype get-method (query)
     * @methodprop primitive
     * Liefert die (maskierte) Komponente an Index i zurück.
     */
    public getComponent(i: number): string {
        Name.assertIndex(i, this.components.length);
        return this.components[i];
    }

    /**
     * @methodtype set-method (mutation)
     * @methodprop primitive
     * Setzt die (maskierte) Komponente an Index i.
     */
    public setComponent(i: number, c: string): void {
        Name.assertIndex(i, this.components.length);
        this.components[i] = c;
    }

    /**
     * @methodtype query-method
     * @methodprop primitive
     * Gibt die Anzahl der Komponenten zurück.
     */
    public getNoComponents(): number {
        return this.components.length;
    }

    /**
     * @methodtype command-method (mutation)
     * @methodprop regular
     * Fügt eine (maskierte) Komponente an Position i ein.
     */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        this.components.splice(i, 0, c);
    }

    /**
     * @methodtype command-method (mutation)
     * @methodprop regular
     * Hängt eine (maskierte) Komponente am Ende an.
     */
    public append(c: string): void {
        this.components.push(c);
    }

    /**
     * @methodtype command-method (mutation)
     * @methodprop regular
     * Entfernt die Komponente an Index i.
     */
    public remove(i: number): void {
        Name.assertIndex(i, this.components.length);
        this.components.splice(i, 1);
    }

    // ---------- Hilfsmethoden ----------

    /**
     * @methodtype helper-method (assertion)
     * @methodprop primitive
     * Prüft, ob das angegebene Trennzeichen gültig ist.
     */
    private static assertValidDelimiter(d: string): void {
        if (typeof d !== 'string' || d.length !== 1) {
            throw new Error(`Delimiter must be a single character string. Got: "${d}"`);
        }
        if (d === ESCAPE_CHARACTER) {
            throw new Error(`Delimiter cannot be the escape character "${ESCAPE_CHARACTER}".`);
        }
    }

    /**
     * @methodtype helper-method (assertion)
     * @methodprop primitive
     * Prüft, ob der Index innerhalb der gültigen Grenzen liegt.
     */
    private static assertIndex(i: number, len: number): void {
        if (!Number.isInteger(i)) {
            throw new TypeError(`Index must be an integer. Got: ${i}`);
        }
        if (i < 0 || i >= len) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
    }

    /**
     * @methodtype helper-method (utility)
     * @methodprop regular
     * Maskiert das Escape- und das Trennzeichen innerhalb eines Strings.
     */
    private static escapeForDelimiter(raw: string, delimiter: string): string {
        let out = '';
        for (let k = 0; k < raw.length; k++) {
            const ch = raw[k];
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                out += ESCAPE_CHARACTER + ch;
            } else {
                out += ch;
            }
        }
        return out;
    }

    /**
     * @methodtype helper-method (utility)
     * @methodprop regular
     * Hebt die Maskierung für ein bestimmtes Trennzeichen auf.
     */
    private static unescapeForDelimiter(masked: string, delimiter: string): string {
        let out = '';
        for (let k = 0; k < masked.length; k++) {
            const ch = masked[k];
            if (ch === ESCAPE_CHARACTER) {
                if (k + 1 < masked.length) {
                    const next = masked[++k];
                    out += next;
                } else {
                    out += ESCAPE_CHARACTER; // Letztes '\' bleibt bestehen
                }
            } else {
                out += ch;
            }
        }
        return out;
    }
}