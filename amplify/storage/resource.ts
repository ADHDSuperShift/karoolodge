import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'karoo-lodge-media',
  access: (allow) => ({
    'media/gallery/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'media/rooms/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'media/uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  })
});
