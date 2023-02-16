import { User } from '@/types/users.type';
import { faker } from '@faker-js/faker';

export const mockUsers: User[] = [];

for (let index = 0; index < 20; index++) {
  mockUsers.push({
    id: faker.helpers.unique(faker.datatype.number),
    email: `${faker.name.fullName()}@example.com`,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    avatar: faker.image.animals(500, 500, true),
  });
}
