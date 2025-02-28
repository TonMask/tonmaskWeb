"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftItem = void 0;
const cell_1 = require("../../../boc/cell");
const contract_1 = require("../../contract");
const nftContractDao_1 = require("./nftContractDao");
const utils_1 = require("./utils");
// https://github.com/ton-blockchain/token-contract/blob/1ad314a98d20b41241d5329e1786fc894ad811de/nft/nft-item.fc
const NFT_ITEM_CODE_HEX = "B5EE9C7241020D010001D0000114FF00F4A413F4BCF2C80B0102016202030202CE04050009A11F9FE00502012006070201200B0C02D70C8871C02497C0F83434C0C05C6C2497C0F83E903E900C7E800C5C75C87E800C7E800C3C00812CE3850C1B088D148CB1C17CB865407E90350C0408FC00F801B4C7F4CFE08417F30F45148C2EA3A1CC840DD78C9004F80C0D0D0D4D60840BF2C9A884AEB8C097C12103FCBC20080900113E910C1C2EBCB8536001F65135C705F2E191FA4021F001FA40D20031FA00820AFAF0801BA121945315A0A1DE22D70B01C300209206A19136E220C2FFF2E192218E3E821005138D91C85009CF16500BCF16712449145446A0708010C8CB055007CF165005FA0215CB6A12CB1FCB3F226EB39458CF17019132E201C901FB00104794102A375BE20A00727082108B77173505C8CBFF5004CF1610248040708010C8CB055007CF165005FA0215CB6A12CB1FCB3F226EB39458CF17019132E201C901FB000082028E3526F0018210D53276DB103744006D71708010C8CB055007CF165005FA0215CB6A12CB1FCB3F226EB39458CF17019132E201C901FB0093303234E25502F003003B3B513434CFFE900835D27080269FC07E90350C04090408F80C1C165B5B60001D00F232CFD633C58073C5B3327B5520BF75041B";
class NftItem extends contract_1.Contract {
    constructor(provider, options) {
        options.wc = 0;
        options.code = options.code || cell_1.Cell.oneFromBoc(NFT_ITEM_CODE_HEX);
        super(provider, options);
    }
    /**
     * @override
     * @private
     * @return {Cell} cell contains nft data
     */
    createDataCell() {
        const cell = new cell_1.Cell();
        cell.bits.writeUint(this.options.index, 64);
        cell.bits.writeAddress(this.options.collectionAddress);
        return cell;
    }
    /**
     * @return {Promise<{isInitialized: boolean, index: number, itemIndex: BN, collectionAddress: Address|null, ownerAddress: Address|null, contentCell: Cell, contentUri: string|null}>}
     */
    getData = async () => {
        const myAddress = await this.getAddress();
        const dao = new nftContractDao_1.NftContractDao(this.provider, myAddress);
        return dao.getData();
    };
    createTransferBody = utils_1.nftTransferBody;
    createGetStaticDataBody = utils_1.nftGetStaticDataBody;
    /**
     * for single nft without collection
     * @return {Promise<{royalty: number, royaltyFactor: number, royaltyBase: number, royaltyAddress: Address}>}
     */
    async getRoyaltyParams() {
        const myAddress = await this.getAddress();
        const dao = new nftContractDao_1.NftContractDao(this.provider, myAddress);
        return dao.getRoyaltyParams();
    }
}
exports.NftItem = NftItem;
