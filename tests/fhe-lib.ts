import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FheLib } from "../target/types/fhe_lib";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("fhe_lib", () => {

  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = anchor.workspace.FheLib as Program<FheLib>
  
  it ("Creates a ciphertext", async () => {
    const key = Array.from(anchor.web3.Keypair.generate().publicKey.toBytes().slice(0, 32));
    
    const [storagePDA] = await PublicKey.findProgramAddress(
      [Buffer.from("fhe_storage"), Buffer.from(key)],
      program.programId
    );

    // @ts-ignore - The type system doesn't match the actual accounts structure
    await program.methods.asFhe8(key).accounts({
      storage: storagePDA,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).rpc();

    const storageAccount = await program.account.cipherText.fetch(storagePDA);
    
    // Simple verification
    expect(storageAccount.bitLength).to.equal(8);
    
    console.log("Storage account created successfully!");
    console.log("Bit length:", storageAccount.bitLength);
    console.log("Owner:", storageAccount.owner.toString());

  })

  it("Creates and adds ciphertexts", async () => {
    // Create first ciphertext (value A)
    const keyA = Array.from(anchor.web3.Keypair.generate().publicKey.toBytes().slice(0, 32));
    const [storagePDA_A] = await PublicKey.findProgramAddress(
      [Buffer.from("fhe_storage"), Buffer.from(keyA)],
      program.programId
    );

    // @ts-ignore - The type system doesn't match the actual accounts structure
    await program.methods.asFhe8(keyA).accounts({
      storage: storagePDA_A,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).rpc();

    const storageAccountA = await program.account.cipherText.fetch(storagePDA_A);
    
    // Create second ciphertext (value B)
    const keyB = Array.from(anchor.web3.Keypair.generate().publicKey.toBytes().slice(0, 32));
    const [storagePDA_B] = await PublicKey.findProgramAddress(
      [Buffer.from("fhe_storage"), Buffer.from(keyB)],
      program.programId
    );

    // @ts-ignore - The type system doesn't match the actual accounts structure
    await program.methods.asFhe8(keyB).accounts({
      storage: storagePDA_B,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).rpc();

    const storageAccountB = await program.account.cipherText.fetch(storagePDA_B);
    
    // Create PDA for the result
    const resultKey = Array.from(anchor.web3.Keypair.generate().publicKey.toBytes().slice(0, 32));
    const [storagePDA_Result] = await PublicKey.findProgramAddress(
      [Buffer.from("fhe_storage"), Buffer.from(resultKey)],
      program.programId
    );
    
    // Convert the accounts to CipherText objects
    const cipherTextA = {
      key: Array.from(storageAccountA.key),
      bitLength: storageAccountA.bitLength,
    };
    
    const cipherTextB = {
      key: Array.from(storageAccountB.key),
      bitLength: storageAccountB.bitLength,
    };
    
    // Call the fhe_add function
    // @ts-ignore - The type system doesn't match the actual accounts structure
    await program.methods.fheAdd(cipherTextA, cipherTextB).accounts({
      lhs: storagePDA_A,
      rhs: storagePDA_B,
      result: storagePDA_Result,
      signer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).rpc();
    
    // // Fetch the result
    // const resultAccount = await program.account.cipherText.fetch(storagePDA_Result);
    
    // console.log("FHE addition performed!");
    // console.log("Result bit length:", resultAccount.bitLength);
    // console.log("Result owner:", resultAccount.owner.toString());
    
    // // Verify the bit length is still 8
    // expect(resultAccount.bitLength).to.equal(8);
  });
});
