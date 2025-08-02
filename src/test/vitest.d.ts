/// <reference types="vitest/globals" />

declare global {
  namespace Vi {
    interface JestAssertion<T = any> {
      toHaveNoViolations(): void
    }
  }
}

export {}