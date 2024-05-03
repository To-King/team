/**
 * 软件：饿了么
 * 抓域名 https://api-unionid.meituan.com/mc/register
 * 请求头  cookie里的token
 * 变量   export meituan='token'
 */

const $ = new Env("饿了么");
const notify = $.isNode() ? require("./sendNotify") : "";
const Notify = 1; //0为关闭通知,1为打开通知,默认为1
const debug = 0; //0为关闭调试,1为打开调试,默认为0
//---------------------------------------------------------------------------------------------------------
const ckName = "elmck";
let ckStr = ($.isNode() ? process.env[ckName] : $.getdata(ckName)) || "";
let msg, ck;

!(async () => {
  if (typeof $request !== "undefined") {
    // 严格不相等
    await GetRewrite();
  } else {
    let ckArr = await Variable_Check(ckStr, ckName);
    await tips(ckArr);
    for (let index = 0; index < ckArr.length; index++) {
      let num = index + 1;
      DoubleLog(`\n-------- 开始【第 ${num} 个账号】--------`);
      ck = ckArr[index].split("&");
      debugLog(`【debug】 这是你第 ${num} 账号信息:\n ${ck}`);
    }
    await SendMsg(msg);
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());

// 重写
async function GetRewrite() {
  if ($request.url.indexOf("/app/conch-page/svip-new-exchange-coupons/index.html") > -1) {
    // const token = $request.headers.Cookie.match(/token=([\w_-]+)/)[1]
    // const token = $request.url.split('wm_logintoken=')[1]
    const sid = $request.headers.Cookie.match(/SID=\w+/);
    const USERID = $request.headers.Cookie.match(/USERID=\w+/);
    const tb_token = $request.headers.Cookie.match(/_tb_token_=\w+/);
    const cookie2 = $request.headers.Cookie.match(/cookie2=\w+/);
    const unb = $request.headers.Cookie.match(/unb=\w+/);
    const sgcookie = $request.headers.Cookie.match(/sgcookie=\w+/);
    // const ck = sid + ";" + USERID + ";" + tb_token + ";" + cookie2 + ";" + unb + ";";
    const ck = sid + ";" + cookie2 + ";" + USERID + ";" + tb_token + ";" + unb + ";" + sgcookie + ";";
    if (ckStr) {
      if (ckStr.indexOf(ck) == -1) {
        // 找不到返回 -1
        ckStr = ckStr + "@" + ck;
        $.setdata(ckStr, ckName);
        ckList = ckStr.split("@");
        $.msg($.name + `📌获取第[${ckList.length}]个ck成功: \n${ck}`);
      }
    } else {
      $.setdata(ck, ckName);
      $.msg($.name + `📌获取到ck成功: \n${ck}`);
    }
  }
}

/**
 * 变量检查
 */
async function Variable_Check(ck, Variables) {
  return new Promise((resolve) => {
    let ckArr = [];
    if (ck) {
      if (ck.indexOf("@") !== -1) {
        ck.split("@").forEach((item) => {
          ckArr.push(item);
        });
      } else if (ck.indexOf("\n") !== -1) {
        ck.split("\n").forEach((item) => {
          ckArr.push(item);
        });
      } else {
        ckArr.push(ck);
      }
      resolve(ckArr);
    } else {
      console.log(` ${$.neme}:未填写变量 ${Variables} ,请仔细阅读脚本说明!`);
    }
  });
}

/**
 * 发送消息
 */
async function SendMsg(message) {
  if (!message) return;
  if (Notify > 0) {
    if ($.isNode()) {
      var notify = require("./sendNotify");
      await notify.sendNotify($.name, message);
    } else {
      // $.msg(message);
      $.msg($.name, "", message);
    }
  } else {
    console.log(message);
  }
}

/**
 * 双平台log输出
 */
function DoubleLog(data) {
  if ($.isNode()) {
    if (data) {
      console.log(`    ${data}`);
      msg += `\n    ${data}`;
    }
  } else {
    console.log(`    ${data}`);
    msg += `\n    ${data}`;
  }
}

/**
 * debug调试
 */
function debugLog(...args) {
  if (debug) {
    console.log(...args);
  }
}

// /**
//  *  单名字 Env
//  */
// function Env() {
//     return new class {
//         isNode() {
//             return "undefined" != typeof module && !!module.exports
//         }
//     }()
// }

// 完整 Env
function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let s = this.get;
      return (
        "POST" === e && (s = this.post),
        new Promise((e, i) => {
          s.call(this, t, (t, s, r) => {
            t ? i(t) : e(s);
          });
        })
      );
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new (class {
    constructor(t, e) {
      (this.name = t), (this.http = new s(this)), (this.data = null), (this.dataFile = "box.dat"), (this.logs = []), (this.isMute = !1), (this.isNeedRewrite = !1), (this.logSeparator = "\n"), (this.startTime = new Date().getTime()), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i)
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise((e) => {
        this.get({ url: t }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise((s) => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        (r = r ? 1 * r : 20), (r = e && e.timeout ? e.timeout : r);
        const [o, h] = i.split("@"),
          n = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: { script_text: t, mock_type: "cron", timeout: r },
            headers: { "X-Key": o, Accept: "*/*" }
          };
        this.post(n, (t, e, i) => s(i));
      }).catch((t) => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {};
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        (this.fs = this.fs ? this.fs : require("fs")), (this.path = this.path ? this.path : require("path"));
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (((r = Object(r)[t]), void 0 === r)) return s;
      return r;
    }
    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), (e.slice(0, -1).reduce((t, s, i) => (Object(t[s]) === t[s] ? t[s] : (t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {})), t)[e[e.length - 1]] = s), t);
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          r = s ? this.getval(s) : "";
        if (r)
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
      }
      return e;
    }
    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
          o = this.getval(i),
          h = i ? ("null" === o ? null : o || "{}") : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), (s = this.setval(JSON.stringify(e), i));
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), (s = this.setval(JSON.stringify(o), i));
        }
      } else s = this.setval(t, e);
      return s;
    }
    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? ((this.data = this.loaddata()), this.data[t]) : (this.data && this.data[t]) || null;
    }
    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? ((this.data = this.loaddata()), (this.data[e] = t), this.writedata(), !0) : (this.data && this.data[e]) || null;
    }
    initGotEnv(t) {
      (this.got = this.got ? this.got : require("got")), (this.cktough = this.cktough ? this.cktough : require("tough-cookie")), (this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()), t && ((t.headers = t.headers ? t.headers : {}), void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t;
    }
    msg(e = t, s = "", i = "", r) {
      const o = (t) => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return { openUrl: e, mediaUrl: s };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return { "open-url": e, "media-url": s };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return { url: e };
          }
        }
      };
      if ((this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog)) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), (this.logs = this.logs.concat(t));
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise((e) => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1e3;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  })(t, e);
}

//#endregion
