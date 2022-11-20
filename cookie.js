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
setCookie("email", "1234@Gmail.com");

console.log(getCookie());
