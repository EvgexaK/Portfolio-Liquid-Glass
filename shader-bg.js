/**
 * WebGL2 Mesh Gradient Background
 * Ported from @paper-design/shaders MeshGradient
 * Vanilla JS — no dependencies
 */

(function () {
  'use strict';

  // ─── GLSL Shaders ───────────────────────────────────────────────

  const vertexSource = `#version 300 es
    in vec2 a_position;
    out vec2 v_objectUV;
    void main() {
      v_objectUV = a_position * 0.5 + 0.5;
      // Flip Y so (0,0) is bottom-left
      v_objectUV.y = 1.0 - v_objectUV.y;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const MAX_COLORS = 10;

  const fragmentSource = `#version 300 es
    precision mediump float;

    #define TWO_PI 6.28318530718
    #define PI 3.14159265358979323846

    uniform float u_time;
    uniform vec4 u_colors[${MAX_COLORS}];
    uniform float u_colorsCount;
    uniform float u_distortion;
    uniform float u_swirl;
    uniform float u_grainMixer;
    uniform float u_grainOverlay;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    in vec2 v_objectUV;
    out vec4 fragColor;

    vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }

    float hash21(vec2 p) {
      p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    float valueNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      float x1 = mix(a, b, u.x);
      float x2 = mix(c, d, u.x);
      return mix(x1, x2, u.y);
    }

    float noise(vec2 n, vec2 seedOffset) {
      return valueNoise(n + seedOffset);
    }

    vec2 getPosition(int i, float t) {
      float a = float(i) * 0.37;
      float b = 0.6 + fract(float(i) / 3.0) * 0.9;
      float c = 0.8 + fract(float(i + 1) / 4.0);

      float x = sin(t * b + a);
      float y = cos(t * c + a * 1.5);

      return 0.5 + 0.5 * vec2(x, y);
    }

    void main() {
      vec2 uv = v_objectUV;

      // Correct aspect ratio
      float aspect = u_resolution.x / u_resolution.y;
      vec2 uvAspect = uv;
      uvAspect.x *= aspect;

      // Use uncorrected UV for the main algorithm (matches paper-design behavior)
      uv += 0.5;
      vec2 grainUV = uv * 1500.0;

      float grain = noise(grainUV, vec2(0.0));
      float mixerGrain = 0.4 * u_grainMixer * (grain - 0.5);

      const float firstFrameOffset = 41.5;
      float t = 0.5 * (u_time + firstFrameOffset);

      float radius = smoothstep(0.0, 1.0, length(uv - u_mouse));
      float center = 1.0 - radius;

      for (float i = 1.0; i <= 2.0; i++) {
        uv.x += u_distortion * center / i * sin(t + i * 0.4 * smoothstep(0.0, 1.0, uv.y))
                 * cos(0.2 * t + i * 2.4 * smoothstep(0.0, 1.0, uv.y));
        uv.y += u_distortion * center / i * cos(t + i * 2.0 * smoothstep(0.0, 1.0, uv.x));
      }

      vec2 uvRotated = uv;
      uvRotated -= vec2(0.5);
      float angle = 3.0 * u_swirl * radius;
      uvRotated = rotate(uvRotated, -angle);
      uvRotated += vec2(0.5);

      vec3 color = vec3(0.0);
      float opacity = 0.0;
      float totalWeight = 0.0;

      for (int i = 0; i < ${MAX_COLORS}; i++) {
        if (i >= int(u_colorsCount)) break;

        vec2 pos = getPosition(i, t) + mixerGrain;
        vec3 colorFraction = u_colors[i].rgb * u_colors[i].a;
        float opacityFraction = u_colors[i].a;

        float dist = length(uvRotated - pos);
        dist = pow(dist, 3.5);
        float weight = 1.0 / (dist + 1e-3);
        color += colorFraction * weight;
        opacity += opacityFraction * weight;
        totalWeight += weight;
      }

      color /= max(1e-4, totalWeight);
      opacity /= max(1e-4, totalWeight);

      // Grain overlay
      float grainOverlay = valueNoise(rotate(grainUV, 1.0) + vec2(3.0));
      grainOverlay = mix(grainOverlay, valueNoise(rotate(grainUV, 2.0) + vec2(-1.0)), 0.5);
      grainOverlay = pow(grainOverlay, 1.3);

      float grainOverlayV = grainOverlay * 2.0 - 1.0;
      vec3 grainOverlayColor = vec3(step(0.0, grainOverlayV));
      float grainOverlayStrength = u_grainOverlay * abs(grainOverlayV);
      grainOverlayStrength = pow(grainOverlayStrength, 0.8);
      color = mix(color, grainOverlayColor, 0.35 * grainOverlayStrength);

      opacity += 0.5 * grainOverlayStrength;
      opacity = clamp(opacity, 0.0, 1.0);

      fragColor = vec4(color, opacity);
    }
  `;

  // ─── Color Themes ───────────────────────────────────────────────

  function hexToGL(hex) {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.substring(0, 2), 16) / 255,
      parseInt(hex.substring(2, 4), 16) / 255,
      parseInt(hex.substring(4, 6), 16) / 255,
      1.0
    ];
  }

  // Color palettes per section (matching existing site vibe)
  const themes = [
    // 0: Hero — deep blues, violet, cyan, pink (Added more blacks for depth)
    ['#000000', '#020408', '#050a12', '#38bdf8', '#8b5cf6', '#ec4899', '#000000'].map(hexToGL),
    // 1: Works — warmer, orange-shifted
    ['#000000', '#020408', '#050a12', '#f59e0b', '#8b5cf6', '#ec4899', '#000000'].map(hexToGL),
    // 2: About — teal/green shift
    ['#000000', '#020408', '#050a12', '#14b8a6', '#0ea5e9', '#8b5cf6', '#000000'].map(hexToGL),
    // 3: Contact — purple/gold
    ['#000000', '#020408', '#050a12', '#a855f7', '#eab308', '#ec4899', '#000000'].map(hexToGL),
  ];

  // ─── Init ───────────────────────────────────────────────────────

  const canvas = document.getElementById('shader-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
  });

  if (!gl) {
    // WebGL2 not available — show the CSS fallback
    console.warn('WebGL2 not available, using CSS fallback background.');
    canvas.style.display = 'none';
    const fallback = document.querySelector('.gradient-bg');
    if (fallback) fallback.style.display = '';
    return;
  }

  // ─── Compile Shaders ────────────────────────────────────────────

  function compileShader(src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vs = compileShader(vertexSource, gl.VERTEX_SHADER);
  const fs = compileShader(fragmentSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  // ─── Geometry (Fullscreen Quad) ─────────────────────────────────

  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // ─── Uniforms ───────────────────────────────────────────────────

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uColorsCount = gl.getUniformLocation(program, 'u_colorsCount');
  const uDistortion = gl.getUniformLocation(program, 'u_distortion');
  const uSwirl = gl.getUniformLocation(program, 'u_swirl');
  const uGrainMixer = gl.getUniformLocation(program, 'u_grainMixer');
  const uGrainOverlay = gl.getUniformLocation(program, 'u_grainOverlay');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  // Individual color uniforms
  const uColors = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    uColors.push(gl.getUniformLocation(program, `u_colors[${i}]`));
  }

  // Set static uniforms
  gl.uniform1f(uDistortion, 0.4);
  gl.uniform1f(uSwirl, 0.2);
  gl.uniform1f(uGrainMixer, 0.12);
  gl.uniform1f(uGrainOverlay, 0.08);

  // ─── Color State ────────────────────────────────────────────────

  let currentColors = themes[0].map(c => [...c]);
  let targetColors = themes[0].map(c => [...c]);

  function setThemeColors(index) {
    const theme = themes[index] || themes[0];
    targetColors = theme.map(c => [...c]);
  }

  // Listen for section changes from nav
  window.addEventListener('set-theme', (e) => {
    setThemeColors(e.detail.index);
  });

  // ─── Resize ─────────────────────────────────────────────────────

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);

  // ─── Mouse Tracking ─────────────────────────────────────────────

  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  window.addEventListener('mousemove', (e) => {
    // Normalize mouse position (0.0 to 1.0)
    // Note: Shader UVs have (0,0) at bottom-left? 
    // Wait, vertex shader says: v_objectUV.y = 1.0 - v_objectUV.y;
    // So (0,0) is top-left in UV space after flip?
    // Let's check: 
    // v_objectUV = a_position * 0.5 + 0.5; // (-1..1) -> (0..1)
    // v_objectUV.y = 1.0 - v_objectUV.y; // Flip Y
    // So 0,0 is top-left.
    // Mouse clientY 0 is top. 
    // So straightforward mapping:
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = 1.0 - (e.clientY / window.innerHeight); // Flip Y to match GL coords (0 at bottom)

    // Actually, if we want it to match the visual "top-left" of the screen, we need to match the UV coordinates.
    // The vertex shader flips Y!
    // v_objectUV.y = 1.0 - v_objectUV.y;
    // So v_objectUV.y = 0.0 is top.
    // If I pass u_mouse.y = 0.0, it should be top.
    // e.clientY / height is 0.0 at top.
    // So NO flip needed here if the shader uses standard top-left UVs.
    // ... wait.
    // Fragment shader: uv += 0.5. The coordinates are shifted.
    // Let's assume standard GL behavior (0 at bottom) but vertex shader flips it.
    // If v_objectUV.y is 0 at top, and 1 at bottom.
    // e.clientY / h is 0 at top, 1 at bottom.
    // So direct mapping is correct.
    targetMouseY = e.clientY / window.innerHeight;
  });

  // ─── Animation Loop ─────────────────────────────────────────────

  const startTime = performance.now();
  const speed = 0.3;

  function render() {
    const elapsed = (performance.now() - startTime) / 1000.0;

    // Smooth lerp mouse
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Smoothly interpolate colors
    for (let i = 0; i < currentColors.length; i++) {
      for (let j = 0; j < 4; j++) {
        currentColors[i][j] += (targetColors[i][j] - currentColors[i][j]) * 0.02;
      }
    }

    // Update uniforms
    gl.uniform1f(uTime, elapsed * speed);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouseX + 0.5, mouseY + 0.5); // Offset by +0.5 to match the shader's uv += 0.5 logic
    gl.uniform1f(uColorsCount, currentColors.length);

    for (let i = 0; i < MAX_COLORS; i++) {
      if (i < currentColors.length) {
        gl.uniform4fv(uColors[i], currentColors[i]);
      } else {
        gl.uniform4fv(uColors[i], [0, 0, 0, 0]);
      }
    }

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
  }

  render();
})();
