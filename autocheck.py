import datetime
import json
from tabnanny import check
from typing import Match

import requests
from requests.packages import urllib3
import base64
import re

urllib3.disable_warnings()
# 模拟浏览器代理
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) '
                  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4051.0 Safari/537.36 Edg/82.0.425.0',
    'Content-Type': 'application/json',
}

# 赋值给url
# url = 'https://www.jiemian.com/article/6345408.html'
# url = 'http://www.108shu.com/book/2113/479991.html' #可以爬取http协议的网站
# url = 'https://dict.eudic.net/dicts/en/%20complicate'
url = 'https://purefast.net'
domain = url
login_url = url + '/auth/login'
password = '123456789'
# email = 'killercontact1740@gmail.com'
email = 'tomxingwu.501@gmail.com'
params = {

}

# 将获取到的数据存到response变量中
# response = requests.get(url, headers=headers, verify=False)
response = requests.get(login_url, headers=headers, verify=False)

# 打印网页源码
# print(response.text)
# print(response.)

push_content = ''


def customize(url: str):
    global response
    login_url = url + params.get("login", "/auth/login")
    # post_data = 'email=' + email + '&passwd=' + password + '&code='
    # post_data = post_data.encode()
    # print(post_data)
    postdata = {
        'email': email,
        'passwd': password,
    }
    global push_content
    print(postdata)

    push_content += postdata.__str__() + "\n"
    session = requests.session()
    response = session.post(url + '/auth/login', postdata,
                            headers=headers, verify=False)
    # response = session.post(login_url, post_data,
    #                         headers=headers, verify=False)
    # 打印网页源码
    print(response.text)

    # print(json.loads(response.text)['msg'])

    if msg_regex(response.text) is not None:
        push_content += json.loads(response.text)["msg"] + "\n"
    else:
        push_content += "返回的是html网页代码"
    print('(============================)')
    # print(response.headers)
    # print('(============================)')
    # print(response.cookies)
    # print('(============================)')
    # print(response.url)
    # print('(============================)')
    # print(response.json)
    # print('(============================)')
    # print(response.encoding)
    # print('(============================)')
    # print(response.status_code)

    # 签到
    response = session.post(url + '/user/checkin',
                            headers=headers, verify=False)
    print(response.text)

    # push_content += msg_decode(response.text) + "\n"
    if msg_regex(response.text) is not None:
        push_content += json.loads(response.text)["msg"] + "\n"
    else:
        push_content += "返回的是html元素\n"

    print('(++++++++++++++++++++++++++++++ finished)')
    # 已测试成功，可以签到。


def msg_regex(obj: str) -> any:
    pattern = re.compile(r'^{.*}$')
    return pattern.match(obj)


params_push = ''


def push_plus(title: str, msg: str):
    global params_push

    params_push = {
        "token": "409ea8a9a1cc4854ad3ca04c019dcc81",
        "title": title,
        "content": msg,
        "template": "html",
        "channel": "wechat",
    }

    # url_push = 'https://www.pushplus.plus/api/send'
    url_push = 'https://www.pushplus.plus/send'

    # response = requests.session().request('POST', url=url_push, headers=headers,
    #                                       params=json.dumps(params).encode(encoding='utf-8'))
    response = requests.session().post(url=url_push, headers={
        'Content-Type': 'application/json'}, data=json.dumps(params_push).encode(encoding='utf-8'))
    print(response.text)


def msg_decode(obj: str) -> str:
    # p = {"ret": 0, "msg": "\u60a8\u4f3c\u4e4e\u5df2\u7ecf\u7b7e\u5230\u8fc7\u4e86..."}
    # p = {"ret": 0, "msg": "\u60a8\u4f3c\u4e4e\u5df2\u7ecf\u7b7e\u5230\u8fc7\u4e86..."}
    # print(type(p))
    # print(type(json.loads(p)))
    if isinstance(obj, dict):
        # params是用来发送查询字符串，而data是用来发送正文的。post方法和get方法的特性是：这两种参数post方法都可以用，get方法只能发查询字符串，不能发送正文。
        #
        # print(p["msg"].encode('utf-8').decode('utf-8'))
        return json.loads(obj)  # 将json字符串转化为obj，并将unicode编码转换
        # return p["msg"].encode('utf-8').decode('utf-8')
        # print(p.encode('gbk').decode('gbk'))
        # print(json.loads('\u60a8\u4f3c\u4e4e\u5df2\u7ecf\u7b7e\u5230\u8fc7\u4e86...'))
        # decode(‘utf-8’) 把 UTF-8 转化为 Unicode 编码
        # #encode(‘utf-8’) 把 Unicode 转化为 UTF-8 编码
    return obj


if __name__ == "__main__":
    # base_url = 'https://purefast.net'
    # password = '123456789'
    # # email = 'killercontact1740@gmail.com'
    # email = 'tomxingwu.501@gmail.com'
    # customize(base_url)
    # password = '123456789'
    # email = 'killercontact1740@gmail.com'
    # email = 'tomxingwu.501@gmail.com'
    # customize(base_url)

    base_url = 'https://ikuuu.co'
    password = '123456789'
    email = 'killercontact1740@gmail.com'
    customize(base_url)
    email = 'tammar.ag.x.2.9.b.18@gmail.com'
    customize(base_url)
    email = 'tomxingw.u502@gmail.com '
    customize(base_url)
    base_url = 'https://www.cxkv2.xyz'
    email = 'tomxingwu501@gmail.com'
    customize(base_url)

    print(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    print(push_content)
    # push_content = msg_decode('')
    push_plus(datetime.datetime.now().strftime(
        '%Y-%m-%d %H:%M:%S')+"github签到", push_content)
    # push_plus(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f'), 'sdfsdf')
