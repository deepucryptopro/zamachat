"use client";

import { useState, useEffect } from "react";
import { encryptMessage, decryptMessage, generateWallet } from "../lib/fhe";
import { saveEncryptedMessage, getEncryptedMessages } from "../lib/storage";

export default function Home() {
  const [myWallet, setMyWallet] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // status text
  const [inbox, setInbox] = useState([]);
  const [isEncrypted, setIsEncrypted] = useState(false);

  // Initialize a wallet for the user on load
  useEffect(() => {
    const wallet = generateWallet();
    setMyWallet(wallet);
    // Auto-fill receiver with another random wallet for demo convenience, or leave empty
    // The UI image shows "0x..." placeholder, implying empty. 
    // But for a demo, it's helpful to know who to send to.
    // We'll leave it empty to match UI exactly, but maybe show a hint.
  }, []);

  // Poll for messages (simulate fetching from chain)
  useEffect(() => {
    if (!myWallet) return;

    const interval = setInterval(() => {
      const allMessages = getEncryptedMessages();
      // Filter for messages meant for me
      const myMessages = allMessages.filter(msg => {
        // We need to peek at the metadata (which is public in this mock) 
        // In real FHE/Blockchain, the event logs would have a topic 'EncryptedMessage(to, data)'
        // Our mock encrypt returns "E_..." which is the payload. 
        // Wait, our encrypt implementation hides the receiver in the encrypted payload? 
        // No, standard blockchain messages usually have a public 'to' field.
        // Let's check our encrypt implementation.
        // Ah, 'encryptMessage' returns a string. Inside it has JSON with receiver.
        // But if it's encrypted, we can't see the receiver!
        // In a real system, the 'to' address is metadata on the transaction, not just in the ciphertext.
        // My mock storage saves { data: "E_..." }. 
        // I need to adjust the Logic: The storage should probably simulate indexing by receiver 
        // OR the receiver tries to decrypt EVERYTHING (expensive) and sees what works.
        // Zama/FHE often uses a viewing key.
        // For this mock, I'll update the 'encrypt' logic to allow the system to route it, 
        // OR I'll just try to decrypt everything in the inbox.
        return true;
      });
      setInbox(myMessages);
    }, 2000);

    return () => clearInterval(interval);
  }, [myWallet]);

  const handleSend = async () => {
    if (!message || !receiver) return;

    setStatus("Encrypting (Client-Side)...");

    try {
      // 1. Client-Side Encryption
      const encrypted = await encryptMessage(message, receiver);

      setStatus("Sending to Storage...");

      // 2. Send to "Smart Contract"
      saveEncryptedMessage(encrypted);

      setStatus("Message Sent Encrypted!");
      setMessage("");
      setTimeout(() => setStatus(""), 3000);
    } catch (e) {
      console.error(e);
      setStatus("Error sending message");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="navbar">
        <a href="https://docs.zama.org/protocol/zama-protocol-litepaper" target="_blank" rel="noopener noreferrer">FHE</a>
        <a href="https://www.zama.org/" target="_blank" rel="noopener noreferrer">ZAMA</a>
      </nav>

      <main className="main">
        <h1 className="title">ZamaChat</h1>
        <p className="subtitle">
          Private messaging using Fully Homomorphic Encryption<br />
          <span style={{ fontSize: '0.9em', opacity: 0.8 }}>
            Messages stay encrypted even during computation.<br />
            Only the receiver can read them.
          </span>
        </p>

        {/* Send Card */}
        <div className="card">
          <div>
            <label className="label">Receiver Wallet Address</label>
            <input
              className="input"
              placeholder="0x..."
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Message</label>
            <textarea
              className="textarea"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button className="button" onClick={handleSend} disabled={!message || !receiver}>
            Send Encrypted Message
          </button>

          <p className="helper-text">
            {status || "Message is encrypted in your browser before sending"}
          </p>
        </div>

        {/* Demo Controls / Inbox (Below fold to keep UI clean) */}
        <div className="output-section">
          <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
            <h3 className="label" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              Simulation Controls (For Demo Purpose)
            </h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Your Wallet: <span style={{ fontFamily: 'monospace', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{myWallet}</span>
              </div>
              <button
                onClick={() => {
                  // Copy my wallet to clipboard or fill receiver for self-test
                  setReceiver(myWallet);
                }}
                style={{ fontSize: '0.8rem', padding: '4px 8px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}
              >
                Send to Me
              </button>
            </div>

            <h3 className="label" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              Encrypted Storage (Public Chain Data)
            </h3>
            <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '2rem' }}>
              {inbox.length === 0 ? (
                <p style={{ color: '#999', fontSize: '0.9rem' }}>No messages in storage.</p>
              ) : (
                inbox.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    <span style={{ color: '#6b46c1' }}>[Block {msg.id.substr(-4)}]</span> {msg.data}
                    <EncryptedMessageItem msg={msg} myWallet={myWallet} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        Inspired by Zama Fully Homomorphic Encryption (FHE)<br />
        • Educational & experimental project
      </footer>
    </div>
  );
}

// Subcomponent to handle individual message decryption
function EncryptedMessageItem({ msg, myWallet }) {
  const [decrypted, setDecrypted] = useState(null);

  useEffect(() => {
    // Attempt to decrypt automatically
    const tryDecrypt = async () => {
      // Logic: decryptMessage now returns null if not authorized
      const res = await decryptMessage(msg.data, myWallet);
      setDecrypted(res);
    };
    tryDecrypt();
  }, [msg, myWallet]);

  if (decrypted) {
    return (
      <div style={{ marginTop: '4px', color: '#059669', fontWeight: 'bold' }}>
        🔓 Decrypted: {decrypted}
      </div>
    );
  } else {
    // If decryption returns null, it means we are not the authorized receiver (or it failed)
    return (
      <div style={{ marginTop: '4px', color: '#999', fontSize: '0.75rem' }}>
        🔒 Encrypted message (not for this wallet)
      </div>
    );
  }
}
