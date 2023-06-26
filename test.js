function StringChallenge(str, token) {
  const challengeObj = {};
  const splittedArray = str.split("");
  const splittedToken = token.split("");

  for (let index = 0; index < splittedArray.length; index++) {
    const currentChar = splittedArray[index];
    challengeObj[currentChar] = (challengeObj[currentChar] || 0) + 1;
  }

  const resultArr = Object.keys(challengeObj)
    .map((key) => `${challengeObj[key]}${key}`)
    .join("");

  const out = [...resultArr].map((c, i) => c + splittedToken[i]).join("");

  return out;
}

const str = "aabbcde";
const token = "eucf6rh23d";

console.log(StringChallenge(str, token));
