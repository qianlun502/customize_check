// ==UserScript==
// @name         签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://purefast.net
// @match        https://purefast.net/auth/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");
  let baseUrl = "https://purefast.net";

  let logout = function () {
    let request = new XMLHttpRequest();
    request.open("GET", baseUrl + "/user/logout", false); //false为同步，true为开启异步
    // request.setRequestHeader();
    // request.responseType();
    request.setRequestHeader("content-type", "application/json");
    request.send();
    /*  request.onreadystatechange = function () {
      //这里是异步回调
      logger.log("logout");
      if (
        request.readyState === XMLHttpRequest.DONE &&
        request.status === 200
      ) {
        // console.log(request.response);//这里返回的登录页面，不打印
        // console.log(request.responseType);
        logger.log("已退出");
        return 200;
      }
    }; */
    if (request.status === 200) console.log(request.status);
  };
  let login = function (email, password) {
    logger.log(email);

    let request = new XMLHttpRequest();
    let postdata = {
      email: email,
      passwd: password,
      code: "",
    };
    //   let fordata = new FormData();
    //   fordata.append("email", email);
    //   fordata.append("passwd", password);
    //   fordata.append("code", "12345");
    request.open("POST", baseUrl + "/auth/login", false);
    request.setRequestHeader("content-type", "application/json");
    request.send(JSON.stringify(postdata));

    if (request.status === 200) console.log(request.responseText);
  };
  let checkin = function () {
    //   alert("55");
    let request = new XMLHttpRequest();

    request.open("POST", baseUrl + "/user/checkin", false);
    request.setRequestHeader("content-type", "application/json");
    request.send();
    if (request.status === 200) {
      console.log(request.responseText);
      setCookie(email, new Date().toString()); //这里没有UTC+8
    }
  };

  let email, password;

  let logger = {
    log: (...args) => {
      console.log(...args);
    },
    warn: (...args) => {
      console.warn(...args);
    },
    error: (...args) => {
      console.error(...args);
    },
  };

  function day_checkin(email, password) {
    this.email = email;
    this.password = password;
  }
  day_checkin.prototype.test = function () {
    return new Promise((resolve, reject) => {
      let login_code;
      // while (login_code != "200")
      login_code = login(this.email, this.password); //当 XMLHTtpservlet open()设置为true时，login里面有异步回调，这里不会等待回调执行完，直接进行then后面的操作。所以会造成执行顺序混乱。
      resolve();
    }).then(() => {
      let checkin_code = "";
      // while (checkin_code != "200") {
      checkin_code = checkin();
      // }
    });
  };

  email = "tomxingwu.501@gmail.com";
  password = "123456789";

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  function setCookie(username, value) {
    let expire = new Date();
    expire.setHours(expire.getHours());
    expire.setTime(expire.getTime() + 24 * 60 * 60 * 1000);
    document.cookie =
      username + "=" + value + ";expires=" + expire.toGMTString() + ";path=/";
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

      if (value_array[0].toString() === email.toString()) {
        console.log(value_array);
        flag = true;
      }
      //   if (value_array[0].trim() == "expires") expire_date = value_array[1];
    });
    if (flag == true) return true;
    return false;
  }
  async function synchornized() {
    email = "killercontact1740@gmail.com";
    password = "123456789";
    if (!getCookie(email)) await new day_checkin(email, "123456789").test();
    else logger.log(email, "存在");

    console.log("Do some thing, " + new Date());
    await sleep(3000);
    logout_code = logout();
    console.log("Do other things, " + new Date());

    email = "tomxingwu.501@gmail.com";
    password = "123456789";
    if (!getCookie(email)) new day_checkin(email, password).test();
    else logger.log(email + "存在");

    await sleep(3000);
    logout_code = logout();
    logger.error("执行完毕");
  }
  if (window.location.href === "https://purefast.net/auth/login") {
    synchornized();
  }
  if (window.location.href === "https://purefast.net/") {
    setTimeout(() => {
      window.location.href = "https://purefast.net/auth/login";
    }, 6000);
  }
})();
