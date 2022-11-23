function setCookie(username, value) {
  let expire = new Date();
  expire.setHours(expire.getHours());
  expire.setTime(expire.getTime() + 24 * 1 * 1000);
  document.cookie =
    username +
    "=" +
    value +
    ";expire_time=" +
    expire +
    ";expires=" +
    expire.toGMTString() +
    ";path=/";
}
function getCookie(email = "123@Gmail.com") {
  let flag = false;
  let expire;
  let cookieArr = [];
  if (document.cookie.length > 0) {
    cookieArr = document.cookie.split(";");
  }
  cookieArr.forEach((value) => {
    let value_array = value.split("=");
    debugger;
    if (value_array[1].toString() === email.toString()) {
      console.log(value_array);
      flag = true;
    }
    //   if (value_array[0].trim() == "expires") expire_date = value_array[1];
  });
  if (flag == true) return true;
  return false;
}
// setCookie("email", "1234@Gmail.com");

// console.log(getCookie());

function post_weixin(title, msg) {
  let token = "409ea8a9a1cc4854ad3ca04c019dcc81";
  let data = {
    token: token,
    title: title,
    content: msg,
    template: "json",
    channel: "wechat",
  };
  let url = "http://www.pushplus.plus/api/send";
  // let url = "http://www.pushplus.plus/send";
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Content-Type": "application/json",
  };
  let request = new XMLHttpRequest();
  request.open("POST", url);

  for (let name in headers) {
    request.setRequestHeader(name, headers[name]);
  }

  request.send(JSON.stringify(data));
}
post_weixin("2022-11-23", "testpushplus 12312送12313");
