const uuidv4 = require('uuid').v4;
const functions = require('firebase-functions');
const faunadb = require('faunadb');

const client = new faunadb.Client({ secret: functions.config().db.key });

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
} = faunadb.query;

/**
 * Adds doccument to the highscore collenction
 * @param {String} username Usernmae of the new USer
 * @param {Number} score Score of the player
 * @returns {Promise} Promise containing the added document
 */
module.exports.POST = async (data) => {
	data.forEach(async (d, i) => {
		await client
			.query(
				Update(Ref(Collection('CronStore'), i), {
					data: d,
				})
			)
			.catch((e) => console.log(e.description));
	});
};
