import { ApplicationError } from 'that-koa-error'

/**
 * A Dynamo Error
 */
export class DynamoError extends ApplicationError {
	constructor(
		public debugMessage: string = 'No debug information provided',
		public debugInfo: any = {}
	) {
		super(500, 'A DynamoDB Error has occurred', debugMessage, debugInfo)
	}
}
