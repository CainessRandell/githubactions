import { jest } from "@jest/globals";

const mockPrisma = {
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
};

export { mockPrisma };

export class PrismaClient {
  constructor() {
    return mockPrisma;
  }
}
