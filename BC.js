
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

    let timeArray = new Float32Array(0);
    let timeBufferDirty = true;
    function buildTimeArray() {
      let nPoints = Math.round(getTaperedValue("numPointsSlider"));
      let dt = getTaperedValue("dtSlider");
      let arr = new Float32Array(nPoints);
      for (let i = 0; i < nPoints; i++) {
        arr[i] = i * dt;
      }
      timeArray = arr;
      timeBufferDirty = true;
    }
    buildTimeArray();

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
     * WEBGL POINT RENDERING SETUP
     ********************************************************/
    const glCanvas = document.getElementById("glCanvas");
    const wireCanvas = document.getElementById("wireCanvas");
    const gl = glCanvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) {
      alert("WebGL is required to render the curve. Please use a compatible browser.");
      throw new Error("WebGL not supported");
    }
    const wireCtx = wireCanvas.getContext("2d");

    const vertexShaderSource = `
      precision mediump float;
      attribute float a_time;
      varying vec4 v_color;

      uniform vec4 u_freqs;
      uniform vec4 u_phases;
      uniform ivec4 u_waveTypes;
      uniform vec3 u_rot3D;
      uniform vec3 u_rot4D_1;
      uniform vec3 u_rot4D_2;
      uniform float u_camZ;
      uniform float u_scaleX;
      uniform float u_scaleY;
      uniform float u_alphaFrac;
      uniform float u_pointSize;

      const float PI = 3.1415926535897932384626433832795;
      const vec3 OFF_WHITE = vec3(0.9843137, 0.9647058, 0.8941176);

      float triangleWave(float x) {
        return (2.0 / PI) * asin(sin(x));
      }

      float getWaveValue(int waveType, float angle) {
        if (waveType == 0) {
          return 0.0;
        } else if (waveType == 2) {
          return triangleWave(angle);
        }
        return sin(angle);
      }

      vec4 rotateXY(vec4 v, float t) {
        float c = cos(t), s = sin(t);
        return vec4(v.x * c - v.y * s, v.x * s + v.y * c, v.z, v.w);
      }
      vec4 rotateXZ(vec4 v, float t) {
        float c = cos(t), s = sin(t);
        return vec4(v.x * c - v.z * s, v.y, v.x * s + v.z * c, v.w);
      }
      vec4 rotateXW(vec4 v, float t) {
        float c = cos(t), s = sin(t);
        return vec4(v.x * c - v.w * s, v.y, v.z, v.x * s + v.w * c);
      }
      vec4 rotateYZ(vec4 v, float t) {
        float c = cos(t), s = sin(t);
        return vec4(v.x, v.y * c - v.z * s, v.y * s + v.z * c, v.w);
      }
      vec4 rotateYW(vec4 v, float t) {
        float c = cos(t), s = sin(t);
        return vec4(v.x, v.y * c - v.w * s, v.z, v.y * s + v.w * c);
      }
      vec4 rotateZW(vec4 v, float t) {
        float c = cos(t), s = sin(t);
        return vec4(v.x, v.y, v.z * c - v.w * s, v.z * s + v.w * c);
      }

      vec3 rotateX3(vec3 v, float ax) {
        float c = cos(ax), s = sin(ax);
        return vec3(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
      }
      vec3 rotateY3(vec3 v, float ay) {
        float c = cos(ay), s = sin(ay);
        return vec3(v.z * s + v.x * c, v.y, v.z * c - v.x * s);
      }
      vec3 rotateZ3(vec3 v, float az) {
        float c = cos(az), s = sin(az);
        return vec3(v.x * c - v.y * s, v.x * s + v.y * c, v.z);
      }
      vec3 rotateXYZ(vec3 v, vec3 ang) {
        vec3 r = rotateX3(v, ang.x);
        r = rotateY3(r, ang.y);
        r = rotateZ3(r, ang.z);
        return r;
      }

      float hue2rgb(float p, float q, float t) {
        if (t < 0.0) t += 1.0;
        if (t > 1.0) t -= 1.0;
        if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
        if (t < 1.0 / 2.0) return q;
        if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
        return p;
      }

      vec3 hsl2rgb(float h, float s, float l) {
        if (s == 0.0) {
          return vec3(l, l, l);
        }
        float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        float p = 2.0 * l - q;
        float r = hue2rgb(p, q, h + 1.0 / 3.0);
        float g = hue2rgb(p, q, h);
        float b = hue2rgb(p, q, h - 1.0 / 3.0);
        return vec3(r, g, b);
      }

      void main() {
        float angleX = 2.0 * PI * u_freqs.x * a_time + u_phases.x;
        float angleY = 2.0 * PI * u_freqs.y * a_time + u_phases.y;
        float angleZ = 2.0 * PI * u_freqs.z * a_time + u_phases.z;
        float angleW = 2.0 * PI * u_freqs.w * a_time + u_phases.w;

        float x4 = getWaveValue(u_waveTypes.x, angleX);
        float y4 = getWaveValue(u_waveTypes.y, angleY);
        float z4 = getWaveValue(u_waveTypes.z, angleZ);
        float w4 = getWaveValue(u_waveTypes.w, angleW);

        vec4 v4 = vec4(x4, y4, z4, w4);
        v4 = rotateXY(v4, u_rot4D_1.x);
        v4 = rotateXZ(v4, u_rot4D_1.y);
        v4 = rotateXW(v4, u_rot4D_1.z);
        v4 = rotateYZ(v4, u_rot4D_2.x);
        v4 = rotateYW(v4, u_rot4D_2.y);
        v4 = rotateZW(v4, u_rot4D_2.z);

        bool zeroXW = abs(u_rot4D_1.z) < 1e-6;
        bool zeroYW = abs(u_rot4D_2.y) < 1e-6;
        bool zeroZW = abs(u_rot4D_2.z) < 1e-6;
        float effW = (zeroXW && zeroYW && zeroZW) ? 0.0 : v4.w;
        float d4 = 5.0;
        float factor4 = d4 / (d4 - effW);
        vec3 v3 = v4.xyz * factor4;

        vec3 rotated3 = rotateXYZ(v3, u_rot3D);
        float denom = u_camZ - rotated3.z;
        bool skipPoint = abs(denom) < 1e-5;
        denom = skipPoint ? (denom >= 0.0 ? 1e-5 : -1e-5) : denom;
        float clipX = (rotated3.x / denom) * u_scaleX;
        float clipY = (rotated3.y / denom) * u_scaleY;

        if (skipPoint) {
          gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
          gl_PointSize = 0.0;
          v_color = vec4(0.0);
          return;
        }

        float hueDegrees = (rotated3.z + 1.0) * 180.0;
        float hue = fract(hueDegrees / 360.0);
        vec3 rgb = hsl2rgb(hue, 1.0, 0.5);
        float mixAmt = clamp(u_alphaFrac, 0.0, 1.0);
        vec3 finalColor = mix(OFF_WHITE, rgb, mixAmt);

        gl_Position = vec4(clipX, clipY, 0.0, 1.0);
        gl_PointSize = u_pointSize;
        v_color = vec4(finalColor, 1.0);
      }
    `;
    const fragmentShaderSource = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        if (dot(coord, coord) > 0.25) {
          discard;
        }
        gl_FragColor = v_color;
      }
    `;

    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        throw new Error("Shader compilation failed");
      }
      return shader;
    }
    function createProgram(glCtx, vsSource, fsSource) {
      const program = glCtx.createProgram();
      const vs = createShader(glCtx, glCtx.VERTEX_SHADER, vsSource);
      const fs = createShader(glCtx, glCtx.FRAGMENT_SHADER, fsSource);
      glCtx.attachShader(program, vs);
      glCtx.attachShader(program, fs);
      glCtx.linkProgram(program);
      if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
        console.error(glCtx.getProgramInfoLog(program));
        throw new Error("Program linking failed");
      }
      return program;
    }

    const pointProgram = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    const timeLoc = gl.getAttribLocation(pointProgram, "a_time");
    const pointSizeUniform = gl.getUniformLocation(pointProgram, "u_pointSize");
    const freqsLoc = gl.getUniformLocation(pointProgram, "u_freqs");
    const phasesLoc = gl.getUniformLocation(pointProgram, "u_phases");
    const waveTypesLoc = gl.getUniformLocation(pointProgram, "u_waveTypes");
    const rot3DLoc = gl.getUniformLocation(pointProgram, "u_rot3D");
    const rot4D1Loc = gl.getUniformLocation(pointProgram, "u_rot4D_1");
    const rot4D2Loc = gl.getUniformLocation(pointProgram, "u_rot4D_2");
    const camZLoc = gl.getUniformLocation(pointProgram, "u_camZ");
    const scaleXLoc = gl.getUniformLocation(pointProgram, "u_scaleX");
    const scaleYLoc = gl.getUniformLocation(pointProgram, "u_scaleY");
    const alphaLoc = gl.getUniformLocation(pointProgram, "u_alphaFrac");
    const timeBuffer = gl.createBuffer();
    const waveTypeVec = new Int32Array(4);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function uploadTimeBuffer() {
      gl.bindBuffer(gl.ARRAY_BUFFER, timeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, timeArray, gl.DYNAMIC_DRAW);
      timeBufferDirty = false;
    }

    function renderPoints(count, uniforms) {
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (count === 0) return;

      if (timeBufferDirty) {
        uploadTimeBuffer();
      }

      gl.useProgram(pointProgram);
      gl.uniform1f(pointSizeUniform, uniforms.pointSize);
      gl.uniform4f(freqsLoc, uniforms.freqs[0], uniforms.freqs[1], uniforms.freqs[2], uniforms.freqs[3]);
      gl.uniform4f(phasesLoc, uniforms.phases[0], uniforms.phases[1], uniforms.phases[2], uniforms.phases[3]);
      gl.uniform4iv(waveTypesLoc, uniforms.waveTypes);
      gl.uniform3f(rot3DLoc, uniforms.rot3D[0], uniforms.rot3D[1], uniforms.rot3D[2]);
      gl.uniform3f(rot4D1Loc, uniforms.rot4D1[0], uniforms.rot4D1[1], uniforms.rot4D1[2]);
      gl.uniform3f(rot4D2Loc, uniforms.rot4D2[0], uniforms.rot4D2[1], uniforms.rot4D2[2]);
      gl.uniform1f(camZLoc, uniforms.camZ);
      gl.uniform1f(scaleXLoc, uniforms.scale[0]);
      gl.uniform1f(scaleYLoc, uniforms.scale[1]);
      gl.uniform1f(alphaLoc, uniforms.alphaFrac);

      gl.bindBuffer(gl.ARRAY_BUFFER, timeBuffer);
      gl.enableVertexAttribArray(timeLoc);
      gl.vertexAttribPointer(timeLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, count);
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
    function resizeCanvas() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      glCanvas.width = width;
      glCanvas.height = height;
      wireCanvas.width = width;
      wireCanvas.height = height;
      gl.viewport(0, 0, width, height);
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
      wireCtx.save();
      wireCtx.lineWidth = 1;
      wireCtx.setLineDash([4,4]);
      wireCtx.strokeStyle = "rgba(251,246,228,0.5)";
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
        let scale = Math.min(wireCanvas.width, wireCanvas.height) * 0.45;
        let px = wireCanvas.width * 0.5 + (xr / denom) * scale;
        let py = wireCanvas.height * 0.5 - (yr / denom) * scale;
        hProj.push({ x: px, y: py });
      }
      for (let [start, end] of hypercubeEdges) {
        let A = hProj[start], B = hProj[end];
        wireCtx.beginPath();
        wireCtx.moveTo(A.x, A.y);
        wireCtx.lineTo(B.x, B.y);
        wireCtx.stroke();
      }
      wireCtx.restore();

      wireCtx.save();
      wireCtx.lineWidth = 2;
      wireCtx.setLineDash([]);
      wireCtx.strokeStyle = "rgba(251,246,228,0.5)";
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
        let scale = Math.min(wireCanvas.width, wireCanvas.height) * 0.45;
        let px = wireCanvas.width * 0.5 + (xr / denom) * scale;
        let py = wireCanvas.height * 0.5 - (yr / denom) * scale;
        cProj.push({ x: px, y: py });
      }
      for (let [start, end] of cube3DEdges) {
        let A = cProj[start], B = cProj[end];
        wireCtx.beginPath();
        wireCtx.moveTo(A.x, A.y);
        wireCtx.lineTo(B.x, B.y);
        wireCtx.stroke();
      }
      wireCtx.restore();
    }

    /********************************************************
     * MAIN ANIMATION LOOP
     ********************************************************/
    let lastFrameTime = performance.now();
    function drawFrame(now) {
      let deltaTime = (now - lastFrameTime) * 0.001;
      lastFrameTime = now;
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

      const pointCount = timeArray.length;
      const width = glCanvas.width || 1;
      const height = glCanvas.height || 1;
      const minDim = Math.min(width, height);
      const scalePx = minDim * 0.45;
      const scaleX = width > 0 ? scalePx / (width * 0.5) : 1;
      const scaleY = height > 0 ? scalePx / (height * 0.5) : 1;
      const waveTypeMap = { off: 0, sine: 1, triangle: 2 };
      waveTypeVec[0] = waveTypeMap[waveX] ?? 1;
      waveTypeVec[1] = waveTypeMap[waveY] ?? 1;
      waveTypeVec[2] = waveTypeMap[waveZ] ?? 1;
      waveTypeVec[3] = waveTypeMap[waveW] ?? 1;
      const dpr = window.devicePixelRatio || 1;
      const uniforms = {
        pointSize: 4.0 * dpr,
        freqs: [fx, fy, fz, fw],
        phases: [phx, phy, phz, phw],
        waveTypes: waveTypeVec,
        rot3D: [ay, ax, az],
        rot4D1: [aXY, aXZ, aXW],
        rot4D2: [aYZ, aYW, aZW],
        camZ,
        scale: [scaleX, scaleY],
        alphaFrac
      };

      renderPoints(pointCount, uniforms);

      wireCtx.clearRect(0, 0, wireCanvas.width, wireCanvas.height);
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
 
