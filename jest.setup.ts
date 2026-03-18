import "@testing-library/react-native/matchers";

// Global mock for react-native-auth0 — prevents native module errors in Jest
jest.mock("react-native-auth0", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    webAuth: {
      authorize: jest.fn(),
      clearSession: jest.fn(),
    },
    credentialsManager: {
      saveCredentials: jest.fn(),
      getCredentials: jest.fn(),
      clearCredentials: jest.fn(),
      hasValidCredentials: jest.fn().mockResolvedValue(true),
    },
  })),
}));
