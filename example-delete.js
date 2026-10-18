// How to make DELETE calls
////////////////////////////
// 1: Ensure .env has all the configurations from Veracross
require('dotenv').config();
const Client = require('./veracross');

// 2: Create a client
const vc = new Client(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.SCHOOL_ROUTE
);

// 3: Specify scopes specific to the call you wish to make
// Note: ensure that this client_id has been assigned these scopes in Veracross as well
const scopes = 'emergency_contacts:delete';

// 4: Finally, call the endpoint!
async function main() {
	const data = await vc.delete(scopes, 'emergency_contacts/1727245'); // call the endpoint (in Veracross API docs these are the path like students, staff_faculty etc.)

	if (data) {
		console.log(`Response to call: ${data}`); // a response code 204 means success!
	} else {
		console.log('No records found.');
	}
}

main().catch(console.error);
