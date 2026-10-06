---
type: atomic
project: "The Hershey Company (HSY)"
tags: [hershey, valuation, dcf, valuation-date, stub]
status: needs-verification
tier: D
date-created: 2026-10-05
sources:
  - "[[01 Sources/S9 Team Q&D workbook for Hershey]]"
---

# Valuation date 5 October 2026 with 23.9 percent stub

The DCF values Hershey as of October 5, 2026, so it counts 23.9 percent of FY2026's free cash flow, the part that falls after that date.

Every cash flow is discounted from its fiscal year end back to this date, and the stub keeps the first year from counting cash Hershey earned before it. The site's engine must count the stub and discount the way the sheet does.

Check: Filed from the Milestone 4 DCF Valuation Memo. Not yet checked against the source; check it there, then set status to confirmed. Formula: YEARFRAC(October 5, 2026, December 31, 2026) = 86/360 = 23.9 percent (Excel's default 30/360 basis), cell D10. Discounting uses actual days over 365 (row 43). The date is cell D9, which reads FrontPage C4.

## Related
- [[02 Atomic Notes/Present value of 2026 to 2028 cash flows 3,792.3 million dollars]]
- [[02 Atomic Notes/WACC 6.78 percent]]
- [[01 Sources/S9 Team Q&D workbook for Hershey]]
