/**
 * Blockchain Service
 * Simulates blockchain functionality using MongoDB as a ledger.
 * Generates realistic transaction hashes and maintains a blockchain-like ledger.
 */
import crypto from 'crypto';
import { BlockchainLedger } from '../models/Schemas.js';
/**
 * Generates a realistic-looking Ethereum-style transaction hash
 * @returns string - 66 character hex string starting with '0x'
 */
export function generateTxHash() {
    const randomBytes = crypto.randomBytes(32);
    return '0x' + randomBytes.toString('hex');
}
/**
 * Generates a simulated gas amount for the transaction
 * @returns number - Simulated gas used
 */
function generateGasUsed() {
    return Math.floor(Math.random() * 100000) + 21000;
}
/**
 * Gets the current block number from the ledger
 * @returns Promise<number> - Next block number
 */
async function getNextBlockNumber() {
    try {
        const latestBlock = await BlockchainLedger
            .findOne()
            .sort({ blockNumber: -1 })
            .select('blockNumber');
        return latestBlock ? latestBlock.blockNumber + 1 : 1;
    }
    catch (error) {
        console.error('Error getting block number:', error);
        return 1;
    }
}
/**
 * Records a new transaction in the blockchain ledger
 *
 * @param from - Wallet address initiating the transaction
 * @param action - Type of action being performed
 * @param recordId - MongoDB ObjectId of the related EHR record
 * @param data - Additional transaction data
 * @returns Promise<string> - Transaction hash
 */
export async function createBlockchainTransaction(from, action, recordId, data) {
    try {
        const txHash = generateTxHash();
        const blockNumber = await getNextBlockNumber();
        const gasUsed = generateGasUsed();
        await BlockchainLedger.create({
            txHash,
            blockNumber,
            timestamp: new Date(),
            from,
            to: '0x' + crypto.randomBytes(20).toString('hex'), // Simulated contract address
            recordId,
            action,
            data,
            gasUsed,
            status: 'confirmed'
        });
        console.log(`Blockchain transaction created: ${txHash} (Block #${blockNumber})`);
        return txHash;
    }
    catch (error) {
        console.error('Error creating blockchain transaction:', error);
        throw new Error('Failed to record transaction in blockchain ledger');
    }
}
/**
 * Retrieves transaction details from the blockchain ledger
 *
 * @param txHash - Transaction hash to lookup
 * @returns Promise<object | null> - Transaction details or null if not found
 */
export async function getTransaction(txHash) {
    try {
        const transaction = await BlockchainLedger
            .findOne({ txHash })
            .populate('recordId');
        return transaction;
    }
    catch (error) {
        console.error('Error fetching transaction:', error);
        return null;
    }
}
/**
 * Retrieves all transactions for a specific wallet address
 *
 * @param walletAddress - User's wallet address
 * @returns Promise<Array> - Array of transactions
 */
export async function getTransactionsByWallet(walletAddress) {
    try {
        const transactions = await BlockchainLedger
            .find({ from: walletAddress })
            .sort({ timestamp: -1 })
            .populate('recordId');
        return transactions;
    }
    catch (error) {
        console.error('Error fetching wallet transactions:', error);
        return [];
    }
}
/**
 * Retrieves recent transactions from the blockchain ledger
 *
 * @param limit - Number of transactions to retrieve
 * @returns Promise<Array> - Array of recent transactions
 */
export async function getRecentTransactions(limit = 10) {
    try {
        const transactions = await BlockchainLedger
            .find()
            .sort({ blockNumber: -1, timestamp: -1 })
            .limit(limit)
            .populate('recordId');
        return transactions;
    }
    catch (error) {
        console.error('Error fetching recent transactions:', error);
        return [];
    }
}
/**
 * Simulates granting access to a doctor for viewing patient records
 *
 * @param patientAddress - Patient's wallet address
 * @param doctorAddress - Doctor's wallet address
 * @param recordId - EHR record ID
 * @returns Promise<string> - Transaction hash
 */
export async function grantAccess(patientAddress, doctorAddress, recordId) {
    const txHash = await createBlockchainTransaction(patientAddress, 'GRANT_ACCESS', recordId, { grantedTo: doctorAddress, timestamp: new Date() });
    return txHash;
}
/**
 * Simulates revoking access from a doctor
 *
 * @param patientAddress - Patient's wallet address
 * @param doctorAddress - Doctor's wallet address
 * @param recordId - EHR record ID
 * @returns Promise<string> - Transaction hash
 */
export async function revokeAccess(patientAddress, doctorAddress, recordId) {
    const txHash = await createBlockchainTransaction(patientAddress, 'REVOKE_ACCESS', recordId, { revokedFrom: doctorAddress, timestamp: new Date() });
    return txHash;
}
//# sourceMappingURL=blockchainService.js.map