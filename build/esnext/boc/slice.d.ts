import BN from "bn.js";
import Address from "../utils/address";
import { BitString } from "./bitString";
import { Cell } from "./cell";
/**
 * A partial view of a TVM cell, used for parsing data from Cells.
 */
export declare class Slice {
    array: Uint8Array;
    length: number;
    readCursor: number;
    refs: Slice[];
    refCursor: number;
    /**
     * @param array {Uint8Array}
     * @param length {number} length in bits
     * @param refs {Slice[]} child cells
     */
    constructor(array: Uint8Array, length: number, refs: Slice[]);
    /**
     * @return {number}
     */
    getFreeBits(): number;
    getFreeRefs(): number;
    /**
     * @private
     * @param n {number}
     */
    checkRange(n: number): void;
    /**
     * @private
     * @param n {number}
     * @return {boolean}    bit value at position `n`
     */
    get(n: number): boolean;
    readUnaryLength(): number;
    readRemaining(): BitString;
    /**
     * @return {boolean}   read bit
     */
    loadBit(): boolean;
    /**
     * @param bitLength {number}
     * @return {Uint8Array}
     */
    loadBits(bitLength: number): Uint8Array;
    /**
     * Reads unsigned int
     *
     * @param {number} bitLength Size of uint in bits
     * @returns {BN} number
     */
    loadUint(bitLength: number): BN;
    /**
     * Reads signed int
     *
     * @param {number} bitLength Size of uint in bits
     * @returns {BN} number
     */
    loadInt(bitLength: number): BN;
    /**
     * @param bitLength {number}
     * @return {BN}
     */
    loadVarUint(bitLength: number): BN;
    /**
     * @return {BN}
     */
    loadCoins(): BN;
    loadAddress(): Address | null;
    /**
     * @return {Slice}
     */
    loadRef(): Slice;
    readCell: () => Cell;
    readOptDict: <T>(keySize: number, extractor: (slice: Slice) => T) => Map<string, T> | null;
    readDict: <T>(keySize: number, extractor: (slice: Slice) => T) => Map<string, T>;
    toCell(): Cell;
}
