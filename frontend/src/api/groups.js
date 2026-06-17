import api from "./axios";

export const getGroups = () => api.get("/groups/");
export const createGroup = (data) => api.post("/groups/", data);
export const getGroupMembers = (groupId) => api.get(`/groups/${groupId}/members`);
export const addMember = (groupId, userId) =>
  api.post(`/groups/${groupId}/members`, { user_id: userId });
export const getContributions = (groupId, round) =>
  api.get(`/groups/${groupId}/contributions?round=${round}`);
export const markContributionPaid = (groupId, data) =>
  api.post(`/groups/${groupId}/contributions`, data);
export const getPayoutStatus = (groupId, round) =>
  api.get(`/groups/${groupId}/payout-status?round=${round}`);
export const processPayout = (groupId, round) =>
  api.post(`/groups/${groupId}/payout?round=${round}`);