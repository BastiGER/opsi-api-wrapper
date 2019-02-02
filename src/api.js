const request = require('request')

/**
 * Class OPSIApi
 */
class OPSIApi {
	/**
	 * This callback type is called `requestCallback` and is displayed as a global symbol.
	 *
	 * @callback requestCallback
	 * @param {any} data
	 */


	/**
	 * Create/Initiate OPSIApi.
	 *
	 * @param {string} apiURL - OPSI Api URL String Example: Https://opsiserver:4447.
	 * @param {string} username - OPSI user with acces rights.
	 * @param {string} password - Password of the api user.
	 * @param {int} id - OPSI Api Server ID. Default is 1
	 */
	constructor(apiURL, username, password, id = 1) {
		if (!apiURL || !username || !password)
			throw new Error('Please define all constructor variables!')

		this.apiURL = apiURL
		this.username = username
		this.password = password
		this.id = id

		// test api connection on construction  maybe obsolete if performance lacks
		// this.getOpsiVersion(function (data) {
		// 	if (!data)
		// 		throw new Error('API is not available!')
		// })
	}

	// ########### base api call functions

	/**
	 * Get opsi version or false.
	 *
	 * @example
	 * // returns a string of the opsi version or false
	 * api.getOpsiVersion(function (obj) {
	 * 		if(obj.success){
	 *			console.log(obj.data.opsiVersion)
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {Function} callback - Callback function.
	 * @returns {Object} Data.
	 */
	getOpsiVersion(callback) {
		this._sendRequest('backend_info', [], this.id, function (res) {
			return callback(res)
		})
	}

	/**
	 * Get all server ids.
	 *
	 * @example
	 * // returns array of server ids
	 * api.serverIDs(function (res) {
	 * 		if(res.success){
	 *			console.log(res.data) // array if ids
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {Function} callback - Callback function.
	 * @returns {Object} Data.
	 */
	serverIDs(callback) {
		this._sendRequest('getServerIds_list', [], this.id, function (data) {
			return callback(data)
		})
	}

	/**
	 * Is api user authenticated.
	 *
	 * @example
	 * // returns boolean if user is logged in or not
	 * api.isAuthenticated(function (res) {
	 * 		if(res.success){
	 *			console.log(res.data) // boolean
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {requestCallback} callback - The callback that handles the response. Function.
	 * @returns {Object} Data.
	 */
	isAuthenticated(callback) {
		this._sendRequest('accessControl_authenticated', [], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}

	/**
	 * Is api user admin.
	 *
	 * @example
	 * // returns if user has admin rights
	 * api.isUserAdmin(function (res) {
	 * 		if(res.success)
	 *			console.log(res.data) // boolean
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Object} Data.
	 */
	isUserAdmin(callback) {
		this._sendRequest('accessControl_userIsAdmin', [], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}

	/**
	 * Get server infos.
	 *
	 * @example
	 * // returns array with objects of server data
	 * api.getOpsiServerInfo(function (res) {
	 * 		if(res.success){
	 *			console.log(res.data[0]) // object of server data
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {Function} callback - Callback function.
	 * @returns {Object} Data.
	 */
	getOpsiServerInfo(callback) {
		this._sendRequest('host_getObjects', [
			'',
			{
				'type': 'OpsiConfigserver'
			}
		], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}

	/**
	 * Get all actions for one product.
	 *
	 * @example
	 * //returns array of actions for product
	 * api.serverIDs(function (servers) {
	 *		api.actionsForProduct('', servers[0], function (res) {
	 * 			if(res.success){
	 *				console.log(res.data) // array of product actions
	 *			}else if(!res.success){
	 *			  	console.error(res.message)
	 *			}
	 *		})
	 *	})
	 * @param {string} productid - Any id string.
	 * @param {string }serverid - Serverid string that gets from serverIDs.
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Object} Data.
	 */
	actionsForProduct(productid, serverid, callback) {
		this._sendRequest('getPossibleProductActions_list', [productid, serverid], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}


	// ########### client actions


	/**
	 * Get all clients.
	 *
	 * @example
	 * //returns array of all clients
	 * api.getAllClients(function (res) {
	 * 		if(res.success)
	 *			console.log(res.data) // client array
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Array} Data.
	 */
	getAllClients(callback) {
		this._sendRequest('getClientIds_list', [], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}

	/**
	 * create client.
	 *
	 * @example
	 * //returns client id name
	 * api.createClient(clientName, domain, description, notes, ipAddress, hardwareAddress, function (res) {
	 * 		if(res.success){
	 *			console.log(res.data) // clients array
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 * })
	 * @param {string} clientName - Client Name
	 * @param {string} domain - Client domain
	 * @param {string} description - description of the client
	 * @param {string} notes - Notes for this client
	 * @param {string} ipAddress - Client IP Address
	 * @param {string} hardwareAddress - physical address of the client
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Array|Object} Data Array or Object with error message (Object.message).
	 */
	createClient(clientName, domain = '', description = '', notes = '', ipAddress = '', hardwareAddress = '', callback) {
		if (!clientName || clientName === '')
			return callback({success: false, message: 'Please define a client name!'})

		this._sendRequest('createClient', [
			clientName,
			domain,
			description,
			notes,
			ipAddress,
			hardwareAddress
		], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}


	/**
	 * get client info
	 *
	 * @example
	 * //returns object with client info
	 * api.getHostGroupInfo(
	 *                    'clientId',
	 *                    function (res) {
	 * 		if(res.success){
	 *			console.log(res.data) // client data
	 *		}else if(res){
	 *		  	console.error(res.message) // error message
	 *		}
	 * })
	 * @param {string} clientId - Client ID Name
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Object} Object of client data.
	 */
	getClientInfo(clientId, callback) {
		if (!clientId || clientId === '')
			return callback({success: false, message: 'Please define a clientId!'})

		this._sendRequest('getHost_hash', [
			clientId
		], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}


	/**
	 * delete client.
	 *
	 * @example
	 * //returns boolean only on super bad data it will return an error message
	 *
	 * api.delete(clientId, function (res) {
	 * 		if(!res.success){
	 *			console.error(res.message) // client error message
	 *		}else if(res.success){
	 *		  	console.log(res.data) // true
	 *		}
	 * })
	 * @param {string} clientId - Client ID
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Boolean|Object} Boolean or Object with error message (Object.message).
	 */
	deleteClient(clientId, callback) {
		if (!clientId || clientId === '')
			return callback({success: false, message: 'Please define a clientId!'})

		this._sendRequest('deleteClient', [
			clientId
		], this.id, function (data) {
			// console.log(data.message)
			return callback(data.message ? data : {success: true, data: true})
		})
	}


	/**
	 * //TODO: rename client -> method -> host_renameOpsiClient
	 */

	// ########### Group actions

	/**
	 * Get all groups.
	 *
	 * @exmaple
	 * //returns an array of opsi groups
	 * api.getAllGroups(function (res) {
	 * 		if(res.success)
	 *			console.log(res.data) // groups array
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 *    })
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Array} Data.
	 */
	getAllHostGroups(callback) {
		this._sendRequest('group_getObjects', [], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}

	/**
	 * create group
	 *
	 * @example
	 * //returns boolean only on super bad data it will return an error message
	 * api.createHostGroup(
	 *                    'groupName',
	 *                    'members',
	 *                    'description',
	 *                    'parentGroupId', function (res) {
	 * 		if(!res.success){
	 *			console.error(res.message) // client error message
	 *		}else if(res.success){
	 *		  	console.log(res.data) // true
	 *		}
	 * })
	 * @param {string} groupName - Group ID Name
	 * @param {string} members - Members Object? String? Array?
	 * @param {string} description - Group description string
	 * @param {string} parentGroupId - Parent Group ID Name
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Boolean|Object} Boolean or Object with error message (Object.message).
	 */
	createHostGroup(groupName, members = '', description = '', parentGroupId = '', callback) {
		if (!groupName || groupName === '')
			return callback({success: false, message: 'Please define a group name!'})

		this._sendRequest('createGroup', [
			groupName,
			members,
			description,
			parentGroupId,
		], this.id, function (data) {
			// console.log(data)
			return callback(data.message ? data : {success: true, data: true})
		})
	}

	/**
	 * get group info
	 *
	 * @example
	 * //returns object with group info
	 * api.getHostGroupInfo(
	 *                    'groupName',
	 *                    function (res) {
	 * 		if(res.success){
	 *			console.log(res.data) // client data
	 *		}else if(res){
	 *		  	console.error(res.message) // error message
	 *		}
	 * })
	 * @param {string} groupName - Group ID Name
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Object} Object of group data.
	 */
	getHostGroupInfo(groupName = '', callback) {
		if (!groupName || groupName === '')
			return callback({success: false, message: 'Please define a groupName!'})

		this._sendRequest('group_getObjects', [
			'',
			{
				'id': groupName,
				'type': 'HostGroup'
			}
		], this.id, function (data) {
			// console.log(data)
			if (data.success)
				data.data = data.data[0]

			return callback(data)
		})
	}

	/**
	 * group name exists
	 *
	 * @example
	 * //returns boolean
	 * api.groupNameExists(
	 *                    'groupName',
	 *                    function (res) {
	 * 		if(res.success){
	 *			console.log(res.data) // boolean
	 *		}else if(res){
	 *		  	console.error(res.message) // error message
	 *		}
	 * })
	 * @param {string} groupName - Group ID Name
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Object} Object
	 */
	groupNameExists(groupName, callback) {
		if (!groupName || groupName === '')
			return callback({success: false, message: 'Please define a groupName!'})

		this._sendRequest('groupname_exists', [
			groupName
		], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}


	/**
	 * delete group
	 * if group id string is an empty string all groups would be deleted WARNING!!!
	 *
	 *  @example
	 * //returns boolean only on super bad data it will return an error message
	 *
	 * api.delete(groupId, function (res) {
	 * 		if(!res.success){
	 *			console.error(res.message) // client error message
	 *		}else if(res.success){
	 *		  	console.log(res.data) // true
	 *		}
	 * })
	 * @param {string} groupId - Group ID
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Boolean|Object} Boolean or Object with error message (Object.message).
	 */
	deleteGroup(groupId, callback) {
		if (!groupId || groupId === '')
			return callback({success: false, message: 'Please define a group Id!'})

		this._sendRequest('group_delete', [
			groupId
		], this.id, function (data) {
			// console.log(data.message)
			return callback(data.message ? data : {success: true, data: true})
		})
	}


	/**
	 * add client to group
	 *
	 * @example
	 * //returns boolean only on super bad data it will return an error message
	 *
	 * api.addClientToGroup(clientId, groupId, function (res) {
	 * 		if(!res.success){
	 *			console.error(res.message) // client error message
	 *		}else if(res.success){
	 *		  	console.log(res.data) // true
	 *		}
	 * })
	 * @param {string} clientId - Client ID
	 * @param {string} groupId - Group ID
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Boolean|Object} Boolean or Object with error message (Object.message).
	 */
	addClientToGroup(clientId, groupId, callback) {
		if (!groupId || groupId === '' || !clientId || clientId === '')
			return callback({success: false, message: 'Please define a group id and a client id!'})

		let self = this
		self.groupNameExists(groupId, function (group) {
			if (group.data) {
				self.getClientInfo(clientId, function (client) {
					if (client.success) {
						self._sendRequest('objectToGroup_create', [
							'HostGroup',
							groupId,
							clientId
						], self.id, function (data) {
							// console.log(data)
							return callback(data.message ? data : {success: true, data: true})
						})
					} else {
						return callback({success: false, message: 'Client not exists!'})
					}
				})

			} else {
				return callback({success: false, message: 'Group not exists!'})
			}
		})
	}

	/**
	 * get clients from group
	 *
	 * @example
	 * //return array of clients
	 *
	 * api.getGroupClients(groupId, function (res) {
	 * 		if(!res.success){
	 *			console.error(res.message) // client error message
	 *		}else if(res.success){
	 *		  	console.log(res.data) // Array of clients
	 *		}
	 * })
	 * @param {string} groupId - Group ID
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Array} Array with clients or empty array.
	 */
	getGroupClients(groupId, callback) {
		if (!groupId || groupId === '')
			return callback({success: false, message: 'Please define a groupId!'})

		this._sendRequest('objectToGroup_getObjects', [
			'',
			{
				'groupType': 'HostGroup',
				'groupId': groupId
			}
		], this.id, function (data) {
			// console.log(data.message)
			return callback(data)
		})
	}

	/**
	 * remove client from group
	 *
	 * @example
	 * //returns boolean only on super bad data it will return an error message
	 *
	 * api.removeClientFromGroup(clientId, groupId, function (res) {
	 * 		if(!res.success){
	 *			console.error(res.message) // client error message
	 *		}else if(res.success){
	 *		  	console.log(res.data) // true
	 *		}
	 * })
	 * @param {string} clientId - Client ID
	 * @param {string} groupId - Group ID
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Boolean|Object} Boolean or Object with error message (Object.message).
	 */
	removeClientFromGroup(clientId, groupId, callback) {
		if (!groupId || groupId === '' || !clientId || clientId === '')
			return callback({success: false, message: 'Please define a group id and a client id!'})

		this._sendRequest('objectToGroup_delete', [
			'HostGroup',
			groupId,
			clientId
		], this.id, function (data) {
			// console.log(data.message)
			callback(data.message ? data : {success: true, data: true})
		})
	}


	// ########### Host actions

	/**
	 * //TODO: host actions
	 */


	// ########### Product actions


	/**
	 * Get all products.
	 *
	 * @example
	 * // returns an array of products
	 * api.getAllProducts(function (res) {
	 * 		if(res.success)
	 *			console.log(res.data) // product array
	 *		}else if(!res.success){
	 *		  	console.error(res.message)
	 *		}
	 *    })
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @returns {Array} Data.
	 */
	getAllProducts(callback) {
		this._sendRequest('getProductIds_list', [], this.id, function (data) {
			// console.log(data)
			return callback(data)
		})
	}

	/**
	 * Generate api call actions.
	 *
	 * @param {string} method - Api function name to call.
	 * @param {Array} params - Array of method parameters.
	 * @param {number} id - Id number.
	 * @param {requestCallback} callback - The callback that handles the response.
	 * @private
	 */
	_sendRequest(method, params, id, callback) {
		const url = `${this.apiURL}/rpc`
		try {
			request({
				method: 'post',
				uri: url,
				rejectUnauthorized: false,
				auth: {
					'user': this.username,
					'pass': this.password,
					'sendImmediately': false
				},
				json: {
					'method': method,
					'params': params,
					'id': id
				}
			},
			function (error, response, body) {
				if (!error && response.statusCode === 200) {
					if (!body.error) {
						callback({'success': true, 'data': body.result})
					} else {
						callback({'success': false, 'message': body.error.message})
					}

					// else if (!body.result && body.error === null) {
					// 	callback({'success': true, 'data': true})
					// } else if (!body.result && body.error.length > 0) {
					// 	callback({'success': false, 'message': body.error})
					// } else {
					// 	callback(body)
					// }
				} else {
					throw new Error(error)
				}
			})
		} catch (e) {
			throw new Error(e)
		}
	}
}

module.exports = OPSIApi
