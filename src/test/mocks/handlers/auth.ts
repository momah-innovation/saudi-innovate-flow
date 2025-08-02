import { http, HttpResponse } from 'msw'

export const authHandlers = [
  // Mock Supabase auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: {
          display_name: 'Test User'
        }
      }
    })
  }),

  http.get('*/auth/v1/user', () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      user_metadata: {
        display_name: 'Test User'
      }
    })
  }),

  http.post('*/auth/v1/logout', () => {
    return HttpResponse.json({})
  })
]