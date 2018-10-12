import * as sqlite from 'sqlite'

/**
 * Run and return a query on the db using SQLite
 * NOTE: We open and close it each time to avoid conflic ts between sqlite
 * and dynamo access
 */
export async function dbGet(sql: string) {
	const db: sqlite.Database = await sqlite.open(
		`db/${process.env.AWS_ACCESS_KEY_ID}_${process.env.AWS_REGION}.db`
	)
	const result = await db.get(sql)
	db.close()
	return result
}