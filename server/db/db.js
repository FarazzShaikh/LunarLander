const faunadb = require('faunadb');
let client = undefined;

const {
	Get,
	Ref,
	Collection,
	Create,
	Map,
	Paginate,
	Lambda,
	Documents,
	Update,
	Delete,
} = faunadb.query;

/**
 * Initialized DB with API key
 */
export function init() {
	client = new faunadb.Client({ secret: process.env.DB_KEY });
}

/**
 * Gets users from the collection.
 * @param {String} [uuid] Get Given user.
 * @returns {Promise} Promise containing Data of single user or an array of all users.
 */
export async function GET(uuid, collection) {
	if (uuid === 'null') {
		return client
			.query(
				Map(
					Paginate(Documents(Collection(collection)), { size: 100000 }),
					Lambda((x) => Get(x))
				)
			)
			.then((doc) => doc.data.map((item) => item.data))
			.catch((e) => console.log(e));
	} else {
		return client
			.query(Get(Ref(Collection(collection), uuid)))
			.then((d) => d.data)
			.catch((e) => console.log(e));
	}
}

/**
 * Adds document to collection.
 * @param {String} username Usernmae of the new USer
 * @param {Number} score Score of the player
 * @returns {Promise} Promise containing the added document
 */
export async function POST(id, collection, data) {
	const doc = await client.query(
		Create(Ref(Collection(collection), id), {
			data: data,
		})
	);

	return doc;
}

/**
 * Updates doccument in Collection
 * @param {*} id id to modify
 * @param {*} collection Collection to modify
 * @param {*} data data to put
 */
export async function UPDATE(id, collection, data) {
	const doc = await client.query(
		Update(Ref(Collection(collection), id), {
			data: data,
		})
	);

	return doc;
}

export async function DELETE(id, collection) {
	const doc = await client.query(Delete(Ref(Collection(collection), id)));

	return doc;
}
