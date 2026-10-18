// How to make LIST calls
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
const scopes = 'staff_faculty:list';

// 4: List call may include params (optional)
const params = {
	faculty_type: '2'
};

// 5: Finally, call the endpoint!
async function main() {
	const data = await vc.list(scopes, 'staff_faculty', params); // call the endpoint (in Veracross API docs these are the path like students, staff_faculty etc.)
	// more examples:
	// const data = await vc.list(scopes, 'students');
	// const data = await vc.list(scopes, 'parents');

	if (data && data.length > 0) {
		console.log(data);
		// data.forEach(record => {
		// 	console.log(`${record.id} | ${record.first_name} | ${record.last_name}`);
		// });
	} else {
		console.log('No records found.');
	}
}

main().catch(console.error);
