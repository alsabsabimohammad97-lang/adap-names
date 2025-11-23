import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
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
        if (this.name === "") throw new RangeError(`Index out of bounds: ${i}`);

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

        if (!Number.isInteger(i) || i < 0 || i >= parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        return parts[i];
    }

    public setComponent(i: number, c: string): void {
        if (this.noComponents === 0) throw new RangeError(`Index out of bounds: ${i}`);

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

        if (!Number.isInteger(i) || i < 0 || i > parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        parts.splice(i, 0, c);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public append(c: string): void {
        if (this.name === "") {
            this.name = c;
            this.noComponents = 1;
        } else {
            this.name += this.delimiter + c;
            this.noComponents += 1;
        }
    }

    public remove(i: number): void {
        if (this.noComponents === 0) throw new RangeError(`Index out of bounds: ${i}`);

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

        if (!Number.isInteger(i) || i < 0 || i >= parts.length) {
            throw new RangeError(`Index out of bounds: ${i}`);
        }
        parts.splice(i, 1);
        this.name = parts.join(this.delimiter);
        this.noComponents = parts.length;
    }

    public concat(other: Name): void {
        super.concat(other);
        this.noComponents = this.getNoComponents();
    }
}
