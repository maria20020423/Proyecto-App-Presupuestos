export function toLowerCaseKeys(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => toLowerCaseKeys(item));
  }

  if (isPlainObject(data)) {
    const newObj: any = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObj[key.toLowerCase()] = toLowerCaseKeys(data[key]);
      }
    }

    return newObj;
  }

  return data;
}

function isPlainObject(value: any): boolean {
  return (
    value !== null &&
    typeof value === "object" &&
    (value.constructor === Object ||
      Object.getPrototypeOf(value) === null)
  );
}