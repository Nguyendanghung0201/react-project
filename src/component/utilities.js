const baseurl = 'http://mathgame.one';
const fetchApi = (type, url, data, token) => {
  return new Promise((resolve, reject) => {
    try {
      if (type === "GET") {
        fetch(baseurl +url, {
          method: type,
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token,
          },
        })
          .then((json) => json.json())
          .then((data) => {
            resolve(data);
          });
      }
      if (type === "POST") {
        fetch(baseurl +url, {
          method: type,
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token,
          },
          body: JSON.stringify(data),
        })
          .then((json) => json.json())
          .then((data) => {
            resolve(data);
          });
      }
    } catch (e) {
      reject(false);
    }
  });
};

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
export { sleep };

export default fetchApi;
