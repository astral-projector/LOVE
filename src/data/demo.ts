export type Mode = 'belonging' | 'vitality' | 'dignity' | 'agency' | 'wisdom' | 'meaning';
export type Polarity = 'support' | 'erosion';
export type Grade = 'A' | 'B' | 'C' | 'D';

export interface ModeImpact { mode: Mode; polarity: Polarity; magnitude: number; }
export interface Activity { id: string; label: string; impacts: ModeImpact[]; }
export interface Additionality {
  path: 'additionality' | 'coherence';
  directCapital?: boolean;
  belowMarket?: boolean;
  useOfProceedsKnown?: boolean;
  causalMultiplier: number;
  note: string;
}
export interface Holding {
  id: string;
  name: string;
  type: 'public_equity' | 'fund' | 'private_debt' | 'private_equity' | 'grant';
  allocation: number;
  activities: Activity[];
  additionality: Additionality;
  evidenceGrade: Grade;
  evidenceMultiplier: number;
  exposureEligible: boolean;
}

export const modes: { id: Mode; label: string; shadow: string }[] = [
  { id: 'belonging', label: 'Belonging', shadow: 'Isolation / exclusion' },
  { id: 'vitality',  label: 'Vitality',  shadow: 'Depletion / harm' },
  { id: 'dignity',   label: 'Dignity',   shadow: 'Humiliation / exploitation' },
  { id: 'agency',    label: 'Agency',    shadow: 'Coercion / dependence' },
  { id: 'wisdom',    label: 'Wisdom',    shadow: 'Manipulation / folly' },
  { id: 'meaning',   label: 'Meaning',   shadow: 'Nihilism / anomie' },
];

export const holdings: Holding[] = [
  {
    id: 'meridian', name: 'Meridian Foods plc', type: 'public_equity',
    allocation: 12_000_000, evidenceGrade: 'B', evidenceMultiplier: 0.85, exposureEligible: true,
    activities: [
      { id: 'staples', label: 'Affordable staple foods',
        impacts: [ {mode:'vitality',polarity:'support',magnitude:0.5}, {mode:'belonging',polarity:'support',magnitude:0.2} ] },
      { id: 'upf', label: 'Ultra-processed snacks & drinks',
        impacts: [ {mode:'vitality',polarity:'erosion',magnitude:0.6} ] },
      { id: 'formula', label: 'Infant-formula marketing, low-income markets',
        impacts: [ {mode:'dignity',polarity:'erosion',magnitude:0.4}, {mode:'vitality',polarity:'erosion',magnitude:0.2} ] },
    ],
    additionality: { path:'additionality', directCapital:false, belowMarket:false, useOfProceedsKnown:false,
      causalMultiplier:0.02, note:'Secondary-market equity — your capital reached another shareholder, not the company. Near-zero additionality.' },
  },
  {
    id: 'brightline', name: 'Brightline Energy', type: 'public_equity',
    allocation: 8_000_000, evidenceGrade:'B', evidenceMultiplier:0.85, exposureEligible:true,
    activities: [
      { id:'renew', label:'Renewable generation',
        impacts:[ {mode:'vitality',polarity:'support',magnitude:0.5}, {mode:'belonging',polarity:'support',magnitude:0.1} ] },
      { id:'peaker', label:'Legacy gas peaker plants',
        impacts:[ {mode:'vitality',polarity:'erosion',magnitude:0.3} ] },
    ],
    additionality: { path:'additionality', directCapital:false, belowMarket:false, useOfProceedsKnown:false,
      causalMultiplier:0.02, note:'Secondary-market equity — near-zero additionality. Exposure remains.' },
  },
  {
    id: 'horizon', name: 'Horizon Impact Fund II', type: 'fund',
    allocation: 10_000_000, evidenceGrade:'C', evidenceMultiplier:0.70, exposureEligible:true,
    activities: [
      { id:'aginsure', label:'Smallholder crop-insurance',
        impacts:[ {mode:'agency',polarity:'support',magnitude:0.4}, {mode:'vitality',polarity:'support',magnitude:0.2} ] },
      { id:'solar', label:'Off-grid solar',
        impacts:[ {mode:'vitality',polarity:'support',magnitude:0.3}, {mode:'belonging',polarity:'support',magnitude:0.1} ] },
    ],
    additionality: { path:'additionality', directCapital:true, belowMarket:false, useOfProceedsKnown:true,
      causalMultiplier:0.45, note:'Looked through to underlying positions; primary commitments carry partial additionality.' },
  },
  {
    id: 'rooted', name: 'Rooted Health', type: 'private_debt',
    allocation: 6_000_000, evidenceGrade:'A', evidenceMultiplier:0.95, exposureEligible:true,
    activities: [
      { id:'clinics', label:'Clinics in medically isolated communities',
        impacts:[ {mode:'vitality',polarity:'support',magnitude:0.7}, {mode:'dignity',polarity:'support',magnitude:0.4}, {mode:'belonging',polarity:'support',magnitude:0.3} ] },
    ],
    additionality: { path:'additionality', directCapital:true, belowMarket:true, useOfProceedsKnown:true,
      causalMultiplier:0.95, note:'Below-market direct loan, use of proceeds known — strong additionality.' },
  },
  {
    id: 'commons', name: 'Commons Housing Co-op', type: 'private_equity',
    allocation: 9_000_000, evidenceGrade:'B', evidenceMultiplier:0.85, exposureEligible:true,
    activities: [
      { id:'housing', label:'Permanently affordable cooperative housing',
        impacts:[ {mode:'belonging',polarity:'support',magnitude:0.6}, {mode:'dignity',polarity:'support',magnitude:0.4}, {mode:'agency',polarity:'support',magnitude:0.3} ] },
    ],
    additionality: { path:'additionality', directCapital:true, belowMarket:true, useOfProceedsKnown:true,
      causalMultiplier:0.85, note:'Primary, patient equity — strong additionality.' },
  },
  {
    id: 'civic', name: 'Civic Roots', type: 'grant',
    allocation: 5_000_000, evidenceGrade:'B', evidenceMultiplier:0.80, exposureEligible:false,
    activities: [
      { id:'cived', label:'Youth civic & media-literacy education',
        impacts:[ {mode:'agency',polarity:'support',magnitude:0.5}, {mode:'wisdom',polarity:'support',magnitude:0.5}, {mode:'belonging',polarity:'support',magnitude:0.2} ] },
    ],
    additionality: { path:'coherence', causalMultiplier:0.60,
      note:'Coherence assessed, outcome not verified. Plausible theory of change; evidence grade B.' },
  },
];

export function causalWeight(h: Holding): number {
  return h.allocation * h.additionality.causalMultiplier * h.evidenceMultiplier;
}
export function exposureWeight(h: Holding): number {
  return h.exposureEligible ? h.allocation * h.evidenceMultiplier : 0;
}
