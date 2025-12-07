import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);

        IllegalArgumentException.assert(
            source != null,
            "source string must not be null"
        );

        this.name = source ?? "";

        const s = this.name;
        if (s.length === 0) {
            this.noComponents = 0;
        } else {
            let count = 1;
            for (let i = 0; i < s.length; i++) {
                const ch = s[i];
                if (ch === ESCAPE_CHARACTER) {
                    if (i + 1 < s.length) {
                        i++;
                    }
                } else if (ch === this.delimiter) {
                    count++;
                }
            }
            this.noComponents = count;
        }

        this.assertClassInvariant();
    }

    public clone(): Name {
        return super.clone();
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of bounds"
        );

        const parts: string[] = [];
        let cur = "";
        for (let k = 0; k < this.name.length; k++) {
            const ch = this.name[k];
            if (ch === ESCAPE_CHARACTER) {
                if (k + 1 < this.name.length) {
                    cur += this.name[++k];
                } else {
                    cur += ESCAPE_CHARACTER;
                }
            } else if (ch === this.delimiter) {
                parts.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);

        const result = parts[i];

        this.assertClassInvariant();
        return result;
    }

    public setComponent(i: number, c: string): void {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of bounds"
        );

        const parts: string[] = [];
        let cur = "";
        for (let k = 0; k < this.name.length; k++) {
            const ch = this.name[k];
            if (ch === ESCAPE_CHARACTER) {
                if (k + 1 < this.name.length) {
                    cur += this.name[++k];
                } else {
                    cur += ESCAPE_CHARACTER;
                }
            } else if (ch === this.delimiter) {
                parts.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);

        const oldNo = parts.length;

        parts[i] = c;
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;

        MethodFailedException.assert(
            this.noComponents === oldNo &&
            this.getComponent(i) === c,
            "setComponent postcondition failed"
        );

        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.noComponents,
            "index out of bounds"
        );

        const parts: string[] = [];
        if (this.name !== "") {
            let cur = "";
            for (let k = 0; k < this.name.length; k++) {
                const ch = this.name[k];
                if (ch === ESCAPE_CHARACTER) {
                    if (k + 1 < this.name.length) {
                        cur += this.name[++k];
                    } else {
                        cur += ESCAPE_CHARACTER;
                    }
                } else if (ch === this.delimiter) {
                    parts.push(cur);
                    cur = "";
                } else {
                    cur += ch;
                }
            }
            parts.push(cur);
        }

        const oldNo = parts.length;

        parts.splice(i, 0, c);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;

        MethodFailedException.assert(
            this.noComponents === oldNo + 1 &&
            this.getComponent(i) === c,
            "insert postcondition failed"
        );

        this.assertClassInvariant();
    }

    public append(c: string): void {
        this.assertClassInvariant();

        const oldNo = this.noComponents;

        if (this.name === "") {
            this.name = c;
            this.noComponents = 1;
        } else {
            this.name += this.delimiter + c;
            this.noComponents += 1;
        }

        MethodFailedException.assert(
            this.noComponents === oldNo + 1 &&
            this.getComponent(this.noComponents - 1) === c,
            "append postcondition failed"
        );

        this.assertClassInvariant();
    }

    public remove(i: number): void {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.noComponents,
            "index out of bounds"
        );

        const parts: string[] = [];
        let cur = "";
        for (let k = 0; k < this.name.length; k++) {
            const ch = this.name[k];
            if (ch === ESCAPE_CHARACTER) {
                if (k + 1 < this.name.length) {
                    cur += this.name[++k];
                } else {
                    cur += ESCAPE_CHARACTER;
                }
            } else if (ch === this.delimiter) {
                parts.push(cur);
                cur = "";
            } else {
                cur += ch;
            }
        }
        parts.push(cur);

        const oldNo = parts.length;

        parts.splice(i, 1);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;

        MethodFailedException.assert(
            this.noComponents === oldNo - 1,
            "remove postcondition failed"
        );

        this.assertClassInvariant();
    }

    public concat(other: Name): void {
        const oldNo = this.noComponents;
        super.concat(other);
        MethodFailedException.assert(
            this.noComponents >= oldNo,
            "concat postcondition failed"
        );
    }
}
