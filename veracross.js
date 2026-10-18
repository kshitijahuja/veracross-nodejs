const axios = require('axios');

class Client {
	constructor(clientId, clientSecret, schoolRoute) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.schoolRoute = schoolRoute;
		this.apiBaseUrl = `https://api.veracross.com/${schoolRoute}/v3`;
		this.schoolBaseUrl = `https://accounts.veracross.com/${schoolRoute}`;
	}

	async getAccessToken(scope) {
		const response = await axios.post(
			`${this.schoolBaseUrl}/oauth/token`,
			new URLSearchParams({
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: 'client_credentials',
				scope,
			}),
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		);

		if (response.status === 200) {
			return response.data.access_token;
		}
		throw new Error('Error retrieving access token.');
	}

	_sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async _rateLimit(limitReset) {
		const sleepFor = limitReset - Date.now();
		if (sleepFor > 0) {
			console.log(`Rate limit reached. Sleeping for ${sleepFor}ms`);
			await this._sleep(sleepFor);
		}
	}

	async list(scope, path, params = {}) {
		if (!scope) throw new Error('Error setting the scopes.');

		const accessToken = await this.getAccessToken(scope);
		const url = `${this.apiBaseUrl}/${path}`;
		const pageSize = 1000;
		let pageNumber = 1;
		const allRecords = [];

		while (true) {
			const response = await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
					'X-Page-Number': String(pageNumber),
					'X-Page-Size': String(pageSize),
				},
				params,
			});

			if (response.status !== 200) {
				throw new Error(`API call failed with status ${response.status}. Please refer to API documentation.`);
			}

			const remaining = parseInt(response.headers['x-rate-limit-remaining'], 10);
			const reset = parseInt(response.headers['x-rate-limit-reset'], 10);
			if (remaining === 1) {
				await this._rateLimit(reset);
			}

			const pageData = response.data.data;
			allRecords.push(...pageData);

			if (pageData.length < pageSize) {
				return allRecords;
			}
			pageNumber++;
		}
	}

	async read(scope, path) {
		if (!scope) throw new Error('Error setting the scopes.');

		const accessToken = await this.getAccessToken(scope);
		const response = await axios.get(`${this.apiBaseUrl}/${path}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`,
			},
		});

		if (response.status !== 200) {
			throw new Error(`API call failed with status ${response.status}. Please refer to API documentation.`);
		}
		return response.data.data;
	}

	async update(scope, path, payload) {
		if (!scope) throw new Error('Error setting the scopes.');

		const accessToken = await this.getAccessToken(scope);
		const response = await axios.patch(`${this.apiBaseUrl}/${path}`, payload, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`,
			},
			validateStatus: null,
		});

		if (response.status !== 204) {
			throw new Error(`API call failed with status ${response.status}. Please refer to API documentation.`);
		}
		return response.status;
	}

	async create(scope, path, payload) {
		if (!scope) throw new Error('Error setting the scopes.');

		const accessToken = await this.getAccessToken(scope);
		const response = await axios.post(`${this.apiBaseUrl}/${path}`, payload, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`,
			},
			validateStatus: null,
		});

		if (response.status !== 201) {
			const errorId = response.data?.error_id ?? response.status;
			const errorMsg = response.data?.error ?? 'Unknown error';
			throw new Error(`API call failed with error code ${errorId}. Error Message: ${errorMsg}. Please refer to API documentation.`);
		}
		return response.status;
	}

	async delete(scope, path) {
		if (!scope) throw new Error('Error setting the scopes.');

		const accessToken = await this.getAccessToken(scope);
		const response = await axios.delete(`${this.apiBaseUrl}/${path}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`,
			},
			validateStatus: null,
		});

		if (response.status !== 204) {
			throw new Error(`API call failed with status ${response.status}. Please refer to API documentation.`);
		}
		return response.status;
	}
}

module.exports = Client;
