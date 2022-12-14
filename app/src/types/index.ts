export type Value<T> = {
  value: T;
  error: never;
};
export type Error<U> = {
  value: never;
  error: U;
};
export type Result<T, U> = NonNullable<Value<T> | Error<U>>;

export function makeValue<T>(value: T): Value<T> {
  return { value };
}

export function makeError<U>(error: U): Error<U> {
  return { error };
}

export function isValue<T, U>(result: Result<T, U>): result is Value<T> {
  return result.value !== undefined;
}

export function isError<T, U>(result: Result<T, U>): result is Error<U> {
  return result.error !== undefined;
}
