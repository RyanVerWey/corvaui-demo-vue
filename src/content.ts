export const routes = [
  { id: "home", label: "Overview", path: "/" },
  { id: "about", label: "Compare", path: "/about" },
  { id: "data-table", label: "Shipments", path: "/data-table" },
  { id: "dashboard", label: "Reports", path: "/dashboard" },
  { id: "control", label: "Control", path: "/control" },
] as const;

export const serviceColumns = [
  { key: "capability", header: "Capability" },
  { key: "signal", header: "Signal" },
  { key: "control", header: "Control" },
  { key: "command", header: "Command" },
];
export const serviceRows = [
  { capability: "Live milestones", signal: "Included", control: "Included", command: "Included" },
  { capability: "Predictive risk", signal: "Daily", control: "Continuous", command: "Continuous" },
  { capability: "Recovery workflow", signal: "Guided", control: "Managed", command: "Managed + approval" },
  { capability: "Customer updates", signal: "Templates", control: "Automated", command: "Branded + automated" },
  { capability: "Commercial impact", signal: "Summary", control: "Lane level", command: "Shipment + portfolio" },
];
export const capabilityColumns = [
  { key: "mode", header: "Mode" },
  { key: "coverage", header: "Northline coverage" },
  { key: "decision", header: "Decision support" },
];
export const capabilityRows = [
  { mode: "Ocean", coverage: "38 ports / 142 services", decision: "Port dwell, roll risk, transload" },
  { mode: "Rail", coverage: "North American intermodal", decision: "Ramp capacity, cut-off, dray" },
  { mode: "Truck", coverage: "US, Canada, Mexico", decision: "Tender, appointment, weather" },
  { mode: "Air", coverage: "Priority gateways", decision: "Capacity, uplift, customs" },
];
export const shipmentColumns = [
  { key: "id", header: "Shipment", sortable: true, filterable: true },
  { key: "customer", header: "Customer", sortable: true, filterable: true },
  { key: "lane", header: "Lane", sortable: true, filterable: true },
  { key: "mode", header: "Mode", sortable: true, filterable: true },
  { key: "milestone", header: "Next milestone", sortable: true, filterable: true },
  { key: "status", header: "Status", sortable: true, filterable: true },
  { key: "owner", header: "Owner", sortable: true, filterable: true },
];
export const shipmentRows = [
  { id: "NA-82041", customer: "Helio Medical", lane: "Shanghai to Long Beach", mode: "Ocean", milestone: "Discharge / 16h", status: "On plan", owner: "Mina Park" },
  { id: "NA-82038", customer: "Arc Foundry", lane: "Rotterdam to Chicago", mode: "Ocean + rail", milestone: "Rail cut / 5h", status: "Decision due", owner: "Leo Grant" },
  { id: "NA-82036", customer: "Morrow Foods", lane: "Salinas to Toronto", mode: "Reefer", milestone: "Border / 9h", status: "Weather watch", owner: "Inez Cole" },
  { id: "NA-82029", customer: "Ridge Audio", lane: "Osaka to Seattle", mode: "Air", milestone: "Customs / 3h", status: "On plan", owner: "Nora Singh" },
  { id: "NA-82022", customer: "Keystone Home", lane: "Monterrey to Dallas", mode: "Truck", milestone: "Delivery / 6h", status: "Appointment hold", owner: "Leo Grant" },
  { id: "NA-82017", customer: "Vale Bio", lane: "Boston to Copenhagen", mode: "Air", milestone: "Uplift / 2h", status: "On plan", owner: "Mina Park" },
  { id: "NA-82011", customer: "Sable Works", lane: "Busan to Savannah", mode: "Ocean", milestone: "Berth / 28h", status: "Port watch", owner: "Inez Cole" },
  { id: "NA-82004", customer: "June & Pine", lane: "Vancouver to Denver", mode: "Rail + truck", milestone: "Ramp / 12h", status: "On plan", owner: "Nora Singh" },
];
export const corridorHealth = [
  { label: "Pacific", service: 92, onTime: 88, plan: 90 },
  { label: "Atlantic", service: 86, onTime: 91, plan: 88 },
  { label: "Mexico", service: 78, onTime: 82, plan: 86 },
  { label: "Europe", service: 89, onTime: 87, plan: 89 },
];
export const networkMix = [
  { label: "Ocean", value: 46 },
  { label: "Truck", value: 27 },
  { label: "Rail", value: 18 },
  { label: "Air", value: 9 },
];
export const dashboardColumns = [
  { key: "corridor", header: "Corridor" },
  { key: "volume", header: "Volume" },
  { key: "service", header: "Service" },
  { key: "exposure", header: "Exposure" },
];
export const dashboardRows = [
  { corridor: "Transpacific eastbound", volume: "214 FEU", service: "93%", exposure: "$182K" },
  { corridor: "Europe to Midwest", volume: "86 FEU", service: "88%", exposure: "$96K" },
  { corridor: "Mexico northbound", volume: "71 loads", service: "82%", exposure: "$74K" },
  { corridor: "US reefer network", volume: "129 loads", service: "95%", exposure: "$41K" },
];
export const reportTabs = [
  { id: "network", label: "Network" },
  { id: "service", label: "Service" },
  { id: "cost", label: "Cost" },
];

export const controlWorkflow = [
  { id: "detect", title: "Detected", items: [{ id: "port", title: "Oakland berth slip", meta: "18 min ago" }, { id: "reefer", title: "Reefer temperature watch", meta: "Owner needed" }] },
  { id: "decide", title: "Decision due", items: [{ id: "rail", title: "Pull Chicago rail forward", meta: "By 16:00 UTC" }, { id: "dray", title: "Houston dray recovery", meta: "$22K exposure" }] },
  { id: "protect", title: "Protected", items: [{ id: "customs", title: "Rotterdam customs window", meta: "Customer updated" }] },
];

export const controlTimeline = [
  { id: "signal", label: "Port signal confirmed", description: "Terminal dwell moved outside the customer tolerance.", meta: "14:18" },
  { id: "option", label: "Recovery options scored", description: "Rail pull-forward protects the Friday transload window.", meta: "14:24" },
  { id: "owner", label: "Decision assigned", description: "Mina Park owns carrier approval and customer note.", meta: "14:27" },
];
