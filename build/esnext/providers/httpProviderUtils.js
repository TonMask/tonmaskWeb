import BN from "bn.js";
import { base64ToBytes } from "../utils/utils";
const { Cell } = require("../boc/cell");
class ProviderError extends Error {
    result;
    constructor(message, result) {
        super(message);
        this.result = result;
    }
}
export class TonHttpProviderUtils {
    static parseObject(x) {
        const typeName = x["@type"];
        switch (typeName) {
            case "tvm.list":
            case "tvm.tuple":
                return x.elements.map(TonHttpProviderUtils.parseObject);
            case "tvm.cell":
                return Cell.oneFromBoc(base64ToBytes(x.bytes));
            case "tvm.stackEntryCell":
                return TonHttpProviderUtils.parseObject(x.cell);
            case "tvm.stackEntryTuple":
                return TonHttpProviderUtils.parseObject(x.tuple);
            case "tvm.stackEntryNumber":
                return TonHttpProviderUtils.parseObject(x.number);
            case "tvm.numberDecimal":
                return new BN(x.number, 10);
            default:
                throw new Error("unknown type " + typeName);
        }
    }
    /**
     * @param pair  {any[]}
     * @return {any}
     */
    static parseResponseStack(pair) {
        const typeName = pair[0];
        const value = pair[1];
        switch (typeName) {
            case "num":
                return new BN(value.replace(/0x/, ""), 16);
            case "list":
            case "tuple":
                return TonHttpProviderUtils.parseObject(value);
            case "cell":
                const contentBytes = base64ToBytes(value.bytes);
                return Cell.oneFromBoc(contentBytes);
            default:
                throw new Error("unknown type " + typeName);
        }
    }
    static parseResponse(result) {
        if (result.exit_code !== 0) {
            const err = new ProviderError(`Http provider parse response error ${JSON.stringify(result)}`, result);
            throw err;
        }
        const arr = result.stack.map(TonHttpProviderUtils.parseResponseStack);
        return arr.length === 1 ? arr[0] : arr;
    }
    static makeArg(arg) {
        if (arg instanceof BN || arg instanceof Number) {
            return ["num", arg];
        }
        else {
            throw new Error("unknown arg type " + arg);
        }
    }
    static makeArgs(args) {
        return args.map(this.makeArg);
    }
}
