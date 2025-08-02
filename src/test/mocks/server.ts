import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth'
import { challengeHandlers } from './handlers/challenges'
import { userHandlers } from './handlers/users'

export const server = setupServer(
  ...authHandlers,
  ...challengeHandlers,
  ...userHandlers
)