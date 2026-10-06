import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  reporter: "line",
  use: { baseURL: "http://127.0.0.1:4190", reducedMotion: "reduce", trace: "retain-on-failure" },
  webServer: {
    command: "npm run preview -- --port 4190 --strictPort",
    url: "http://127.0.0.1:4190",
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 320, height: 720 } } },
  ],
});
