import { ddbQueryPostsParams } from "../types";
require('dotenv').config()

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const getAllBids = async (projectId: string) => {
  console.log(`getAllBids called`);

  const params: ddbQueryPostsParams = {
    TableName: process.env.CONTRACTORS_TABLE || "",
    KeyConditionExpression: "#PK = :post_partition and #SK = :sk_prefix",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":post_partition": `PROJECT#${projectId}`,
      ":sk_prefix": "BID#",
    },
    ReturnConsumedCapacity: "TOTAL",
    ScanIndexForward: false, // Set this to true for ascending order
  };
 
  try {
    const data = await docClient.query(params).promise();

    console.log(`data: ${JSON.stringify(data, null, 2)}`);

    return data.Items;

  } catch (err) {
    console.log(`err: ${JSON.stringify(err, null, 2)}`);

    return null;
  }
};

export default getAllBids;