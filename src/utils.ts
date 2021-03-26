export const range = (stop: number) => [
  ...(function* () {
    for (let i = 0; i < stop; i++) {
      yield i;
    }
  })(),
];
