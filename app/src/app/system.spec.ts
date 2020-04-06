describe('parseInt', () => {
  it('should return NaN on empty string', () => {
    expect(Number.parseInt('')).toBeNaN()
  })
})
