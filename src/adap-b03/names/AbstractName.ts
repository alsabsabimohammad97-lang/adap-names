import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
            throw new Error("Invalid delimiter");
        }
        this.delimiter = delimiter;
    }

    // ---------- helper functions (local to this class) ----------

    private static unescape(masked: string): string {
        let out = "";
        for (let i = 0; i < masked.length; i++) {
            const ch = masked[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < masked.length) {
                    out += masked[++i];
                } else {
                    out += ESCAPE_CHARACTER;
                }
            } else {
                out += ch;
            }
        }
        return out;
    }

    private static escapeForDelimiter(raw: string, delimiter: string): string {
        let out = "";
        for (let i = 0; i < raw.length; i++) {
            const ch = raw[i];
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                out += ESCAPE_CHARACTER + ch;
            } else {
                out += ch;
            }
        }
        return out;
    }

    private static splitMasked(s: string, delimiter: string): string[] {
        if (s === "") return [];
        const parts: string[] = [];
        let cur = "";
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i + 1 < s.length) {
                    cur += s[++i];
                } else {
                    cur += ESCAPE_CHARACTER;
                }
            } else if (ch === delimiter) {
                parts.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);
        return parts;
    }

    // ---------- Name / Cloneable / Printable / Equality ----------

    public clone(): Name {
        const proto = Object.getPrototypeOf(this);
        const copy: any = Object.create(proto);

        for (const key of Object.keys(this)) {
            const value = (this as any)[key];
            if (Array.isArray(value)) {
                copy[key] = [...value];
            } else {
                copy[key] = value;
            }
        }

        return copy as Name;
    }

    public asString(delimiter: string = this.delimiter): string {
        if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
            throw new Error("Invalid delimiter");
        }

        const raw: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const masked = this.getComponent(i);
            raw.push(AbstractName.unescape(masked));
        }
        return raw.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const raw: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const masked = this.getComponent(i);
            raw.push(AbstractName.unescape(masked));
        }
        const maskedForDefault = raw.map(r =>
            AbstractName.escapeForDelimiter(r, DEFAULT_DELIMITER)
        );
        return maskedForDefault.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (this === other) return true;
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            const ch = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        const otherData = other.asDataString();
        if (otherData === "") return;

        const otherMaskedDefault = AbstractName.splitMasked(otherData, DEFAULT_DELIMITER);

        for (const masked of otherMaskedDefault) {
            const raw = AbstractName.unescape(masked);
            const maskedForThis = AbstractName.escapeForDelimiter(raw, this.delimiter);
            this.append(maskedForThis);
        }
    }

    // ---------- abstract methods to be implemented by subclasses ----------

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
