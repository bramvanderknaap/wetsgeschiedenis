export class NietGevonden extends Error {
  constructor(wat: string) {
    super(`${wat} bestaat niet`);
    this.name = "NietGevonden";
  }
}
