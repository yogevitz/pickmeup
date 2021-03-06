const client = require('./client');

let token = '';

export async function login(body) {
  const { data } = await client.post(`/login`, body);
  token = data.token;
  return data;
}

export async function restorePassword(body) {
  const { data } = await client.post(`/restorePassword`, body);
  return data;
}


export async function getAllShuttles() {
  const config = {
    headers: {
      'x-auth-token': token,
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': "GET,HEAD,OPTIONS,POST,PUT",
      'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    }
  };
  const { data } = await client.get(`/getAllShuttles`, config);
  return data;
}

export async function deleteShuttle(body) {
  const { data } = await client.post(`/deleteShuttle`, body);
  return data;
}

export async function deleteRider(body) {
  const { data } = await client.post(`/deleteRider`, body);
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

export async function getShuttle(shuttleID) {
  const { data } = await client.get( `/getShuttle/${shuttleID}`);
  return data;
}

export async function uploadRiders(body) {
  const { data } = await client.post(`/createRiders`, body);
  return data;
}

export async function createSupervisor(body) {
  const { data } = await client.post(`/createSupervisor`, body);
  return data;
}

export async function deleteSupervisor(body) {
  const { data } = await client.post(`/deleteSupervisor`, body);
  return data;
}

export async function setSupervisor(body) {
  const { data } = await client.post(`/setSupervisor`, body);
  return data;
}

export async function createShuttle(body) {
  const { data } = await client.post(`/createShuttle`, body);
  return data;
}

export async function setShuttle(body) {
  const { data } = await client.post(`/setShuttle`, body);
  return data;
}


export async function createRider(body) {
  const { data } = await client.post(`/createRider`, body);
  return data;
}

export async function setRider(body) {
  const { data } = await client.post(`/setRider`, body);
  return data;
}

export async function getAllShuttleRiders(shuttleID) {
  const { data } = await client.get(`/getAllShuttleRiders/${shuttleID}`);
  return data;
}

export async function getShuttleRidersByShuttle(shuttleID) {
  const { data } = await client.get(`/getShuttleRidersByShuttle/${shuttleID}`);
  return data;
}

export async function getAllShuttlesRiders() {
  const { data } = await client.get(`/getAllShuttlesRiders`);
  return data;
}

export async function createShuttleRider({ shuttleID, shuttleName, riderID, riderName }) {
  const body = { shuttleID, shuttleName, riderID, riderName };
  const { data } = await client.post(`/createShuttleRider`, body);
  return data;
}

export async function deleteShuttleRider({ shuttleID, riderID }) {
  const body = { shuttleID, riderID };
  const { data } = await client.post(`/deleteShuttleRider`, body);
  return data;
}

export async function getLiftRiders(params) {
  const { shuttleID, date } = params;
  const { data } = await client.get(`/getLiftRiders/${shuttleID}/${date}`);
  return data;
}

export async function getLiftSupervisor(params) {
  const { shuttleID, date } = params;
  const { data } = await client.get(`/getLiftSupervisor/${shuttleID}/${date}`);
  return data;
}

export async function setLiftRiderMark(body) {
  const { data } = await client.post(`/setLiftRiderMark`, body);
  return data;
}

export async function setLiftRiderApproved(body) {
  const { data } = await client.post(`/setLiftRiderApproved`, body);
  return data;
}

export async function setLiftSupervisor(body) {
  const { data } = await client.post(`/setLiftSupervisor`, body);
  return data;
}
