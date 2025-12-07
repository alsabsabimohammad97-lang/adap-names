import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

constructor(delimiter: string = DEFAULT_DELIMITER) {
    // precondition: delimiter must be valid
    IllegalArgumentException.assert(
        typeof delimiter === "string" &&
        delimiter.length === 1 &&
        delimiter !== ESCAPE_CHARACTER,
        "invalid delimiter"
    );

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

    protected assertClassInvariant(): void {
        InvalidStateException.assert(
            typeof this.delimiter === "string" &&
            this.delimiter.length === 1 &&
            this.delimiter !== ESCAPE_CHARACTER,
            "invalid delimiter state"
        );
        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "negative number of components"
        );
    }

    // ---------- Name / Cloneable / Printable / Equality ----------

    public clone(): Name {
        this.assertClassInvariant();

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

        const result = copy as Name;

        // postcondition: clone isEqual but not identical
        MethodFailedException.assert(
            result.isEqual(this),
            "clone not equal to original"
        );
        MethodFailedException.assert(
            result !== this,
            "clone must be a different object"
        );

        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        // precondition: delimiter must be valid
        IllegalArgumentException.assert(
            typeof delimiter === "string" &&
            delimiter.length === 1 &&
            delimiter !== ESCAPE_CHARACTER,
            "invalid delimiter"
        );

        this.assertClassInvariant();

        const raw: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const masked = this.getComponent(i);
            raw.push(AbstractName.unescape(masked));
        }
        const result = raw.join(delimiter);

        this.assertClassInvariant();
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        this.assertClassInvariant();

        const raw: string[] = [];
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const masked = this.getComponent(i);
            raw.push(AbstractName.unescape(masked));
        }
        const maskedForDefault = raw.map(r =>
            AbstractName.escapeForDelimiter(r, DEFAULT_DELIMITER)
        );
        const result = maskedForDefault.join(DEFAULT_DELIMITER);

        this.assertClassInvariant();
        return result;
    }

    public isEqual(other: Name): boolean {
        this.assertClassInvariant();
        const result = this.asDataString() === other.asDataString();
        this.assertClassInvariant();
        return result;
    }

    public getHashCode(): number {
        this.assertClassInvariant();

        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            const ch = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + ch;
            hash |= 0;
        }

        this.assertClassInvariant();
        return hash;
    }

    public isEmpty(): boolean {
        this.assertClassInvariant();
        const result = this.getNoComponents() === 0;
        this.assertClassInvariant();
        return result;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariant();
        return this.delimiter;
    }

    public concat(other: Name): void {
        this.assertClassInvariant();

        const otherData = other.asDataString();
        if (otherData === "") {
            this.assertClassInvariant();
            return;
        }

        const otherMaskedDefault = AbstractName.splitMasked(otherData, DEFAULT_DELIMITER);

        const oldNo = this.getNoComponents();
        for (const masked of otherMaskedDefault) {
            const raw = AbstractName.unescape(masked);
            const maskedForThis = AbstractName.escapeForDelimiter(raw, this.delimiter);
            this.append(maskedForThis);
        }

        // postcondition: number of components increased by at least 0
        MethodFailedException.assert(
            this.getNoComponents() >= oldNo,
            "concat did not increase number of components"
        );

        this.assertClassInvariant();
    }

    // ---------- abstract methods to be implemented by subclasses ----------

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
