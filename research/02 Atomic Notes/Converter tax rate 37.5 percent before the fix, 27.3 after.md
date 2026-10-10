---
type: atomic
project: "The Hershey Company (HSY)"
tags: [ai-use, process, module-2, converter]
status: needs-verification
tier: D
date-created: 2026-10-09
sources:
  - "[[01 Sources/S24 Team AI Log]]"
---

# Converter tax rate 37.5 percent before the fix, 27.3 after

The converter (scripts/workbook_to_data.py) first computed the tax rate as taxes over net income, 37.5 percent; on 2026-10-04 it was fixed to taxes over pre-tax income, 27.3 percent.

The memo's example of a silent calculation error: nothing flagged it until Claude recomputed the rate from the workbook values the next time it ran the converter. It is the reason for the memo's second recommendation, that every number the AI computes is checked against one it did not compute.

Check: Filed from the Milestone 6 AI Use Evaluation Memo. Not yet checked by a person; check it against the source, then set status to confirmed. Derived: tax rate = income taxes / pre-tax income (the wrong version divided by net income). Filing note: both AI Log rows about it, the catch and the fix, say Helped.

## Related
- [[02 Atomic Notes/FY2025 effective tax rate 27.3 percent]]
- [[01 Sources/S9 Team Q&D workbook for Hershey]]
- [[03 Drafts/Milestone 6 - AI Use Evaluation Memo]]
- [[01 Sources/S24 Team AI Log]]
