import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected readonly components: readonly string[];
    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);
        IllegalArgumentException.assert(source != null);
        this.components = [...source];
    }
    getNoComponents(): number {
        return this.components.length;
    }
    getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length);
        return this.components[i];
    }
    setComponent(i: number, c: string): Name {
        const copy = [...this.components];
        copy[i] = c;
        return new StringArrayName(copy, this.delimiter);
    }
    insert(i: number, c: string): Name {
        const copy = [...this.components];
        copy.splice(i, 0, c);
        return new StringArrayName(copy, this.delimiter);
    }
    append(c: string): Name {
        return new StringArrayName([...this.components, c], this.delimiter);
    }
    remove(i: number): Name {
        const copy = [...this.components];
        copy.splice(i, 1);
        return new StringArrayName(copy, this.delimiter);
    }
}
