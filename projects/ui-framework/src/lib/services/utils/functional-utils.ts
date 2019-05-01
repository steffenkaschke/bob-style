export const keysFromArrayOrObject = (smth: string[] | {}): string[] => {
  return Array.isArray(smth) ? smth : Object.keys(smth);
};
