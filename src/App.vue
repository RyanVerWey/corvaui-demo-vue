<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import {
  CorvaAccordion,
  CorvaAlert,
  CorvaAppBar,
  CorvaAutocomplete,
  CorvaAvatar,
  CorvaBadge,
  CorvaButton,
  CorvaButtonGroup,
  CorvaCard,
  CorvaChart,
  CorvaCheckbox,
  CorvaChip,
  CorvaDataGrid,
  CorvaDataTable,
  CorvaDatePicker,
  CorvaIcon,
  CorvaList,
  CorvaNumberField,
  CorvaPaper,
  CorvaProgress,
  CorvaRadioGroup,
  CorvaSearchForm,
  CorvaSelect,
  CorvaSidebar,
  CorvaStack,
  CorvaStepper,
  CorvaSwitch,
  CorvaTabs,
  CorvaTextarea,
  CorvaTextField,
  CorvaTimeline,
  CorvaToolbar,
  CorvaTypography,
  CorvaWorkflowBoard,
} from "@corvaui/vue";

type Mode = "light" | "dark";
type RouteId = "home" | "dashboard" | "work-orders" | "customers" | "data-table" | "settings" | "about";
type ShipmentKey = "shipper" | "lane" | "pickup" | "equipment" | "priority" | "temperature" | "notes";

const routes: Array<{ id: RouteId; path: string; label: string; badge?: string }> = [
  { id: "home", path: "/", label: "Home" },
  { id: "dashboard", path: "/dashboard", label: "Command", badge: "live" },
  { id: "work-orders", path: "/work-orders", label: "Shipment intake" },
  { id: "customers", path: "/customers", label: "Partners", badge: "18" },
  { id: "data-table", path: "/data-table", label: "Lane table" },
  { id: "settings", path: "/settings", label: "Settings" },
  { id: "about", path: "/about", label: "Package proof" },
];

const routeLookup = new Map(routes.map((route) => [route.path, route]));
const routeById = new Map(routes.map((route) => [route.id, route]));
const normalizeHash = () => {
  const next = window.location.hash.replace(/^#/, "") || "/";
  return routeLookup.has(next) ? next : "/";
};

const mode = ref<Mode>("light");
const currentPath = ref(normalizeHash());
const activeSettingsTab = ref("profile");
const submittedShipment = ref(false);
const shipment = reactive<Record<ShipmentKey, string>>({
  shipper: "Copperline Grocery Co.",
  lane: "Denver cold chain to Kansas City",
  pickup: "2026-09-04",
  equipment: "reefer",
  priority: "expedited",
  temperature: "34",
  notes: "Protect produce transfer, dock appointment confirmed, require temp seal photo at pickup.",
});

const themeName = computed(() => `ocean-${mode.value}`);
const currentRoute = computed(() => routeLookup.get(currentPath.value) ?? routes[0]);
const shellTitle = computed(() => currentRoute.value.id === "home" ? "BluePort Logistics" : `${currentRoute.value.label} | BluePort Logistics`);
const routeSidebarItems = computed(() => routes.map(({ id, label, badge }) => ({ id, label, badge })));
const missingShipmentFields = computed(() =>
  (["shipper", "lane", "pickup", "equipment", "priority"] as ShipmentKey[]).filter((key) => !shipment[key]),
);
const shipmentReady = computed(() => missingShipmentFields.value.length === 0);

const setMode = (next: Mode) => {
  mode.value = next;
};
const setModeFromSwitch = (event: Event) => {
  mode.value = (event as CustomEvent<{ checked: boolean }>).detail.checked ? "dark" : "light";
};
const syncHash = () => {
  currentPath.value = normalizeHash();
};
const navigateById = (event: Event) => {
  const route = routeById.get((event as CustomEvent<RouteId>).detail);
  if (route) window.location.hash = route.path;
};
const navigate = (path: string) => {
  window.location.hash = path;
};
const setSelectValue = (key: ShipmentKey, event: Event) => {
  shipment[key] = (event as CustomEvent<{ value: string }>).detail.value;
};
const setFieldValue = (key: ShipmentKey, event: Event) => {
  shipment[key] = (event.target as HTMLInputElement).value;
};
const setSettingsTab = (event: Event) => {
  activeSettingsTab.value = (event as CustomEvent<{ id: string }>).detail.id;
};

onMounted(() => window.addEventListener("hashchange", syncHash));
onUnmounted(() => window.removeEventListener("hashchange", syncHash));

const freightHealth = [
  { label: "On-time loads", value: 94 },
  { label: "Tender acceptance", value: 88 },
  { label: "Cold chain checks", value: 97 },
  { label: "Margin protected", value: 72 },
];
const costMix = [
  { label: "Linehaul", value: 52 },
  { label: "Fuel", value: 19 },
  { label: "Accessorial", value: 11 },
  { label: "Warehouse", value: 18 },
];
const laneColumns = [
  { key: "lane", header: "Lane" },
  { key: "loads", header: "Loads" },
  { key: "margin", header: "Margin" },
  { key: "risk", header: "Risk" },
];
const laneRows = [
  { lane: "Denver to Kansas City", loads: 42, margin: "18.4%", risk: "Weather watch" },
  { lane: "Phoenix to Salt Lake", loads: 28, margin: "21.1%", risk: "Clear" },
  { lane: "Boise to Reno", loads: 19, margin: "16.8%", risk: "Capacity tight" },
  { lane: "Omaha to Dallas", loads: 33, margin: "20.3%", risk: "Clear" },
];
const workflowColumns = [
  {
    id: "tendered",
    title: "Tendered",
    items: [
      { id: "ld-7341", title: "Copperline produce", meta: "Reefer" },
      { id: "ld-7344", title: "Mesa appliance transfer", meta: "Dry van" },
    ],
  },
  {
    id: "covered",
    title: "Covered",
    items: [
      { id: "ld-7338", title: "Northgate pharmacy", meta: "Team driver" },
      { id: "ld-7339", title: "Range Supply", meta: "Flatbed" },
    ],
  },
  {
    id: "settled",
    title: "Settled",
    items: [
      { id: "ld-7319", title: "Prairie Foods", meta: "POD matched" },
      { id: "ld-7324", title: "Summit Grocery", meta: "Billed" },
    ],
  },
];
const partnerRows = [
  { account: "Copperline Grocery Co.", segment: "Cold chain", owner: "Nina Brooks", volume: "$410K", next: "Q4 lane review" },
  { account: "Range Supply", segment: "Flatbed", owner: "Theo James", volume: "$288K", next: "Spot bid package" },
  { account: "Mesa Appliance", segment: "Retail", owner: "Ari Shah", volume: "$196K", next: "Dock scorecard" },
  { account: "Northgate Pharmacy", segment: "Pharma", owner: "Nina Brooks", volume: "$540K", next: "Temp audit" },
];
const partnerColumns = [
  { key: "account", header: "Partner" },
  { key: "segment", header: "Segment" },
  { key: "owner", header: "Owner" },
  { key: "volume", header: "Volume" },
  { key: "next", header: "Next step" },
];
const loadRows = [
  { id: "LD-7341", shipper: "Copperline Grocery", lane: "Denver to Kansas City", owner: "Nina Brooks", mode: "Reefer", status: "Covered", eta: "Fri 08:40" },
  { id: "LD-7342", shipper: "Northgate Pharmacy", lane: "Phoenix to Salt Lake", owner: "Owen Kim", mode: "Team reefer", status: "Tracking", eta: "Thu 21:10" },
  { id: "LD-7343", shipper: "Range Supply", lane: "Boise to Reno", owner: "Theo James", mode: "Flatbed", status: "Tendered", eta: "Sat 11:30" },
  { id: "LD-7344", shipper: "Mesa Appliance", lane: "Omaha to Dallas", owner: "Ari Shah", mode: "Dry van", status: "Dock hold", eta: "Fri 15:00" },
  { id: "LD-7345", shipper: "Prairie Foods", lane: "Denver to Tulsa", owner: "Nina Brooks", mode: "Reefer", status: "Delivered", eta: "Closed" },
  { id: "LD-7346", shipper: "Summit Grocery", lane: "Reno to Spokane", owner: "Owen Kim", mode: "Dry van", status: "At risk", eta: "Thu 18:20" },
];
const loadColumns = [
  { key: "id", header: "Load", sortable: true, filterable: true },
  { key: "shipper", header: "Shipper", sortable: true, filterable: true },
  { key: "lane", header: "Lane", sortable: true, filterable: true },
  { key: "owner", header: "Owner", sortable: true, filterable: true },
  { key: "mode", header: "Mode", sortable: true, filterable: true },
  { key: "status", header: "Status", sortable: true, filterable: true },
  { key: "eta", header: "ETA", sortable: true, filterable: true },
];
const packageRows = [
  { package: "@corvaui/vue", role: "Vue 3 wrappers", proof: "Product routes import CorvaUI wrapper components directly" },
  { package: "@corvaui/tokens", role: "Ocean theme", proof: "Root shell uses data-corva-theme with ocean-light and ocean-dark" },
  { package: "Vite", role: "Build host", proof: "Hash routes deploy on vue.corvaui.com" },
];
const packageColumns = [
  { key: "package", header: "Package" },
  { key: "role", header: "Role" },
  { key: "proof", header: "Proof" },
];
const ownerOptions = ["Nina Brooks", "Owen Kim", "Theo James", "Ari Shah"];
const equipmentOptions = [
  { label: "Reefer", value: "reefer" },
  { label: "Dry van", value: "dry-van" },
  { label: "Flatbed", value: "flatbed" },
];
const priorityOptions = [
  { label: "Standard", value: "standard", description: "Cover through the normal carrier desk." },
  { label: "Expedited", value: "expedited", description: "Escalate carrier match and pickup check-in." },
  { label: "Critical", value: "critical", description: "Executive alert and tracked hourly." },
];
const localeOptions = [
  { label: "English, United States", value: "en-US" },
  { label: "English, Canada", value: "en-CA" },
  { label: "Spanish, United States", value: "es-US" },
];
const settingsTabs = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Alerts" },
  { id: "controls", label: "Controls" },
];
const shipmentSteps = [
  { id: "quote", label: "Quote", description: "Shipper, lane, and service promise" },
  { id: "cover", label: "Cover", description: "Carrier, equipment, and appointment" },
  { id: "settle", label: "Settle", description: "POD, claims, and invoice match" },
];
const timelineEvents = [
  { label: "06:20", description: "Snow risk added to Denver outbound lanes.", meta: "Network" },
  { label: "08:10", description: "Cold-chain temp audits cleared for first wave.", meta: "Quality" },
  { label: "10:45", description: "Two dock holds converted into live unloads.", meta: "Customer success" },
];
const proofItems = [
  { id: "business", heading: "Business context", content: "BluePort Logistics is a believable freight command product, not a generic component sampler." },
  { id: "tokens", heading: "Ocean tokens", content: "Vue switches between ocean-light and ocean-dark with the same package token source as docs." },
  { id: "components", heading: "Coverage", content: "Navigation, dashboards, charts, forms, tables, workflow, settings, alerts, chips, and progress all use CorvaUI." },
];
</script>

<template>
  <main class="app-shell" :data-corva-theme="themeName">
    <CorvaAppBar :heading="shellTitle">
      <CorvaButtonGroup slot="actions" label="Theme mode">
        <CorvaButton size="sm" :variant="mode === 'light' ? 'primary' : 'secondary'" @click="setMode('light')">Light</CorvaButton>
        <CorvaButton size="sm" :variant="mode === 'dark' ? 'primary' : 'secondary'" @click="setMode('dark')">Dark</CorvaButton>
      </CorvaButtonGroup>
    </CorvaAppBar>

    <div class="app-main">
      <div class="app-layout">
        <CorvaSidebar heading="BluePort" label="Freight workspace" :active-id="currentRoute.id" :items="routeSidebarItems" @corvaSelect="navigateById">
          <CorvaBadge slot="footer" tone="info">{{ themeName }}</CorvaBadge>
        </CorvaSidebar>

        <section class="app-page" :aria-label="currentRoute.label">
          <template v-if="currentRoute.id === 'home'">
            <CorvaPaper>
              <div class="hero-layout">
                <CorvaStack gap="md">
                  <CorvaBadge tone="info">Freight network control</CorvaBadge>
                  <CorvaTypography as="h1" variant="display">BluePort turns volatile freight days into readable operating plans.</CorvaTypography>
                  <CorvaTypography variant="body">
                    A transportation workspace for brokers and shipper teams balancing service promises, margin, carriers, and dock exceptions across regional lanes.
                  </CorvaTypography>
                  <CorvaSearchForm label="Search logistics network" placeholder="Load, shipper, lane, owner"></CorvaSearchForm>
                  <div class="action-row">
                    <CorvaButton @click="navigate('/work-orders')">Book a shipment</CorvaButton>
                    <CorvaButton variant="secondary" @click="navigate('/dashboard')">Open command center</CorvaButton>
                  </div>
                </CorvaStack>

                <div class="hero-visual" aria-label="Freight health snapshot">
                  <div class="visual-row">
                    <CorvaIcon name="route" size="lg" decorative></CorvaIcon>
                    <span>214 active loads</span>
                  </div>
                  <CorvaProgress label="Loads with carrier acceptance" :value="88"></CorvaProgress>
                  <CorvaProgress label="On-time pickup forecast" :value="94"></CorvaProgress>
                  <CorvaProgress label="POD packets matched" :value="76"></CorvaProgress>
                </div>
              </div>
            </CorvaPaper>

            <div class="proof-grid">
              <CorvaCard eyebrow="Network" heading="Lane health at a glance">Dispatchers see tender acceptance, dwell, carrier capacity, and weather risk without a spreadsheet relay.</CorvaCard>
              <CorvaCard eyebrow="Margin" heading="Every exception has a cost">Fuel movement, detention, and re-rate approvals stay visible next to operational status.</CorvaCard>
              <CorvaCard eyebrow="Customer proof" heading="Status without status calls">Shippers get load history, temp proof, ETA changes, and invoice evidence from the same record.</CorvaCard>
            </div>

            <CorvaToolbar label="Launch desk">
              <CorvaButton size="sm" @click="navigate('/customers')">Review partners</CorvaButton>
              <CorvaButton size="sm" variant="secondary" @click="navigate('/data-table')">Audit load grid</CorvaButton>
            </CorvaToolbar>
          </template>

          <template v-else-if="currentRoute.id === 'dashboard'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="success">Command center live</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Freight command dashboard</CorvaTypography>
                <CorvaTypography variant="body">Network health, lane risk, margin movement, and tender flow for the current operating day.</CorvaTypography>
              </CorvaStack>
              <CorvaButton variant="secondary" @click="navigate('/work-orders')">Add load</CorvaButton>
            </div>

            <div class="stat-grid">
              <CorvaCard eyebrow="Active freight" heading="214 loads">37 require check-in before the next appointment window.</CorvaCard>
              <CorvaCard eyebrow="Service" heading="94% on time">Snow watch is isolated to Denver outbound refrigerated freight.</CorvaCard>
              <CorvaCard eyebrow="Gross margin" heading="$186K">Accessorial leakage fell after detention approvals moved into the workflow.</CorvaCard>
            </div>

            <div class="chart-grid">
              <CorvaChart label="Freight health" :data="freightHealth"></CorvaChart>
              <CorvaChart label="Cost mix" :data="costMix"></CorvaChart>
            </div>

            <div class="split-layout">
              <CorvaDataTable caption="Priority lanes" :columns="laneColumns" :rows="laneRows"></CorvaDataTable>
              <CorvaStack gap="md">
                <CorvaWorkflowBoard :columns="workflowColumns"></CorvaWorkflowBoard>
                <CorvaTimeline :events="timelineEvents"></CorvaTimeline>
              </CorvaStack>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'work-orders'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge :tone="shipmentReady ? 'success' : 'warning'">{{ shipmentReady ? "Shipment ready to tender" : "Required shipment details missing" }}</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Shipment intake</CorvaTypography>
                <CorvaTypography variant="body">Capture lane, shipper, equipment, temperature, and priority details before the load reaches the carrier desk.</CorvaTypography>
              </CorvaStack>
              <CorvaStepper :steps="shipmentSteps" :active-index="submittedShipment ? 1 : 0"></CorvaStepper>
            </div>

            <div class="form-layout">
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaTextField label="Shipper" :value="shipment.shipper" :error="submittedShipment && !shipment.shipper ? 'Shipper is required.' : undefined" @input="setFieldValue('shipper', $event)"></CorvaTextField>
                  <CorvaTextField label="Lane" :value="shipment.lane" :error="submittedShipment && !shipment.lane ? 'Lane is required.' : undefined" @input="setFieldValue('lane', $event)"></CorvaTextField>
                  <div class="field-grid">
                    <CorvaDatePicker label="Pickup date" :value="shipment.pickup"></CorvaDatePicker>
                    <CorvaSelect label="Equipment" :value="shipment.equipment" :options="equipmentOptions" @corvaChange="setSelectValue('equipment', $event)"></CorvaSelect>
                    <CorvaNumberField label="Target temp" :value="shipment.temperature" :min="-10" :max="80" :step="1"></CorvaNumberField>
                  </div>
                  <CorvaRadioGroup label="Priority" name="shipment-priority" :value="shipment.priority" :options="priorityOptions"></CorvaRadioGroup>
                  <CorvaTextarea label="Load notes" :value="shipment.notes" @input="setFieldValue('notes', $event)"></CorvaTextarea>
                  <CorvaCheckbox label="Require carrier seal photo before pickup" checked></CorvaCheckbox>
                  <div class="action-row">
                    <CorvaButton @click="submittedShipment = true">Validate load</CorvaButton>
                    <CorvaButton variant="secondary" @click="navigate('/dashboard')">Back to dashboard</CorvaButton>
                  </div>
                </CorvaStack>
              </CorvaPaper>

              <CorvaStack gap="md">
                <CorvaAlert :tone="shipmentReady ? 'success' : 'warning'" heading="Tender readiness">Missing {{ missingShipmentFields.length }} required fields. Refrigerated freight requires pickup proof and temperature notes.</CorvaAlert>
                <CorvaCard eyebrow="Preview" :heading="shipment.shipper">{{ shipment.lane }}. {{ shipment.equipment }} equipment, {{ shipment.priority }} priority, {{ shipment.temperature }} degrees.</CorvaCard>
                <CorvaList>
                  <li><strong>Carrier desk</strong><span>Confirm accepted rate, appointment, and equipment match.</span></li>
                  <li><strong>Quality</strong><span>Temperature-controlled freight must have seal and photo proof.</span></li>
                  <li><strong>Finance</strong><span>Detention and re-rate approvals stay tied to the load.</span></li>
                </CorvaList>
              </CorvaStack>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'customers'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="info">Partner records</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Shipper and carrier command</CorvaTypography>
                <CorvaTypography variant="body">Commercial records connect revenue, service commitments, claim risk, and carrier quality.</CorvaTypography>
              </CorvaStack>
              <CorvaSearchForm label="Search partners" placeholder="Partner, lane, owner, segment"></CorvaSearchForm>
            </div>

            <div class="split-layout">
              <CorvaDataGrid caption="Partner pipeline" :columns="partnerColumns" :rows="partnerRows"></CorvaDataGrid>
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaAvatar name="Copperline Grocery Co."></CorvaAvatar>
                  <CorvaTypography as="h2" variant="title">Copperline Grocery Co.</CorvaTypography>
                  <CorvaTypography variant="body">Cold-chain shipper with 44 stores, strict temperature proof, and weekly Denver outbound volume.</CorvaTypography>
                  <div class="chip-row">
                    <CorvaChip selected>Cold chain</CorvaChip>
                    <CorvaChip>High volume</CorvaChip>
                    <CorvaChip>Q4 review</CorvaChip>
                  </div>
                  <CorvaProgress label="Renewal confidence" :value="82"></CorvaProgress>
                  <CorvaAutocomplete label="Account owner" value="Nina Brooks" :options="ownerOptions"></CorvaAutocomplete>
                  <CorvaButton @click="navigate('/work-orders')">Create load</CorvaButton>
                </CorvaStack>
              </CorvaPaper>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'data-table'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="info">Operational records</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Lane and load table</CorvaTypography>
                <CorvaTypography variant="body">Sortable, filterable load records prove Vue wrapper parity against a realistic logistics dataset.</CorvaTypography>
              </CorvaStack>
              <CorvaButtonGroup label="Grid actions">
                <CorvaButton size="sm" variant="secondary">Export CSV</CorvaButton>
                <CorvaButton size="sm">Save view</CorvaButton>
              </CorvaButtonGroup>
            </div>

            <CorvaToolbar label="Load table controls">
              <CorvaSearchForm label="Search loads" placeholder="Load, shipper, lane, owner, mode"></CorvaSearchForm>
              <CorvaBadge tone="success">6 loads</CorvaBadge>
            </CorvaToolbar>

            <div class="split-layout wide-left">
              <CorvaDataGrid caption="Load operations grid" :columns="loadColumns" :rows="loadRows" sortable filterable pageable :page-size="4"></CorvaDataGrid>
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaTypography as="h2" variant="title">Grid policy</CorvaTypography>
                  <CorvaProgress label="Loads with full proof packet" :value="76"></CorvaProgress>
                  <CorvaAlert tone="info" heading="Wrapper behavior">Vue passes typed arrays to CorvaUI wrappers, so DataGrid owns sort, filter, and page state.</CorvaAlert>
                  <CorvaList>
                    <li><strong>Sort</strong><span>Use columns to isolate late ETA risk.</span></li>
                    <li><strong>Filter</strong><span>Filter by lane, status, owner, or equipment.</span></li>
                    <li><strong>Page</strong><span>Page size is set from Vue state.</span></li>
                  </CorvaList>
                </CorvaStack>
              </CorvaPaper>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'settings'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="info">Workspace controls</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Settings and account</CorvaTypography>
                <CorvaTypography variant="body">Preferences, locale, notification posture, and theme controls for logistics operators.</CorvaTypography>
              </CorvaStack>
              <CorvaSwitch label="Dark mode" :checked="mode === 'dark'" @corvaChange="setModeFromSwitch"></CorvaSwitch>
            </div>

            <CorvaTabs label="Settings sections" :active-id="activeSettingsTab" :items="settingsTabs" @corvaChange="setSettingsTab"></CorvaTabs>

            <div class="settings-layout">
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaTextField label="Display name" value="Nina Brooks"></CorvaTextField>
                  <CorvaTextField label="Workspace" value="BluePort Logistics"></CorvaTextField>
                  <CorvaSelect label="Locale" value="en-US" :options="localeOptions"></CorvaSelect>
                  <CorvaButton>Save account</CorvaButton>
                </CorvaStack>
              </CorvaPaper>

              <CorvaStack gap="md">
                <CorvaSwitch label="Weather risk alerts" description="Notify when lane confidence changes." checked></CorvaSwitch>
                <CorvaSwitch label="Carrier acceptance digest" description="Summarize tender acceptance by region." checked></CorvaSwitch>
                <CorvaSwitch label="Cold-chain proof lock" description="Prevent settlement when temp evidence is missing." checked></CorvaSwitch>
                <CorvaButtonGroup label="Theme">
                  <CorvaButton size="sm" :variant="mode === 'light' ? 'primary' : 'secondary'" @click="setMode('light')">ocean-light</CorvaButton>
                  <CorvaButton size="sm" :variant="mode === 'dark' ? 'primary' : 'secondary'" @click="setMode('dark')">ocean-dark</CorvaButton>
                </CorvaButtonGroup>
              </CorvaStack>
            </div>
          </template>

          <template v-else>
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="success">Package proof</CorvaBadge>
                <CorvaTypography as="h1" variant="title">About this Vue demo</CorvaTypography>
                <CorvaTypography variant="body">This static Vue app proves CorvaUI package integration through a logistics product mockup.</CorvaTypography>
              </CorvaStack>
              <CorvaButton variant="secondary" @click="navigate('/')">Back home</CorvaButton>
            </div>

            <div class="split-layout">
              <CorvaDataTable caption="Installed package proof" :columns="packageColumns" :rows="packageRows"></CorvaDataTable>
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaIcon name="package" size="lg" decorative></CorvaIcon>
                  <CorvaTypography as="h2" variant="title">Framework-specific integration</CorvaTypography>
                  <CorvaTypography variant="body">Vue imports CorvaUI wrappers directly, token CSS once in main.ts, and uses a small hash router for Vercel-safe static routes.</CorvaTypography>
                  <CorvaAlert tone="info" heading="Routing">Routes are hash based so hosted refreshes stay simple.</CorvaAlert>
                </CorvaStack>
              </CorvaPaper>
            </div>

            <CorvaStack gap="sm">
              <CorvaAccordion v-for="item in proofItems" :key="item.id" :heading="item.heading" :open="item.id === 'business'">{{ item.content }}</CorvaAccordion>
            </CorvaStack>
          </template>
        </section>
      </div>
    </div>
  </main>
</template>
