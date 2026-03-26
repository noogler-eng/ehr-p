/**
 * Blockchain Service
 * Simulates blockchain functionality using MongoDB as a ledger.
 * Generates realistic transaction hashes and maintains a blockchain-like ledger.
 */
/**
 * Generates a realistic-looking Ethereum-style transaction hash
 * @returns string - 66 character hex string starting with '0x'
 */
export declare function generateTxHash(): string;
/**
 * Records a new transaction in the blockchain ledger
 *
 * @param from - Wallet address initiating the transaction
 * @param action - Type of action being performed
 * @param recordId - MongoDB ObjectId of the related EHR record
 * @param data - Additional transaction data
 * @returns Promise<string> - Transaction hash
 */
export declare function createBlockchainTransaction(from: string, action: 'CREATE_RECORD' | 'UPDATE_RECORD' | 'GRANT_ACCESS' | 'REVOKE_ACCESS', recordId?: any, data?: any): Promise<string>;
/**
 * Retrieves transaction details from the blockchain ledger
 *
 * @param txHash - Transaction hash to lookup
 * @returns Promise<object | null> - Transaction details or null if not found
 */
export declare function getTransaction(txHash: string): Promise<(import("mongoose").Document<unknown, {}, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: import("mongoose").Types.ObjectId | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: import("mongoose").Types.ObjectId | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}) | null>;
/**
 * Retrieves all transactions for a specific wallet address
 *
 * @param walletAddress - User's wallet address
 * @returns Promise<Array> - Array of transactions
 */
export declare function getTransactionsByWallet(walletAddress: string): Promise<(import("mongoose").Document<unknown, {}, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: import("mongoose").Types.ObjectId | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: import("mongoose").Types.ObjectId | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
/**
 * Retrieves recent transactions from the blockchain ledger
 *
 * @param limit - Number of transactions to retrieve
 * @returns Promise<Array> - Array of recent transactions
 */
export declare function getRecentTransactions(limit?: number): Promise<(import("mongoose").Document<unknown, {}, {
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: import("mongoose").Types.ObjectId | null;
}, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<{
    txHash: string;
    timestamp: NativeDate;
    blockNumber: number;
    status: "pending" | "confirmed" | "failed";
    action?: "CREATE_RECORD" | "UPDATE_RECORD" | "GRANT_ACCESS" | "REVOKE_ACCESS" | null;
    from?: string | null;
    to?: string | null;
    data?: any;
    gasUsed?: number | null;
    recordId?: import("mongoose").Types.ObjectId | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
})[]>;
/**
 * Simulates granting access to a doctor for viewing patient records
 *
 * @param patientAddress - Patient's wallet address
 * @param doctorAddress - Doctor's wallet address
 * @param recordId - EHR record ID
 * @returns Promise<string> - Transaction hash
 */
export declare function grantAccess(patientAddress: string, doctorAddress: string, recordId: any): Promise<string>;
/**
 * Simulates revoking access from a doctor
 *
 * @param patientAddress - Patient's wallet address
 * @param doctorAddress - Doctor's wallet address
 * @param recordId - EHR record ID
 * @returns Promise<string> - Transaction hash
 */
export declare function revokeAccess(patientAddress: string, doctorAddress: string, recordId: any): Promise<string>;
//# sourceMappingURL=blockchainService.d.ts.map