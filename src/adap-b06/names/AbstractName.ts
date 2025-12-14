import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            typeof delimiter === "string" &&
            delimiter.length === 1 &&
            delimiter !== ESCAPE_CHARACTER,
            "invalid delimiter"
        );
        this.delimiter = delimiter;
    }

    protected assertClassInvariant(): void {
        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "negative number of components"
        );
    }

    protected static unescape(masked: string): string {
        let out = "";
        for (let i = 0; i < masked.length; i++) {
            if (masked[i] === ESCAPE_CHARACTER && i + 1 < masked.length) {
                out += masked[++i];
            } else {
                out += masked[i];
            }
        }
        return out;
    }

    protected static escape(raw: string, delimiter: string): string {
        let out = "";
        for (const ch of raw) {
            if (ch === ESCAPE_CHARACTER || ch === delimiter) {
                out += ESCAPE_CHARACTER;
            }
            out += ch;
        }
        return out;
    }

    clone(): Name {
        return this; // immutable value object
    }

    isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }
    asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER
        );
        const parts = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(AbstractName.unescape(this.getComponent(i)));
        }
        return parts.join(delimiter);
    }
    asDataString(): string {
        const parts = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(
                AbstractName.escape(
                    AbstractName.unescape(this.getComponent(i)),
                    DEFAULT_DELIMITER
                )
            );
        }
        return parts.join(DEFAULT_DELIMITER);
    }
    isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString();
    }
    getHashCode(): number {
        const s = this.asDataString();
        let h = 0;
        for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
        return h;
    }
    concat(other: Name): Name {
        let result: Name = this;
        for (let i = 0; i < other.getNoComponents(); i++) {
            result = result.append(other.getComponent(i));
        }
        return result;
    }
    getDelimiterCharacter(): string {
    this.assertClassInvariant();
    return this.delimiter;
}

    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;
    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

}
