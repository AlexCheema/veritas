import { VerifySTG } from './VerifySTG.js'; // Assuming VerifySTG is the modified smart contract
import {
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
} from 'o1js';

const useProof = false;

const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new VerifySTG(zkAppAddress); // Adjusted for VerifySTG smart contract
const deployTxn = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// Let's assume we have an array of hashes we want to check against the smart contract's preset field
const hashes = [Field(12345), Field(67890), Field(111213)]; // Example hashes

const txn1 = await Mina.transaction(senderAccount, () => {
  zkAppInstance.checkTransitions(hashes);
});
await txn1.prove();
await txn1.sign([senderKey]).send();

