#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[derive(Clone, PartialEq, Debug)]
#[contracttype]
pub enum SubscriptionTier {
    Free = 0,
    Basic = 1,
    Premium = 2,
}

#[derive(Clone, Debug)]
#[contracttype]
pub struct Subscription {
    pub tier: u32,
    pub expires_at: u64,
    pub created_at: u64,
}

const SECONDS_PER_MONTH: u64 = 30 * 24 * 60 * 60;

const BASIC_PRICE: i128 = 10_000_000; // 1 XLM (7 decimals)
const PREMIUM_PRICE: i128 = 50_000_000; // 5 XLM

fn tier_price(tier: u32) -> i128 {
    match tier {
        1 => BASIC_PRICE,
        2 => PREMIUM_PRICE,
        _ => 0,
    }
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

        let required = tier_price(tier);
        if payment < required {
            return false;
        }

        let now = env.ledger().timestamp();
        let expires_at = now + SECONDS_PER_MONTH;

        let sub = Subscription {
            tier,
            expires_at,
            created_at: now,
        };
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

    pub fn get_subscription(env: Env, user: Address) -> Option<Subscription> {
        env.storage().persistent().get(&user)
    }

    pub fn renew_subscription(env: Env, user: Address, payment: i128) -> bool {
        user.require_auth();

        let sub: Option<Subscription> = env.storage().persistent().get(&user);
        match sub {
            Some(existing) => {
                let required = tier_price(existing.tier);
                if payment < required {
                    return false;
                }

                let now = env.ledger().timestamp();
                let base = if existing.expires_at > now {
                    existing.expires_at
                } else {
                    now
                };

                let renewed = Subscription {
                    tier: existing.tier,
                    expires_at: base + SECONDS_PER_MONTH,
                    created_at: existing.created_at,
                };
                env.storage().persistent().set(&user, &renewed);
                true
            }
            None => false,
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

    pub fn upgrade_tier(env: Env, user: Address, new_tier: u32, payment: i128) -> bool {
        user.require_auth();

        if new_tier == 0 || new_tier > 2 {
            return false;
        }

        let sub: Option<Subscription> = env.storage().persistent().get(&user);
        match sub {
            Some(existing) => {
                if new_tier <= existing.tier {
                    return false;
                }

                let required = tier_price(new_tier);
                if payment < required {
                    return false;
                }

                let upgraded = Subscription {
                    tier: new_tier,
                    expires_at: existing.expires_at,
                    created_at: existing.created_at,
                };
                env.storage().persistent().set(&user, &upgraded);
                true
            }
            None => false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    fn setup() -> (Env, WatchlistContractClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(WatchlistContract, ());
        let client = WatchlistContractClient::new(&env, &contract_id);
        let user = Address::generate(&env);
        (env, client, user)
    }

    #[test]
    fn test_create_basic_subscription() {
        let (_env, client, user) = setup();
        let result = client.create_subscription(&user, &1, &BASIC_PRICE);
        assert!(result);
        assert_eq!(client.check_subscription(&user), 1);
    }

    #[test]
    fn test_create_premium_subscription() {
        let (_env, client, user) = setup();
        let result = client.create_subscription(&user, &2, &PREMIUM_PRICE);
        assert!(result);
        assert_eq!(client.check_subscription(&user), 2);
    }

    #[test]
    fn test_create_subscription_insufficient_payment() {
        let (_env, client, user) = setup();
        let result = client.create_subscription(&user, &1, &(BASIC_PRICE - 1));
        assert!(!result);
        assert_eq!(client.check_subscription(&user), 0);
    }

    #[test]
    fn test_create_subscription_invalid_tier() {
        let (_env, client, user) = setup();
        assert!(!client.create_subscription(&user, &0, &0));
        assert!(!client.create_subscription(&user, &3, &100_000_000));
    }

    #[test]
    fn test_check_subscription_no_subscription() {
        let (_env, client, user) = setup();
        assert_eq!(client.check_subscription(&user), 0);
    }

    #[test]
    fn test_cancel_subscription() {
        let (_env, client, user) = setup();
        client.create_subscription(&user, &1, &BASIC_PRICE);
        assert_eq!(client.check_subscription(&user), 1);

        let result = client.cancel_subscription(&user);
        assert!(result);
        assert_eq!(client.check_subscription(&user), 0);
    }

    #[test]
    fn test_cancel_nonexistent_subscription() {
        let (_env, client, user) = setup();
        let result = client.cancel_subscription(&user);
        assert!(!result);
    }

    #[test]
    fn test_renew_subscription() {
        let (_env, client, user) = setup();
        client.create_subscription(&user, &1, &BASIC_PRICE);

        let result = client.renew_subscription(&user, &BASIC_PRICE);
        assert!(result);
        assert_eq!(client.check_subscription(&user), 1);
    }

    #[test]
    fn test_renew_no_subscription() {
        let (_env, client, user) = setup();
        let result = client.renew_subscription(&user, &BASIC_PRICE);
        assert!(!result);
    }

    #[test]
    fn test_renew_insufficient_payment() {
        let (_env, client, user) = setup();
        client.create_subscription(&user, &2, &PREMIUM_PRICE);

        let result = client.renew_subscription(&user, &(PREMIUM_PRICE - 1));
        assert!(!result);
    }

    #[test]
    fn test_upgrade_tier() {
        let (_env, client, user) = setup();
        client.create_subscription(&user, &1, &BASIC_PRICE);

        let result = client.upgrade_tier(&user, &2, &PREMIUM_PRICE);
        assert!(result);
        assert_eq!(client.check_subscription(&user), 2);
    }

    #[test]
    fn test_upgrade_same_tier_fails() {
        let (_env, client, user) = setup();
        client.create_subscription(&user, &1, &BASIC_PRICE);

        let result = client.upgrade_tier(&user, &1, &BASIC_PRICE);
        assert!(!result);
    }

    #[test]
    fn test_upgrade_downgrade_fails() {
        let (_env, client, user) = setup();
        client.create_subscription(&user, &2, &PREMIUM_PRICE);

        let result = client.upgrade_tier(&user, &1, &BASIC_PRICE);
        assert!(!result);
    }

    #[test]
    fn test_upgrade_no_subscription_fails() {
        let (_env, client, user) = setup();
        let result = client.upgrade_tier(&user, &2, &PREMIUM_PRICE);
        assert!(!result);
    }

    #[test]
    fn test_get_subscription() {
        let (env, client, user) = setup();
        client.create_subscription(&user, &1, &BASIC_PRICE);

        let sub = client.get_subscription(&user);
        assert!(sub.is_some());
        let s = sub.unwrap();
        assert_eq!(s.tier, 1);
        assert_eq!(s.created_at, env.ledger().timestamp());
        assert!(s.expires_at > env.ledger().timestamp());
    }

    #[test]
    fn test_get_subscription_none() {
        let (_env, client, user) = setup();
        let sub = client.get_subscription(&user);
        assert!(sub.is_none());
    }

    #[test]
    fn test_payment_accepts_exact_amount() {
        let (_env, client, user) = setup();
        assert!(client.create_subscription(&user, &1, &BASIC_PRICE));
        assert!(client.create_subscription(&user, &2, &PREMIUM_PRICE));
    }

    #[test]
    fn test_payment_accepts_overpayment() {
        let (_env, client, user) = setup();
        assert!(client.create_subscription(&user, &1, &(BASIC_PRICE * 2)));
    }
}