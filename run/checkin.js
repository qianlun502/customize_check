// ==UserScript==
// @name         签到
// @namespace    http://tampermonkey.net/
// @version      0.2
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
  let alert_text = "";
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
    if (request.status === 200) console.log(request.status + "exit");
    alert_text += request.status + "exit" + "\n";
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
    //   request.send(fordata);
    /*   request.onreadystatechange = function () {
      logger.log("login");
      if (
        request.readyState === XMLHttpRequest.DONE &&
        request.status === 200
      ) {
        console.log(request.response.ret);
        console.log(request.response.msg);
        // console.log(request.responseType);
        //
        // checkin();
        return "200";
      }
      if (request.status == 302) {
        logger.log("重新调用");
        request.send(postdata);
      }
    }; */
    if (request.status === 200) console.log(request.responseText);
<<<<<<< HEAD:checkin.js
    alert_text += email + "\n" + request.responseText + "\n";
=======
    alert_text += email + "\n" +  JSON.parse(request.responseText).msg + "\n";
>>>>>>> 22c2fe8069804cc64156a01b39da5c24e5b76392:run/checkin.js
  };
  let checkin = function () {
    //   alert("55");
    let request = new XMLHttpRequest();

    request.open("POST", baseUrl + "/user/checkin", false);
    request.setRequestHeader("content-type", "application/json");
    request.send();
    /*  request.onreadystatechange = function () {
      logger.log("checkin");

      if (
        request.readyState === XMLHttpRequest.DONE &&
        request.status === 200
      ) {
        console.log(request.response);
        return "200";
      }
    }; */
    if (request.status === 200) {

      console.log(request.responseText);
      setCookie(email);
<<<<<<< HEAD:checkin.js
      alert_text += request.responseText + "\n";
=======
      alert_text +=  JSON.parse(request.responseText).msg + "\n";
>>>>>>> 22c2fe8069804cc64156a01b39da5c24e5b76392:run/checkin.js
    }
  };
  //
  // checkin();

  let email, password;
  // window.open("https://purefast.net");
  // window.open("https://purefast.net/auth/login", "_self");
  //window.location.href = "https://purefast.net/auth/login";
  /*   email = "tomxingwu.501@gmail.com";
      password = "123456789";
      // login(email, password);
      //email=tomxingwu.501%40gmail.com&passwd=123456789&code=123123123123123123

      setTimeout(() => {
        if (window.location.href === "https://purefast.net") {
          window.open("https://purefast.net/auth/login", "_self");
        }
        login(email, password);
      }, 5); */
  /*
      email = "killercontact1740@gmail.com";
      password = "123456789";
      setTimeout(() => {
        if (window.location.href === "https://purefast.net") {
          window.open("https://purefast.net/auth/login", "_self");
        }
        login(email, password);
      }, 5); */
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

  function myPromise() {
    logger.log(window.location.href);
    if (window.location.href === "https://purefast.net/") {
      window.open("https://purefast.net/auth/login", "_self");
    }

    return new Promise((resolve, reject) => {
      login(email, password);
      resolve();
    })
      .then(
        (res) => {
          //
          return checkin();
        },
        (res) => {
          logger.error(res);
        }
      )
      .then(
        (res) => {
          logout();
        },
        (error) => {}
      )
      .finally(() => {
        email = "killercontact1740@gmail.com";
        password = "123456789";
        new Promise((resolve, reject) => {
          login(email, password);
          resolve();
        })
          .then((res) => {
            checkin();
          })
          .then(() => {
            logout();
          });
      });
  }

  function day_checkin(email, password) {
    this.email = email;
    this.password = password;
  }
  day_checkin.prototype.test = function () {
    return new Promise((resolve, reject) => {
      //
      let login_code;
      // while (login_code != "200")
      login_code = login(this.email, this.password); //当 XMLHTtpservlet open()设置为true时，login里面有异步回调，这里不会等待回调执行完，直接进行then后面的操作。所以会造成执行顺序混乱。
      resolve();
    })
      .then(() => {
<<<<<<< HEAD:checkin.js
        // debugger;
        let checkin_code = "";
        // while (checkin_code != "200") {
        // checkin_code = checkin();
        // }
=======
        //
        let checkin_code = "";
       checkin_code = checkin();
>>>>>>> 22c2fe8069804cc64156a01b39da5c24e5b76392:run/checkin.js
      })
      .then(() => {
        logout();
      });
  };
  day_checkin.prototype.setCookie = function () {
    var timestamp = new Date();
  };
  email = "tomxingwu.501@gmail.com";
  password = "123456789";
  // new myPromise();

  // Promise.all(
  //   new day_checkin("killercontact1740@gmail.com", "123456789").test()
  // ).then(() => {
  //   new day_checkin(email, password).test();
  // });

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  // (async function () {
  //   console.log("Do some thing, " + new Date());
  //   await sleep(3000);
  //   console.log("Do other things, " + new Date());
  // })();
  function setCookie(username, value=new Date().toLocaleString()) {
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
  function post_weixin(title, msg) {
    let token = "409ea8a9a1cc4854ad3ca04c019dcc81";
    let data = {
      token: token,
      title: title,
      content: msg,
      template: "html",
      channel: "wechat",
    };
    let url = "https://www.pushplus.plus/api/send";
    // let url = "http://www.pushplus.plus/send";
    let headers = {
    /*   "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36", */
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

  async function synchornized() {
    email = "killercontact1740@gmail.com";
    password = "123456789";
    if (!getCookie(email)) await new day_checkin(email, "123456789").test();
    else logger.log(email, "存在");

    console.log("Do some thing, " + new Date());
    await sleep(3000);
    // logout_code = logout();
    console.log("Do other things, " + new Date());

    email = "tomxingwu.501@gmail.com";
    password = "123456789";
    if (!getCookie(email)) new day_checkin(email, password).test();
    else logger.log(email + "存在");

    await sleep(3000);
    // logout_code = logout();
    logger.error("执行完毕");
    alert(alert_text);
    console.log(alert_text);
<<<<<<< HEAD:checkin.js
    debugger;
=======

>>>>>>> 22c2fe8069804cc64156a01b39da5c24e5b76392:run/checkin.js
    post_weixin(new Date().toLocaleDateString() + "签到", alert_text);
    // post_weixin(new Date().getDate() + "签到", alert_text);
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
