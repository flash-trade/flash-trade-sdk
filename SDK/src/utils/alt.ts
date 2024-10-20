import {
  AddressLookupTableProgram,
  Connection,
  PublicKey,
} from '@solana/web3.js';

export async function createLookupTable(authority: PublicKey, payer: PublicKey, connection: Connection) {
    const [lookupTableInst, lookUpTableAddress] =
      AddressLookupTableProgram.createLookupTable({
        authority,
        payer,
        recentSlot: await connection.getSlot(),
      });
  
    return {
      lookupTableInst,
      lookUpTableAddress
    };
  }
  
  export async function addAddressesToTable(authority: PublicKey, payer: PublicKey, lookUpTableAddress: PublicKey, addressesToAdd: PublicKey[]) {
    const addAddressesInstruction = AddressLookupTableProgram.extendLookupTable({
        payer,
        authority,
        lookupTable: lookUpTableAddress,
        addresses: addressesToAdd,
    });
  
    return addAddressesInstruction;
  }

  export async function getAddressesInTable(connection :Connection,lookUpTableAddress: PublicKey) {
    const lookupTableAccount = (await connection.getAddressLookupTable(lookUpTableAddress))

    if (!lookupTableAccount.value) return;

    return lookupTableAccount.value.state.addresses;
  }