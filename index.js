// Copyright 2021 Táxeus Checklists Platform
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Imports the Google Cloud client libraries
const { Firestore } = require('@google-cloud/firestore');
const { PubSub } = require('@google-cloud/pubsub');

/**
 * Cloud Function to be triggered by HTTP calls.
 *
 * @param {Object} req Cloud Function request context.
 */
exports.storeAndPublishMessage = req => {
  storeMessage(req.body);
  publishMessage(req.body);
};

async function storeMessage(message) {
  const db = new Firestore({ projectId: process.env.PROJECT_ID });

  const collection = db.collection(process.env.FIRESTORE_COLLECTION_PATH);
  const messageRef = collection.doc(`${message.resource.id}-${message.event}`);

  await messageRef.set(message);
  console.log(`Message ${message.resource.id}-${message.event} stored.`);
}

async function publishMessage(message) {
  const pubSubClient = new PubSub();

  const topic = pubSubClient.topic(process.env.PUBSUB_TOPIC_NAME);

  const messageId = await topic.publish(message);
  console.log(`Message ${message.resource.id}-${message.event} published with ID ${messageId}.`);
}
