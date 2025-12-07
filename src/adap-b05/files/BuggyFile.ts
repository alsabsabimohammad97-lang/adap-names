import { File } from "./File";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";

export class BuggyFile extends File {

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    /**
     * Fault injection for homework
     * @returns base name, here always ""
     */
    protected doGetBaseName(): string {
        // Inject the fault:
        this.baseName = "";

        // This invalid state MUST trigger test failure
        InvalidStateException.assert(false, "BuggyFile produced invalid basename");

        return super.doGetBaseName();
    }
}
