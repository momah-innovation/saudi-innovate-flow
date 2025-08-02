import { http, HttpResponse } from 'msw'

export const userHandlers = [
  // Mock user endpoints
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([
      {
        id: 'profile-1',
        user_id: 'mock-user-id',
        display_name: 'Test User',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z'
      }
    ])
  }),

  http.get('*/rest/v1/profiles/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      user_id: 'mock-user-id', 
      display_name: 'Test User',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z'
    })
  })
]