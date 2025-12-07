import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);

        IllegalArgumentException.assert(
            source != null,
            "source array must not be null"
        );

        this.components = [...source];

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
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const result = this.components[i];

        this.assertClassInvariant();
        return result;
    }

    public setComponent(i: number, c: string): void {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const oldNo = this.components.length;

        this.components[i] = c;

        MethodFailedException.assert(
            this.components.length === oldNo && this.components[i] === c,
            "setComponent postcondition failed"
        );

        this.assertClassInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i <= this.components.length,
            "index out of bounds"
        );

        const oldNo = this.components.length;
        this.components.splice(i, 0, c);

        MethodFailedException.assert(
            this.components.length === oldNo + 1 &&
            this.components[i] === c,
            "insert postcondition failed"
        );

        this.assertClassInvariant();
    }

    public append(c: string): void {
        this.assertClassInvariant();

        const oldNo = this.components.length;
        this.components.push(c);

        MethodFailedException.assert(
            this.components.length === oldNo + 1 &&
            this.components[this.components.length - 1] === c,
            "append postcondition failed"
        );

        this.assertClassInvariant();
    }

    public remove(i: number): void {
        this.assertClassInvariant();

        IllegalArgumentException.assert(
            Number.isInteger(i) && i >= 0 && i < this.components.length,
            "index out of bounds"
        );

        const oldNo = this.components.length;
        this.components.splice(i, 1);

        MethodFailedException.assert(
            this.components.length === oldNo - 1,
            "remove postcondition failed"
        );

        this.assertClassInvariant();
    }

    public concat(other: Name): void {
        super.concat(other);
    }
}
