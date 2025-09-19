export const TEST_CREDENTIALS = {
  VALID: {
    user: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD
  },
  INVALID: {
    user: process.env.TEST_USER_INVALID,
    password: process.env.TEST_PASSWORD_INVALID
  }
} as const;

export const TEST_URLS = {
  LOGIN: '/login',
  SUBMODULE_LIST: '/submodule-list'
} as const;

export const getBaseUrl = () => {
  return process.env.TEST_BASE_URL || 'http://localhost:5173';
};
