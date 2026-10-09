#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum SubscriptionTier {
    Free = 0,
    Basic = 1,
    Premium = 2,
}

#[derive(Clone)]
#[contracttype]
pub struct Subscription {
    pub tier: u32,
    pub expires_at: u64,
}

#[contract]
pub struct WatchlistContract;

#[contractimpl]
impl WatchlistContract {
    pub fn create_subscription(env: Env, user: Address, tier: u32, payment: i128) -> bool {
        user.require_auth();

        if tier == 0 || tier > 2 {
            return false;
        }

        let expires_at = env.ledger().timestamp() + 30 * 24 * 60 * 60;

        let sub = Subscription { tier, expires_at };
        env.storage().persistent().set(&user, &sub);

        true
    }

    pub fn check_subscription(env: Env, user: Address) -> u32 {
        let sub: Option<Subscription> = env.storage().persistent().get(&user);

        match sub {
            Some(s) if s.expires_at > env.ledger().timestamp() => s.tier,
            _ => 0,
        }
    }

    pub fn cancel_subscription(env: Env, user: Address) -> bool {
        user.require_auth();

        let exists: Option<Subscription> = env.storage().persistent().get(&user);
        if exists.is_some() {
            env.storage().persistent().remove(&user);
            return true;
        }

        false
    }
}
