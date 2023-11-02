// mongodb-connection.js
import { MongoClient } from 'mongodb';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const mongoSecret = 'dev/presently/mongo';
const client = new SecretsManagerClient({
    region: "us-east-1",
  });


async function getMongoURL () {
    console.info('running')
    let response;
    try {
        response = await client.send(
            new GetSecretValueCommand({
            SecretId: mongoSecret,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
    }

    const url = response.SecretString;

    return url;
}

export default async function connectToMongoDB() {
    const url = await getMongoURL();
    if (url) {
        const client = new MongoClient(url);
        try {
            await client.connect();
            return client.db();
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    } else {
        throw new Error('MongoDB URL is undefined.');
    }
}

