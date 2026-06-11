export const REJECTION_REASON_COPY: Record<string, string> = {
  DAILY_MAX_LOSS_REACHED:
    "Your agent reached its daily loss limit and stood down to protect your capital. It resets at the next market open.",
  DAILY_MAX_GAIN_REACHED:
    "Your agent hit its daily gain target and stood down for the day. It resets at the next market open.",
  CAPITAL_ALLOCATION_EXCEEDED:
    "This trade would exceed your agent's capital allocation. Use the Rebuild action to create a new agent with a higher allocation.",
  AGGREGATE_EXPOSURE_EXCEEDED:
    "This trade would exceed your account's available capital. One or more of your other agents already has funds committed to an open position.",
  INSUFFICIENT_CAPITAL:
    "Your account balance is too low for this agent to place a trade. Deposit additional funds to continue.",
  HOLDING_PERIOD_NOT_ELAPSED:
    "Your agent's holding period hasn't elapsed yet. It can propose an exit once the minimum hold time passes.",
  OPEN_POSITION_EXISTS:
    "Your agent already has an open position. It can only hold one position at a time.",
  TRADE_FREQUENCY_CAP:
    "Your agent proposed a trade before its minimum interval elapsed. It will scan again once the required wait time passes, based on your trade tempo setting.",
  MAX_DRAWDOWN_EXCEEDED:
    "Your agent's drawdown protection limit was reached and it stood down to protect your capital. An exit proposal is waiting in your inbox — approve it to close the position and reactivate your agent.",
  EVALUATION_ERROR:
    "Something went wrong evaluating this trade. Your agent will try again on the next scan.",
};
