import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== KAROO LODGE DATA SCHEMA ==============================================
Define data models for Karoo Lodge: Gallery images, Rooms, Wine collection,
and Settings. These will be stored as JSON files and managed through the
admin interface.
=========================================================================*/
const schema = a.schema({
  GalleryImage: a
    .model({
      title: a.string().required(),
      description: a.string(),
      imageUrl: a.string().required(),
      category: a.enum(['rooms', 'dining', 'bar', 'wine', 'scenery']),
      sortOrder: a.integer().default(0),
    })
    .authorization((allow) => [
      allow.guest(),
      allow.authenticated()
    ]),

  Room: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      price: a.float(),
      images: a.string().array(), // Array of image URLs
      amenities: a.string().array(),
      sortOrder: a.integer().default(0),
    })
    .authorization((allow) => [
      allow.guest(),
      allow.authenticated()
    ]),

  Wine: a
    .model({
      name: a.string().required(),
      winery: a.string().required(),
      vintage: a.integer(),
      category: a.enum(['red', 'white', 'rose', 'sparkling', 'dessert']),
      price: a.float(),
      description: a.string(),
      imageUrl: a.string(),
    })
    .authorization((allow) => [
      allow.guest(),
      allow.authenticated()
    ]),

  Setting: a
    .model({
      key: a.string().required(),
      value: a.json().required(),
      description: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated()
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
