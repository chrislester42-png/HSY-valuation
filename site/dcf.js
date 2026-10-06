// Valuation engine, built in Module 4 from the workbook's DCF 1-Pager tab (F.dcf, from scripts/workbook_to_data.py).
// Contract: window.valuation(dcf, inputs) is a pure function that returns every intermediate line for both
// terminal value methods, so the Valuation section, its sensitivity tables, and The Call all compute from one place.
//
// It rebuilds the DCF the way the DCF 1-Pager tab does:
// - each forecast year's unlevered free cash flow = NOPAT + D&A + change in NWC + capex (the last two carry their
//   own signs on the sheet); the first year counts only the stub, dcf.stubFraction (the sheet's YEARFRAC, row 42);
// - each counted cash flow is discounted from its fiscal year end back to the valuation date at the WACC,
//   over actual days / 365 (row 43);
// - terminal value by growth in perpetuity = last year's counted cash flow x (1 + g) / (WACC - g), and by
//   exit multiple = last year's EBITDA x the multiple, each discounted from the last forecast date;
// - enterprise value = PV of the forecast years + PV of the terminal value; equity = EV - net debt;
//   per share = equity / diluted shares.
// inputs: { wacc, growth, multiple }, each defaulting to the workbook's. Nothing here reads the page.
//
// Scenario shifts (Module 4, bull, base, and bear), both zero by default:
// - revenueGrowthShift: added to every forecast year's revenue growth as the workbook implies it
//   (needs baseRevenue, the last actual year's revenue from F.periods; window.valuation.baseRevenue(F) gives it);
// - ebitdaMarginShift: added to every forecast year's EBITDA margin as the workbook implies it.
// When either is set, each year is carried the way the DCF tab carries it: EBITDA = revenue x margin;
// EBIT = EBITDA - D&A; tax = EBIT x that year's tax rate; NOPAT = EBIT - tax. D&A, capex, and the change in
// NWC stay at the workbook's dollars, as the DCF tab holds them. With both shifts zero the workbook's own
// lines are used unchanged.
(function () {
  "use strict";
  const DAY = 86400000;
  const utc = (s) => { const p = String(s).slice(0, 10).split("-").map(Number); return Date.UTC(p[0], p[1] - 1, p[2]); };

  function valuation(dcf, inputs) {
    inputs = inputs || {};
    const wacc = inputs.wacc != null ? inputs.wacc : dcf.wacc;
    const growth = inputs.growth != null ? inputs.growth : dcf.longTermGrowth;
    const multiple = inputs.multiple != null ? inputs.multiple : dcf.exitMultiple;
    const gShift = inputs.revenueGrowthShift || 0, mShift = inputs.ebitdaMarginShift || 0;
    const shifted = gShift !== 0 || mShift !== 0;
    if (gShift !== 0 && !(inputs.baseRevenue > 0)) throw new Error("valuation: revenueGrowthShift needs baseRevenue (the last actual year's revenue)");
    const v0 = utc(dcf.valuationDate);

    let prevWb = inputs.baseRevenue, prevRev = inputs.baseRevenue;
    const years = dcf.years.map((y, i) => {
      let revenue = y.revenue, ebitda = y.ebitda, ebit = y.ebit, nopat = y.nopat, revenueGrowth = null;
      if (shifted) {
        if (gShift !== 0) {
          revenueGrowth = y.revenue / prevWb - 1 + gShift;
          revenue = prevRev * (1 + revenueGrowth);
          prevWb = y.revenue; prevRev = revenue;
        }
        ebitda = revenue * (y.ebitda / y.revenue + mShift);
        ebit = ebitda - y.da;
        nopat = ebit - ebit * y.taxRate;
      }
      const fcf = nopat + y.da + y.changeInNwc + y.capex;
      const counted = i === 0 ? fcf * dcf.stubFraction : fcf;
      const t = (utc(y.date) - v0) / DAY / 365;
      const factor = Math.pow(1 + wacc, t);
      return { label: y.label, date: y.date, revenue, revenueGrowth, ebitda, ebitdaMargin: ebitda / revenue, ebit, nopat,
        fcf, counted, t, pv: counted / factor };
    });
    const pvStage1 = years.reduce((a, y) => a + y.pv, 0);
    const last = years[years.length - 1];
    const lastFactor = Math.pow(1 + wacc, last.t);

    function finish(tv) {
      const pvTerminal = tv / lastFactor;
      const enterpriseValue = pvStage1 + pvTerminal;
      const equityValue = enterpriseValue - dcf.netDebt;
      return { terminalValue: tv, pvTerminal, pvStage1, enterpriseValue, netDebt: dcf.netDebt, equityValue,
        sharesOut: dcf.sharesOut, perShare: equityValue / dcf.sharesOut, tvShareOfEv: pvTerminal / enterpriseValue };
    }

    // Growth in perpetuity only works while growth stays below the WACC.
    let perpetuity;
    if (wacc > growth) {
      const fcfNextYear = last.counted * (1 + growth);
      perpetuity = Object.assign({ valid: true, fcfNextYear }, finish(fcfNextYear / (wacc - growth)));
      perpetuity.impliedExitMultiple = perpetuity.terminalValue / last.ebitda;
    } else {
      perpetuity = { valid: false, fcfNextYear: NaN, terminalValue: NaN, pvTerminal: NaN, pvStage1, enterpriseValue: NaN,
        netDebt: dcf.netDebt, equityValue: NaN, sharesOut: dcf.sharesOut, perShare: NaN, tvShareOfEv: NaN, impliedExitMultiple: NaN };
    }

    const exitMultiple = Object.assign({ valid: true, terminalEbitda: last.ebitda }, finish(last.ebitda * multiple));
    const ratio = last.counted / exitMultiple.terminalValue;
    exitMultiple.impliedGrowth = (wacc - ratio) / (1 + ratio);

    return { inputs: { wacc, growth, multiple, revenueGrowthShift: gShift, ebitdaMarginShift: mShift }, valuationDate: dcf.valuationDate, stubFraction: dcf.stubFraction,
      years, pvStage1, perpetuity, exitMultiple };
  }

  // The last actual year's revenue, the base the revenue growth shift compounds from.
  valuation.baseRevenue = (F) => {
    const acts = ((F && F.periods) || []).filter((p) => p.actual && p.revenue != null);
    return acts.length ? acts[acts.length - 1].revenue : null;
  };
  window.valuation = valuation;
})();
