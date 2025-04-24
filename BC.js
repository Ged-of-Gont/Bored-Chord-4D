
    /********************************************************
     * WAVE TOGGLES
     ********************************************************/
    document.querySelectorAll('.wave-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let curr = btn.dataset.wave;
        if (curr === 'off') {
          // from off to sine
          btn.dataset.wave = 'sine';
          btn.textContent = 'SINE';
          btn.style.background = 'var(--secondary)';
          btn.style.color = 'var(--primary)';
          btn.style.border = 'none';
        } else if (curr === 'sine') {
          // from sine to triangle
          btn.dataset.wave = 'triangle';
          btn.textContent = 'TRI.';
          btn.style.background = 'var(--secondary)';
          btn.style.color = 'var(--primary)';
          btn.style.border = 'none';
        } else if (curr === 'triangle') {
          // from triangle to off
          btn.dataset.wave = 'off';
          btn.textContent = 'OFF';
          btn.style.background = 'var(--background)';
          btn.style.color = 'var(--secondary)';
          btn.style.border = '3px solid var(--secondary)';
        }
      });
    });

    /********************************************************
     * WIREFRAME ON/OFF BUTTON
     ********************************************************/
    const wireframeBtn = document.getElementById('wireframeBtn');
    wireframeBtn.addEventListener('click', () => {
      let curr = wireframeBtn.dataset.wireframe;
      if (curr === 'off') {
        // turn ON
        wireframeBtn.dataset.wireframe = 'on';
        wireframeBtn.textContent = 'ON';
        wireframeBtn.style.background = 'var(--secondary)';
        wireframeBtn.style.color = 'var(--primary)';
        wireframeBtn.style.border = 'none';
      } else {
        // turn OFF
        wireframeBtn.dataset.wireframe = 'off';
        wireframeBtn.textContent = 'OFF';
        wireframeBtn.style.background = 'var(--background)';
        wireframeBtn.style.color = 'var(--secondary)';
        wireframeBtn.style.border = '3px solid var(--secondary)';
      }
    });

    function radToDeg(rad) {
      return (rad * 180) / Math.PI;
    }

    /********************************************************
     * ROTATION SLIDERS => DATASET.PHASE
     ********************************************************/
    const rotationSliders = [
      { rangeId: 'phaseXRange',    valId: 'phaseXVal',    offset: 0 },
      { rangeId: 'phaseYRange',    valId: 'phaseYVal',    offset: 0 },
      { rangeId: 'phaseZRange',    valId: 'phaseZVal',    offset: 0 },
      { rangeId: 'phaseWRange',    valId: 'phaseWVal',    offset: 0 },
      { rangeId: 'rotXRange',      valId: 'rotXVal',      offset: 0 },
      { rangeId: 'rotYRange',      valId: 'rotYVal',      offset: 0 },
      { rangeId: 'rotZRange',      valId: 'rotZVal',      offset: Math.PI / 2 },
      { rangeId: 'angle4DXYRange', valId: 'angle4DXYVal', offset: 0 },
      { rangeId: 'angle4DXZRange', valId: 'angle4DXZVal', offset: 0 },
      { rangeId: 'angle4DXWRange', valId: 'angle4DXWVal', offset: 0 },
      { rangeId: 'angle4DYZRange', valId: 'angle4DYZVal', offset: 0 },
      { rangeId: 'angle4DYWRange', valId: 'angle4DYWVal', offset: 0 },
      { rangeId: 'angle4DZWRange', valId: 'angle4DZWVal', offset: 0 }
    ];
    rotationSliders.forEach(obj => {
      let slider = document.getElementById(obj.rangeId);
      let label = document.getElementById(obj.valId);
      if (!slider || !label) return;
      slider.addEventListener('input', e => {
        let val = parseFloat(e.target.value);
        slider.dataset.phase = val;
        let eff = (val + obj.offset) % (2 * Math.PI);
        label.textContent = radToDeg(eff).toFixed(0);
      });
      // Trigger an initial update
      slider.dispatchEvent(new Event('input'));
    });

    /********************************************************
     * FREQUENCIES & LFO SLIDERS
     ********************************************************/
    const freqXInput = document.getElementById("freqX");
    const freqYInput = document.getElementById("freqY");
    const freqZInput = document.getElementById("freqZ");
    const freqWInput = document.getElementById("freqW");

    const masterRateSlider = document.getElementById("masterRateSlider");
    const masterRateVal = document.getElementById("masterRateVal");
    const masterRateToggle1 = document.getElementById("masterRateToggle1");
    masterRateSlider.addEventListener("input", () => {
      let freq = getTaperedValue("masterRateSlider");
      masterRateVal.textContent = freq.toFixed(2);
    });
    masterRateSlider.dispatchEvent(new Event('input'));

    const masterRateSlider2 = document.getElementById("masterRateSlider2");
    const masterRateVal2 = document.getElementById("masterRateVal2");
    const masterRateToggle2 = document.getElementById("masterRateToggle2");
    masterRateSlider2.addEventListener("input", () => {
      let freq2 = getTaperedValue("masterRateSlider2");
      masterRateVal2.textContent = freq2.toFixed(2);
    });
    masterRateSlider2.dispatchEvent(new Event('input'));

    const volumeSlider = document.getElementById("volumeSlider");
    const volVal = document.getElementById("volVal");
    volumeSlider.addEventListener("input", () => {
      let v = getTaperedValue("volumeSlider");
      volVal.textContent = v.toFixed(2);
    });
    volumeSlider.dispatchEvent(new Event('input'));

    const dtSlider = document.getElementById("dtSlider");
    const dtVal = document.getElementById("dtVal");
    dtSlider.addEventListener("input", () => {
      let dt = getTaperedValue("dtSlider");
      dtVal.textContent = dt.toExponential(2);
      buildTimeArray();
    });
    dtSlider.dispatchEvent(new Event('input'));

    const numPointsSlider = document.getElementById("numPointsSlider");
    const numPointsVal = document.getElementById("numPointsVal");
    numPointsSlider.addEventListener("input", () => {
      let val = getTaperedValue("numPointsSlider");
      let n = Math.round(val);
      numPointsVal.textContent = n;
      buildTimeArray();
    });
    numPointsSlider.dispatchEvent(new Event('input'));

    const saturationSlider = document.getElementById("saturationSlider");
    const saturationVal = document.getElementById("saturationVal");
    saturationSlider.addEventListener("input", () => {
      let s = getTaperedValue("saturationSlider");
      saturationVal.textContent = s.toFixed(0);
    });
    saturationSlider.dispatchEvent(new Event('input'));

    let timeArray = [];
    function buildTimeArray() {
      timeArray = [];
      let nPoints = Math.round(getTaperedValue("numPointsSlider"));
      let dt = getTaperedValue("dtSlider");
      for (let i = 0; i < nPoints; i++) {
        timeArray.push(i * dt);
      }
    }
    buildTimeArray();

    function triangleWave(x) {
      return (2 / Math.PI) * Math.asin(Math.sin(x));
    }
    function getWaveValue(wave, angle) {
      if (wave === 'off')  return 0;
      if (wave === 'triangle') return triangleWave(angle);
      return Math.sin(angle);
    }

    /********************************************************
     * 3D ROTATIONS & 4D ROTATIONS
     ********************************************************/
    function rotateX(x, y, z, ax) {
      let c = Math.cos(ax), s = Math.sin(ax);
      return { x, y: y * c - z * s, z: y * s + z * c };
    }
    function rotateY(x, y, z, ay) {
      let c = Math.cos(ay), s = Math.sin(ay);
      return { x: z * s + x * c, y, z: z * c - x * s };
    }
    function rotateZ(x, y, z, az) {
      let c = Math.cos(az), s = Math.sin(az);
      return { x: x * c - y * s, y: x * s + y * c, z };
    }
    function rotateXYZ(x, y, z, ax, ay, az) {
      let r = rotateX(x, y, z, ax);
      r = rotateY(r.x, r.y, r.z, ay);
      r = rotateZ(r.x, r.y, r.z, az);
      return r;
    }

    // 4D rotation "helpers"
    function rotateXY(v, t) {
      let c = Math.cos(t), s = Math.sin(t);
      return { x: v.x * c - v.y * s, y: v.x * s + v.y * c, z: v.z, w: v.w };
    }
    function rotateXZ(v, t) {
      let c = Math.cos(t), s = Math.sin(t);
      return { x: v.x * c - v.z * s, y: v.y, z: v.x * s + v.z * c, w: v.w };
    }
    function rotateXW(v, t) {
      let c = Math.cos(t), s = Math.sin(t);
      return { x: v.x * c - v.w * s, y: v.y, z: v.z, w: v.x * s + v.w * c };
    }
    function rotateYZ(v, t) {
      let c = Math.cos(t), s = Math.sin(t);
      return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c, w: v.w };
    }
    function rotateYW(v, t) {
      let c = Math.cos(t), s = Math.sin(t);
      return { x: v.x, y: v.y * c - v.w * s, z: v.z, w: v.y * s + v.w * c };
    }
    function rotateZW(v, t) {
      let c = Math.cos(t), s = Math.sin(t);
      return { x: v.x, y: v.y, z: v.z * c - v.w * s, w: v.z * s + v.w * c };
    }

    /********************************************************
     * AUTOMATED SLIDER UPDATES
     ********************************************************/
    function updateAutomatedSliders(deltaTime, speed) {
      const twoPi = 2 * Math.PI;
      document.querySelectorAll('.autoMaster').forEach(auto => {
        if (auto.checked) {
          let targetId = auto.dataset.target;
          let slider = document.getElementById(targetId);
          if (slider) {
            let minVal = parseFloat(slider.min), maxVal = parseFloat(slider.max);
            let range = maxVal - minVal;
            if (Math.abs(range - twoPi) < 1e-5) {
              let phase = parseFloat(slider.dataset.phase || slider.value);
              phase += speed * deltaTime;
              slider.dataset.phase = phase;
              let wrapped = ((phase - minVal) % range + range) % range + minVal;
              slider.value = wrapped;
              slider.dispatchEvent(new Event('input'));
            } else {
              let curVal = parseFloat(slider.value);
              let newVal = curVal + speed * deltaTime;
              if (newVal > maxVal) newVal = maxVal;
              if (newVal < minVal) newVal = minVal;
              slider.value = newVal;
              slider.dispatchEvent(new Event('input'));
            }
          }
        }
      });
    }
    function getContinuousAngle(sliderId, offset = 0) {
      let slider = document.getElementById(sliderId);
      if (!slider) return offset;
      let phase = parseFloat(slider.dataset.phase || slider.value);
      return phase + offset;
    }

    /********************************************************
     * CANVAS & DRAWING
     ********************************************************/
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Build hypercube & 3D-cube data
    const hypercubeVertices = [];
    for (let i = 0; i < 16; i++) {
      hypercubeVertices.push({
        x: (i & 1) ? 1 : -1,
        y: (i & 2) ? 1 : -1,
        z: (i & 4) ? 1 : -1,
        w: (i & 8) ? 1 : -1
      });
    }
    const hypercubeEdges = [];
    for (let i = 0; i < 16; i++) {
      for (let bit = 0; bit < 4; bit++) {
        let j = i ^ (1 << bit);
        if (j > i) hypercubeEdges.push([i, j]);
      }
    }
    const cube3DVertices = [
      { x: -1, y: -1, z: -1, w: 0 },
      { x: 1,  y: -1, z: -1, w: 0 },
      { x: 1,  y: 1,  z: -1, w: 0 },
      { x: -1, y: 1,  z: -1, w: 0 },
      { x: -1, y: -1, z: 1,  w: 0 },
      { x: 1,  y: -1, z: 1,  w: 0 },
      { x: 1,  y: 1,  z: 1,  w: 0 },
      { x: -1, y: 1,  z: 1,  w: 0 }
    ];
    const cube3DEdges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    // Draw wireframe
    function drawWireframe(ax, ay, az, aXY, aXZ, aXW, aYZ, aYW, aZW, camZ) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([4,4]);
      ctx.strokeStyle = "rgba(251,246,228,0.5)";
      let hProj = [];
      for (let v of hypercubeVertices) {
        let r = rotateXY(v, aXY);
        r = rotateXZ(r, aXZ);
        r = rotateXW(r, aXW);
        r = rotateYZ(r, aYZ);
        r = rotateYW(r, aYW);
        r = rotateZW(r, aZW);

        let d4 = 5;
        let factor4 = d4 / (d4 - r.w);
        let x3 = r.x * factor4;
        let y3 = r.y * factor4;
        let z3 = r.z * factor4;
        let { x: xr, y: yr, z: zr } = rotateXYZ(x3, y3, z3, ay, ax, az);

        let denom = camZ - zr;
        if (Math.abs(denom) < 1e-5) denom = 1e-5;
        let scale = Math.min(canvas.width, canvas.height) * 0.45;
        let px = canvas.width * 0.5 + (xr / denom) * scale;
        let py = canvas.height * 0.5 - (yr / denom) * scale;
        hProj.push({ x: px, y: py });
      }
      for (let [start, end] of hypercubeEdges) {
        let A = hProj[start], B = hProj[end];
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(251,246,228,0.5)";
      let cProj = [];
      for (let v of cube3DVertices) {
        let r = rotateXY(v, aXY);
        r = rotateXZ(r, aXZ);
        r = rotateXW(r, aXW);
        r = rotateYZ(r, aYZ);
        r = rotateYW(r, aYW);
        r = rotateZW(r, aZW);

        let d4 = 5;
        let factor4 = d4 / (d4 - r.w);
        let x3 = r.x * factor4;
        let y3 = r.y * factor4;
        let z3 = r.z * factor4;
        let { x: xr, y: yr, z: zr } = rotateXYZ(x3, y3, z3, ay, ax, az);

        let denom = camZ - zr;
        if (Math.abs(denom) < 1e-5) denom = 1e-5;
        let scale = Math.min(canvas.width, canvas.height) * 0.45;
        let px = canvas.width * 0.5 + (xr / denom) * scale;
        let py = canvas.height * 0.5 - (yr / denom) * scale;
        cProj.push({ x: px, y: py });
      }
      for (let [start, end] of cube3DEdges) {
        let A = cProj[start], B = cProj[end];
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    /********************************************************
     * MAIN ANIMATION LOOP
     ********************************************************/
    let lastFrameTime = performance.now();
    function drawFrame(now) {
      let deltaTime = (now - lastFrameTime) * 0.001;
      lastFrameTime = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // LFO freq
      const lfo1 = masterRateToggle1.checked, lfo2 = masterRateToggle2.checked;
      let f1 = getTaperedValue("masterRateSlider");
      let f2 = getTaperedValue("masterRateSlider2");
      let effFreq;
      if (lfo1 && !lfo2)      effFreq = f1;
      else if (!lfo1 && lfo2) effFreq = f2;
      else if (lfo1 && lfo2) {
        effFreq = f1 * (1 + 0.5 * Math.sin(2 * Math.PI * f2 * (now * 0.001)));
      } else effFreq = 0;

      const speed = 2 * Math.PI * effFreq;
      updateAutomatedSliders(deltaTime, speed);

      let fx = parseFloat(freqXInput.value) || DEFAULT_FREQS[0];
      let fy = parseFloat(freqYInput.value) || DEFAULT_FREQS[1];
      let fz = parseFloat(freqZInput.value) || DEFAULT_FREQS[2];
      let fw = parseFloat(freqWInput.value) || DEFAULT_FREQS[3];

      // read 4D phases
      let phx = getContinuousAngle("phaseXRange");
      let phy = getContinuousAngle("phaseYRange");
      let phz = getContinuousAngle("phaseZRange");
      let phw = getContinuousAngle("phaseWRange");

      // read 3D angles
      let ax = getContinuousAngle("rotXRange");
      let ay = getContinuousAngle("rotYRange");
      let rawAz = getContinuousAngle("rotZRange");
      // your old offset:
      let az = rawAz + Math.PI / 2;

      let vol = getTaperedValue("volumeSlider") || 5;
      let camZ = 5 - 0.4 * (vol - 1);

      let n = timeArray.length;

      let waveX = document.getElementById("waveTypeX").dataset.wave;
      let waveY = document.getElementById("waveTypeY").dataset.wave;
      let waveZ = document.getElementById("waveTypeZ").dataset.wave;
      let waveW = document.getElementById("waveTypeW").dataset.wave;

      // read 4D angles
      let aXY = getContinuousAngle("angle4DXYRange");
      let aXZ = getContinuousAngle("angle4DXZRange");
      let aXW = getContinuousAngle("angle4DXWRange");
      let aYZ = getContinuousAngle("angle4DYZRange");
      let aYW = getContinuousAngle("angle4DYWRange");
      let aZW = getContinuousAngle("angle4DZWRange");

      let alphaFrac = getTaperedValue("saturationSlider") / 100;

      // MAIN wave draw
      for (let i = 0; i < n; i++) {
        let t = timeArray[i];
        let angleX = 2 * Math.PI * fx * t + phx;
        let angleY = 2 * Math.PI * fy * t + phy;
        let angleZ = 2 * Math.PI * fz * t + phz;
        let angleW = 2 * Math.PI * fw * t + phw;

        let x4 = getWaveValue(waveX, angleX);
        let y4 = getWaveValue(waveY, angleY);
        let z4 = getWaveValue(waveZ, angleZ);
        let w4 = getWaveValue(waveW, angleW);

        let v4 = { x: x4, y: y4, z: z4, w: w4 };
        v4 = rotateXY(v4, aXY);
        v4 = rotateXZ(v4, aXZ);
        v4 = rotateXW(v4, aXW);
        v4 = rotateYZ(v4, aYZ);
        v4 = rotateYW(v4, aYW);
        v4 = rotateZW(v4, aZW);

        let allZero4D = (aXW === 0 && aYW === 0 && aZW === 0);
        let effW = allZero4D ? 0 : v4.w;
        let d4 = 5;
        let factor4 = d4 / (d4 - effW);
        let x3 = v4.x * factor4;
        let y3 = v4.y * factor4;
        let z3 = v4.z * factor4;

        // mismatch param => rotateXYZ(..., ay, ax, az)
        let { x: xr, y: yr, z: zr } = rotateXYZ(x3, y3, z3, ay, ax, az);

        let denom = camZ - zr;
        if (Math.abs(denom) < 1e-5) continue;
        let scale = Math.min(canvas.width, canvas.height) * 0.45;
        let px = canvas.width * 0.5 + (xr / denom) * scale;
        let py = canvas.height * 0.5 - (yr / denom) * scale;

        // constant radius
        let radius = 2;
        let whiteAlpha = 1 - alphaFrac;
        let hue = (zr + 1) * 180;

        // partial off-white fill
        if (whiteAlpha > 0) {
          ctx.fillStyle = `rgba(251,246,228,${whiteAlpha})`;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
        // hue-based fill
        ctx.fillStyle = `hsla(${hue},100%,50%,${alphaFrac})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, 2 * Math.PI);
        ctx.fill();
      }

      // If wireframe ON
      if (wireframeBtn.dataset.wireframe === 'on') {
        drawWireframe(ax, ay, az, aXY, aXZ, aXW, aYZ, aYW, aZW, camZ);
      }

      requestAnimationFrame(drawFrame);
    }
    requestAnimationFrame(drawFrame);
 


  
    /********************************************************
     * DYNAMIC SLIDER TRACK GRADIENT
     ********************************************************/
    document.querySelectorAll('input[type=range]').forEach(slider => {
      slider.addEventListener('input', () => {
        let min = parseFloat(slider.min) || 0,
            max = parseFloat(slider.max) || 100,
            val = parseFloat(slider.value);
        let pct = ((val - min) * 100 / (max - min)) + '%';
        slider.style.setProperty('--range-progress', pct);
      });
      slider.dispatchEvent(new Event('input'));
    });
 

  
    /********************************************************
     * CHORD PRESET DROPDOWN
     ********************************************************/
    document.getElementById('chordPreset').addEventListener('change', function() {
      
      const freqIDs = ['freqX','freqY','freqZ','freqW'];
      const values = CHORD_PRESETS[this.value];
      if (values) {
        freqIDs.forEach((id, i) => {
          document.getElementById(id).value = values[i];
        });
      }
      freqIDs.forEach(id => {
        document.getElementById(id).dispatchEvent(new Event('input'));
      });
    });
 

 
    /********************************************************
     * RESPONSIVE SCALING OF TOOLBARS
     ********************************************************/
    function scaleToolbar(toolbar) {
      const viewportHeight = window.innerHeight;
      const toolbarHeight = toolbar.scrollHeight;
      const scale = Math.min(1, viewportHeight / toolbarHeight);
      toolbar.style.transform = `scale(${scale})`;
      if (toolbar.id === "controlsRight") {
        toolbar.style.transformOrigin = "top right";
      } else {
        toolbar.style.transformOrigin = "top left";
      }
    }
    const controlsLeft = document.getElementById("controlsLeft");
    const controlsRight = document.getElementById("controlsRight");
    scaleToolbar(controlsLeft);
    scaleToolbar(controlsRight);
    window.addEventListener("resize", () => {
      scaleToolbar(controlsLeft);
      scaleToolbar(controlsRight);
    });
 

 
    /********************************************************
     * (A) BUILD FILENAME FROM FREQUENCIES
     ********************************************************/
    function getFrequencyFileName() {
      const fx = document.getElementById("freqX").value;
      const fy = document.getElementById("freqY").value;
      const fz = document.getElementById("freqZ").value;
      const fw = document.getElementById("freqW").value;
      return `${fx}_${fy}_${fz}_${fw}_BC4D.json`;
    }

    /********************************************************
     * (B) WAVE/WIREFRAME BUTTON UI HELPERS
     ********************************************************/
    function updateWaveButtonUI(btn, waveState) {
      btn.dataset.wave = waveState;
      switch (waveState) {
        case 'off':
          btn.textContent = 'OFF';
          btn.style.background = 'var(--background)';
          btn.style.color = 'var(--secondary)';
          btn.style.border = '3px solid var(--secondary)';
          break;
        case 'sine':
          btn.textContent = 'SINE';
          btn.style.background = 'var(--secondary)';
          btn.style.color = 'var(--primary)';
          btn.style.border = 'none';
          break;
        case 'triangle':
          btn.textContent = 'TRI.';
          btn.style.background = 'var(--secondary)';
          btn.style.color = 'var(--primary)';
          btn.style.border = 'none';
          break;
      }
    }

    function updateWireframeButtonUI(btn, wireframeState) {
      btn.dataset.wireframe = wireframeState;
      if (wireframeState === 'on') {
        btn.textContent = 'ON';
        btn.style.background = 'var(--secondary)';
        btn.style.color = 'var(--primary)';
        btn.style.border = 'none';
      } else {
        btn.textContent = 'OFF';
        btn.style.background = 'var(--background)';
        btn.style.color = 'var(--secondary)';
        btn.style.border = '3px solid var(--secondary)';
      }
    }

    /********************************************************
     * (C) GET ALL CURRENT SETTINGS => JSON
     ********************************************************/
    function getSettings() {
      const settings = {};
      const allInputs = document.querySelectorAll(
        "#controlsLeft input, #controlsLeft select, #controlsRight input, #controlsRight select"
      );
      allInputs.forEach(el => {
        if (el.type === "checkbox") {
          settings[el.id] = el.checked;
        } else {
          settings[el.id] = el.value;
        }
      });
      const waveX = document.getElementById("waveTypeX");
      const waveY = document.getElementById("waveTypeY");
      const waveZ = document.getElementById("waveTypeZ");
      const waveW = document.getElementById("waveTypeW");
      const wireB = document.getElementById("wireframeBtn");
      if (waveX) settings.waveTypeXState = waveX.dataset.wave;
      if (waveY) settings.waveTypeYState = waveY.dataset.wave;
      if (waveZ) settings.waveTypeZState = waveZ.dataset.wave;
      if (waveW) settings.waveTypeWState = waveW.dataset.wave;
      if (wireB) settings.wireframeBtnState = wireB.dataset.wireframe;
      return settings;
    }

    /********************************************************
     * (D) APPLY JSON SETTINGS TO THE UI
     ********************************************************/
    function setSettings(settings) {
      const allInputs = document.querySelectorAll(
        "#controlsLeft input, #controlsLeft select, #controlsRight input, #controlsRight select"
      );
      allInputs.forEach(el => {
        if (settings.hasOwnProperty(el.id)) {
          if (el.type === "checkbox") {
            el.checked = settings[el.id];
          } else {
            el.value = settings[el.id];
          }
          // Trigger "input" so existing logic updates
          el.dispatchEvent(new Event("input"));
        }
      });
      const waveX = document.getElementById("waveTypeX");
      const waveY = document.getElementById("waveTypeY");
      const waveZ = document.getElementById("waveTypeZ");
      const waveW = document.getElementById("waveTypeW");
      const wireB = document.getElementById("wireframeBtn");

      if (waveX && settings.waveTypeXState) {
        updateWaveButtonUI(waveX, settings.waveTypeXState);
      }
      if (waveY && settings.waveTypeYState) {
        updateWaveButtonUI(waveY, settings.waveTypeYState);
      }
      if (waveZ && settings.waveTypeZState) {
        updateWaveButtonUI(waveZ, settings.waveTypeZState);
      }
      if (waveW && settings.waveTypeWState) {
        updateWaveButtonUI(waveW, settings.waveTypeWState);
      }
      if (wireB && settings.wireframeBtnState) {
        updateWireframeButtonUI(wireB, settings.wireframeBtnState);
      }
    }

    /********************************************************
     * (E) HOOK UP THE "SAVE" & "LOAD" BUTTONS
     ********************************************************/
    document.getElementById("saveSettings").addEventListener("click", () => {
      const settings = getSettings();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
      const fileName = getFrequencyFileName();
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", fileName);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    document.getElementById("loadSettings").addEventListener("click", () => {
      document.getElementById("loadSettingsFile").click();
    });

    document.getElementById("loadSettingsFile").addEventListener("change", event => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          setSettings(settings);
        } catch (err) {
          alert("Error parsing JSON:\n" + err);
        }
      };
      reader.readAsText(file);
    });

    /********************************************************
     * INIT/RESET ("INITIALIZE") BUTTON
     ********************************************************/
    let defaultSettings = getSettings();
    document.getElementById("initializeSettings").addEventListener("click", () => {
      setSettings(defaultSettings);
    });
 