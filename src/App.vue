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
  CorvaFileUpload,
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
type WorkOrderKey = "site" | "contact" | "city" | "date" | "crew" | "priority" | "budget" | "notes";

const routes: Array<{ id: RouteId; path: string; label: string; badge?: string }> = [
  { id: "home", path: "/", label: "Home" },
  { id: "dashboard", path: "/dashboard", label: "Metrics", badge: "live" },
  { id: "work-orders", path: "/work-orders", label: "Work orders" },
  { id: "customers", path: "/customers", label: "Customers", badge: "12" },
  { id: "data-table", path: "/data-table", label: "Data table" },
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
const submittedWorkOrder = ref(false);

const workOrder = reactive<Record<WorkOrderKey, string>>({
  site: "Bayside Medical Campus",
  contact: "Jamie Ortiz",
  city: "Providence, RI",
  date: "2026-06-22",
  crew: "north",
  priority: "high",
  budget: "18400",
  notes: "Replace rooftop controller, inspect line sensors, and stage customer approval before 15:00.",
});

const themeName = computed(() => `ocean-${mode.value}`);
const currentRoute = computed(() => routeLookup.get(currentPath.value) ?? routes[0]);
const shellTitle = computed(() => {
  if (currentRoute.value.id === "home") return "CorvaUI Field Services";
  return `${currentRoute.value.label} | CorvaUI Field Services`;
});
const routeSidebarItems = computed(() =>
  routes.map((route) => ({
    id: route.id,
    label: route.label,
    badge: route.badge,
  })),
);
const missingWorkOrderFields = computed(() =>
  (["site", "contact", "date", "crew", "priority"] as WorkOrderKey[]).filter((key) => !workOrder[key]),
);
const workOrderReady = computed(() => missingWorkOrderFields.value.length === 0);
const workOrderStatus = computed(() => {
  if (!submittedWorkOrder.value) return "Draft ready for review";
  return workOrderReady.value ? "Validated and queued for dispatch" : "Needs required fields";
});

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
  const id = (event as CustomEvent<RouteId>).detail;
  const route = routeById.get(id);
  if (route) window.location.hash = route.path;
};
const navigate = (path: string) => {
  window.location.hash = path;
};
const setSelectValue = (key: WorkOrderKey, event: Event) => {
  workOrder[key] = (event as CustomEvent<{ value: string }>).detail.value;
};
const setFieldValue = (key: WorkOrderKey, event: Event) => {
  workOrder[key] = (event.target as HTMLInputElement).value;
};
const setSettingsTab = (event: Event) => {
  activeSettingsTab.value = (event as CustomEvent<{ id: string }>).detail.id;
};
const submitWorkOrder = () => {
  submittedWorkOrder.value = true;
};

onMounted(() => window.addEventListener("hashchange", syncHash));
onUnmounted(() => window.removeEventListener("hashchange", syncHash));

const performanceChart = [
  { label: "First visit fix", value: 92 },
  { label: "On-time arrival", value: 88 },
  { label: "Parts ready", value: 81 },
  { label: "Renewals", value: 76 },
];
const revenueChart = [
  { label: "Install", value: 46 },
  { label: "Preventive", value: 32 },
  { label: "Emergency", value: 18 },
  { label: "Warranty", value: 9 },
];
const dashboardRows = [
  { route: "Metro North", dispatcher: "Avery Stone", open: 18, risk: "Low" },
  { route: "Harbor Corridor", dispatcher: "Mina Shah", open: 25, risk: "Watch" },
  { route: "Inland West", dispatcher: "Jon Bell", open: 14, risk: "Clear" },
  { route: "University Loop", dispatcher: "Priya Lane", open: 11, risk: "Parts hold" },
];
const dashboardColumns = [
  { key: "route", header: "Route" },
  { key: "dispatcher", header: "Dispatcher" },
  { key: "open", header: "Open" },
  { key: "risk", header: "Risk" },
];
const workflowColumns = [
  {
    id: "intake",
    title: "Intake",
    items: [
      { id: "wo-1184", title: "Hotel condenser alarm", meta: "07:45" },
      { id: "wo-1189", title: "Campus lockout report", meta: "09:20" },
    ],
  },
  {
    id: "scheduled",
    title: "Scheduled",
    items: [
      { id: "wo-1191", title: "Clinic pressure test", meta: "Crew B" },
      { id: "wo-1193", title: "Warehouse dock sensor", meta: "Crew F" },
    ],
  },
  {
    id: "closed",
    title: "Closed",
    items: [
      { id: "wo-1178", title: "Bank branch PM sweep", meta: "Signed" },
      { id: "wo-1179", title: "Arena chiller check", meta: "Paid" },
    ],
  },
];
const pipelineRows = [
  { account: "Granite Health", stage: "Renewal", owner: "Maya Chen", value: "$84K", next: "QBR" },
  { account: "Cobalt Hospitality", stage: "Proposal", owner: "Omar Haddad", value: "$126K", next: "Scope review" },
  { account: "StateLine Logistics", stage: "Implementation", owner: "Elena Rossi", value: "$212K", next: "Crew onboarding" },
  { account: "North Pier Arena", stage: "Discovery", owner: "Nia Brooks", value: "$58K", next: "Site walk" },
];
const pipelineColumns = [
  { key: "account", header: "Account" },
  { key: "stage", header: "Stage" },
  { key: "owner", header: "Owner" },
  { key: "value", header: "Value" },
  { key: "next", header: "Next step" },
];
const serviceRecordRows = [
  { id: "SR-1028", account: "Granite Health", region: "Northeast", owner: "Maya Chen", priority: "High", status: "Scheduled", window: "09:00-11:00" },
  { id: "SR-1029", account: "Cobalt Hospitality", region: "Harbor", owner: "Omar Haddad", priority: "Critical", status: "Parts hold", window: "11:30-14:00" },
  { id: "SR-1030", account: "StateLine Logistics", region: "Inland", owner: "Elena Rossi", priority: "Normal", status: "On route", window: "13:00-15:00" },
  { id: "SR-1031", account: "North Pier Arena", region: "Downtown", owner: "Nia Brooks", priority: "High", status: "Approval", window: "15:00-17:00" },
  { id: "SR-1032", account: "Harbor Foods", region: "Harbor", owner: "Maya Chen", priority: "Normal", status: "Closed", window: "08:00-10:00" },
  { id: "SR-1033", account: "Summit Bank", region: "West", owner: "Omar Haddad", priority: "Critical", status: "Triage", window: "10:30-12:30" },
];
const serviceRecordColumns = [
  { key: "id", header: "Record", sortable: true, filterable: true },
  { key: "account", header: "Account", sortable: true, filterable: true },
  { key: "region", header: "Region", sortable: true, filterable: true },
  { key: "owner", header: "Owner", sortable: true, filterable: true },
  { key: "priority", header: "Priority", sortable: true, filterable: true },
  { key: "status", header: "Status", sortable: true, filterable: true },
  { key: "window", header: "Window", sortable: true, filterable: true },
];
const packageRows = [
  { package: "@corvaui/vue", role: "Vue 3 wrappers", proof: "All page controls import from package" },
  { package: "@corvaui/tokens", role: "Ocean themes", proof: "Shell uses data-corva-theme" },
  { package: "Vite", role: "Build host", proof: "Hash routes work on Vercel" },
];
const packageColumns = [
  { key: "package", header: "Package" },
  { key: "role", header: "Role" },
  { key: "proof", header: "Proof" },
];
const ownerOptions = ["Maya Chen", "Omar Haddad", "Elena Rossi", "Nia Brooks"];
const crewOptions = [
  { label: "North crew", value: "north" },
  { label: "Harbor crew", value: "harbor" },
  { label: "Night response", value: "night" },
];
const priorityOptions = [
  { label: "Emergency", value: "emergency" },
  { label: "High", value: "high" },
  { label: "Scheduled", value: "scheduled" },
];
const localeOptions = [
  { label: "English, United States", value: "en-US" },
  { label: "English, Canada", value: "en-CA" },
  { label: "Spanish, United States", value: "es-US" },
];
const priorityRadioOptions = [
  { label: "Emergency dispatch", value: "emergency" },
  { label: "Normal queue", value: "scheduled" },
];
const settingsTabs = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
  { id: "controls", label: "Controls" },
];
const orderSteps = [
  { id: "intake", label: "Intake", description: "Request details captured" },
  { id: "dispatch", label: "Dispatch", description: "Crew and parts assigned" },
  { id: "closeout", label: "Closeout", description: "Customer signoff and invoice" },
];
const timelineEvents = [
  { label: "07:30", description: "Emergency queue opened", meta: "Harbor corridor" },
  { label: "09:10", description: "Two preventive visits pulled forward", meta: "Metro North" },
  { label: "11:40", description: "Parts variance cleared", meta: "Warehouse dock" },
];
const uploadedFiles = [
  { name: "roof-controller-photo.jpg", meta: "2.4 MB" },
  { name: "customer-scope.pdf", meta: "188 KB" },
];
const proofItems = [
  { id: "routing", heading: "Hash routing", content: "Seven business pages share Vue state and work on Vercel hosting." },
  { id: "tokens", heading: "Ocean tokens", content: "The app shell switches between ocean-light and ocean-dark token scopes." },
  { id: "components", heading: "CorvaUI controls", content: "Forms, charts, tables, navigation, tabs, workflow, and feedback use @corvaui/vue." },
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
        <CorvaSidebar
          heading="CorvaUI"
          label="Business routes"
          :active-id="currentRoute.id"
          :items="routeSidebarItems"
          @corvaSelect="navigateById"
        >
          <CorvaBadge slot="footer" tone="info">{{ themeName }}</CorvaBadge>
        </CorvaSidebar>

        <section class="app-page" :aria-label="currentRoute.label">
          <template v-if="currentRoute.id === 'home'">
            <CorvaPaper>
              <div class="hero-layout">
                <CorvaStack gap="md">
                  <CorvaBadge tone="info">Regional field operations</CorvaBadge>
                  <CorvaTypography as="h1" variant="display">CorvaUI keeps service teams on time, stocked, and accountable.</CorvaTypography>
                  <CorvaTypography variant="body">
                    Premium dispatch software for HVAC, facilities, and field maintenance teams that need clean schedules,
                    signed work, and leadership metrics in one operating system.
                  </CorvaTypography>
                  <CorvaSearchForm label="Find a service plan" placeholder="Search contracts, sites, service lines"></CorvaSearchForm>
                  <div class="action-row">
                    <CorvaButton @click="navigate('/work-orders')">Create work order</CorvaButton>
                    <CorvaButton variant="secondary" @click="navigate('/dashboard')">View live metrics</CorvaButton>
                  </div>
                </CorvaStack>

                <div class="hero-visual" aria-label="CorvaUI daily operations proof">
                  <div class="visual-row">
                    <CorvaIcon name="route" size="lg" decorative></CorvaIcon>
                    <span>37 crews routed</span>
                  </div>
                  <CorvaProgress label="SLA confidence" :value="91"></CorvaProgress>
                  <CorvaProgress label="Parts readiness" :value="84"></CorvaProgress>
                  <CorvaProgress label="Customer signoff" :value="78"></CorvaProgress>
                </div>
              </div>
            </CorvaPaper>

            <div class="proof-grid">
              <CorvaCard eyebrow="Offer" heading="Dispatch command">
                Route planning, service history, and schedule risk stay visible before crews roll.
              </CorvaCard>
              <CorvaCard eyebrow="Customer proof" heading="14 minute faster closeout">
                Regional operators cut paperwork lag by moving approvals and evidence capture into the same flow.
              </CorvaCard>
              <CorvaCard eyebrow="Field ready" heading="No training deck required">
                Clean CorvaUI controls make technician, dispatcher, and account workflows feel consistent.
              </CorvaCard>
            </div>

            <CorvaToolbar label="Launch desk">
              <CorvaButton size="sm" @click="navigate('/customers')">Open pipeline</CorvaButton>
              <CorvaButton size="sm" variant="secondary" @click="navigate('/about')">Package proof</CorvaButton>
            </CorvaToolbar>
          </template>

          <template v-else-if="currentRoute.id === 'dashboard'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="success">Operations live</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Metrics dashboard</CorvaTypography>
                <CorvaTypography variant="body">Dispatch health, route load, and revenue mix for today.</CorvaTypography>
              </CorvaStack>
              <CorvaButton variant="secondary" @click="navigate('/work-orders')">Add order</CorvaButton>
            </div>

            <div class="stat-grid">
              <CorvaCard eyebrow="Today" heading="142 visits">31 emergency, 86 preventive, 25 quoted follow-ups.</CorvaCard>
              <CorvaCard eyebrow="SLA" heading="96.4 percent">Only Harbor Corridor needs dispatcher review.</CorvaCard>
              <CorvaCard eyebrow="Revenue" heading="$418K">Install work leads booked value this week.</CorvaCard>
            </div>

            <div class="chart-grid">
              <CorvaChart label="Service performance" :data="performanceChart"></CorvaChart>
              <CorvaChart label="Revenue mix" :data="revenueChart"></CorvaChart>
            </div>

            <div class="split-layout">
              <CorvaDataTable caption="Route load" :columns="dashboardColumns" :rows="dashboardRows"></CorvaDataTable>
              <CorvaStack gap="md">
                <CorvaWorkflowBoard :columns="workflowColumns"></CorvaWorkflowBoard>
                <CorvaTimeline :events="timelineEvents"></CorvaTimeline>
              </CorvaStack>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'work-orders'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge :tone="workOrderReady ? 'success' : 'warning'">{{ workOrderStatus }}</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Work order intake</CorvaTypography>
                <CorvaTypography variant="body">Capture dispatch-ready scope, customer context, schedule, files, and priority.</CorvaTypography>
              </CorvaStack>
              <CorvaStepper :steps="orderSteps" :active-index="submittedWorkOrder ? 1 : 0"></CorvaStepper>
            </div>

            <div class="form-layout">
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaTextField
                    label="Site name"
                    :value="workOrder.site"
                    placeholder="Customer site"
                    :error="submittedWorkOrder && !workOrder.site ? 'Site name is required.' : undefined"
                    @input="setFieldValue('site', $event)"
                  ></CorvaTextField>
                  <CorvaTextField
                    label="Site contact"
                    :value="workOrder.contact"
                    placeholder="Primary contact"
                    :error="submittedWorkOrder && !workOrder.contact ? 'Contact is required.' : undefined"
                    @input="setFieldValue('contact', $event)"
                  ></CorvaTextField>
                  <CorvaTextField label="Service city" :value="workOrder.city" placeholder="City, state" @input="setFieldValue('city', $event)"></CorvaTextField>
                  <div class="field-grid">
                    <CorvaDatePicker label="Target date" :value="workOrder.date" hint="Earliest available service date"></CorvaDatePicker>
                    <CorvaSelect label="Crew" :value="workOrder.crew" :options="crewOptions" @corvaChange="setSelectValue('crew', $event)"></CorvaSelect>
                    <CorvaSelect label="Priority" :value="workOrder.priority" :options="priorityOptions" @corvaChange="setSelectValue('priority', $event)"></CorvaSelect>
                  </div>
                  <CorvaNumberField label="Estimated budget" :value="workOrder.budget" :min="0" :step="100" hint="Used for approval routing"></CorvaNumberField>
                  <CorvaTextarea label="Scope notes" :value="workOrder.notes" @input="setFieldValue('notes', $event)"></CorvaTextarea>
                  <CorvaFileUpload label="Attachments" description="Photos, signed scope, inspection notes" :files="uploadedFiles"></CorvaFileUpload>
                  <CorvaCheckbox label="Customer approved after-hours access" checked></CorvaCheckbox>
                  <CorvaRadioGroup label="Dispatch posture" name="posture" value="scheduled" :options="priorityRadioOptions"></CorvaRadioGroup>
                  <div class="action-row">
                    <CorvaButton @click="submitWorkOrder">Validate order</CorvaButton>
                    <CorvaButton variant="secondary" @click="navigate('/dashboard')">Back to dashboard</CorvaButton>
                  </div>
                </CorvaStack>
              </CorvaPaper>

              <CorvaStack gap="md">
                <CorvaAlert :tone="workOrderReady ? 'success' : 'warning'" heading="Validation">
                  Required fields: site, contact, date, crew, and priority. Missing {{ missingWorkOrderFields.length }}.
                </CorvaAlert>
                <CorvaCard eyebrow="Dispatch preview" :heading="workOrder.site">
                  {{ workOrder.contact }} in {{ workOrder.city }}. Crew {{ workOrder.crew }} with {{ workOrder.priority }} priority.
                </CorvaCard>
                <CorvaList>
                  <li><strong>Help copy</strong><span>Use exact site names from the customer record.</span></li>
                  <li><strong>Upload policy</strong><span>Attach site photos before emergency dispatch.</span></li>
                  <li><strong>Approval</strong><span>Budgets above $25K route to finance.</span></li>
                </CorvaList>
              </CorvaStack>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'customers'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="info">Pipeline and records</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Customer command center</CorvaTypography>
                <CorvaTypography variant="body">Account pipeline, owner coverage, and field record patterns in one page.</CorvaTypography>
              </CorvaStack>
              <CorvaSearchForm label="Search customers" placeholder="Account, owner, city, stage"></CorvaSearchForm>
            </div>

            <div class="split-layout">
              <CorvaDataGrid caption="Customer pipeline" :columns="pipelineColumns" :rows="pipelineRows"></CorvaDataGrid>
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaAvatar name="Granite Health"></CorvaAvatar>
                  <CorvaTypography as="h2" variant="title">Granite Health</CorvaTypography>
                  <CorvaTypography variant="body">Eight campuses, 41 critical assets, renewal committee meets Friday.</CorvaTypography>
                  <div class="chip-row">
                    <CorvaChip selected>Renewal</CorvaChip>
                    <CorvaChip>Medical</CorvaChip>
                    <CorvaChip>High SLA</CorvaChip>
                  </div>
                  <CorvaProgress label="Renewal confidence" :value="86"></CorvaProgress>
                  <CorvaAutocomplete label="Account owner" value="Maya Chen" :options="ownerOptions"></CorvaAutocomplete>
                  <CorvaButton @click="navigate('/work-orders')">Start service request</CorvaButton>
                </CorvaStack>
              </CorvaPaper>
            </div>

            <div class="proof-grid">
              <CorvaCard eyebrow="Record pattern" heading="Contract context">Contacts, sites, and assets sit beside current revenue stage.</CorvaCard>
              <CorvaCard eyebrow="List pattern" heading="Next best action">Every account exposes one explicit operational next step.</CorvaCard>
              <CorvaCard eyebrow="Detail pattern" heading="Proof before pitch">Progress and owner fields use real form controls, not static screenshots.</CorvaCard>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'data-table'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="info">Data operations</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Service records grid</CorvaTypography>
                <CorvaTypography variant="body">Sortable, filterable service records prove Vue wrapper parity for dense operational tables.</CorvaTypography>
              </CorvaStack>
              <CorvaButtonGroup label="Grid actions">
                <CorvaButton size="sm" variant="secondary">Export CSV</CorvaButton>
                <CorvaButton size="sm">Save view</CorvaButton>
              </CorvaButtonGroup>
            </div>

            <CorvaToolbar label="Data table controls">
              <CorvaSearchForm label="Search service records" placeholder="Account, owner, region, status"></CorvaSearchForm>
              <CorvaBadge tone="success">6 records</CorvaBadge>
            </CorvaToolbar>

            <div class="split-layout wide-left">
              <CorvaDataGrid
                caption="Service record queue"
                :columns="serviceRecordColumns"
                :rows="serviceRecordRows"
                sortable
                filterable
                pageable
                :page-size="4"
              ></CorvaDataGrid>
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaTypography as="h2" variant="title">Selected queue policy</CorvaTypography>
                  <CorvaProgress label="Records with complete closeout notes" :value="84"></CorvaProgress>
                  <CorvaAlert tone="info" heading="Wrapper behavior">
                    Vue passes arrays as typed props to CorvaUI wrappers, so DataGrid owns sort, filter, and page state.
                  </CorvaAlert>
                  <CorvaList>
                    <li><strong>Sort</strong><span>Click any enabled column header.</span></li>
                    <li><strong>Filter</strong><span>Use column filters for scoped search.</span></li>
                    <li><strong>Page</strong><span>Page size is set from Vue state.</span></li>
                  </CorvaList>
                </CorvaStack>
              </CorvaPaper>
            </div>
          </template>

          <template v-else-if="currentRoute.id === 'settings'">
            <div class="page-head">
              <CorvaStack gap="sm">
                <CorvaBadge tone="info">Account controls</CorvaBadge>
                <CorvaTypography as="h1" variant="title">Settings and account</CorvaTypography>
                <CorvaTypography variant="body">Preferences, locale, notification posture, and theme controls for operations users.</CorvaTypography>
              </CorvaStack>
              <CorvaSwitch label="Dark mode" :checked="mode === 'dark'" @corvaChange="setModeFromSwitch"></CorvaSwitch>
            </div>

            <CorvaTabs label="Settings sections" :active-id="activeSettingsTab" :items="settingsTabs" @corvaChange="setSettingsTab"></CorvaTabs>

            <div class="settings-layout">
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaTextField label="Display name" value="Ryan VerWey"></CorvaTextField>
                  <CorvaTextField label="Workspace" value="CorvaUI Field Services"></CorvaTextField>
                  <CorvaSelect label="Locale" value="en-US" :options="localeOptions"></CorvaSelect>
                  <CorvaButton>Save account</CorvaButton>
                </CorvaStack>
              </CorvaPaper>

              <CorvaStack gap="md">
                <CorvaSwitch label="Dispatch alerts" description="Notify when route risk changes." checked></CorvaSwitch>
                <CorvaSwitch label="Customer approvals" description="Send approval requests from closeout." checked></CorvaSwitch>
                <CorvaSwitch label="Weekly executive digest" description="Summarize SLA, margin, and open risk." checked></CorvaSwitch>
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
                <CorvaTypography variant="body">This static app proves CorvaUI package integration through real business pages.</CorvaTypography>
              </CorvaStack>
              <CorvaButton variant="secondary" @click="navigate('/')">Back home</CorvaButton>
            </div>

            <div class="split-layout">
              <CorvaDataTable caption="Installed package proof" :columns="packageColumns" :rows="packageRows"></CorvaDataTable>
              <CorvaPaper>
                <CorvaStack gap="md">
                  <CorvaIcon name="package" size="lg" decorative></CorvaIcon>
                  <CorvaTypography as="h2" variant="title">Framework-specific integration</CorvaTypography>
                  <CorvaTypography variant="body">
                    Vue imports CorvaUI wrappers directly, token CSS once in main.ts, and uses a tiny hash router because vue-router is not installed.
                  </CorvaTypography>
                  <CorvaAlert tone="info" heading="Routing">Routes are hash based so deep links survive hosted refreshes.</CorvaAlert>
                </CorvaStack>
              </CorvaPaper>
            </div>

            <CorvaStack gap="sm">
              <CorvaAccordion v-for="item in proofItems" :key="item.id" :heading="item.heading" :open="item.id === 'routing'">
                {{ item.content }}
              </CorvaAccordion>
            </CorvaStack>
          </template>
        </section>
      </div>
    </div>
  </main>
</template>
