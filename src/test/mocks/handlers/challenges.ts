import { http, HttpResponse } from 'msw'

export const challengeHandlers = [
  // Mock challenges endpoints
  http.get('*/rest/v1/challenges', () => {
    return HttpResponse.json([
      {
        id: 'challenge-1',
        title: 'Test Challenge',
        description: 'A test challenge for testing',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ])
  }),

  http.get('*/rest/v1/challenges/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: 'Test Challenge',
      description: 'A test challenge for testing',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    })
  }),

  http.post('*/rest/v1/challenges', () => {
    return HttpResponse.json({
      id: 'new-challenge',
      title: 'New Challenge',
      description: 'A newly created challenge',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  })
]