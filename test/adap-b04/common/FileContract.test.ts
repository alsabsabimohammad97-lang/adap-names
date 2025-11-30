import { describe, it, expect, beforeEach } from "vitest";
import { Directory } from '../../../src/adap-b04/files/Directory';
import { RootNode } from '../../../src/adap-b04/files/RootNode';
import { Link } from '../../../src/adap-b04/files/Link';
import { Node } from '../../../src/adap-b04/files/Node';
import { File } from '../../../src/adap-b04/files/File';
import { IllegalArgumentException } from '../../../src/adap-b04/common/IllegalArgumentException';

// Helper class for testing
class FileContract extends Node {
    constructor(name: string, parent: Directory) {
        super(name, parent);
    }
}

describe("FileSystem Node Tests", () => {

    let root: RootNode;
    let dirA: Directory;
    let dirB: Directory;
    let file1: File;
    let link1: Link;

    beforeEach(() => {
        root = RootNode.getRootNode();
        dirA = new Directory("dirA", root);
        dirB = new Directory("dirB", root);
        file1 = new File("file1", dirA);
        link1 = new Link("link1", dirA, file1);
    });

    // ---------------- Directory ----------------
    it("Directory addChildNode precondition: null should throw", () => {
        expect(() => dirA.addChildNode(null as unknown as Node)).toThrow(IllegalArgumentException);
    });

    it("Directory add/remove child nodes", () => {
        const node = new FileContract("node1", dirA);
        expect(dirA.hasChildNode(node)).toBe(true);
        dirA.removeChildNode(node);
        expect(dirA.hasChildNode(node)).toBe(false);
    });

    // ---------------- File ----------------
    it("File open/close/read states", () => {
        expect(() => file1.read(1)).toThrow(IllegalArgumentException); // must be open
        file1.open();
        expect(() => file1.open()).toThrow(IllegalArgumentException); // already open
        const data = file1.read(5);
        expect(data.length).toBe(5);
        expect(() => file1.read(-1)).toThrow(IllegalArgumentException); // negative bytes
        file1.close();
        expect(() => file1.close()).toThrow(IllegalArgumentException); // already closed
    });

    // ---------------- Node ----------------
    it("Node move and rename", () => {
        const node = new FileContract("nodeMove", dirA);
        node.move(dirB);
        expect(node.getParentNode()).toBe(dirB);
        node.rename("newName");
        expect(node.getBaseName()).toBe("newName");
        expect(() => node.rename(null as unknown as string)).toThrow(IllegalArgumentException);
        expect(() => node.move(null as unknown as Directory)).toThrow(IllegalArgumentException);
    });

    // ---------------- Link ----------------
    it("Link get/set targetNode precondition", () => {
        const newFile = new File("newFile", dirB);
        expect(() => link1.setTargetNode(null as unknown as Node)).toThrow(IllegalArgumentException);
        link1.setTargetNode(newFile);
        expect(link1.getTargetNode()).toBe(newFile);
    });

    it("Link getBaseName and rename redirects to target", () => {
        const targetFile = new File("targetFile", dirA);
        const link = new Link("linkToTarget", dirA, targetFile);
        expect(link.getBaseName()).toBe("targetFile");
        link.rename("renamedFile");
        expect(targetFile.getBaseName()).toBe("renamedFile");
    });

    // ---------------- RootNode ----------------
    it("RootNode operations", () => {
        const rootNode = RootNode.getRootNode();
        expect(rootNode.getFullName().toString()).toBe(""); // empty StringName
        rootNode.move(dirA); // no effect
        rootNode.rename("newRoot"); // no effect
        expect(rootNode.getFullName().toString()).toBe("");
    });

});