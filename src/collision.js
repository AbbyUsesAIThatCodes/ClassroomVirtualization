// Circle versus axis-aligned boxes. Substeps prevent crossing thin objects on slow frames.
export function circleIntersectsBox(x, z, box, radius = .22) {
  const dx = x - Math.max(box.minX, Math.min(x, box.maxX));
  const dz = z - Math.max(box.minZ, Math.min(z, box.maxZ));
  return dx * dx + dz * dz < radius * radius;
}
export function moveWithCollisions(position, dx, dz, boxes, radius = .22) {
  let {x, z} = position;
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / (radius * .5)));
  const clear = (xx, zz) => !boxes.some(box => circleIntersectsBox(xx, zz, box, radius));
  for (let i = 0; i < steps; i++) {
    if (clear(x + dx / steps, z)) x += dx / steps;
    if (clear(x, z + dz / steps)) z += dz / steps;
  }
  return {x, z};
}
