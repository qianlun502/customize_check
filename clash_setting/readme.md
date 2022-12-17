## Clash 规则的写法

[Clash 规则的写法 - 1337Hao - 博客园 (cnblogs.com)](https://www.cnblogs.com/z1645444/p/16326621.html)

> # [Clash 规则的写法](https://www.cnblogs.com/z1645444/p/16326621.html)
>
> 这篇博文是针对 CFW 写的。
>
> 最近尝试从 v2 转向使用 Clash。基于一个简单的需求：用 Spotify 听专的时候用代理，用 AM 听专的时候直连，我参考了以下完成了我的规则：
>
> 1. CFW 官网的说明；
> 2. github 上别人总结的规则；
> 3. 订阅提供的初始的简陋规则。
>
> 首先要确认订阅提供的规则是否是使用 YAML 完成，因为在完成规则的过程中，我在 CFW 的一个 issue 中发现，可能会因为订阅提供的规则不是用 YAML 完成，而附加规则使用 YAML 写，最终导致配置无效，以及可能导致 CLash 核心无法正常运作。倘若这个最坏的情况已经发生，其实处理起来并不麻烦：
>
> 1. 在 CFW 中找到 Settings - Parsers，将原先你新增的所有行都删除或注释，仅剩下第一行 `parsers:`(不剩下也不影响)；
> 2. 删除 ~/.config/clash/ 目录下的 config.yaml、Country.mmdb 两个文件；
> 3. 重新打开 Clash。
>
> ~/.config/clash/ 目录存放的是 Clash 的配置文件。启用 Clash 主要的两个文件是 `config.yaml` 和 `profiles/xxxx.yaml`。
>
> - `config.yaml`：主要存在字段为 `mixed-port`、`allow-lan`、`log-level`，它们与 CFW 主页配置相对应；
> - `profiles/xxxx.yaml`：命名由 Clash 控制，命名方法是使用时间戳，文件里写的是订阅推送的地址和部分规则。主要存在字段为 `proxies`、`proxy-groups`、`rules`。
>   - `proxies` 数组是订阅推送的服务器信息；
>   - `proxy-groups` 数组重新按组整理了 `proxies` 中的服务器，并显示在 GFW 应用的 Proxies 页面中，数组成员的 `name` 待会儿配置的过程中会用到；
>   - `rules` 数组存放的就是规则集，通常订阅的推送中存放的比较简陋，所以才需要下面的 `rule-providers`；
>   - `rule-providers` 数组中的成员可以通过网络下载 YAML 文件，存放在指定的路径下并读取，然后添加在 `rules` 数组的前面（append-rules）、后面（prepend-rules）。
>
> 配置的主要完成工作是在 Settings - Profiles - Parsers 这儿完成。首次点击 Parsers 弹出来的 CFW 自带的编辑器中，仅仅只有一行：
>
> ```YAML
> parsers: # array
> ```
>
> 配置工作也就从这里开始。
>
> YAML 的语法非常简单，不必阅读 YAML 的语法教程或者对其他资料序列化语言有过编写经历，看一眼别人写的成品其实就能马上理解如何更改和书写。经过简单的一番配置后，大致如下：
>
> ```YAML
> parsers:
>   - url: 订阅链接
>     yaml:
>       prepend-rules:
>         - DOMAIN-SUFFIX,cn.bing.com,DIRECT
>         - DOMAIN-SUFFIX,mirrors.ustc.edu.cn,DIRECT
>         - DOMAIN-SUFFIX,mirrors.tuna.tsinghua.edu.cn,DIRECT
>         - PROCESS-NAME,iTunes,DIRECT
>         - MATCH,proxy-groups->name
> 
>       mix-rule-providers: 
>         reject:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt"
>           path: ./ruleset/reject.yaml
>           interval: 86400
> ```
>
> 上面的 YAML 语句块就是规则。
>
> - `- url` 指定订阅链接，根据订阅链接进行匹配，每次更新订阅都会针对这个匹配上的订阅，在原有的规则上再附加你自定义的规则；
>
> - `yaml` 附加规则使用语言
>
> - `prepend-rules` 在订阅推送的规则数组之前，加入你自定义的规则；若是想添加在推送的规则数组之后，那么可以使用 `append-rules`；这类字段的每个成员都由两个逗号进行了切分。例如 `- DOMAIN-SUFFIX,mirrors.ustc.edu.cn,DIRECT`，`DOMAIN-SUFFIX` 是规则类型，`mirrors.ustc.edu.cn` 是受约束的目标，`DIRECT` 是连接策略。根据这单个规则，就可以写下无数规则。
>
>   - 规则类型如下：
>
>   | 字段           | 含义                         |
>   | -------------- | ---------------------------- |
>   | DOMAIN-SUFFIX  | 域名后缀匹配                 |
>   | DOMAIN         | 域名匹配                     |
>   | DOMAIN-KEYWORD | 域名关键字匹配               |
>   | IP-CIDR        | IP 段匹配                    |
>   | SRC-IP-CIDR    | 源 IP 段匹配                 |
>   | GEOIP          | GEOIP 数据库（国家代码）匹配 |
>   | DST-PORT       | 目标端口匹配                 |
>   | SRC-PORT       | 源端口匹配                   |
>   | PROCESS-NAME   | 源进程名匹配                 |
>   | RULE-SET       | Rule Provider 规则匹配       |
>   | MATCH          | 全匹配                       |
>
>   - 连接策略如下：
>
>   | 字段                            | 含义             |
>   | ------------------------------- | ---------------- |
>   | DIRECT                          | 不走订阅直接连接 |
>   | REJECT                          | 拒绝连接         |
>   | PROXIE（proxy-group 中的 name） | 走订阅           |
>
> - `mix-rule-providers` 提供自定义规则的来源网址和文件，和 `rule-providers` 是同样的概念，加上 `mix-` 前缀后，可以与订阅提供的 `rule-providers` 合并，而不是覆盖
>
> 日常访问和未来可能要访问的网站实在太多，如果所有规则都手工整理会比较麻烦，所以可以通过 `rule-providers` 使用其他人写好的规则作为基础，在上面继续添加。我是以[这个仓库](https://github.com/Loyalsoldier/clash-rules])作为基础的，大部分人应该也是以这个仓库的规则作为基础。
>
> 当我配置完后大致如下：
>
> ```YAML
> parsers:
>   - url: XXX.com
>     yaml:
>       prepend-rules:
>         - PROCESS-NAME,iTunes,DIRECT
>         - PROCESS-NAME,iTunes.exe,DIRECT
>         - PROCESS-NAME,ESurfingClient,DIRECT
>         - PROCESS-NAME,ESurfingClient.exe,DIRECT
>         - DOMAIN-SUFFIX,cn.bing.com,DIRECT
>         - DOMAIN-SUFFIX,mirrors.ustc.edu.cn,DIRECT
>         - DOMAIN-SUFFIX,mirrors.tuna.tsinghua.edu.cn,DIRECT
>         - RULE-SET,applications,DIRECT
>         - DOMAIN,clash.razord.top,DIRECT
>         - DOMAIN,yacd.haishan.me,DIRECT
>         - RULE-SET,private,DIRECT
>         - RULE-SET,reject,REJECT
>         - RULE-SET,icloud,DIRECT
>         - RULE-SET,apple,DIRECT
>         - RULE-SET,google,DIRECT
>         - RULE-SET,proxy,Nice Cloud
>         - RULE-SET,direct,DIRECT
>         - RULE-SET,lancidr,DIRECT
>         - RULE-SET,cncidr,DIRECT
>         - RULE-SET,telegramcidr,Nice Cloud
>         - GEOIP,LAN,DIRECT
>         - GEOIP,CN,DIRECT
>         - MATCH,Nice Cloud
> 
>       mix-rule-providers: 
>         reject:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/reject.txt"
>           path: ./ruleset/reject.yaml
>           interval: 86400
> 
>         icloud:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/icloud.txt"
>           path: ./ruleset/icloud.yaml
>           interval: 86400
> 
>         apple:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/apple.txt"
>           path: ./ruleset/apple.yaml
>           interval: 86400
> 
>         google:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/google.txt"
>           path: ./ruleset/google.yaml
>           interval: 86400
> 
>         proxy:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/proxy.txt"
>           path: ./ruleset/proxy.yaml
>           interval: 86400
> 
>         direct:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/direct.txt"
>           path: ./ruleset/direct.yaml
>           interval: 86400
> 
>         private:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/private.txt"
>           path: ./ruleset/private.yaml
>           interval: 86400
> 
>         gfw:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/gfw.txt"
>           path: ./ruleset/gfw.yaml
>           interval: 86400
> 
>         greatfire:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/greatfire.txt"
>           path: ./ruleset/greatfire.yaml
>           interval: 86400
> 
>         tld-not-cn:
>           type: http
>           behavior: domain
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/tld-not-cn.txt"
>           path: ./ruleset/tld-not-cn.yaml
>           interval: 86400
> 
>         telegramcidr:
>           type: http
>           behavior: ipcidr
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/telegramcidr.txt"
>           path: ./ruleset/telegramcidr.yaml
>           interval: 86400
> 
>         cncidr:
>           type: http
>           behavior: ipcidr
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/cncidr.txt"
>           path: ./ruleset/cncidr.yaml
>           interval: 86400
> 
>         lancidr:
>           type: http
>           behavior: ipcidr
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/lancidr.txt"
>           path: ./ruleset/lancidr.yaml
>           interval: 86400
> 
>         applications:
>           type: http
>           behavior: classical
>           url: "https://raw.githubusercontent.com/Loyalsoldier/clash-rules/release/applications.txt"
>           path: ./ruleset/applications.yaml
>           interval: 86400
> ```
>
> 由于访问 raw.githubusercontent.com 可能会受到严重的网络波动影响，导致没法访问，不能正常获取，所以可以手动访问所有的 `url`，然后将内容存入对应的 `xxx.yaml` 文件中，放到对应的 `./ruleset/` 目录下，也就是 `~/.config/clash/ruleset/` 下。`ruleset/` 这个文件夹第一次装 Clash 是没有的，需要自己创建。
>
> 至此，打开 Clash，点击 Profiles 里的订阅的更新以后，额外规则就能自动添加到订阅里了。

### **通过Parsers实际样例：**

**rule-providers 规则池引用规则地址**：https://github.com/Loyalsoldier/clash-rules

```yaml
parsers:
  - reg: 'slbable$'
    yaml:
      append-proxy-groups:
        - name: ⚖️ 负载均衡-散列
          type: load-balance
          url: 'https://www.google.com/generate_204'
          interval: 2
          strategy: consistent-hashing
        - name: ⚖️ 负载均衡-轮询
          type: load-balance
          url: 'https://www.google.com/generate_204'
          interval: 2
          strategy: round-robin
      commands:
        - proxy-groups.⚖️ 负载均衡-散列.proxies=[]proxyNames
        - proxy-groups.0.proxies.0+⚖️ 负载均衡-散列
        - proxy-groups.⚖️ 负载均衡-轮询.proxies=[]proxyNames
        - proxy-groups.0.proxies.0+⚖️ 负载均衡-轮询
      prepend-rules:
        - RULE-SET,applications,DIRECT
        - DOMAIN,clash.razord.top,DIRECT
        - DOMAIN,yacd.haishan.me,DIRECT
        - RULE-SET,private,DIRECT
        - RULE-SET,reject,REJECT
        - RULE-SET,icloud,DIRECT
        - RULE-SET,apple,DIRECT
        - RULE-SET,google,DIRECT
        - RULE-SET,proxy,⚖️ 负载均衡-散列
        - RULE-SET,direct,DIRECT
        - RULE-SET,lancidr,DIRECT
        - RULE-SET,cncidr,DIRECT
        - RULE-SET,telegramcidr,⚖️ 负载均衡-散列
        - GEOIP,LAN,DIRECT
        - GEOIP,CN,DIRECT
        - MATCH,⚖️ 负载均衡-散列
      mix-rule-providers:
          reject:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt"
            path: ./ruleset/reject.yaml
            interval: 86400

          icloud:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt"
            path: ./ruleset/icloud.yaml
            interval: 86400

          apple:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt"
            path: ./ruleset/apple.yaml
            interval: 86400

          google:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt"
            path: ./ruleset/google.yaml
            interval: 86400

          proxy:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt"
            path: ./ruleset/proxy.yaml
            interval: 86400

          direct:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt"
            path: ./ruleset/direct.yaml
            interval: 86400

          private:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt"
            path: ./ruleset/private.yaml
            interval: 86400

          gfw:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt"
            path: ./ruleset/gfw.yaml
            interval: 86400

          greatfire:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.tx\
              t"
            path: ./ruleset/greatfire.yaml
            interval: 86400

          tld-not-cn:
            type: http
            behavior: domain
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.t\
              xt"
            path: ./ruleset/tld-not-cn.yaml
            interval: 86400

          telegramcidr:
            type: http
            behavior: ipcidr
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr\
              .txt"
            path: ./ruleset/telegramcidr.yaml
            interval: 86400

          cncidr:
            type: http
            behavior: ipcidr
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt"
            path: ./ruleset/cncidr.yaml
            interval: 86400

          lancidr:
            type: http
            behavior: ipcidr
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt"
            path: ./ruleset/lancidr.yaml
            interval: 86400

          applications:
            type: http
            behavior: classical
            url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications\
              .txt"
            path: ./ruleset/applications.yaml
            interval: 86400




      
      
          

```

### CLASH RULE规则参数和白名单（黑名单）

[配置 ·Dreamacro/clash Wiki (github.com)](https://github.com/Dreamacro/clash/wiki/configuration)

> # 规则
>
> 可用关键字：
>
> - `DOMAIN`：仅路由到 。`DOMAIN,www.google.com,policy``www.google.com``policy`
> - `DOMAIN-SUFFIX`：将任何以 或 或 结尾的 FQDN 路由到 。这就像通配符一样工作。`DOMAIN-SUFFIX,youtube.com,policy``youtube.com``www.youtube.com``foo.bar.youtube.com``policy``+`
> - `DOMAIN-KEYWORD`：将包含 或 的任何 FQDN 路由到 。`DOMAIN-KEYWORD,google,policy``google``www.google.com``googleapis.com``policy`
> - `GEOIP`：将发往中国 IP 地址的任何请求路由到 。`GEOIP,CN,policy``policy`
> - `IP-CIDR`：将任何数据包路由到策略。`IP-CIDR,127.0.0.0/8,DIRECT``127.0.0.0/8``DIRECT`
> - `IP-CIDR6`：将任何数据包路由到 。`IP-CIDR6,2620:0:2d0:200::7/32,policy``2620:0:2d0:200::7/32``policy`
> - `SRC-IP-CIDR`：**将任何数据包路由**到策略。`SRC-IP-CIDR,192.168.1.201/32,DIRECT``192.168.1.201/32``DIRECT`
> - `SRC-PORT`：将端口 80 **的任何**数据包路由到 。`SRC-PORT,80,policy``policy`
> - `DST-PORT`：将任何数据包**路由到**端口 80 到 。`DST-PORT,80,policy``policy`
> - `PROCESS-NAME`：将进程路由到 。（支持 macOS、Linux、FreeBSD 和 Windows）`PROCESS-NAME,nc,DIRECT``nc``DIRECT`
> - `MATCH`：将其余数据包路由到 。此规则是**必需的**。`MATCH,policy``policy`
>
> #### 白名单模式 Rules 配置方式（推荐）
>
> - 白名单模式，意为「**没有命中规则的网络流量，统统使用代理**」，适用于服务器线路网络质量稳定、快速，不缺服务器流量的用户。
> - 以下配置中，除了 `DIRECT` 和 `REJECT` 是默认存在于 Clash 中的 policy（路由策略/流量处理策略），其余均为自定义 policy，对应配置文件中 `proxies` 或 `proxy-groups` 中的 `name`。如你直接使用下面的 `rules` 规则，则需要在 `proxies` 或 `proxy-groups` 中手动配置一个 `name` 为 `PROXY` 的 policy。
> - 如你希望 Apple、iCloud 和 Google 列表中的域名使用代理，则把 policy 由 `DIRECT` 改为 `PROXY`，以此类推，举一反三。
> - 如你不希望进行 DNS 解析，可在 `GEOIP` 规则的最后加上 `,no-resolve`，如 `GEOIP,CN,DIRECT,no-resolve`。
>
> ```
> rules:
>   - RULE-SET,applications,DIRECT
>   - DOMAIN,clash.razord.top,DIRECT
>   - DOMAIN,yacd.haishan.me,DIRECT
>   - RULE-SET,private,DIRECT
>   - RULE-SET,reject,REJECT
>   - RULE-SET,icloud,DIRECT
>   - RULE-SET,apple,DIRECT
>   - RULE-SET,google,DIRECT
>   - RULE-SET,proxy,PROXY
>   - RULE-SET,direct,DIRECT
>   - RULE-SET,lancidr,DIRECT
>   - RULE-SET,cncidr,DIRECT
>   - RULE-SET,telegramcidr,PROXY
>   - GEOIP,LAN,DIRECT
>   - GEOIP,CN,DIRECT
>   - MATCH,PROXY
> ```
>
> #### 黑名单模式 Rules 配置方式
>
> - 黑名单模式，意为「**只有命中规则的网络流量，才使用代理**」，适用于服务器线路网络质量不稳定或不够快，或服务器流量紧缺的用户。通常也是软路由用户、家庭网关用户的常用模式。
> - 以下配置中，除了 `DIRECT` 和 `REJECT` 是默认存在于 Clash 中的 policy（路由策略/流量处理策略），其余均为自定义 policy，对应配置文件中 `proxies` 或 `proxy-groups` 中的 `name`。如你直接使用下面的 `rules` 规则，则需要在 `proxies` 或 `proxy-groups` 中手动配置一个 `name` 为 `PROXY` 的 policy。
>
> ```
> rules:
>   - RULE-SET,applications,DIRECT
>   - DOMAIN,clash.razord.top,DIRECT
>   - DOMAIN,yacd.haishan.me,DIRECT
>   - RULE-SET,private,DIRECT
>   - RULE-SET,reject,REJECT
>   - RULE-SET,tld-not-cn,PROXY
>   - RULE-SET,gfw,PROXY
>   - RULE-SET,greatfire,PROXY
>   - RULE-SET,telegramcidr,PROXY
>   - MATCH,DIRECT
> ```

## 使用 rule-provider、 proxy-provider 轻松实现自动更新节点、规则、机场订阅链接

> https://www.youtube.com/watch?v=IVlnvBQXEgE 视频教程
>
> https://www.jamesdailylife.com/rule-proxy-provider 链接教程
>
> > 文件架构：
>
> mixed-port
>
> allow-lan
>
> external-control
>
> secret
>
> dns
>
> proxies
>
> proxy-providers
>
> proxy-groups
>
> rule-providers
>
> rules
>
> * **proxies** :单节点信息，例如：
>
> ```yml
> proxies:
>   - { name: '太韩BGP 03', type: trojan, server: ko3.lianpi.xyz, port: 56145, password: 0e84ec99-7f8e-48a0-9c5b-f546f505e550, udp: true, sni: ko3.lianpi.xyz, skip-cert-verify: true }
> ```
>
> * **proxy-provider**：**俗称代理集合**，通过它，可以提取指定 Clash订阅链接或者本地配置文件中的proxies字段中的所有内容。简单地说，proxy-provider 帮助我们提取订阅链接或者配置文件中所包含的节点信息，到当前配置文件中供我们使用。
>
> - proxy-groups：以“策略组”为单位，对 proxy-provider 提供的节点或者手动添加的节点进行分组管理
> - rule-provider：提供规则集，不同的在线规则集，以 url 链接形式提供，包含常见的域名和IP 地址列表，由项目大佬们实时维护的
>   - [Clash- Rules github](https://github.com/Loyalsoldier/clash-rules)
> - rule：引用规则集、策略组，以访问目标是否在规则集中为条件，设定本地网络或者节点对其进行访问
>
> ```
> rules:
>   - RULE-SET,applications,DIRECT
>   - DOMAIN,clash.razord.top,DIRECT
>   - DOMAIN,yacd.haishan.me,DIRECT
>   - RULE-SET,private,DIRECT
>   - RULE-SET,reject,REJECT
>   - RULE-SET,tld-not-cn,PROXY
>   - RULE-SET,gfw,PROXY
>   - RULE-SET,greatfire,PROXY
>   - RULE-SET,telegramcidr,PROXY
>   - MATCH,DIRECT
>   
> #比如，RULE-SET,telegramcidr,PROXY
> # --RULE-SET 是规则集的意思
> # --telegramcidr 为规则集的名称
> # --PROXY 为代理策略组名称
> # 意思就是当访问目标是 telegramcidr 中的IP地址时，就通过 PROXY 策略组中的节点去访问。
> ```

# 