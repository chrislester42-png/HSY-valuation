---
type: atomic
project: "The Hershey Company (HSY)"
tags: [hershey, cost-of-capital, beta]
status: needs-verification
tier: D
date-created: 2026-10-05
sources:
  - "[[01 Sources/S10 Damodaran betas by sector January 2026]]"
  - "[[01 Sources/S9 Team Q&D workbook for Hershey]]"
---

# Hamada beta 0.35 cross-check

The WACC tab's Hamada cross-check gives Hershey a beta of 0.35, from the Food Processing average beta of 0.61 unlevered at the industry's capital structure and relevered at Hershey's.

One of the two cross-checks on the adjusted beta of 0.4102. If the corrected figure (below) is right, Hamada gives the highest of the three betas, and the memo's sentence that the adjusted beta is the highest would need to change. The WACC itself does not change, because Hamada is a cross-check only.

Check: Filed from the Milestone 3 Cost of Capital Memo. Not yet checked against the source; check it there, then set status to confirmed. Formula as intended: unlevered beta = 0.61 / (1 + (1 - 0.1037) x 0.4373); relevered beta = unlevered x (1 + (1 - 0.2296) x 0.1437) (Derived). Formula issue found 2026-10-05: cell C24 on the WACC tab reads =C21/(1+(1-C23*C22)), with a misplaced bracket. The intended =C21/(1+(1-C23)*C22) gives an unlevered beta of 0.438 (not 0.312) and a relevered beta of 0.49 (not 0.35). The team fixes the cell by hand in Excel, then updates this note and the memo.

## Related
- [[02 Atomic Notes/Food processing industry beta 0.61]]
- [[02 Atomic Notes/Food processing industry debt to equity 43.73 percent]]
- [[02 Atomic Notes/Food processing industry tax rate 10.37 percent]]
- [[02 Atomic Notes/Hershey debt to equity 14.37 percent]]
- [[02 Atomic Notes/WACC tax rate 22.96 percent]]
- [[02 Atomic Notes/Adjusted beta 0.4102]]
- [[02 Atomic Notes/FactSet beta 0.34]]
- [[01 Sources/S10 Damodaran betas by sector January 2026]]
- [[01 Sources/S9 Team Q&D workbook for Hershey]]
