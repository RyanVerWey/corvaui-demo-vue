import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { routes, serviceRows, shipmentRows, corridorHealth, networkMix } from "../src/content";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("Northline Atlas demo contract", () => {
  it("uses the current Vue and token packages", () => {
    expect(pkg.dependencies["@corvaui/vue"]).toBe("^0.2.1");
    expect(pkg.dependencies["@corvaui/tokens"]).toBe("^0.2.1");
  });
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
      for (const value of Object.values(point).filter((entry): entry is number => typeof entry === "number")) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
    expect(Object.keys(corridorHealth[0]).filter((key) => key !== "label")).toHaveLength(3);
  });
});
