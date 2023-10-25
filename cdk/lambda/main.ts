import deleteClient from "./clients/deleteClient";
import getAllClients from "./clients/getAllClients";
import getClientById from "./clients/getClientById";
import updateClient from "./clients/updateClient";
import createContractor from "./contractors/createContractor";

import deleteContractor from "./contractors/deleteContractor";
import getAllContractors from "./contractors/getAllContractors";
import getContractorById from "./contractors/getContractorById";
import updateContractor from "./contractors/updateContractor";

import createProject from "./projects/createProject";
import deleteProject from "./projects/deleteProject";
import getAllProjects from "./projects/getAllProjects";
import getAllProjectsFromAllClients from "./projects/getAllProjectsFromAllClients";
import getAllProjectsWithEstimates from "./projects/getAllProjectsWithEstimates";
import getAllProjectsWithoutEstimates from "./projects/getAllProjectsWithoutEstimates";
import getProjectById from "./projects/getProjectById";
import updateProject from "./projects/updateProject";

import { ClientAppsyncEvent, ContractorAppsyncEvent, ProjectAppsyncEvent } from "./types";

export async function handler(event: any): Promise<any> {
  console.log(`EVENT --- ${JSON.stringify(event)}`);
  const eventType = getEventType(event);

  if (eventType === "Client") {
    return handleClientEvent(event);
  } else if (eventType === "Project") {
    return handleProjectEvent(event);
  }
  else if (eventType === "Contractor") {
    return handleContractorEvent(event);
  }
  else {
    throw new Error(`Unknown event type.`);
  }
}

// Function to determine the event type based on the field name
function getEventType(event: any): "Client" | "Project" | "Contractor" | "Visitor" {
  switch (event.info.fieldName) {
    case "getAllProjects":
    case "getAllProjectsFromAllClients":
    case "getAllProjectsWithEstimates":
    case "getAllProjectsWithoutEstimates":
    case "getProjectById":
    case "createProject":
    case "deleteProject":
    case "updateProject":
      return "Project";
    case "getAllClients":
    case "getClientById":
    case "deleteClient":
    case "updateClient":
      return "Client";
    case "getAllContractors":
    case "getContractorById":
    case "createContractor":
    case "updateContractor":
    case "deleteContractor":
      return "Contractor";
    case "getAllVisitors":
      return "Visitor";
    default:
      throw new Error(`Unknown field name: ${event.info.fieldName}`);
  }
}

// Handler function for Client events
function handleClientEvent(event: ClientAppsyncEvent) {
  switch (event.info.fieldName) {
    case "getClientById":
      return getClientById(event.arguments.clientName!, event.arguments.clientId!);
    case "getAllClients":
      return getAllClients();
    case "updateClient":
      return updateClient(
        event.arguments.clientName!,
        event.arguments.clientId!,
        event.arguments.clientInput!
      );
    case "deleteClient":
      return deleteClient(event.arguments.clientName!, event.arguments.clientId!);
    default:
      throw new Error(`Unknown field name: ${event.info.fieldName}`);
  }
}

// Handler function for Project events
function handleProjectEvent(event: ProjectAppsyncEvent) {
  switch (event.info.fieldName) {
    case "getProjectById":
      return getProjectById(event.arguments.projectId!);
    case "getAllProjects":
      return getAllProjects(event.arguments.clientName!);
    case "getAllProjectsFromAllClients":
      return getAllProjectsFromAllClients();
    case "getAllProjectsWithEstimates":
      return getAllProjectsWithEstimates();
    case "getAllProjectsWithoutEstimates":
      return getAllProjectsWithoutEstimates();
    case "createProject":
      return createProject(event.arguments.projectInput!);
    case "updateProject":
      return updateProject(
        event.arguments.projectId!,
        event.arguments.projectInput!
      );
    case "deleteProject":
      return deleteProject(event.arguments.clientName!, event.arguments.projectId!);
    default:
      throw new Error(`Unknown field name: ${event.info.fieldName}`);
  }
}

// Handler function for Contractor events
function handleContractorEvent(event: ContractorAppsyncEvent) {
  switch (event.info.fieldName) {
    case "getContractorById":
      return getContractorById(event.arguments.contractorName!, event.arguments.contractorId!);
    case "getAllContractors":
      return getAllContractors();
    case "createContractor":
      return createContractor(event.arguments.contractorInput!);
    case "updateContractor":
      return updateContractor(
        event.arguments.contractorName!,
        event.arguments.contractorId!,
        event.arguments.contractorInput!
      );
    case "deleteContractor":
      return deleteContractor(event.arguments.contractorName!, event.arguments.contractorId!);
    default:
      throw new Error(`Unknown field name: ${event.info.fieldName}`);
  }
}