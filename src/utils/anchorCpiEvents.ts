import { BorshEventCoder, Event, EventCoder, web3 } from "@coral-xyz/anchor";
import { IDL } from "../idl/perpetuals";
import { base64, bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";


export function getAndValidateEvent(
    previousProgram: web3.PublicKey,
    currentProgram: web3.PublicKey,
    eventAuthority: web3.PublicKey,
    eventCoder: EventCoder,
    ixData: Buffer
  ): Event {
    // CHECK 1: Event tag
    let eventTag = Buffer.from(
      [0x1d, 0x9a, 0xcb, 0x51, 0x2e, 0xa5, 0x45, 0xe4].reverse()
    );
    if (!ixData.slice(0, 8).equals(eventTag)) {
      throw new Error("Invalid CPI Event: Event tag mismatch");
    }
    // console.log("ixData.slice(0, 8):",ixData.slice(0, 8))
  
    // CHECK 2: Previous program's ID must match current program's ID
    // if (previousProgram.toString() !== currentProgram.toString()) {
    //   throw new Error("Invalid CPI Event: Program ID mismatch");
    // }
  
    // CHECK 3: The first account meta must be the event authority,
    //          derived from the seed's `__event_authority` and the
    //          current program's ID
    let expectedAuthority = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("__event_authority")],
      currentProgram
    )[0];
    if (expectedAuthority.toString() !== eventAuthority.toString()) {
      throw new Error("Invalid CPI Event: Event authority does not match");
    }
  
    // CHECK 4: The current program must have an Anchor IDL
    //          associated with it (implicit)
    let event = eventCoder.decode(base64.encode(ixData.slice(8)));
    if (!event) {
      throw new Error("Invalid CPI Event: Failed to decode event");
    }
    return event;
  }

export const getCpiEventsFromTransaction = async (response: web3.VersionedTransactionResponse) : Promise<Event[]> => {
    let instructions = response.transaction.message.compiledInstructions;
    let innerInstructions = response.meta.innerInstructions;
  
    let accounts: web3.PublicKey[] =
      response.transaction.message.staticAccountKeys
        .concat(response.meta.loadedAddresses.writable ?? [])
        .concat(response.meta.loadedAddresses.readonly ?? []);
  
    let eventCoder = new BorshEventCoder(IDL);
    const events : Event[] = []
  
    for (const packet of innerInstructions) {
      let previousProgram = accounts[instructions[packet.index].programIdIndex];
      packet.instructions.forEach((instruction, indexofInnerIns) => {
        // console.log("instruction:",instruction)
        // console.log(">> indexofInnerIns:",indexofInnerIns)
        let bytes = bs58.decode(instruction.data);
  
        let currentProgram = accounts[instruction.programIdIndex];
        let eventAuthority = accounts[instruction.accounts[0]];
        try {
          let event = getAndValidateEvent(
            previousProgram,
            currentProgram,
            eventAuthority,
            eventCoder,
            bytes
          );
          events.push(event);
        //   console.log("currentProgram, event:",currentProgram.toBase58(), event)
        } catch (err) {
          // console.error("getCpiEventsFromTransaction error:",err);
        }
        // previousProgram = accounts[instruction.programIdIndex];// not sure why he kept this 
      });
    }
    return events;
  }