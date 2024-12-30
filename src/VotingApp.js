import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from './idl.json';

const programID = new anchor.web3.PublicKey("programid");
const network = "https://api.devnet.solana.com";

const VotingApp = () => {
    const [votes, setVotes] = useState(null);
    const wallet = useWallet();
    const connection = new anchor.web3.Connection(network, "processed");

    const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "processed" });
    const program = new anchor.Program(idl, programID, provider);

    const fetchVotes = async () => {
        try {
            const [votesPda] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("votes")],
                programID
            );

            const votesAccount = await program.account.votes.fetch(votesPda);
            setVotes(votesAccount);
        } catch (error) {
            console.error("Error fetching votes:", error);
        }
    };

    const initializeVotes = async () => {
        try {
            const [votesPda] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("votes")],
                programID
            );

            await program.rpc.initialize("YourContractAddressHere", {
                accounts: {
                    votes: votesPda,
                    user: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
            });
            fetchVotes();
        } catch (error) {
            console.error("Error initializing votes:", error);
        }
    };

    const vote = async (isUpvote) => {
        try {
            const [votesPda] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from("votes")],
                programID
            );

            await program.rpc.vote(isUpvote, {
                accounts: {
                    votes: votesPda,
                    user: wallet.publicKey,
                },
            });
            fetchVotes();
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    useEffect(() => {
        if (wallet.connected) {
            fetchVotes();
        }
    }, [wallet.connected]);

    return (
        <div>
            <h1>Solana Voting App</h1>
            {wallet.connected ? (
                votes ? (
                    <div>
                        <p>Upvotes: {votes.upvotes}</p>
                        <p>Downvotes: {votes.downvotes}</p>
                        <button onClick={() => vote(true)}>Upvote</button>
                        <button onClick={() => vote(false)}>Downvote</button>
                    </div>
                ) : (
                    <button onClick={initializeVotes}>Initialize Votes</button>
                )
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
};

export default VotingApp;
