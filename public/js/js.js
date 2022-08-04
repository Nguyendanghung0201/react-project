window.addEventListener("orientationchange", function () {
  return calculateViewport();
});
window.addEventListener("resize", function () {
  return calculateViewport();
});
function Time() {
  var d = new Date();
  var t = d.getTime() / 1000.0;
  return t;
}
// First visit
if (!eval(localStorage.clientid)) {
  localStorage.clientid = Time().toFixed(2);
  localStorage.referrer = document.referrer;
}

function calculateViewport() {
  var innerHeight = window.innerHeight / 100;
  document.documentElement.style.setProperty(
    "--vh",
    innerHeight.toString() + "px"
  );

  var keyHeight = window.innerHeight * 0.09 + 19;
  document.documentElement.style.setProperty(
    "--key-height",
    keyHeight.toString() + "px"
  );

  var vhKeyboard = window.innerHeight * 0.64 - 76;
  document.documentElement.style.setProperty(
    "--vh-keyboard",
    vhKeyboard.toString() + "px"
  );
}
calculateViewport();
let open = false;
//  left  mở tắt seting
$(".menu-toggle.close-menu-btn.left").click(function () {
  $(".menu.menu--left").hide("fast", "linear");
  $(".overlay").hide();
  open = false;
});

$(".menu-btn.menu-btn--left.menu-toggle").click(async function () {
  console.log("left");

  $(".menu.menu--left").show("fast", "linear");
  $(".menu.menu--right").hide("fast", "linear");
  $(".overlay").show();
  await sleep(1000);
  open = true;
});
// right mở tắt seting

$(".menu-btn.menu-btn--right.menu-toggle").click(async function () {
  console.log("right");
  $(".menu.menu--right").show("fast", "linear");
  $(".menu.menu--left").hide("fast", "linear");
  $(".overlay").show();
  await sleep(1000);
  open = true;
});
$(".menu-toggle.close-menu-btn.right").click(function () {
  $(".menu.menu--right").hide("fast", "linear");
  $(".overlay").hide();
  open = false;
});
var r = document.querySelector(":root");
for (const color of listVarible.light) {
  let key = Object.keys(color)[0];
  r.style.setProperty(key, color[key]);
}
// mod nền
if (mode == "dark") {
  $('input[name="dark"]').prop("checked", true);
  for (const color of listVarible.dark) {
    let key = Object.keys(color)[0];
    r.style.setProperty(key, color[key]);
  }
}
$('input[name="dark"]').change(function () {
  if (this.checked) {
    for (const color of listVarible.dark) {
      let key = Object.keys(color)[0];
      r.style.setProperty(key, color[key]);
    }
    localStorage.setItem("mode", "dark");
    $('input[name="dark"]').prop("checked", true);
  } else {
    //I'm not checked
    for (const color of listVarible.light) {
      let key = Object.keys(color)[0];
      r.style.setProperty(key, color[key]);
    }
    localStorage.setItem("mode", "light");
    $('input[name="dark"]').prop("checked", false);
  }
});

$(document).on("click", function (e) {
  if (open && $(e.target).closest(".header").length === 0) {
    $(".menu.menu--left").hide("fast", "linear");
    $(".menu.menu--right").hide("fast", "linear");
    $(".overlay").hide();
    open = false;
  }
});

function getLocation() {
  fetch("http://ip-api.com/json")
    .then((json) => json.json())
    .then((data) => {
      if (data.status === "success" && data.city && data.regionName) {
        $(".locationdetail").html(data.city + ", " + data.regionName);
      }
    });
}
getLocation();
