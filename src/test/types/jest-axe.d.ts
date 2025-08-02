/// <reference types="vitest/globals" />

declare global {
  namespace Vi {
    interface Assertion<T = any> {
      toHaveNoViolations(): void
    }
  }
}

export {}