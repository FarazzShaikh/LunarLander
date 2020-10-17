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
	client = new faunadb.Client({ secret: process.env.API_KEY });
}

/**
 * Gets users from the Highscores collention
 * @param {String} [user] Get Given user.
 * @returns {Promise} Promise containing Data of single user or an array of all users.
 */
export async function GET(user) {
	if (!user) {
		const doc = await client
			.query(
				Map(
					Paginate(Documents(Collection('HighScores'))),
					Lambda((x) => Get(x))
				)
			)
			.catch((e) => console.log(e));

		return doc.data.map((item) => item.data);
	}
}

/**
 * Adds doccument to the highscore collenction
 * @param {String} username Usernmae of the new USer
 * @param {Number} score Score of the player
 * @returns {Promise} Promise containing the added document
 */
export async function POST(username, score) {
	const uuid = uuidv4();
	const doc = await client.query(
		Create(Ref(Collection('HighScores'), uuid), {
			data: {
				uuid: uuid,
				userName: username,
				score: score,
				time: new Date().toISOString(),
			},
		})
	);

	return doc;
}
