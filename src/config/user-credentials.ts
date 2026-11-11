export const TEST_USERS = {
  STANDARD: {
    username: 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    description: 'Regular active user without behavioral anomalies'
  },
  LOCKED_OUT: {
    username: 'locked_out_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    description: 'Locked out user account to test access denial error messages'
  },
  PROBLEM: {
    username: 'problem_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    description: 'User encountering UI defects (image mismatch, form blocks)'
  },
  PERFORMANCE_GLITCH: {
    username: 'performance_glitch_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    description: 'User experiencing simulated latency'
  },
  ERROR: {
    username: 'error_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    description: 'User triggering internal checkout error'
  },
  VISUAL: {
    username: 'visual_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
    description: 'User encountering layout/visual regressions'
  },
  INVALID: {
    username: 'invalid_user',
    password: 'wrong_password',
    description: 'Non-existent user credentials'
  }
} as const;

