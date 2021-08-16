// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
const createVanityNumbers = require("./VanityConvert");
// Set the region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB service object
var dynamo = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
exports.handler = async (event, context, callback) => {
  var phoneNumber =
    event["Details"]["ContactData"]["CustomerEndpoint"]["Address"];

  const vanityNumbers = createVanityNumbers(phoneNumber);

  const dbItem = {
    TableName: "VanityConvert",
    Item: {
      PhoneNumber: { S: phoneNumber },
      vanityNumbers: { SS: vanityNumbers },
    },
  };

  dynamo.putItem(dbItem, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });

  var resultMap = {
    Phone: phoneNumber,
  };

  for (let i = 0; i < vanityNumbers.length; i++) {
    resultMap["vanity" + i] = vanityNumbers[i];
  }
  callback(null, resultMap);
};
