// src/services/mermindClient.ts
type Params = Record<string, unknown>;

async function ax() {
  const { default: apiClient } = await import("@/services/authClientService");
  return apiClient;
}

export async function generate(body: Params) {
  const api = await ax();
  const r = await api.post("/api/mermaid/generate/", body);
  return r.data;
}

export async function adjust(body: Params) {
  const api = await ax();
  const r = await api.post("/api/mermaid/adjust/", body);
  return r.data;
}

export async function save(body: Params) {
  const api = await ax();
  const r = await api.post("/api/mermaid/save/", body);
  return r.data;
}

export async function listDiagrams(params?: Params) {
  const api = await ax();
  const r = await api.get("/api/mermaid/list/", { params });
  return r.data;
}

export async function getDiagram(id: number) {
  const api = await ax();
  const r = await api.get(`/api/mermaid/${id}/`);
  return r.data;
}

export async function patchDiagram(id: number, body: Params) {
  const api = await ax();
  const r = await api.patch(`/api/mermaid/${id}/`, body);
  return r.data;
}

export async function deleteDiagram(id: number) {
  const api = await ax();
  const r = await api.delete(`/api/mermaid/${id}/`);
  return r.data;
}
