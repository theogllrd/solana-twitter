use anchor_lang::prelude::*;

declare_id!("7H16s7FNXJhZDtSC8GmgHMqBdmks1ZmkGHerMkhcKQbQ");

#[program]
pub mod solana_twitter {
    use super::*;
    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> ProgramResult {
        let tweet: &mut Account<Tweet> = &mut ctx.accounts.tweet;
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap(); // we use unwrap() because Clock::get() returns a Result which can be Ok or Err, unwrapping a result means either using the value inside Ok — in our case, the clock — or immediately returning the error.
        if topic.chars().count() > 50 {
            // return an error
            return Err(ErrorCode::TopicTooLong.into());
        }
        if content.chars().count() > 280 {
            // return an error
            return Err(ErrorCode::ContentTooLong.into());
        }

        tweet.author = *author.key;
        tweet.timestamp = clock.unix_timestamp;
        tweet.topic = topic;
        tweet.content = content;
        Ok(())
    }

    pub fn delete_tweet(_ctx: Context<DeleteTweet>) -> ProgramResult {
        Ok(())
    }
}

// Define the context
#[derive(Accounts)]
pub struct SendTweet<'info> {
    // init this account, definite the payer and the space we're going to use
    #[account(init, payer = author, space = Tweet::LEN)]
    pub tweet: Account<'info, Tweet>, // means this is an account of type Tweet
    // mark the author account as mutable, because we are going to mutate the amount of money in this account
    #[account(mut)]
    pub author: Signer<'info>, // same as the AccountInfo type except we're also saying this account should sign the instruction
    pub system_program: Program<'info, System>, // the official system_program
}

// Define the context of DeleteTweet function
#[derive(Accounts)]
pub struct DeleteTweet<'info> {
    #[account(mut, has_one = author, close = author)]
    pub tweet: Account<'info, Tweet>,
    pub author: Signer<'info>,
}

// 1. Define the structure of the Tweet account.
#[account] // custom Rust attribute provided by Anchor
pub struct Tweet {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}

// 2. Add some useful constants for sizing propeties.
const DISCRIMINATOR_LENGTH: usize = 8; // discriminator stores the type of the account we create
const PUBLIC_KEY_LENGTH: usize = 32; // store the pubkey of the author of the tweet
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the actual size of the string
const MAX_TOPIC_LENGTH: usize = 50 * 4; // 50 chars max, each char use up to 4 bytes
const MAX_CONTENT_LENGTH: usize = 280 * 4; // 280 chars max.

// 3. Add a constant on the Tweet account that provides its total size.
impl Tweet {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Author
        + TIMESTAMP_LENGTH // Timestamp
        + STRING_LENGTH_PREFIX // Topic prefix
        + MAX_TOPIC_LENGTH // Topic
        + STRING_LENGTH_PREFIX // Content prefix
        + MAX_CONTENT_LENGTH; // Content
}

// Define errors messages
#[error]
pub enum ErrorCode {
    #[msg("The provided topic should be 50 characters long maximum.")]
    TopicTooLong,
    #[msg("The provided content should be 280 characters long maximum.")]
    ContentTooLong,
}
