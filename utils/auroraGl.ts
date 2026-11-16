/**
 * WebGL aurora borealis: a fragment shader that renders volumetric curtains.
 *
 * Model. The aurora is a set of thin vertical sheets. Their footprint on the
 * ground plane is the contour line of a domain-warped noise field, stretched
 * east–west so the sheets read as arcs. Each sheet glows from its lower edge
 * upwards with a sharp onset and a long fading tail. A view ray is sampled where
 * it crosses STEPS horizontal planes between the lower edge and the top, so a
 * sheet is seen in perspective: folds overlap, near curtains tower over the
 * viewer, far ones flatten into arcs on the horizon. Fine noise in the footprint
 * becomes the vertical rays.
 *
 * Colour follows altitude like the real thing: a magenta fringe on the lower
 * border of bright folds (N2), oxygen green above it, then teal, then violet to
 * red at the top. Brightness waves travel along the arcs.
 *
 * The output is premultiplied alpha over a dark backdrop, so the canvas can sit
 * on top of any sky gradient and behind the skyline.
 */

const VERTEX = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
/* Where the horizon sits, as a fraction of the height measured from the top. */
uniform float uHorizon;

const int STEPS = 28;
/* Half-width of a sheet, in units of the footprint noise value. */
const float SHEET_WIDTH = 0.021;
/* Overall brightness before tone mapping. */
const float GAIN = 30.0;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/* Three octaves, normalised to 0..1. */
float fbm(vec2 p) {
  float s = 0.5 * noise(p);
  p = p * 2.03 + vec2(17.0, 9.0);
  s += 0.25 * noise(p);
  p = p * 2.01 + vec2(3.0, 31.0);
  s += 0.125 * noise(p);
  return s / 0.875;
}

/* Sheet density at a point of the ground plane (x east, y north). */
float curtain(vec2 p, float t) {
  // East–west stretch: structures are long in x, so sheets form arcs.
  vec2 q = vec2(p.x * 0.16, p.y * 0.42);
  // Domain warp: the slow folding of the sheets.
  q += 0.55 * vec2(
    noise(q * 1.4 + vec2(0.0, t * 0.045)),
    noise(q * 1.4 + vec2(5.2, -t * 0.035))
  );
  float n = fbm(q + vec2(t * 0.012, 0.0));
  // A thin sheet sits on the n = 0.5 contour (fbm clusters around 0.5, so the
  // falloff has to be steep or the sheets fill the whole sky), and a fainter
  // companion on a second contour.
  float e = (n - 0.5) / SHEET_WIDTH;
  float ridge = exp(-e * e);
  float e2 = (n - 0.36) / (SHEET_WIDTH * 0.8);
  ridge += 0.45 * exp(-e2 * e2);
  // Activity: large quiet stretches of sky between the active arcs.
  float active = smoothstep(0.25, 0.6, noise(p * 0.16 + vec2(t * 0.012, 7.0)));
  // Rays: fine structure along the sheet, drifting sideways.
  float rays = 0.12 + 0.88 * smoothstep(0.2, 0.8, noise(vec2(p.x * 10.0 + t * 0.25, p.y * 10.0)));
  // Surges: brightness waves that run along the arcs.
  float surge = 0.4 + 1.2 * noise(vec2(p.x * 0.22 - t * 0.16, p.y * 0.1 + t * 0.05));
  return ridge * rays * surge * (0.3 + 0.7 * active);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float yTop = 1.0 - frag.y / uRes.y;
  /* 0 at the horizon, 1 at the top of the frame. */
  float el = (uHorizon - yTop) / uHorizon;
  float x = (frag.x - 0.5 * uRes.x) / uRes.y;

  vec3 col = vec3(0.0);

  if (el > 0.0) {
    vec3 rd = normalize(vec3(x * 1.15, el * 1.05 + 0.035, 1.0));
    float t = uTime;
    /* Slow drift of the whole palette between a violet and a red top. */
    float warm = 0.5 + 0.5 * sin(t * 0.021);
    vec3 green = vec3(0.10, 1.00, 0.42);
    vec3 teal = vec3(0.08, 0.72, 0.86);
    vec3 top = mix(vec3(0.52, 0.20, 0.98), vec3(0.98, 0.14, 0.34), warm);
    vec3 fringe = vec3(1.0, 0.22, 0.62);

    /* Per-pixel offset of the sample planes hides the banding between them. */
    float jitter = hash(frag);

    for (int i = 0; i < STEPS; i++) {
      float a = (float(i) + jitter) / float(STEPS);
      float h = 0.75 + a * 1.35;
      float dist = h / rd.y;
      vec2 p = rd.xz * dist + vec2(3.7, 1.9);
      float d = curtain(p, t);

      /* Emission along the height of a sheet: sharp lower border, long tail. */
      float profile = smoothstep(0.0, 0.05, a) * exp(-a * 3.4);

      vec3 c = mix(green, teal, 0.6 * smoothstep(0.1, 0.35, a));
      c = mix(c, top, smoothstep(0.24, 0.6, a));
      /* Magenta lower border, only on the brightest folds. */
      c += fringe * (1.0 - smoothstep(0.0, 0.1, a)) * smoothstep(0.35, 0.9, d) * 1.6;
      /* The faint top glows longer than the green: lift the upper tail a little. */
      profile += 0.22 * smoothstep(0.25, 0.55, a) * (1.0 - a);

      /* Far sheets fade fast: otherwise they pile up along the ray into a flat haze. */
      col += c * d * profile * exp(-dist * 0.13);
    }
    col *= GAIN / float(STEPS);

    /* Extinction at the horizon, and the airglow the curtains leave there. */
    col *= smoothstep(0.0, 0.14, el);
    col += vec3(0.04, 0.30, 0.17) * exp(-el * 6.0) * (0.16 + 0.05 * sin(t * 0.24));

    col = 1.0 - exp(-col * 1.7);
  }

  /* Dark backdrop so the light reads against any sky; premultiplied output. */
  vec3 night = vec3(0.012, 0.022, 0.055);
  float backdrop = 0.58;
  float lum = max(col.r, max(col.g, col.b));
  float alpha = clamp(backdrop + lum, 0.0, 1.0);
  vec3 outCol = night * backdrop + col;
  outCol += (hash(frag * 1.7 + 0.5) - 0.5) / 255.0;
  gl_FragColor = vec4(clamp(outCol, 0.0, alpha), alpha);
}
`;

/** Longest side of the drawing buffer; the canvas is upscaled by CSS (the aurora is soft). */
const MAX_BUFFER_PX = 560;

export interface AuroraRenderer {
  /** Sets the drawing-buffer size from the CSS size of the canvas. */
  resize: (cssWidth: number, cssHeight: number) => void;
  /** Draws one frame. `horizon` = fraction of the height (from the top) where the ground is. */
  render: (seconds: number, horizon: number) => void;
  dispose: () => void;
}

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/** Returns `null` when WebGL is unavailable or the shader does not compile. */
export const createAuroraRenderer = (canvas: HTMLCanvasElement): AuroraRenderer | null => {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'uRes');
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uHorizon = gl.getUniformLocation(program, 'uHorizon');

  return {
    resize: (cssWidth, cssHeight) => {
      const scale = Math.min(1, MAX_BUFFER_PX / Math.max(cssWidth, cssHeight, 1));
      const w = Math.max(2, Math.round(cssWidth * scale));
      const h = Math.max(2, Math.round(cssHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    },
    render: (seconds, horizon) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform1f(uHorizon, horizon);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose: () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
};
