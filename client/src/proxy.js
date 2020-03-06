const client = require('./client');

export async function getAllShuttles() {
  const { data } = await client.get( `/getAllShuttles`);
  return data;
}

export async function getAllSupervisors() {
  const { data } = await client.get( `/getAllSupervisors`);
  return data;
}

export async function getAllRiders() {
  const { data } = await client.get( `/getAllRiders`);
  return data;
}

export async function getShuttle(shuttleId) {
  const { data } = await client.get( `/getShuttle/${shuttleId}`);
  return data;
}