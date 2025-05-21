import ky from "ky";

const kyInstance = ky.create({
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      const isTimeStampKey = key.endsWith("At");
      if (isTimeStampKey) {
        return new Date(value);
      }
      return value;
    });
  },
});

export default kyInstance;
