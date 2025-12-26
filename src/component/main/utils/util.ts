export const formatPayload = function () {
  const result: Record<string, any> = {};
  const original = { ...(this as Record<string, any>) };
  console.log(this);
  for (const [key, value] of Object.entries(original)) {
    const splitDot = key.split(".");

    if (splitDot.length > 1) {
      // Has dot notation - create nested structure
      let current = result;

      splitDot.forEach((part, index) => {
        if (index === splitDot.length - 1) {
          // Last part - assign the value
          current[part] = value;
        } else {
          // Not last part - create nested object if doesn't exist
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    } else {
      // No dot notation - direct assignment
      result[key] = value;
    }
  }
  console.log(result);
  return result;
};
