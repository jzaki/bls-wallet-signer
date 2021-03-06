import * as hubbleBls from "../deps/hubble-bls";

import encodeMessageForSigning from "./encodeMessageForSigning";
import getPublicKey from "./getPublicKey";
import { RawTransactionData, TransactionData } from "./types";

export default (
  signerFactory: hubbleBls.signer.BlsSignerFactory,
  domain: Uint8Array,
  chainId: number,
) => (
  rawTransactionData: RawTransactionData,
  privateKey: string,
): TransactionData => {
  const message = encodeMessageForSigning(chainId)(rawTransactionData);
  const signer = signerFactory.getSigner(domain, privateKey);

  const signature = hubbleBls.mcl.dumpG1(signer.sign(message));

  return {
    ...rawTransactionData,
    publicKey: getPublicKey(signerFactory, domain)(privateKey),
    signature,
  }
};
