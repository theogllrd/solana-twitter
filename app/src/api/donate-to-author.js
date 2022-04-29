
//const web3 = require("@project-serum/anchor").web3;
import { useWallet } from 'solana-wallets-vue';
import { SystemProgram, Transaction } from '@solana/web3.js';

import { useWorkspace } from '@/composables'
//import { Wallet } from '@project-serum/anchor';
//import { useWallet } from "solana-wallets-vue";


export const donateToAuthor = async (tweetAuthor, donationAmount) => {




    //console.log(donationAmount);

    const { connection } = useWorkspace()
    const { wallet, sendTransaction } = useWallet();

    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.value.publicKey,
                toPubkey: tweetAuthor,
                lamports: donationAmount,
            })
        );
        const signature = await sendTransaction(transaction, connection);
        const confirmation = await connection.confirmTransaction(signature, 'processed');
        if (confirmation != null) return signature;
    }
    catch (err) {
        console.log(err);
    }




}