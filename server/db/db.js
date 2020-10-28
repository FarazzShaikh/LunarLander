import { v4 as uuidv4 } from 'uuid';
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
} = faunadb.query;

/**
 * Initialized DB with API key
 */
export function init() {
	client = new faunadb.Client({ secret: process.env.DB_KEY });
}

/**
 * Gets users from the Highscores collention
 * @param {String} [uuid] Get Given user.
 * @returns {Promise} Promise containing Data of single user or an array of all users.
 */
export async function GET(uuid, collection) {
	if (!uuid) {
		return client
			.query(
				Map(
					Paginate(Documents(Collection(collection))),
					Lambda((x) => Get(x))
				)
			)
			.then((doc) => doc.data.map((item) => item.data))
			.catch((e) => console.log(e));
	}
}

/**
 * Adds doccument to the highscore collenction
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
