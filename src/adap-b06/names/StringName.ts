import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        IllegalArgumentException.assert(source != null);
        this.name = source;

        let count = source === "" ? 0 : 1;
        for (let i = 0; i < source.length; i++) {
            if (source[i] === ESCAPE_CHARACTER) i++;
            else if (source[i] === delimiter) count++;
        }
        this.noComponents = count;
    }

    getNoComponents(): number {
        return this.noComponents;
    }

    getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents);
        return this.name.split(this.delimiter)[i];
    }
    setComponent(i: number, c: string): Name {
        const parts = this.name.split(this.delimiter);
        parts[i] = c;
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }
   public getDelimiterCharacter(): string {
    return this.delimiter;
      }

    insert(i: number, c: string): Name {
        const parts = this.name === "" ? [] : this.name.split(this.delimiter);
        parts.splice(i, 0, c);
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }
    append(c: string): Name {
        return this.name === ""
            ? new StringName(c, this.delimiter)
            : new StringName(this.name + this.delimiter + c, this.delimiter);
    }
    remove(i: number): Name {
        const parts = this.name.split(this.delimiter);
        parts.splice(i, 1);
        return new StringName(parts.join(this.delimiter), this.delimiter);
    }
}
