# ZamaChat

**Confidential messaging demo inspired by Zama’s Fully Homomorphic Encryption (FHE)**

**[Live Demo](https://zamachat.vercel.app/)**

## Overview
ZamaChat is an educational and experimental messaging application that demonstrates how confidential communication can be built using Fully Homomorphic Encryption (FHE) principles inspired by Zama.

Messages remain encrypted throughout the system and are never revealed to smart contracts or storage layers. Only the intended receiver can decrypt and read a message.

## Problem Statement
Public blockchains are transparent by default. While this transparency enables trust, it makes private communication impossible.

Most messaging or communication systems either:
- Rely on centralized servers, or
- Expose metadata and message content on-chain

ZamaChat explores how FHE-style encrypted computation can enable private messaging on public infrastructure.

## Solution (High-Level)
ZamaChat uses a Zama-inspired approach where:

- Messages are encrypted on the client side
- Encrypted messages are stored and processed without decryption
- Smart contracts never access plaintext data
- Only the intended receiver can decrypt messages locally

This mirrors the core idea behind Zama’s confidential smart contracts and FHEVM.

## Architecture Overview
The system follows a simplified confidential computation flow:

**User Wallet**
  → **Client-side Encryption**
    → **Encrypted Message Storage (Smart Contract)**
      → **Encrypted Retrieval**
        → **Client-side Decryption**

### Key Design Principles
- End-to-end encryption
- No plaintext storage
- Wallet-based authorization
- Graceful failure for unauthorized access

## Encryption Model (Demo)
This project uses mock encryption to simulate FHE behavior.

Real Fully Homomorphic Encryption is computationally heavy and not required for demonstrating architectural correctness in a demo environment.

The focus is on:
- Correct privacy flow
- Authorization logic
- Zama-aligned design principles

### Access Control Logic
Each message is associated with a receiver wallet address.

During decryption:
- If the connected wallet matches the receiver address, decryption succeeds
- Otherwise, the message remains encrypted and unreadable

Unauthorized decryption attempts fail silently without exposing any plaintext.

This behavior intentionally demonstrates Zama-style Access Control Lists (ACL).

## Demo Behavior
- Same user can simulate multiple participants using different wallets
- Encrypted messages remain visible on-chain
- Only authorized wallets can decrypt and read messages

Example:

🔒 Encrypted message (not for this wallet)

## Tech Stack
- Next.js (Frontend)
- React
- EVM-compatible Smart Contracts (demo)
- Wallet-based identity
- Vercel (deployment)

## Why Zama?
ZamaChat is inspired by Zama’s vision of confidential smart contracts and Fully Homomorphic Encryption (FHE).

The project demonstrates:
- Encrypted data processing
- Authorization-based decryption
- Privacy-preserving application design

This aligns with Zama’s FHEVM and confidential computation philosophy.

## Limitations
- This is an educational demo, not a production messaging system
- Encryption is simulated for clarity and accessibility
- No key recovery or message persistence guarantees

## Future Improvements
- Integration with Zama FHEVM when publicly available
- True encrypted computation using euint types
- Group messaging with encrypted ACLs
- Metadata minimization

## Disclaimer
This project is an educational and experimental prototype. It is not intended for production use.
