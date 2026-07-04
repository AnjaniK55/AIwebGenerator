import { apiClient } from "@/lib/api-client";
import { User, Project, Client, ApiResponse } from "@/types";

export const userService = {
  getProfile: () => 
    apiClient<ApiResponse<User>>("/users/profile"),
  
  updateProfile: (data: Partial<User>) =>
    apiClient<ApiResponse<User>>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const projectService = {
  getProjects: () =>
    apiClient<ApiResponse<Project[]>>("/projects"),
  
  getProjectById: (id: string) =>
    apiClient<ApiResponse<Project>>(`/projects/${id}`),
  
  createProject: (projectData: {
    projectName: string;
    businessType: string;
    description: string;
    websiteGoal: string;
  }) =>
    apiClient<ApiResponse<Project>>("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),
};

export const clientService = {
  getClients: () =>
    apiClient<ApiResponse<Client[]>>("/clients"),
  
  getClientById: (id: string) =>
    apiClient<ApiResponse<Client>>(`/clients/${id}`),
  
  createClient: (clientData: { name: string; email: string; projectId: string }) =>
    apiClient<ApiResponse<Client>>("/clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    }),
};
