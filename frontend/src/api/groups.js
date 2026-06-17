import api from "./axios";

export const getGroups = () => api.get("/groups/");
export const createGroup = (data) => api.post("/groups/", data);
export const getGroupMembers = (groupId) => api.get(`/groups/${groupId}/members`);
export const getPayoutStatus = (groupId, round) =>
  api.get(`/groups/${groupId}/payout-status?round=${round}`);

