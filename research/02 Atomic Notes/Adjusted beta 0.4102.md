---
type: atomic
project: "The Hershey Company (HSY)"
tags: [hershey, cost-of-capital, beta, wacc]
status: needs-verification
tier: E
date-created: 2026-10-05
sources:
  - "[[01 Sources/S14 Yahoo Finance monthly prices for HSY SPY and BIL]]"
---

# Adjusted beta 0.4102

The beta used in Hershey's cost of equity is 0.4102, the raw regression beta of 0.1153 adjusted toward the market average of 1.

It sets the cost of equity at 7.11 percent. It is the highest of the three beta estimates as the WACC tab shows them (0.35 Hamada, 0.34 FactSet), so the memo calls it conservative; see the Hamada note for a formula issue that may change that comparison.

Check: Filed from the Milestone 3 Cost of Capital Memo. Not yet checked against the source; check it there, then set status to confirmed. Estimate: Chris Lester chose the adjusted beta because the raw beta is not distinguishable from zero and a defensive consumer staple should have a low beta, but not one near zero. Formula: (2/3) x 0.1153 + (1/3) x 1 = 0.4102. It is cell D10 on the WACC tab.

## Related
- [[02 Atomic Notes/HSY raw regression beta 0.1153 over 60 months]]
- [[02 Atomic Notes/Regression beta standard error 0.195 and R-squared 0.006]]
- [[02 Atomic Notes/Hamada beta 0.35 cross-check]]
- [[02 Atomic Notes/FactSet beta 0.34]]
- [[02 Atomic Notes/Cost of equity 7.11 percent]]
- [[01 Sources/S14 Yahoo Finance monthly prices for HSY SPY and BIL]]
