---
type: atomic
project: "The Hershey Company (HSY)"
tags: [hershey, cost-of-capital, beta]
status: needs-verification
tier: D
date-created: 2026-10-05
sources:
  - "[[01 Sources/S14 Yahoo Finance monthly prices for HSY SPY and BIL]]"
---

# HSY raw regression beta 0.1153 over 60 months

Hershey's raw beta from a regression of 60 monthly excess returns (September 2021 to August 2026) on those of the S&P 500 (SPY), with BIL as the risk-free return, is 0.1153.

The starting point for the adjusted beta of 0.4102 used in the cost of equity. On its own it would put the cost of equity near the risk-free rate.

Check: Filed from the Milestone 3 Cost of Capital Memo. Not yet checked against the source; check it there, then set status to confirmed. Formula: slope of an ordinary least squares regression of (HSY monthly return minus BIL monthly return) on (SPY monthly return minus BIL monthly return), 60 months of adjusted prices from S14 (Derived). It is cell G10 on the WACC tab.

## Related
- [[02 Atomic Notes/Regression beta standard error 0.195 and R-squared 0.006]]
- [[02 Atomic Notes/Adjusted beta 0.4102]]
- [[01 Sources/S14 Yahoo Finance monthly prices for HSY SPY and BIL]]
