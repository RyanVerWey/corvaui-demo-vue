<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  CorvaAlert,
  CorvaAppBar,
  CorvaBadge,
  CorvaButton,
  CorvaButtonGroup,
  CorvaCard,
  CorvaChart,
  CorvaDataGrid,
  CorvaDataTable,
  CorvaDatePicker,
  CorvaPaper,
  CorvaProgress,
  CorvaSelect,
  CorvaStack,
  CorvaSwitch,
  CorvaTabs,
  CorvaTextField,
  CorvaTimeline,
  CorvaTypography,
  CorvaWorkflowBoard,
} from "@corvaui/vue";
import {
  capabilityColumns,
  capabilityRows,
  controlTimeline,
  controlWorkflow,
  corridorHealth,
  dashboardRows,
  dashboardColumns,
  networkMix,
  reportTabs,
  routes,
  shipmentColumns,
  shipmentRows,
  serviceColumns,
  serviceRows,
} from "./content";

type Mode = "light" | "dark";

const normalizePath = () => {
  const path = window.location.hash.replace(/^#/, "") || "/";
  return routes.some((route) => route.path === path) ? path : "/";
};

const currentPath = ref(normalizePath());
const mode = ref<Mode>("light");
const activeReport = ref("network");
const recoveryOptions = [
  { label: "Pull rail forward", value: "rail" },
  { label: "Priority dray", value: "dray" },
  { label: "Hold current plan", value: "hold" },
];
const theme = computed(() => `ocean-${mode.value}`);
const currentRoute = computed(() => routes.find((route) => route.path === currentPath.value) ?? routes[0]);

const navigate = (path: string) => {
  window.location.hash = path;
};

const syncRoute = () => {
  currentPath.value = normalizePath();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const setMode = (next: Mode) => {
  mode.value = next;
  localStorage.setItem("northline-theme", next);
};

const setReport = (event: Event) => {
  activeReport.value = (event as CustomEvent<{ id: string }>).detail.id;
};

const prepareScrollableTables = async () => {
  await nextTick();
  window.setTimeout(() => {
    document.querySelectorAll<HTMLElement>(".corva-table-container").forEach((container) => {
      const caption = container.querySelector("caption")?.textContent?.trim() ?? "Data table";
      container.tabIndex = 0;
      container.setAttribute("role", "region");
      container.setAttribute("aria-label", `${caption}, horizontally scrollable`);
    });
  }, 0);
};

watch(currentPath, prepareScrollableTables);

onMounted(() => {
  mode.value = localStorage.getItem("northline-theme") === "dark" ? "dark" : "light";
  window.addEventListener("hashchange", syncRoute);
  prepareScrollableTables();
});

onUnmounted(() => window.removeEventListener("hashchange", syncRoute));
</script>

<template>
  <div class="site-shell" :data-corva-theme="theme">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <CorvaAppBar heading="Northline Atlas">
      <nav slot="navigation" class="primary-nav" aria-label="Primary navigation">
        <a
          v-for="route in routes"
          :key="route.id"
          :href="`#${route.path}`"
          :aria-current="currentPath === route.path ? 'page' : undefined"
        >{{ route.label }}</a>
      </nav>
      <CorvaButtonGroup slot="actions" label="Color mode">
        <CorvaButton size="sm" :variant="mode === 'light' ? 'primary' : 'secondary'" @click="setMode('light')">Light</CorvaButton>
        <CorvaButton size="sm" :variant="mode === 'dark' ? 'primary' : 'secondary'" @click="setMode('dark')">Dark</CorvaButton>
      </CorvaButtonGroup>
    </CorvaAppBar>
    <details class="mobile-menu">
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        <a v-for="route in routes" :key="route.id" :href="`#${route.path}`" :aria-current="currentPath === route.path ? 'page' : undefined">{{ route.label }}</a>
      </nav>
    </details>

    <main id="main-content" tabindex="-1">
      <template v-if="currentRoute.id === 'home'">
        <section class="hero" aria-labelledby="home-title">
          <div class="hero-copy">
            <CorvaBadge tone="info">Freight intelligence, made legible</CorvaBadge>
            <CorvaTypography id="home-title" as="h1" variant="display">See the whole route before the first mile moves.</CorvaTypography>
            <CorvaTypography variant="body">
              Northline Atlas gives logistics teams one operating picture for ocean, rail, and over-the-road freight. Plan around disruption, protect margin, and keep customers ahead of every handoff.
            </CorvaTypography>
            <div class="hero-actions">
              <CorvaButton @click="navigate('/dashboard')">Explore live reports</CorvaButton>
              <CorvaButton variant="secondary" @click="navigate('/about')">Compare services</CorvaButton>
            </div>
            <div class="proof-line" aria-label="Network proof">
              <span><strong>38</strong> ports connected</span>
              <span><strong>94%</strong> on-time forecast</span>
              <span><strong>11 min</strong> alert lead time</span>
            </div>
          </div>
          <figure class="hero-image">
            <img src="/images/northline-terminal.jpg" alt="Container vessel and cranes working at a coastal freight terminal" width="1800" height="1200" fetchpriority="high" />
            <figcaption>
              <span>Pacific network</span>
              <strong>16 exceptions resolved before cut-off</strong>
            </figcaption>
          </figure>
        </section>

        <section class="signal-band" aria-labelledby="signal-title">
          <div class="section-heading">
            <CorvaBadge tone="success">Decision network</CorvaBadge>
            <CorvaTypography id="signal-title" as="h2" variant="title">A clearer answer at every handoff.</CorvaTypography>
            <p>One operating model connects planning, execution, and customer communication without flattening the details that matter.</p>
          </div>
          <div class="signal-flow">
            <article><span>01</span><h3>Forecast</h3><p>Blend capacity, weather, port, and carrier signals into a usable lane outlook.</p></article>
            <article><span>02</span><h3>Decide</h3><p>Compare cost, service, and carbon before approving the next route.</p></article>
            <article><span>03</span><h3>Explain</h3><p>Give every customer a precise status, impact, and recovery plan.</p></article>
          </div>
        </section>

        <section class="network-story" aria-labelledby="network-title">
          <div class="operations-mosaic" aria-label="Northline intermodal operations">
            <figure class="operations-primary">
              <img src="/images/northline-port.jpg" alt="Port, rail yard, and highway operating as one intermodal terminal" width="1600" height="900" loading="lazy" />
              <figcaption><span>Terminal 04</span><strong>Ocean, road, and rail in one operating view</strong></figcaption>
            </figure>
            <figure class="operations-secondary">
              <img src="/images/northline-rail.jpg" alt="Gantry crane moving containers above an intermodal freight train" width="1600" height="1200" loading="lazy" />
              <figcaption>18:40 rail cut-off protected</figcaption>
            </figure>
          </div>
          <CorvaStack gap="md">
            <CorvaBadge tone="info">Live corridor</CorvaBadge>
            <CorvaTypography id="network-title" as="h2" variant="title">Oakland to Rotterdam, without the blind spots.</CorvaTypography>
            <CorvaTypography variant="body">Northline watches port congestion, intermodal capacity, customs windows, and final-mile appointments as one route, not four disconnected systems.</CorvaTypography>
            <CorvaProgress label="Route confidence" :value="91"></CorvaProgress>
            <CorvaAlert tone="success" heading="Recovery protected">Panama dwell is trending down. Current arrival window remains within customer tolerance.</CorvaAlert>
          </CorvaStack>
        </section>

        <section class="closing-band" aria-labelledby="closing-title">
          <CorvaTypography id="closing-title" as="h2" variant="title">Freight is complicated. The operating picture should not be.</CorvaTypography>
          <CorvaButton @click="navigate('/data-table')">Open shipment network</CorvaButton>
        </section>
      </template>

      <template v-else-if="currentRoute.id === 'about'">
        <header class="page-hero">
          <div>
            <CorvaBadge tone="info">Service architecture</CorvaBadge>
            <CorvaTypography as="h1" variant="display">Choose the control layer your network needs.</CorvaTypography>
            <CorvaTypography variant="body">From visibility to managed intervention, every tier uses the same decision model and customer-ready record.</CorvaTypography>
          </div>
          <figure class="page-photo">
            <img src="/images/northline-port.jpg" alt="Coastal port connected to highway and rail infrastructure" width="1600" height="900" loading="lazy" />
            <figcaption><span>Network standard</span><strong>One source of route truth across every handoff.</strong></figcaption>
          </figure>
        </header>

        <section class="content-section" aria-labelledby="service-title">
          <div class="section-heading compact">
            <CorvaTypography id="service-title" as="h2" variant="title">Service comparison</CorvaTypography>
            <p>Clear boundaries make it easier to buy the right operational depth.</p>
          </div>
          <CorvaDataTable caption="Northline service tiers" :columns="serviceColumns" :rows="serviceRows"></CorvaDataTable>
        </section>

        <section class="comparison-layout" aria-labelledby="capability-title">
          <CorvaPaper>
            <CorvaStack gap="md">
              <CorvaTypography id="capability-title" as="h2" variant="title">Capability by transport mode</CorvaTypography>
              <CorvaDataTable caption="Transport capability matrix" :columns="capabilityColumns" :rows="capabilityRows"></CorvaDataTable>
            </CorvaStack>
          </CorvaPaper>
          <div class="principles-panel">
            <span class="principle-number">04</span>
            <h2>Built for the moment a plan changes.</h2>
            <p>Static visibility is not enough. Northline connects each exception to an owner, a deadline, a commercial impact, and the next best action.</p>
            <CorvaButton variant="secondary" @click="navigate('/dashboard')">See reporting depth</CorvaButton>
          </div>
        </section>
      </template>

      <template v-else-if="currentRoute.id === 'data-table'">
        <header class="page-hero data-hero">
          <div>
            <CorvaBadge tone="success">Network current at 14:32 UTC</CorvaBadge>
            <CorvaTypography as="h1" variant="display">Shipment network</CorvaTypography>
            <CorvaTypography variant="body">Filter active freight by lane, owner, mode, and exception state. Every row is shaped for fast operational scanning.</CorvaTypography>
          </div>
          <div class="data-summary" aria-label="Shipment summary">
            <span><strong>126</strong> active</span>
            <span><strong>9</strong> need action</span>
            <span><strong>3</strong> customer holds</span>
          </div>
        </header>
        <section class="grid-shell" aria-label="Active shipment records">
          <CorvaDataGrid caption="Active shipment network" :columns="shipmentColumns" :rows="shipmentRows" sortable filterable pageable :page-size="6"></CorvaDataGrid>
        </section>
        <CorvaAlert tone="info" heading="DataGrid proof">The Vue wrapper receives typed columns and rows directly. Sorting, filtering, pagination, and theme states come from CorvaUI.</CorvaAlert>
      </template>

      <template v-else-if="currentRoute.id === 'dashboard'">
        <header class="page-hero reports-hero">
          <div>
            <CorvaBadge tone="info">Week 35 network review</CorvaBadge>
            <CorvaTypography as="h1" variant="display">Reports that lead to a decision.</CorvaTypography>
            <CorvaTypography variant="body">Service, cost, and disruption signals stay close enough to explain what changed and what the team should do next.</CorvaTypography>
          </div>
          <CorvaTabs label="Report view" :items="reportTabs" :active-id="activeReport" @corvaSelect="setReport"></CorvaTabs>
        </header>

        <section class="metric-rail" aria-label="Network metrics">
          <article><span>Forecast accuracy</span><strong>94.2%</strong><small>+2.6 pts</small></article>
          <article><span>Cost protected</span><strong>$418K</strong><small>this quarter</small></article>
          <article><span>Exception age</span><strong>46 min</strong><small>-18 min</small></article>
          <article><span>Carbon intensity</span><strong>71 g</strong><small>CO2e / tkm</small></article>
        </section>

        <section class="report-grid">
          <CorvaPaper><CorvaChart label="Corridor health" :data="corridorHealth"></CorvaChart></CorvaPaper>
          <CorvaPaper><CorvaChart label="Network mode mix" :data="networkMix"></CorvaChart></CorvaPaper>
        </section>

        <section class="report-detail" aria-labelledby="watch-title">
          <div>
            <div class="section-heading compact">
              <CorvaTypography id="watch-title" as="h2" variant="title">Lane watch</CorvaTypography>
              <p>Priority corridors sorted by service exposure.</p>
            </div>
            <CorvaDataTable caption="Priority lane report" :columns="dashboardColumns" :rows="dashboardRows"></CorvaDataTable>
          </div>
          <CorvaStack gap="md">
            <figure class="report-photo"><img src="/images/northline-rail.jpg" alt="Intermodal containers moving through a rail terminal at dusk" width="1600" height="1200" loading="lazy" /></figure>
            <CorvaCard eyebrow="Recommended action" heading="Pull Chicago rail forward">Capacity remains available today. Moving 11 containers now protects the Friday transload window.</CorvaCard>
            <CorvaProgress label="Team response within SLA" :value="89"></CorvaProgress>
            <CorvaAlert tone="warning" heading="Two decisions due">Pacific Northwest reefer and Houston import dray need owners before 16:00 UTC.</CorvaAlert>
          </CorvaStack>
        </section>
      </template>

      <template v-else>
        <header class="page-hero control-hero">
          <div>
            <CorvaBadge tone="warning">4 decisions due</CorvaBadge>
            <CorvaTypography as="h1" variant="display">Network control room</CorvaTypography>
            <CorvaTypography variant="body">Move from signal to owned recovery without losing the customer, commercial, or timing context behind the decision.</CorvaTypography>
          </div>
          <div class="control-status" aria-label="Control room status">
            <span><strong>11 min</strong>alert lead</span>
            <span><strong>$182K</strong>exposure protected</span>
            <CorvaBadge tone="success">Team online</CorvaBadge>
          </div>
        </header>

        <section class="control-layout" aria-labelledby="decision-title">
          <CorvaPaper>
            <CorvaStack gap="md">
              <CorvaTypography id="decision-title" as="h2" variant="title">Decision workspace</CorvaTypography>
              <CorvaSelect label="Recovery option" :options="recoveryOptions" value="rail"></CorvaSelect>
              <CorvaTextField label="Decision owner" value="Mina Park"></CorvaTextField>
              <CorvaDatePicker label="Customer commitment" value="2026-08-29"></CorvaDatePicker>
              <CorvaSwitch label="Publish customer update on approval" checked></CorvaSwitch>
              <CorvaAlert tone="info" heading="Commercial impact">Pulling 11 containers forward costs $8,400 and protects $62,000 in service exposure.</CorvaAlert>
              <CorvaButton>Approve recovery plan</CorvaButton>
            </CorvaStack>
          </CorvaPaper>
          <CorvaPaper>
            <CorvaStack gap="md">
              <CorvaTypography as="h2" variant="title">Decision trace</CorvaTypography>
              <CorvaTimeline :events="controlTimeline"></CorvaTimeline>
            </CorvaStack>
          </CorvaPaper>
        </section>

        <section class="content-section" aria-labelledby="workflow-title">
          <div class="section-heading compact">
            <CorvaTypography id="workflow-title" as="h2" variant="title">Exception workflow</CorvaTypography>
            <p>Every active signal has a stage, an owner, a deadline, and a visible outcome.</p>
          </div>
          <CorvaWorkflowBoard :columns="controlWorkflow"></CorvaWorkflowBoard>
        </section>
      </template>
    </main>

    <footer>
      <span>Northline Atlas</span>
      <span>Vue 3 + CorvaUI</span>
      <a href="https://www.corvaui.com/">Design system documentation</a>
    </footer>
  </div>
</template>
