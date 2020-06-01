import { Convert } from "../src/convert";

const gravityZ = (z: number) => ({ x: 0, y: 0, z });

test("Convert volume happy paths", () => {
  expect(Convert.gravity2Volume(gravityZ(-9.8))).toBeCloseTo(0);

  expect(Convert.gravity2Volume(gravityZ(0))).toBeCloseTo(10);

  expect(Convert.gravity2Volume(gravityZ(9.8))).toBeCloseTo(20);
});

test("Convert volume, bounds checking", () => {
  expect(Convert.gravity2Volume(gravityZ(-100))).toBe(0);

  expect(Convert.gravity2Volume(gravityZ(100))).toBe(20);
});
