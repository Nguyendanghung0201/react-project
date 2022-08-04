const listVarible = {
  dark: [
    { "--color": "hsl(120, 25%, 40%)" },
    { "--background": "hsl(0, 0%, 3%)" },
    { "--foreground": "hsl(0, 0%, 8%)" },
    { "--color9": "white" },
    { "--color8": "hsl(0, 0%, 79%)" },
    { "--color7": "hsl(0, 0%, 68%)" },
    { "--color6": "hsl(0, 0%, 50%)" },
    { "--color5": "hsl(0, 0%, 36%)" },
    { "--color4": "hsl(0, 0%, 25%)" },
    { "--color3": "hsl(0, 0%, 15%)" },
    { "--color2": "hsl(0, 0%, 8%)" },
    { "--color1": "hsl(0, 0%, 5%)" },
    { "--color0": "black" },
    { "--weak-opacity": "0.12" },
    { "--strong-opacity": "0.3" },
  ],
  light: [
    { "--color": "darkgreen" },
    { "--background": "hsl(0, 0%, 96%)" },
    { "--foreground": "white" },
    { "--color9": "black" },
    { "--color8": "hsl(0, 0%, 25%)" },
    { "--color7": "hsl(0, 0%, 40%)" },
    { "--color6": "hsl(0, 0%, 50%)" },
    { "--color5": "hsl(0, 0%, 64%)" },
    { "--color4": "hsl(0, 0%, 75%)" },
    { "--color3": "hsl(0, 0%, 88%)" },
    { "--color2": "hsl(0, 0%, 93%)" },
    { "--color1": "hsl(0, 0%, 96%)" },
    { "--color0": "white" },
    { "--weak-opacity": "0.4" },
    { "--strong-opacity": "0.7" },
  ],
};
let token = localStorage.getItem("token");
let mode  = localStorage.getItem('mode')

var fetchApi = (type, url, data) => {
  return new Promise((resolve, reject) => {
    try {
      if (type == "GET") {
        fetch(url, {
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
      if (type == "POST") {
        fetch(url, {
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
let mainid = document.getElementById("#mainid");
const sleep = (time)=>{
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve(true)
    },time)
  })
}
var statusPage = false; // đang ở trang nào

var yourdapan = "";