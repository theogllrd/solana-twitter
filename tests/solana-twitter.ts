import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaTwitter } from '../target/types/solana_twitter';
import * as assert from "assert";

describe('solana-twitter', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

  it('can send a new tweet', async () => {
    // Before sending the transaction to the blockchain.
    const tweet = anchor.web3.Keypair.generate(); // generate a new key pair for our tweet account 
    // Call the "SendTweet" instruction.
    await program.rpc.sendTweet('choose', 'rust or solidity ?', {
      accounts: {
        // Accounts here...
        tweet: tweet.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [
        // Key pairs of signers here...
        tweet
      ],
    });
    // After sending the transaction to the blockchain.
    // Fetch the account details of the created tweet.
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    // Ensure it has the right data.
    assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey);
    assert.equal(tweetAccount.topic, 'choose');
    assert.equal(tweetAccount.content, 'rust or solidity ?');
    assert.ok(tweetAccount.timestamp);
  });


  it('can send a new tweet without topic', async () => {
    // Before sending the transaction to the blockchain.
    const tweet = anchor.web3.Keypair.generate(); // generate a new key pair for our tweet account 
    // Call the "SendTweet" instruction.
    await program.rpc.sendTweet('', 'gm everyone', {
      accounts: {
        // Accounts here...
        tweet: tweet.publicKey,
        author: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [
        // Key pairs of signers here...
        tweet
      ],
    });
    // After sending the transaction to the blockchain.
    // Fetch the account details of the created tweet.
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    // Ensure it has the right data.
    assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey);
    assert.equal(tweetAccount.topic, '');
    assert.equal(tweetAccount.content, 'gm everyone');
    assert.ok(tweetAccount.timestamp);
  });


  it('can send a new tweet from a different author', async () => {
    // Generate another user and airdrop him some SOL
    const otherUser = anchor.web3.Keypair.generate();
    // Airdropping 1SOL to otherUser account to pay the rent
    const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
    // the requestAirdrop function ask the wallet to be Airdrop, but we need to wait until the transaction is confirmed
    await program.provider.connection.confirmTransaction(signature);

    // Generate a new key pair for our tweet account
    const tweet = anchor.web3.Keypair.generate();

    // Call the "SendTweet" instruction.
    try {
      await program.rpc.sendTweet('help me', 'stuck in my new rust project..', {
        accounts: {
          // Accounts here...
          tweet: tweet.publicKey,
          author: otherUser.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [
          // Key pairs of signers here...
          otherUser, tweet
        ],
      });
    } catch (err) {
      console.log(err);
    }
    // After sending the transaction to the blockchain.
    // Fetch the account details of the created tweet.
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    // Ensure it has the right data.
    assert.equal(tweetAccount.author.toBase58(), otherUser.publicKey.toBase58());
    assert.equal(tweetAccount.topic, 'help me');
    assert.equal(tweetAccount.content, 'stuck in my new rust project..');
    assert.ok(tweetAccount.timestamp);
  });


  it('cannot provide a topic with more than 50 characters', async () => {
    try {
      const tweet = anchor.web3.Keypair.generate();
      const topicWith51Chars = 'x'.repeat(51);
      // Call the "SendTweet" instruction.
      await program.rpc.sendTweet(topicWith51Chars, 'rust or solidity ?', {
        accounts: {
          // Accounts here...
          tweet: tweet.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [
          // Key pairs of signers here...
          tweet
        ],
      });
    } catch (error) {
      assert.equal(error.msg, 'The provided topic should be 50 characters long maximum.');
      return;
    }
    assert.fail('The instruction should have failed with a 51-character topic.');
  });


  it('cannot provide a content with more than 280 characters', async () => {
    try {
      const tweet = anchor.web3.Keypair.generate();
      const contentWith281Chars = 'x'.repeat(281);
      await program.rpc.sendTweet('veganism', contentWith281Chars, {
        accounts: {
          tweet: tweet.publicKey,
          author: program.provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [tweet],
      });
    } catch (error) {
      assert.equal(error.msg, 'The provided content should be 280 characters long maximum.');
      return;
    }

    assert.fail('The instruction should have failed with a 281-character content.');
  });
});
