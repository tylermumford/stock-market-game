describe('parseInt', () => {
  it('should return NaN on empty string', () => {
    expect(Number.parseInt('')).toBeNaN()
  })
})

describe('toUpperCase', () => {
  it('shouldn\'t change numbers', () => {
    expect('8'.toUpperCase()).toBe('8')
  })
})
