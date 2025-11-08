import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        if (delimiter !== undefined) {
            if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
                throw new Error("Invalid delimiter");
            }
            this.delimiter = delimiter;
        }
        this.components = [...source];
    }

    public asString(delimiter: string = this.delimiter): string {
        if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
            throw new Error("Invalid delimiter");
        }
        const unescape = (masked: string): string => {
            let out = "";
            for (let i = 0; i < masked.length; i++) {
                const ch = masked[i];
                if (ch === ESCAPE_CHARACTER) {
                    if (i + 1 < masked.length) out += masked[++i];
                    else out += ESCAPE_CHARACTER;
                } else out += ch;
            }
            return out;
        };
        const raw = this.components.map(unescape);
        return raw.join(delimiter);
    }

    public asDataString(): string {
        const unescape = (masked: string): string => {
            let out = "";
            for (let i = 0; i < masked.length; i++) {
                const ch = masked[i];
                if (ch === ESCAPE_CHARACTER) {
                    if (i + 1 < masked.length) out += masked[++i];
                    else out += ESCAPE_CHARACTER;
                } else out += ch;
            }
            return out;
        };
        const escapeForDefault = (raw: string): string => {
            let out = "";
            for (let i = 0; i < raw.length; i++) {
                const ch = raw[i];
                if (ch === ESCAPE_CHARACTER || ch === DEFAULT_DELIMITER) out += ESCAPE_CHARACTER + ch;
                else out += ch;
            }
            return out;
        };
        const raw = this.components.map(unescape);
        const masked = raw.map(escapeForDefault);
        return masked.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (!Number.isInteger(i) || i < 0 || i > this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (!Number.isInteger(i) || i < 0 || i >= this.components.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const splitMasked = (s: string, delimiter: string): string[] => {
            const parts: string[] = [];
            let cur = "";
            for (let i = 0; i < s.length; i++) {
                const ch = s[i];
                if (ch === ESCAPE_CHARACTER) {
                    if (i + 1 < s.length) { cur += s[i + 1]; i++; }
                    else { cur += ESCAPE_CHARACTER; }
                } else if (ch === delimiter) {
                    parts.push(cur); cur = "";
                } else {
                    cur += ch;
                }
            }
            parts.push(cur);
            return parts;
        };
        const unescape = (masked: string): string => {
            let out = "";
            for (let i = 0; i < masked.length; i++) {
                const ch = masked[i];
                if (ch === ESCAPE_CHARACTER) {
                    if (i + 1 < masked.length) out += masked[++i];
                    else out += ESCAPE_CHARACTER;
                } else out += ch;
            }
            return out;
        };
        const escapeForThis = (raw: string): string => {
            let out = "";
            for (let i = 0; i < raw.length; i++) {
                const ch = raw[i];
                if (ch === ESCAPE_CHARACTER || ch === this.delimiter) out += ESCAPE_CHARACTER + ch;
                else out += ch;
            }
            return out;
        };

        const otherData = other.asDataString();
        if (otherData.length === 0) return;

        const otherMasked = splitMasked(otherData, DEFAULT_DELIMITER);
        const toAdd = otherMasked.map(unescape).map(escapeForThis);
        this.components.push(...toAdd);
    }

}
