import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
                throw new Error("Invalid delimiter");
            }
            this.delimiter = delimiter;
        }
        this.name = source ?? "";
        //  escape
        const s = this.name;
        if (s.length === 0) {
            this.noComponents = 0;
        } else {
            let count = 1, i = 0;
            while (i < s.length) {
                const ch = s[i];
                if (ch === ESCAPE_CHARACTER) {
                    i += (i + 1 < s.length) ? 2 : 1;
                } else {
                    if (ch === this.delimiter) count++;
                    i++;
                }
            }
            this.noComponents = count;
        }
    }
    public asString(delimiter: string = this.delimiter): string {
        if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
            throw new Error("Invalid delimiter");
        }
        if (this.name === "") return "";
        const parts: string[] = [];
        let cur = "";
        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else { cur += ESCAPE_CHARACTER; }
            } else if (ch === this.delimiter) {
                parts.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);
        return parts.join(delimiter);
    }

    public asDataString(): string {
        if (this.name === "") return "";
        // split masked
        const parts: string[] = [];
        let cur = "";
        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else { cur += ESCAPE_CHARACTER; }
            } else if (ch === this.delimiter) {
                parts.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);
        // escape for default and join
        const escapeForDefault = (raw: string): string => {
            let out = "";
            for (let i = 0; i < raw.length; i++) {
                const ch = raw[i];
                if (ch === ESCAPE_CHARACTER || ch === DEFAULT_DELIMITER) out += ESCAPE_CHARACTER + ch;
                else out += ch;
            }
            return out;
        };
        const masked = parts.map(escapeForDefault);
        return masked.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (this.name === "") throw new RangeError(`Index out of bounds: ${i}`);
        const parts: string[] = [];
        let cur = "";
        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else { cur += ESCAPE_CHARACTER; }
            } else if (ch === this.delimiter) {
                parts.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);
        if (!Number.isInteger(i) || i < 0 || i >= parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        return parts[i]; // مُهروب كما هو مخزّن
    }

    public setComponent(i: number, c: string): void {
        if (this.noComponents === 0) throw new RangeError(`Index out of bounds: ${i}`);
        const parts: string[] = [];
        let cur = "";
        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else { cur += ESCAPE_CHARACTER; }
            } else if (ch === this.delimiter) {
                parts.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);
        if (!Number.isInteger(i) || i < 0 || i >= parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        parts[i] = c;
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public insert(i: number, c: string): void {
        const parts: string[] = [];
        if (this.name !== "") {
            let cur = "";
            for (let i = 0; i < this.name.length; i++) {
                const ch = this.name[i];
                if (ch === ESCAPE_CHARACTER) {
                    if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                    else { cur += ESCAPE_CHARACTER; }
                } else if (ch === this.delimiter) {
                    parts.push(cur); cur = "";
                } else {
                    cur += ch;
                }
            }
            parts.push(cur);
        }
        if (!Number.isInteger(i) || i < 0 || i > parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        parts.splice(i, 0, c);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public append(c: string): void {
        if (this.name === "") this.name = c;
        else this.name += this.delimiter + c;
        this.noComponents += 1;
    }

    public remove(i: number): void {
        if (this.noComponents === 0) throw new RangeError(`Index out of bounds: ${i}`);
        const parts: string[] = [];
        let cur = "";
        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) { cur += this.name[i + 1]; i++; }
                else { cur += ESCAPE_CHARACTER; }
            } else if (ch === this.delimiter) {
                parts.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);
        if (!Number.isInteger(i) || i < 0 || i >= parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        parts.splice(i, 1);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public concat(other: Name): void {
        const otherData = other.asDataString(); // default-delimited masked string
        if (otherData.length === 0) return;

        // split other on DEFAULT_DELIMITER respecting escape
        const otherParts: string[] = [];
        let cur = "";
        for (let i = 0; i < otherData.length; i++) {
            const ch = otherData[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < otherData.length) { cur += otherData[i + 1]; i++; }
                else { cur += ESCAPE_CHARACTER; }
            } else if (ch === DEFAULT_DELIMITER) {
                otherParts.push(cur); cur = "";
            } else {
                cur += ch;
            }
        }
        otherParts.push(cur);

        // convert to this delimiter (unescape -> escape for this.delimiter)
        const toAdd: string[] = otherParts.map(masked => {
            let raw = "";
            for (let j = 0; j < masked.length; j++) {
                const ch = masked[j];
                if (ch === ESCAPE_CHARACTER) {
                    if (j + 1 < masked.length) raw += masked[++j];
                    else raw += ESCAPE_CHARACTER;
                } else raw += ch;
            }
            let re = "";
            for (let j = 0; j < raw.length; j++) {
                const ch = raw[j];
                if (ch === ESCAPE_CHARACTER || ch === this.delimiter) re += ESCAPE_CHARACTER + ch;
                else re += ch;
            }
            return re;
        });

        if (this.name === "") {
            this.name = toAdd.join(this.delimiter);
            this.noComponents = toAdd.length;
        } else {
            this.name += this.delimiter + toAdd.join(this.delimiter);
            this.noComponents += toAdd.length;
        }
    }

}
