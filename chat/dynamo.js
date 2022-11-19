
const { DynamoDBClient, PutItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const MESSAGE_TABLE_NAME = process.env.DYNAMODB_MESSAGE_TABLE;

let dynamoConfig = {};
if (process.env.DEBUG) {
    dynamoConfig = { endpoint: "http://dynamodb:8000", region: "ddblocal" };
}

const client = new DynamoDBClient(dynamoConfig);

module.exports = {
    async putMessage(messageData) {
        const putItem = new PutItemCommand({
            TableName: MESSAGE_TABLE_NAME,
            Item: marshall(messageData)
        });
        return await client.send(putItem)
    },

    async getMessages(eventId) {
        const getItems = new QueryCommand({
            TableName: MESSAGE_TABLE_NAME,
            Select: "ALL_ATTRIBUTES",
            ExpressionAttributeValues: {
                ":eventId": {S: eventId}
            },
            KeyConditionExpression: "eventId = :eventId"
        })
        const getItemResponse = await client.send(getItems)
        const rawItems = await getItemResponse.Items
        let unmarshaledItems = rawItems.map(unmarshall)
        return unmarshaledItems
    }
}
