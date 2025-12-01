// Mock the serviceAccountKey.json to prevent real Firebase initialization
jest.mock('../serviceAccountKey.json', () => ({}), { virtual: true });

// Mock Firebase Admin SDK before any imports
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  cert: jest.fn(),
  getAuth: () => ({
    verifyIdToken: jest.fn().mockImplementation((token) => {
      // Mock different users based on token
      if (token === 'mock.firebase.admin.token') {
        return Promise.resolve({
          uid: 'adminUserId',
          email: 'admin@example.com',
        });
      } else if (token === 'mock.firebase.user.token') {
        return Promise.resolve({
          uid: 'userUserId',
          email: 'user@example.com',
        });
      } else {
        return Promise.resolve({
          uid: 'testUserId',
          email: 'test@example.com',
        });
      }
    }),
  }),
  getFirestore: () => ({
    collection: (name: string) => ({
      get: jest.fn().mockImplementation(() => ({
        docs: testData[name].map((item, index) => ({
          id: item.id || `testId${index}`,
          data: () => item,
        })),
      })),
      doc: (id: string) => ({
        get: jest.fn().mockImplementation(() => {
          const item = testData[name].find(item => item.id === id);
          return Promise.resolve({
            exists: !!item,
            data: () => item,
          });
        }),
        set: jest.fn().mockImplementation((data) => {
          const existingIndex = testData[name].findIndex(item => item.id === id);
          if (existingIndex >= 0) {
            testData[name][existingIndex] = { ...data, id };
          } else {
            testData[name].push({ ...data, id });
          }
        }),
        update: jest.fn().mockImplementation((data) => {
          const existingIndex = testData[name].findIndex(item => item.id === id);
          if (existingIndex >= 0) {
            testData[name][existingIndex] = { ...testData[name][existingIndex], ...data };
          }
        }),
        delete: jest.fn().mockImplementation(() => {
          const existingIndex = testData[name].findIndex(item => item.id === id);
          if (existingIndex >= 0) {
            testData[name].splice(existingIndex, 1);
          }
        }),
      }),
      add: jest.fn().mockImplementation((data) => {
        const newId = `testId${testData[name].length + 1}`;
        const newItem = { ...data, id: newId };
        testData[name].push(newItem);
        return { id: newId };
      }),
      where: jest.fn().mockReturnThis(),
    }),
  }),
}));

// Mock the authMiddleware to bypass Firebase authentication
jest.mock('./src/middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization token missing or malformed' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Mock user based on token
    if (token === 'mock.firebase.admin.token') {
      (req as any).user = {
        userId: 'adminUserId',
        email: 'admin@example.com',
        role: 'admin',
      };
    } else if (token === 'mock.firebase.user.token') {
      (req as any).user = {
        userId: 'userUserId',
        email: 'user@example.com',
        role: 'user',
      };
    } else {
      (req as any).user = {
        userId: 'testUserId',
        email: 'test@example.com',
        role: 'admin',
      };
    }
    next();
  }),
  authorizeRole: jest.fn((roles: string[]) => {
    return (req: any, res: any, next: any) => {
      const user = req.user;
      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ error: 'Forbidden: insufficient rights' });
        return;
      }
      next();
    };
  }),
}));

// In-memory storage for tests
const testData: { [collection: string]: any[] } = {
  clients: [],
  loans: [],
  users: [],
};

// Keep references to original console methods
const originalConsoleInfo = console.info;
const originalConsoleError = console.error;

// Suppress emailService logs during tests
beforeAll(() => {
  console.info = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('[emailService]')) return;
    originalConsoleInfo.apply(console, args);
  };
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('[emailService]')) return;
    originalConsoleError.apply(console, args);
  };
});

// Clear test data before each test
beforeEach(() => {
  testData.clients = [];
  testData.loans = [];
  testData.users = [
    {
      id: 'testUserId',
      email: 'test@example.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'adminUserId',
      email: 'admin@example.com',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'userUserId',
      email: 'user@example.com',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
});

afterAll(() => {
  console.info = originalConsoleInfo;
  console.error = originalConsoleError;
});
