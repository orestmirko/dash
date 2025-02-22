export const updateObjectFields = <T extends object, U extends Partial<T>>(
  target: T,
  updates: U,
): T => {
  return Object.assign(
    target,
    Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined)),
  );
};
