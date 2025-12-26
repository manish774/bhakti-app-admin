export const selectSubarray = (
  array: any[],
  startIndex: number,
  endIndex: number
) => {
  const subarray = array.slice(startIndex, endIndex + 1);

  return subarray;
};
export const ASC = "asc";
export const DESC = "desc";

export const sortRecords = (records: any[], key: string, order: string) => {
  const sortedArray = [...records];

  sortedArray.sort((a, b) => {
    const valueA = String(a[key]).toLowerCase();
    const valueB = String(b[key]).toLowerCase();

    if (order === ASC) {
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    } else if (order === DESC) {
      if (valueA > valueB) return -1;
      if (valueA < valueB) return 1;
      return 0;
    }

    return 0;
  });

  return sortedArray;
};

export const searchFromDictionary = (dictionary: any, searchValue: string) => {
  if (!Object.keys(dictionary).length) {
    return {};
  }
  const foundInDictionary: { [key: string]: any } = {};
  for (let key in dictionary) {
    if (
      JSON.stringify(dictionary[key])
        .toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase())
    ) {
      foundInDictionary[key] = dictionary[key];
    }
  }
  return foundInDictionary;
};

export const getFileType = (file: any) => {
  if (file) {
    const selectedFile = file;
    const fileType = selectedFile.type;

    switch (fileType) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return "image";

      case "audio/mpeg":
      case "audio/wav":
      case "audio/ogg":
        return "audio";

      case "video/mp4":
      case "video/webm":
      case "video/ogg":
        return "video";

      case "application/pdf":
        return "other";

      // Add more cases as needed

      default:
        console.log("Selected file type is not supported.");
        break;
    }
  }
};

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};
