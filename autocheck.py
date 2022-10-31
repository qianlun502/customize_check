# 引用requests库
from tabnanny import check
import requests
from requests.packages import urllib3
urllib3.disable_warnings()
# 模拟浏览器代理
headers = { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4051.0 Safari/537.36 Edg/82.0.425.0'}

# 赋值给url
# url = 'https://www.jiemian.com/article/6345408.html'
# url = 'http://www.108shu.com/book/2113/479991.html' #可以爬取http协议的网站
# url = 'https://dict.eudic.net/dicts/en/%20complicate'
url = 'https://purefast.net'
domain = url
login_url = url+'/auth/login'
password = '123456789'
# email = 'killercontact1740@gmail.com'
email = 'tomxingwu.501@gmail.com'
base_url = 'https://purefast.net'
params = {

}
# 将获取到的数据存到response变量中
# response = requests.get(url, headers=headers, verify=False)
response = requests.get(login_url, headers=headers, verify=False)

# 打印网页源码
# print(response.text)
# print(response.)


def customize():
    login_url = domain + params.get("login", "/auth/login")
    # post_data = 'email=' + email + '&passwd=' + password + '&code='
    # post_data = post_data.encode()
    # print(post_data)
    postdata = {
        'email': email,
        'passwd': password,
    }
    print(postdata)
    session = requests.session()
    response = session.post(login_url, postdata,
                            headers=headers, verify=False)
    # response = session.post(login_url, post_data,
    #                         headers=headers, verify=False)
    # 打印网页源码
    print(response.text)
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
    response = session.post(base_url + '/user/checkin',
                            headers=headers, verify=False)
    print(response.text)
    print('(============================)')
    # 已测试成功，可以签到。


if __name__ == "__main__":
    password = '123456789'
    # email = 'killercontact1740@gmail.com'
    email = 'tomxingwu.501@gmail.com'
    customize()
    password = '123456789'
    email = 'killercontact1740@gmail.com'
    # email = 'tomxingwu.501@gmail.com'
    customize()
