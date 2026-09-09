
const advancedFakeRecipes = {
  'fluid-cursor': {
    html: '<canvas></canvas>',
    logic: 'pressure solver, velocity / dye splat, advection, diffusion, vorticity, divergence, pressure Jacobi, gradient subtraction, mobile budgets, reduced motion, cleanup. MUST NOT replace this with: - opacity trail - blur-only glass - CSS circles',
    acceptance: 'pointer strokes visibly curl, spread, persist briefly, and dissipate. reduced motion releases resources.'
  },
  'metaballs': {
    html: '<canvas></canvas>',
    logic: 'continuous field, smooth merge, pointer repel / attraction, spring equilibrium, ellipse deformation, field shader, card/detail blob counts. MUST NOT replace this with: - opacity trail - blur-only glass - CSS circles',
    acceptance: 'blobs share smooth necks, merge/separate under input. velocity changes ellipse deformation.'
  },
  'liquid-refraction': {
    html: '<canvas></canvas>',
    logic: 'generated texture, UV refraction, RGB channel offset, Fresnel / rim, pointer spring, velocity squash/stretch, press response. MUST NOT replace this with: - opacity trail - blur-only glass - CSS circles',
    acceptance: 'grid/text bends visibly through the lens, with color fringes and moving highlight. pointer motion produces smooth spring follow and deformation.'
  }
}

