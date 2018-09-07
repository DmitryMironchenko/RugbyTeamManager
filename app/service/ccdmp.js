//import teams from './stubs/teams';
//import members from './stubs/members';
const host = 'https://mitsufuji.corebet.net';
const rugbyMSPath = 'mtfj-rugby/api/v1';
const biometricalMSPath = 'biometrical-tracking/api/v1/biotrackers';
const locationMSPath = 'location-tracking/api/v1/trackers';


const token = 'a475b229e6f34fb3aeb67e1804a53edb';
const getTeams = async () => {
	const response = await fetch(`${host}/${rugbyMSPath}/teams/?token=${token}`);
	const data = await response.json();
	// const data = teams;
	return data;
};
const getTeamMembers = async (id) => {
	const response = await fetch(`${host}/${rugbyMSPath}/players/?token=${token}`);
	const data = await response.json();
	// const data = members;
	return data;
};
const createSession = async (id) => {
	const response = await fetch(`${host}/${rugbyMSPath}/sessions/?token=${token}`, {
		method: 'POST',
		body: JSON.stringify({
			session_type: 'training',
			team_1: id,
			start_datetime: new Date().toISOString(),
			end_datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
			status: 1,
		})
	});
	const data = await response.json();
	return data;
};
const getBiometricalDataForPlayer = async ({ id: sessionId }, teamId, playerId) => {
	const response = await fetch(`${host}/${biometricalMSPath}/${playerId}/?session_id=${sessionId}&token=${token}`)
	const data = await response.json();
	return data;
};

const getBiometricalDataForPlayers = async ({ id: sessionId }, teamId, playerIds) => {
	const url = `${host}/${biometricalMSPath}/?session_id=${sessionId}&token=${token}&realtime_only=true&ids=${playerIds.join(',')}`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

const getLocationDataForPlayer = async (playerId) => {
	const response = await fetch(`${host}/${locationMSPath}/?device_id=${playerId}&token=${token}`)
	const data = await response.json();
	return data;
};

export default {
	getTeams,
	getTeamMembers,
	getBiometricalDataForPlayer,
	getBiometricalDataForPlayers,
	getLocationDataForPlayer,
	createSession,
}
