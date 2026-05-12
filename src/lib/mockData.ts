export const shipments = [
  { id: 1, tracking_id: 'SM-9283-CN', origin: 'Shanghai', destination: 'Los Angeles', origin_lat: 31.2, origin_lng: 121.4, dest_lat: 33.7, dest_lng: -118.2, status: 'in_transit', cargo_type: 'Electronics', vessel_name: 'Ever Glory', eta: '2026-05-18', delay_days: 0, risk_score: 12, carbon_kg: 4200, fuel_cost_usd: 12500, route_id: 'PAC-01' },
  { id: 2, tracking_id: 'SM-1042-SG', origin: 'Singapore', destination: 'Rotterdam', origin_lat: 1.3, origin_lng: 103.8, dest_lat: 51.9, dest_lng: 4.5, status: 'delayed', cargo_type: 'Automotive', vessel_name: 'Ocean Titan', eta: '2026-05-22', delay_days: 3, risk_score: 45, carbon_kg: 8400, fuel_cost_usd: 24000, route_id: 'EUR-04' },
  { id: 3, tracking_id: 'SM-7721-DE', origin: 'Hamburg', destination: 'New York', origin_lat: 53.5, origin_lng: 10.0, dest_lat: 40.7, dest_lng: -74.0, status: 'at_risk', cargo_type: 'Pharma', vessel_name: 'North Star', eta: '2026-05-15', delay_days: 1, risk_score: 78, carbon_kg: 3100, fuel_cost_usd: 9800, route_id: 'ATL-02' },
  { id: 4, tracking_id: 'SM-3392-AE', origin: 'Dubai', destination: 'Mumbai', origin_lat: 25.2, origin_lng: 55.3, dest_lat: 19.0, dest_lng: 72.8, status: 'delivered', cargo_type: 'Textiles', vessel_name: 'Desert Wind', eta: '2026-05-10', delay_days: 0, risk_score: 5, carbon_kg: 1200, fuel_cost_usd: 4500, route_id: 'IND-08' },
  { id: 5, tracking_id: 'SM-5512-JP', origin: 'Tokyo', destination: 'Shanghai', origin_lat: 35.6, origin_lng: 139.7, dest_lat: 31.2, dest_lng: 121.4, status: 'in_transit', cargo_type: 'Machinery', vessel_name: 'Sun Riser', eta: '2026-05-14', delay_days: 0, risk_score: 22, carbon_kg: 800, fuel_cost_usd: 2200, route_id: 'ASN-03' },
  { id: 6, tracking_id: 'SM-8110-KR', origin: 'Busan', destination: 'Hamburg', origin_lat: 35.1, origin_lng: 129.0, dest_lat: 53.5, dest_lng: 10.0, status: 'rerouted', cargo_type: 'Consumer', vessel_name: 'Goliath', eta: '2026-06-02', delay_days: 8, risk_score: 62, carbon_kg: 10500, fuel_cost_usd: 31000, route_id: 'EUR-09' },
  { id: 7, tracking_id: 'SM-2022-US', origin: 'Los Angeles', destination: 'Tokyo', origin_lat: 33.7, origin_lng: -118.2, dest_lat: 35.6, dest_lng: 139.7, status: 'in_transit', cargo_type: 'Agriculture', vessel_name: 'Pacific Sky', eta: '2026-05-25', delay_days: 0, risk_score: 18, carbon_kg: 4500, fuel_cost_usd: 13200, route_id: 'PAC-02' },
  { id: 8, tracking_id: 'SM-6643-CN', origin: 'Shanghai', destination: 'Singapore', origin_lat: 31.2, origin_lng: 121.4, dest_lat: 1.3, dest_lng: 103.8, status: 'delivered', cargo_type: 'Steel', vessel_name: 'Iron Whale', eta: '2026-05-09', delay_days: 0, risk_score: 3, carbon_kg: 1800, fuel_cost_usd: 5100, route_id: 'ASN-11' },
  { id: 9, tracking_id: 'SM-4481-NL', origin: 'Rotterdam', destination: 'Dubai', origin_lat: 51.9, origin_lng: 4.5, dest_lat: 25.2, dest_lng: 55.3, status: 'at_risk', cargo_type: 'High-Tech', vessel_name: 'Dutch Duke', eta: '2026-05-20', delay_days: 2, risk_score: 82, carbon_kg: 7200, fuel_cost_usd: 21500, route_id: 'MEA-05' },
  { id: 10, tracking_id: 'SM-1192-IN', origin: 'Mumbai', destination: 'Busan', origin_lat: 19.0, origin_lng: 72.8, dest_lat: 35.1, dest_lng: 129.0, status: 'in_transit', cargo_type: 'Generic', vessel_name: 'Indus King', eta: '2026-05-19', delay_days: 0, risk_score: 15, carbon_kg: 3400, fuel_cost_usd: 9400, route_id: 'ASN-07' },
];

export const routes = [
  { id: 'TP', name: 'Trans-Pacific', congestion_level: 'High', active_vessels: 180, color: 'bg-orange-500' },
  { id: 'NA', name: 'North Atlantic', congestion_level: 'Moderate', active_vessels: 120, color: 'bg-yellow-500' },
  { id: 'MEC', name: 'Middle East Corridor', congestion_level: 'Critical', active_vessels: 210, color: 'bg-red-500' },
  { id: 'AE', name: 'Asia-Europe', congestion_level: 'Moderate', active_vessels: 145, color: 'bg-yellow-500' },
  { id: 'IOE', name: 'Indian Ocean Express', congestion_level: 'High', active_vessels: 165, color: 'bg-orange-500' },
  { id: 'SA', name: 'South Atlantic', congestion_level: 'Low', active_vessels: 85, color: 'bg-green-500' },
  { id: 'CR', name: 'Cape Route', congestion_level: 'Moderate', active_vessels: 110, color: 'bg-yellow-500' },
];

export const riskEvents = [
  { id: 1, title: 'Typhoon Kira Approaching', type: 'weather', severity: 'critical', region: 'South China Sea', lat: 15.0, lng: 115.0, description: 'Category 4 typhoon with 185km/h winds. 23 vessels in danger zone.', affected_routes: ['Routes: 4'], estimated_impact_usd: 2400000, probability: 0.94, active: true },
  { id: 2, title: 'Strait of Hormuz Closure', type: 'geopolitical', severity: 'critical', region: 'Strait of Hormuz', lat: 26.5, lng: 56.4, description: 'Total maritime blockade in effect. All tankers and cargo vessels halted. Seizure risk critical.', affected_routes: ['Routes: 3', 'Routes: 5'], estimated_impact_usd: 125000000, probability: 1.0, active: true },
  { id: 3, title: 'Red Sea Geopolitical Tensions', type: 'geopolitical', severity: 'high', region: 'Red Sea / Suez', lat: 20.0, lng: 38.0, description: 'Ongoing maritime security alerts. Vessels advised to reroute via Cape of Good Hope.', affected_routes: ['Routes: 6'], estimated_impact_usd: 8700000, probability: 0.87, active: true },
  { id: 4, title: 'LA Port Congestion Alert', type: 'port_congestion', severity: 'high', region: 'Los Angeles, USA', lat: 33.7, lng: -118.2, description: 'Port congestion at 94% capacity. Average wait time: 4.2 days.', affected_routes: ['Routes: 3'], estimated_impact_usd: 1200000, probability: 0.99, active: true },
  { id: 5, title: 'Brent Crude Spike $102/bbl', type: 'fuel_spike', severity: 'critical', region: 'Global', lat: 0, lng: 0, description: 'Hormuz closure driving Brent crude past $100. Unprecedented bunker fuel surcharge expected.', affected_routes: ['Routes: 9'], estimated_impact_usd: 45000000, probability: 1.0, active: true },
  { id: 6, title: 'Panama Canal Draft Restrictions', type: 'environmental', severity: 'high', region: 'Panama Canal', lat: 9.1, lng: -79.9, description: 'Draft restricted to 44ft due to extreme El Niño drought conditions.', affected_routes: ['Routes: 5'], estimated_impact_usd: 3200000, probability: 0.95, active: true },
  { id: 7, title: 'Singapore Port Cyber Incident', type: 'cyber_attack', severity: 'critical', region: 'Singapore', lat: 1.35, lng: 103.8, description: 'Ransomware detected in port management systems. Customs processing halted.', affected_routes: ['Routes: 5'], estimated_impact_usd: 4200000, probability: 0.83, active: true },
];

export const kpiData = {
  activeShipments: 2847,
  onTimeRate: 72.4,
  atRiskShipments: 412,
  aiPredictedSavingsM: 8.5,
  carbonMT: 52400,
  fuelCostM: 28.1,
  avgDelayDays: 6.4,
  activeVessels: 694
};

export const throughputData = [
  { month: 'Jun', throughput: 4500, target: 4200 },
  { month: 'Jul', throughput: 4800, target: 4400 },
  { month: 'Aug', throughput: 5200, target: 4600 },
  { month: 'Sep', throughput: 4900, target: 4800 },
  { month: 'Oct', throughput: 5600, target: 5000 },
  { month: 'Nov', throughput: 6100, target: 5200 },
  { month: 'Dec', throughput: 6800, target: 5400 },
  { month: 'Jan', throughput: 5200, target: 5600 },
  { month: 'Feb', throughput: 4800, target: 4800 },
  { month: 'Mar', throughput: 5400, target: 5200 },
  { month: 'Apr', throughput: 5900, target: 5400 },
  { month: 'May', throughput: 6200, target: 5600 },
];

export const carbonData = [
  { month: 'Jun', actual: 320, benchmark: 350 },
  { month: 'Jul', actual: 340, benchmark: 345 },
  { month: 'Aug', actual: 360, benchmark: 340 },
  { month: 'Sep', actual: 310, benchmark: 330 },
  { month: 'Oct', actual: 330, benchmark: 320 },
  { month: 'Nov', actual: 350, benchmark: 310 },
  { month: 'Dec', actual: 380, benchmark: 300 },
  { month: 'Jan', actual: 300, benchmark: 290 },
  { month: 'Feb', actual: 280, benchmark: 285 },
  { month: 'Mar', actual: 290, benchmark: 280 },
  { month: 'Apr', actual: 270, benchmark: 275 },
  { month: 'May', actual: 260, benchmark: 270 },
];

export const fuelPriceData = [
  { month: 'Jun', brent: 74, lng: 12 },
  { month: 'Jul', brent: 76, lng: 14 },
  { month: 'Aug', brent: 82, lng: 15 },
  { month: 'Sep', brent: 80, lng: 13 },
  { month: 'Oct', brent: 85, lng: 16 },
  { month: 'Nov', brent: 88, lng: 18 },
  { month: 'Dec', brent: 92, lng: 20 },
  { month: 'Jan', brent: 84, lng: 17 },
  { month: 'Feb', brent: 82, lng: 15 },
  { month: 'Mar', brent: 86, lng: 16 },
  { month: 'Apr', brent: 89, lng: 18 },
  { month: 'May', brent: 91, lng: 19 },
];

export const demandForecast = [
  { month: 'May', electronics: 420, automotive: 300, pharmaceuticals: 180 },
  { month: 'Jun', electronics: 450, automotive: 310, pharmaceuticals: 185 },
  { month: 'Jul', electronics: 480, automotive: 320, pharmaceuticals: 190 },
  { month: 'Aug', electronics: 520, automotive: 350, pharmaceuticals: 200 },
  { month: 'Sep', electronics: 610, automotive: 380, pharmaceuticals: 210 },
  { month: 'Oct', electronics: 680, automotive: 400, pharmaceuticals: 220 },
  { month: 'Nov', electronics: 750, automotive: 420, pharmaceuticals: 230 },
  { month: 'Dec', electronics: 820, automotive: 410, pharmaceuticals: 240 },
  { month: 'Jan', electronics: 540, automotive: 320, pharmaceuticals: 190 },
  { month: 'Feb', electronics: 490, automotive: 310, pharmaceuticals: 185 },
  { month: 'Mar', electronics: 520, automotive: 330, pharmaceuticals: 195 },
  { month: 'Apr', electronics: 560, automotive: 340, pharmaceuticals: 200 },
];

export const radarData = [
  { subject: 'Weather', value: 65, fullMark: 100 },
  { subject: 'Geopolitical', value: 85, fullMark: 100 },
  { subject: 'Port Congest.', value: 75, fullMark: 100 },
  { subject: 'Supplier', value: 60, fullMark: 100 },
  { subject: 'Fuel', value: 45, fullMark: 100 },
  { subject: 'Labor', value: 55, fullMark: 100 },
  { subject: 'Cyber', value: 80, fullMark: 100 },
];

export const simulationKPIs = [
  { label: 'Delayed Shipments', value: '50', color: '#ff4b4b' },
  { label: 'Financial Impact', value: '$2.9M', color: '#ff4b4b' },
  { label: 'Carbon Increase', value: '+4%', color: '#f59e0b' },
  { label: 'Affected TEU', value: '16,800', color: '#00f2ff' },
  { label: 'AI Route Savings', value: '$0.7M', color: '#22c55e' },
];

export const simulationDemandData = [
  { month: 'Jun', baseline: 800, simulated: 750 },
  { month: 'Jul', baseline: 850, simulated: 800 },
  { month: 'Aug', baseline: 780, simulated: 650 },
  { month: 'Sep', baseline: 920, simulated: 810 },
  { month: 'Oct', baseline: 980, simulated: 850 },
  { month: 'Nov', baseline: 900, simulated: 820 },
];

export const simulationRouteUtilization = [
  { name: 'Trans-Pacific', baseline: 140, simulated: 165 },
  { name: 'North Atlantic', baseline: 110, simulated: 125 },
  { name: 'Middle East Co', baseline: 75, simulated: 95 },
  { name: 'Asia-Europe', baseline: 210, simulated: 245 },
  { name: 'Indian Ocean E', baseline: 105, simulated: 115 },
];

export const aiRecommendations = [
  { id: 1, step: 'STEP 01', title: 'Preemptively reroute 20 vessels via Cape of Good Hope', benefit: '→ $0.3M saved' },
  { id: 2, step: 'STEP 02', title: 'Activate emergency supplier network for raw materials cargo', benefit: '→ 35% delay reduction' },
  { id: 3, step: 'STEP 3', title: 'Negotiate spot rate contracts on North Atlantic route before congestion peaks', benefit: '→ $0.4M avoided' },
];
