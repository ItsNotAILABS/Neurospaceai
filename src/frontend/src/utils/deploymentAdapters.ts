// Deployment Adapters — Core Brain Deployment Layer
// One brain asset, multiple adapters. No forked intelligence.

export type AdapterType = "npc" | "agent" | "scenario" | "robotics";
export type AdapterStatus = "active" | "standby" | "offline";

export interface DeploymentAdapter {
  id: string;
  name: string;
  type: AdapterType;
  status: AdapterStatus;
  boundInstances: number;
  lastSync: number;
  capabilities: string[];
  description: string;
}

export interface RoleOverlay {
  id: string;
  name: string;
  perceptionWeighting: number; // 0-1, higher = broader perception
  memoryHorizon: number; // seconds
  riskTolerance: number; // 0-1
  authorityLevel: number; // 0-1
  notes: string;
}

export interface ScopeOverlay {
  id: string;
  name: string;
  perceptionScope: "local" | "squad" | "sector" | "regional" | "theater";
  actionAuthority: number; // 0-1
  memoryHorizon: number; // seconds
  abstractionLevel: number; // 0-1
}

export interface BindingEntry {
  entityClass: string;
  brainInstanceType: string;
  roleOverlayId: string;
  scopeOverlayId: string;
}

export interface DeploymentBindingManager {
  adapters: DeploymentAdapter[];
  roleOverlays: RoleOverlay[];
  scopeOverlays: ScopeOverlay[];
  bindingTable: BindingEntry[];
}

export function createDeploymentBindingManager(): DeploymentBindingManager {
  const adapters: DeploymentAdapter[] = [
    {
      id: "adapter_npc",
      name: "NPC Runtime",
      type: "npc",
      status: "active",
      boundInstances: 12,
      lastSync: Date.now() - 1200,
      capabilities: [
        "perception_mapping",
        "embodiment_state",
        "motor_output",
        "role_overlay",
        "analytics_hooks",
      ],
      description:
        "Individual NPC agents with soldier/medic/recon role overlays",
    },
    {
      id: "adapter_agent",
      name: "Agent Runtime",
      type: "agent",
      status: "active",
      boundInstances: 4,
      lastSync: Date.now() - 3600,
      capabilities: [
        "goal_context",
        "policy_output",
        "memory_horizon",
        "emergence_logging",
        "ablation_hooks",
      ],
      description:
        "Adaptive agents for scenario and digital character deployments",
    },
    {
      id: "adapter_scenario",
      name: "Scenario Runtime",
      type: "scenario",
      status: "standby",
      boundInstances: 2,
      lastSync: Date.now() - 7200,
      capabilities: [
        "theater_state",
        "command_hierarchy",
        "force_disposition",
        "scenario_objectives",
        "report_pipeline",
      ],
      description:
        "Command-level scenario simulation with theater-scope overlays",
    },
    {
      id: "adapter_robotics",
      name: "Robotics Adapter",
      type: "robotics",
      status: "offline",
      boundInstances: 0,
      lastSync: 0,
      capabilities: [
        "sensor_bridge",
        "motor_primitives",
        "edge_compute",
        "real_time_loop",
      ],
      description:
        "Edge deployment placeholder — sensor/actuator bridge pending",
    },
  ];

  const roleOverlays: RoleOverlay[] = [
    {
      id: "role_soldier",
      name: "Individual Soldier",
      perceptionWeighting: 0.6,
      memoryHorizon: 300,
      riskTolerance: 0.5,
      authorityLevel: 0.2,
      notes: "Local tactical scope, survival-weighted",
    },
    {
      id: "role_medic",
      name: "Medic",
      perceptionWeighting: 0.55,
      memoryHorizon: 600,
      riskTolerance: 0.4,
      authorityLevel: 0.25,
      notes: "Recovery-biased, casualty-priority salience",
    },
    {
      id: "role_recon",
      name: "Recon",
      perceptionWeighting: 0.85,
      memoryHorizon: 1200,
      riskTolerance: 0.35,
      authorityLevel: 0.2,
      notes: "Wide perception, stealth-weighted, low aggression",
    },
    {
      id: "role_support",
      name: "Support Gunner",
      perceptionWeighting: 0.5,
      memoryHorizon: 180,
      riskTolerance: 0.7,
      authorityLevel: 0.2,
      notes: "High aggression tolerance, suppression-biased",
    },
    {
      id: "role_squad_leader",
      name: "Squad Leader",
      perceptionWeighting: 0.75,
      memoryHorizon: 900,
      riskTolerance: 0.5,
      authorityLevel: 0.5,
      notes: "Squad-scope, coordination priority, relay authority",
    },
    {
      id: "role_regional_cmd",
      name: "Regional Command",
      perceptionWeighting: 0.9,
      memoryHorizon: 3600,
      riskTolerance: 0.45,
      authorityLevel: 0.75,
      notes: "Sector-scope, strategic patience, reserve authority",
    },
    {
      id: "role_faction_cmd",
      name: "Faction Command",
      perceptionWeighting: 0.95,
      memoryHorizon: 14400,
      riskTolerance: 0.4,
      authorityLevel: 0.9,
      notes: "Theater-scope, doctrine-weighted, full override",
    },
    {
      id: "role_theater_cmd",
      name: "Theater Command",
      perceptionWeighting: 1.0,
      memoryHorizon: 86400,
      riskTolerance: 0.35,
      authorityLevel: 1.0,
      notes: "Maximum scope, strategic doctrine enforcement",
    },
  ];

  const scopeOverlays: ScopeOverlay[] = [
    {
      id: "scope_local",
      name: "Local Tactical",
      perceptionScope: "local",
      actionAuthority: 0.2,
      memoryHorizon: 300,
      abstractionLevel: 0.1,
    },
    {
      id: "scope_squad",
      name: "Squad",
      perceptionScope: "squad",
      actionAuthority: 0.4,
      memoryHorizon: 900,
      abstractionLevel: 0.25,
    },
    {
      id: "scope_sector",
      name: "Sector",
      perceptionScope: "sector",
      actionAuthority: 0.6,
      memoryHorizon: 3600,
      abstractionLevel: 0.5,
    },
    {
      id: "scope_regional",
      name: "Regional",
      perceptionScope: "regional",
      actionAuthority: 0.8,
      memoryHorizon: 14400,
      abstractionLevel: 0.7,
    },
    {
      id: "scope_theater",
      name: "Theater",
      perceptionScope: "theater",
      actionAuthority: 1.0,
      memoryHorizon: 86400,
      abstractionLevel: 1.0,
    },
  ];

  const bindingTable: BindingEntry[] = [
    {
      entityClass: "soldier_entity",
      brainInstanceType: "individual_agent",
      roleOverlayId: "role_soldier",
      scopeOverlayId: "scope_local",
    },
    {
      entityClass: "medic_entity",
      brainInstanceType: "individual_agent",
      roleOverlayId: "role_medic",
      scopeOverlayId: "scope_local",
    },
    {
      entityClass: "recon_entity",
      brainInstanceType: "individual_agent",
      roleOverlayId: "role_recon",
      scopeOverlayId: "scope_squad",
    },
    {
      entityClass: "squad_leader_entity",
      brainInstanceType: "squad_leader",
      roleOverlayId: "role_squad_leader",
      scopeOverlayId: "scope_squad",
    },
    {
      entityClass: "regional_controller",
      brainInstanceType: "regional_command",
      roleOverlayId: "role_regional_cmd",
      scopeOverlayId: "scope_regional",
    },
    {
      entityClass: "theater_command",
      brainInstanceType: "theater_command",
      roleOverlayId: "role_theater_cmd",
      scopeOverlayId: "scope_theater",
    },
  ];

  return { adapters, roleOverlays, scopeOverlays, bindingTable };
}

export function registerAdapter(
  mgr: DeploymentBindingManager,
  adapter: DeploymentAdapter,
): DeploymentBindingManager {
  return {
    ...mgr,
    adapters: [...mgr.adapters.filter((a) => a.id !== adapter.id), adapter],
  };
}

export function bindEntity(
  mgr: DeploymentBindingManager,
  entityClass: string,
  instanceType: string,
  roleOverlayId: string,
  scopeOverlayId: string,
): DeploymentBindingManager {
  const entry: BindingEntry = {
    entityClass,
    brainInstanceType: instanceType,
    roleOverlayId,
    scopeOverlayId,
  };
  return {
    ...mgr,
    bindingTable: [
      ...mgr.bindingTable.filter((b) => b.entityClass !== entityClass),
      entry,
    ],
  };
}
