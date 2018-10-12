import * as AWS from 'aws-sdk'
import * as M from 'that-simple-model'
import * as O from 'that-simple-objectstore'
import * as Impl from '@/dynamoImpl'

/**
 * ObjectStore for persisting to DynamoDB
 */
export class DynamoObjectStore implements O.IObjectStore {
	/* PROPERTIES */
	/**
	 * The connection to the dynamodb service
	 */
	private _dynamodb: AWS.DynamoDB

	/**
	 * An instance of a document client
	 */
	private _docClient: AWS.DynamoDB.DocumentClient

	/* CONSTRUCTOR */
	constructor(config: AWS.DynamoDB.ClientConfiguration) {
		AWS.config.update(config)
		this._dynamodb = new AWS.DynamoDB()
		this._docClient = new AWS.DynamoDB.DocumentClient()
	}

	/* METHODS */
	/**
	 * Create a simple/standard DynamoDB table
	 */
	async construct<T extends M.IModel>(cls: M.IModelClass<T>): Promise<void> {
		return Impl.construct(this._dynamodb, cls)
	}

	/**
	 * Creates/updates an item in the dynamodb
	 */
	async put<T extends M.IModel>(item: T): Promise<T> {
		return Impl.put(this._docClient, item)
	}

	/**
	 * Returns an items from the dynamodb datastore
	 */
	async get<T extends M.IModel>(
		cls: M.IModelClass<T>,
		partitionKey: string | number,
		sortKey?: string | number
	): Promise<T> {
		return Impl.get(this._docClient, cls, partitionKey, sortKey)
	}

	/**
	 * Removes an item from the dynamodb datastore
	 */
	async query<T extends M.IModel>(
		cls: M.IModelClass<T>,
		query?: O.IObjectStoreQueryOptions<T>
	): Promise<O.IObjectStoreQueryResult<T>> {
		return Impl.query(this._docClient, cls, query)
	}

	/**
	 * Removes an item from the dynamodb datastore
	 */
	async remove<T extends M.IModel>(item: T): Promise<void> {
		return Impl.remove(this._docClient, item)
	}
}
