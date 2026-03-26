import { FileCode2, Shield, Blocks, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

const CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EHRRegistry
 * @dev Smart contract for managing Electronic Health Records
 *      on the Ethereum blockchain. Provides immutable record
 *      tracking and granular access control.
 *
 * @notice Deployed on Ethereum Mainnet
 * @author Secure EHR Team
 */
contract EHRRegistry {

    // ==================== STATE ====================

    struct Record {
        string mongoId;      // Reference to off-chain MongoDB document
        address owner;       // Patient wallet address (record owner)
        uint256 timestamp;   // Block timestamp of creation
        bool exists;         // Existence flag for validation
    }

    // Record storage: mongoId => Record
    mapping(string => Record) private records;

    // Access control: owner => doctor => isAllowed
    mapping(address => mapping(address => bool)) private permissions;

    // Record count per patient
    mapping(address => uint256) private recordCount;

    // Total records in the system
    uint256 public totalRecords;

    // ==================== EVENTS ====================

    event RecordAdded(
        string indexed mongoId,
        address indexed owner,
        uint256 timestamp
    );

    event AccessGranted(
        address indexed owner,
        address indexed doctor,
        uint256 timestamp
    );

    event AccessRevoked(
        address indexed owner,
        address indexed doctor,
        uint256 timestamp
    );

    // ==================== MODIFIERS ====================

    modifier onlyRecordOwner(string memory _mongoId) {
        require(records[_mongoId].exists, "Record does not exist");
        require(
            records[_mongoId].owner == msg.sender,
            "Only record owner can perform this action"
        );
        _;
    }

    // ==================== CORE FUNCTIONS ====================

    /**
     * @dev Register a new medical record on the blockchain
     * @param _mongoId The MongoDB document ID for off-chain data
     */
    function addRecord(string memory _mongoId) public {
        require(!records[_mongoId].exists, "Record already exists");

        records[_mongoId] = Record({
            mongoId: _mongoId,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        recordCount[msg.sender]++;
        totalRecords++;

        emit RecordAdded(_mongoId, msg.sender, block.timestamp);
    }

    /**
     * @dev Grant a doctor access to view patient records
     * @param _doctor The doctor's wallet address
     */
    function grantAccess(address _doctor) public {
        require(_doctor != address(0), "Invalid doctor address");
        require(_doctor != msg.sender, "Cannot grant access to yourself");

        permissions[msg.sender][_doctor] = true;

        emit AccessGranted(msg.sender, _doctor, block.timestamp);
    }

    /**
     * @dev Revoke a doctor's access to view patient records
     * @param _doctor The doctor's wallet address
     */
    function revokeAccess(address _doctor) public {
        require(
            permissions[msg.sender][_doctor],
            "Doctor does not have access"
        );

        permissions[msg.sender][_doctor] = false;

        emit AccessRevoked(msg.sender, _doctor, block.timestamp);
    }

    // ==================== VIEW FUNCTIONS ====================

    /**
     * @dev Check if a doctor has access to a patient's records
     * @param _owner The patient's wallet address
     * @param _doctor The doctor's wallet address
     * @return bool Whether the doctor has access
     */
    function hasAccess(
        address _owner,
        address _doctor
    ) public view returns (bool) {
        if (_owner == _doctor) return true;
        return permissions[_owner][_doctor];
    }

    /**
     * @dev Get record details by MongoDB ID
     * @param _mongoId The MongoDB document ID
     * @return owner The record owner's address
     * @return timestamp The creation timestamp
     * @return exists Whether the record exists
     */
    function getRecord(string memory _mongoId)
        public view returns (
            address owner,
            uint256 timestamp,
            bool exists
        )
    {
        Record memory r = records[_mongoId];
        return (r.owner, r.timestamp, r.exists);
    }

    /**
     * @dev Get the number of records for a patient
     * @param _patient The patient's wallet address
     * @return uint256 Number of records
     */
    function getRecordCount(address _patient)
        public view returns (uint256)
    {
        return recordCount[_patient];
    }
}`;

const CONTRACT_ABI = `[
  {
    "inputs": [{"type": "string", "name": "_mongoId"}],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "_doctor"}],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "_doctor"}],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"type": "address", "name": "_owner"},
      {"type": "address", "name": "_doctor"}
    ],
    "name": "hasAccess",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "string", "name": "_mongoId"}],
    "name": "getRecord",
    "outputs": [
      {"type": "address", "name": "owner"},
      {"type": "uint256", "name": "timestamp"},
      {"type": "bool", "name": "exists"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "type": "string", "name": "mongoId"},
      {"indexed": true, "type": "address", "name": "owner"},
      {"indexed": false, "type": "uint256", "name": "timestamp"}
    ],
    "name": "RecordAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "type": "address", "name": "owner"},
      {"indexed": true, "type": "address", "name": "doctor"},
      {"indexed": false, "type": "uint256", "name": "timestamp"}
    ],
    "name": "AccessGranted",
    "type": "event"
  }
]`;

export const SmartContract = () => {
  const [activeTab, setActiveTab] = useState<"code" | "abi" | "details">("code");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(activeTab === "abi" ? CONTRACT_ABI : CONTRACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Smart <span className="text-zinc-500">Contract</span>
          </h1>
          <p className="text-zinc-600 text-xs font-bold mt-1 uppercase tracking-widest">
            EHRRegistry.sol — Solidity v0.8.20 — Verified & Published
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
          <FileCode2 size={24} className="text-zinc-500" />
        </div>
      </div>

      {/* Contract Info Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Contract Address</p>
            <p className="text-xs font-mono text-zinc-400 break-all">{contractAddress}</p>
          </div>
          <div>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Network</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <p className="text-xs font-bold text-white">Ethereum Mainnet</p>
            </div>
          </div>
          <div>
            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Compiler</p>
            <p className="text-xs font-bold text-zinc-400">Solidity v0.8.20 + Hardhat</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
          <InfoBadge icon={<Shield size={14} />} label="License" value="MIT" />
          <InfoBadge icon={<Blocks size={14} />} label="EVM Version" value="Shanghai" />
          <InfoBadge icon={<FileCode2 size={14} />} label="Optimization" value="200 runs" />
          <InfoBadge icon={<ExternalLink size={14} />} label="Verification" value="Verified" />
        </div>
      </div>

      {/* Code Tabs */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] overflow-hidden">
        {/* Tab Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800">
          <div className="flex gap-1">
            {[
              { id: "code" as const, label: "Contract Source" },
              { id: "abi" as const, label: "ABI / Interface" },
              { id: "details" as const, label: "Contract Details" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab !== "details" && (
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all text-[9px] font-bold"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
          {activeTab === "code" && (
            <pre className="text-[11px] font-mono leading-relaxed text-zinc-400 whitespace-pre overflow-x-auto">
              {CONTRACT_CODE.split("\n").map((line, i) => (
                <div key={i} className="flex hover:bg-zinc-800/30 transition-colors">
                  <span className="w-12 text-right pr-4 text-zinc-700 select-none shrink-0">{i + 1}</span>
                  <span className="flex-1">
                    {highlightSolidity(line)}
                  </span>
                </div>
              ))}
            </pre>
          )}

          {activeTab === "abi" && (
            <pre className="text-[11px] font-mono leading-relaxed text-zinc-400 whitespace-pre overflow-x-auto">
              {CONTRACT_ABI}
            </pre>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              <ContractFunction
                name="addRecord"
                description="Register a new medical record hash on the blockchain for immutable tracking"
                inputs={[{ name: "_mongoId", type: "string", desc: "MongoDB document ID" }]}
                outputs={[]}
                type="Write"
              />
              <ContractFunction
                name="grantAccess"
                description="Grant a healthcare provider access to view patient's medical records"
                inputs={[{ name: "_doctor", type: "address", desc: "Doctor's Ethereum wallet" }]}
                outputs={[]}
                type="Write"
              />
              <ContractFunction
                name="revokeAccess"
                description="Revoke a doctor's previously granted access to patient records"
                inputs={[{ name: "_doctor", type: "address", desc: "Doctor's Ethereum wallet" }]}
                outputs={[]}
                type="Write"
              />
              <ContractFunction
                name="hasAccess"
                description="Check if a doctor has permission to view a patient's records"
                inputs={[
                  { name: "_owner", type: "address", desc: "Patient's wallet" },
                  { name: "_doctor", type: "address", desc: "Doctor's wallet" },
                ]}
                outputs={[{ name: "", type: "bool", desc: "Access status" }]}
                type="Read"
              />
              <ContractFunction
                name="getRecord"
                description="Retrieve record metadata from the blockchain by MongoDB ID"
                inputs={[{ name: "_mongoId", type: "string", desc: "MongoDB document ID" }]}
                outputs={[
                  { name: "owner", type: "address", desc: "Record owner" },
                  { name: "timestamp", type: "uint256", desc: "Creation time" },
                  { name: "exists", type: "bool", desc: "Existence flag" },
                ]}
                type="Read"
              />
              <ContractFunction
                name="getRecordCount"
                description="Get total number of records for a patient address"
                inputs={[{ name: "_patient", type: "address", desc: "Patient's wallet" }]}
                outputs={[{ name: "", type: "uint256", desc: "Record count" }]}
                type="Read"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper components

const InfoBadge = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 bg-black/30 border border-zinc-800/50 rounded-xl p-3">
    <span className="text-zinc-600">{icon}</span>
    <div>
      <p className="text-[7px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-bold text-zinc-400">{value}</p>
    </div>
  </div>
);

const ContractFunction = ({
  name,
  description,
  inputs,
  outputs,
  type,
}: {
  name: string;
  description: string;
  inputs: { name: string; type: string; desc: string }[];
  outputs: { name: string; type: string; desc: string }[];
  type: "Read" | "Write";
}) => (
  <div className="bg-black/30 border border-zinc-800 rounded-2xl p-5">
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-sm font-black text-white font-mono">{name}()</h4>
      <span
        className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${
          type === "Write"
            ? "bg-white/10 border border-white/20 text-white"
            : "bg-zinc-800 border border-zinc-700 text-zinc-400"
        }`}
      >
        {type}
      </span>
    </div>
    <p className="text-[10px] text-zinc-500 mb-3">{description}</p>

    {inputs.length > 0 && (
      <div className="mb-3">
        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Inputs</p>
        {inputs.map((input, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] py-1">
            <span className="font-mono text-zinc-300">{input.name}</span>
            <span className="text-zinc-700">—</span>
            <span className="font-mono text-zinc-500">{input.type}</span>
            <span className="text-zinc-700 italic">{input.desc}</span>
          </div>
        ))}
      </div>
    )}

    {outputs.length > 0 && (
      <div>
        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">Returns</p>
        {outputs.map((output, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] py-1">
            <span className="font-mono text-zinc-300">{output.name || "—"}</span>
            <span className="text-zinc-700">—</span>
            <span className="font-mono text-zinc-500">{output.type}</span>
            <span className="text-zinc-700 italic">{output.desc}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

function highlightSolidity(line: string): React.ReactNode {
  // Simple syntax highlighting for Solidity
  const keywords = /\b(pragma|solidity|contract|struct|mapping|function|public|private|view|returns|require|emit|event|modifier|memory|indexed|bool|address|string|uint256|true|false)\b/g;
  const comments = /(\/\/.*$|\/\*\*|\*\/|\*\s)/;
  const strings = /(".*?")/g;

  if (comments.test(line)) {
    return <span className="text-zinc-600 italic">{line}</span>;
  }

  const parts = line.split(/(\/\/.*$|".*?"|'.*?'|\b(?:pragma|solidity|contract|struct|mapping|function|public|private|view|returns|require|emit|event|modifier|memory|indexed|bool|address|string|uint256|true|false)\b)/g);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("//")) return <span key={i} className="text-zinc-600 italic">{part}</span>;
    if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-zinc-300">{part}</span>;
    if (keywords.test(part)) {
      keywords.lastIndex = 0;
      return <span key={i} className="text-white font-semibold">{part}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}
