import { describe, expect, it } from "vitest";
import { routes, serviceRows, shipmentRows, corridorHealth, networkMix } from "../src/content";

describe("Northline Atlas demo contract", () => {
  it("ships the complete showcase route set", () => {
    expect(routes.map((route) => route.path)).toEqual(["/", "/about", "/data-table", "/dashboard", "/control"]);
  });
  it("uses unique shipment identifiers and realistic table depth", () => {
    const ids = shipmentRows.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(shipmentRows.length).toBeGreaterThanOrEqual(8);
    expect(serviceRows.length).toBeGreaterThanOrEqual(5);
  });
  it("keeps chart values in valid percentage ranges", () => {
    for (const point of [...corridorHealth, ...networkMix]) {
      expect(point.value).toBeGreaterThanOrEqual(0);
      expect(point.value).toBeLessThanOrEqual(100);
    }
  });
});
