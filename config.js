

const TAPER_CONFIGS = {
    masterRateSlider:  { min: 0.01,  max: 0.25,   anchorPct: 50, anchorVal: 0.1 },
    masterRateSlider2: { min: 0.5,   max: 1,     anchorPct: 50, anchorVal: .75 },
    volumeSlider:      { min: 1,     max: 11,    anchorPct: 50, anchorVal: 5 },
    dtSlider:          { min: 1e-5,  max: 5e-3,  anchorPct: 35, anchorVal: 8e-4 },
    numPointsSlider:   { min: 100,   max: 250000, anchorPct: 20, anchorVal: 800 },
    saturationSlider:  { min: 0,     max: 100,   anchorPct: 0,  anchorVal: 0 }
  };
  
  const CHORD_PRESETS = {
    maj7:     [8, 10, 12, 15],
    min7:     [10, 12, 15, 18],
    dom7:     [20, 25, 30, 36],
    dim7:     [125, 150, 180, 216],
    maj6:     [16, 20, 24, 27],
    min6:     [80, 96, 120, 135],
    hdim7:    [25, 30, 36, 45],
    minmaj7:  [40, 48, 60, 75],
    minb6:    [10, 12, 15, 16],
    augmaj7:  [16, 20, 25, 30]
  };
  
  const DEFAULT_FREQS = [3, 4, 5, 6];
  
  const DEFAULT_SLIDER_VALUES = {
    masterRateSlider: 1,
    masterRateSlider2: 25,
    volumeSlider: 75,
    dtSlider: 40,
    numPointsSlider: 65,
    saturationSlider: 0
  };
  
  function customTaper(t, config) {
    let { min, max, anchorPct, anchorVal } = config;
    let a = anchorPct / 100;
    if (a <= 0 || a >= 1) {
      return min + (max - min) * t;
    }
    let e = Math.log((anchorVal - min) / (max - min)) / Math.log(a);
    return min + (max - min) * Math.pow(t, e);
  }
  
  function getTaperedValue(sliderId) {
    const el = document.getElementById(sliderId);
    if (!el) return 0;
    let cfg = TAPER_CONFIGS[sliderId];
    if (!cfg) {
      return parseFloat(el.value);
    }
    let rawVal = parseFloat(el.value);
    let t = rawVal / 100;
    return customTaper(t, cfg);
  }
  
