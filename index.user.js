// ==UserScript==
// @name         百度无限加载
// @namespace    http://tampermonkey.net/
// @include      https://www.baidu.com/*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.baidu.com/s?
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let page = 10; // 页数
    let wd = getQueryString("wd")
    let node = document.createElement("div")
    let loading = 0; // 进度条控制
    initBottom()

    // 滚动时触发
    window.onscroll = function () {
        let Murl = window.location.origin + window.location.pathname + window.location.search
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        // 滚动到底部时触发
        if (scrollTop + clientHeight == scrollHeight) {
            // 生成进度条
            node.setAttribute("style", "width: 0%;left: 0;top: 0;background-color: #409eff;text-align: right;border-radius: 100px;line-height: 1;white-space: nowrap;height: 2px;position: fixed;z-index: 999;transition: width 1s;display: none;")
            node.setAttribute("id", "MyLodang")
            // 添加进度条到页面上
            document.getElementsByTagName("body")[0].appendChild(node)
            // 搜索内容不一样,重置页数
            if (wd != getQueryString("wd")) {
                wd = getQueryString("wd")
                initBottom()
                page = 10
            }
            var xhr = new XMLHttpRequest();
            // 显示进度条
            node.style.display = "block"
            // 发送请求
            xhr.open("GET", Murl + "&pn=" + page, true);
            // 进度条控制
            xhr.addEventListener("progress", function (evt) {
                node.style.width = `${loading}%`
                // 进度大于八十，每次加1，否则，每次加10
                if (loading > 80) {
                    loading += 1
                } else {
                    loading += 10
                }
            }, false);
            // 请求结束执行
            xhr.onloadend = function () {
                setTimeout(() => {
                    // 隐藏进度条
                    node.remove();
                    // 重置进度条
                    loading = 0
                }, 1000);
            }
            // 请求出错
            xhr.onerror = e => {
                setTimeout(() => {
                    // 隐藏进度条
                    node.remove();
                    // 重置进度条
                    loading = 0
                }, 1000);
            };
            // 请求超时
            xhr.ontimeout = e => {
                setTimeout(() => {
                    // 隐藏进度条
                    node.remove();
                    // 重置进度条
                    loading = 0
                }, 1000);
            }
            // 请求完毕执行
            xhr.onload = function () {
                // 进度条100%
                node.style.width = `100%`
                if (this.readyState == 4 && this.status == 200) {
                    let remo = document.getElementById("Mydiv")
                    // 先移除节点,避免节点重复
                    if (remo != null) remo.remove()
                    // 获取body
                    let body = document.getElementsByTagName("body")[0]
                    // 获取内容区
                    let content = document.getElementById("content_left")
                    // 创建div节点
                    let Mydiv = document.createElement("div")
                    // 写入请求回来的内容
                    Mydiv.innerHTML = this.responseText
                    // 设置id
                    Mydiv.setAttribute("id", "Mydiv");
                    // 隐藏内容
                    Mydiv.setAttribute("style", "display:none");
                    // 添加内容到body中
                    body.appendChild(Mydiv)
                    // 获取请求回来的内容
                    let node = document.querySelector("#Mydiv #content_left")
                    for (let i = 0; i < node.childNodes.length; i++) {
                        try {
                            // 添加到内容区中
                            content.appendChild(node.childNodes[i].nextElementSibling)
                        } catch (error) { }
                    }
                    // 重置内容
                    Mydiv.innerHTML = ""
                    // 页数加1
                    page += 10
                }
            }
            xhr.send();
        }
    }
    // 获取请求参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(decodeURIComponent(r[2]));
        return null;
    }
    var scrollFunc = function (e) {
        let node = document.getElementById("head")
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
            if (e.wheelDelta > 0) { //当滑轮向上滚动时
                node.setAttribute("style", "display: revert;top: 0px;transition: all 1s;");
                foldUpSidebar()
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时
                node.setAttribute("style", "display: revert;top: -73px;transition: all 1s;");
                foldUpSidebar()
            }
        }
    }
    // 收起侧边栏
    function foldUpSidebar(){
        let MyUl = document.getElementById("MyUl");
        if(!MyUl){
            return
        }
        let node = document.getElementById("My_left");
        let node2 = document.getElementById("My_left_Txt");
        node2.innerHTML = "&gt;"
        node.style.left = "-118px";
    }
    //给页面绑定滑轮滚动事件
    if (document.addEventListener) {//firefox
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    //滚动滑轮触发scrollFunc方法  //ie 谷歌
    window.onmousewheel = document.onmousewheel = scrollFunc;
    // ------------------------------------------------------侧边栏相关搜索----------------------------------------------
    function initBottom() {
        setTimeout(() => {
            // 隐藏底部相关搜索
            document.getElementById("rs").style.display = "none"
            // 隐藏页数
            document.getElementById("page").style.display = "none"
        }, 100);
        let My_left = document.createElement("div")
        My_left.setAttribute("style", "height: 100%;width: 115px;position: fixed;transition: all 0.3s;top: 0;left:-118px;background: #00000012;");
        My_left.setAttribute("id", "My_left");
        let My_left_Txt = document.createElement("div")
        My_left_Txt.setAttribute("style", "position: relative;right: -116px;font-size: 32px;top: 50%;color: #00000038;");
        My_left_Txt.setAttribute("id", "My_left_Txt");
        My_left_Txt.innerHTML = "&gt;";
        My_left_Txt.onclick = openRelatedSearch
        My_left.appendChild(My_left_Txt);
        document.getElementsByTagName("body")[0].appendChild(My_left);

        // 侧边栏点击事件
        function openRelatedSearch() {
            let MyUl = document.getElementById("MyUl");
            if(MyUl){
                MyUl.remove()
            }
            let node = document.getElementById("My_left");
            let node2 = document.getElementById("My_left_Txt");
            if (node.style.left == "-118px") {
                node.style.left = "0";
                node2.innerHTML = "&lt;"
                getBottom();
            } else {
                node2.innerHTML = "&gt;"
                node.style.left = "-118px";
            }
        }
        // 获取底部相关搜索
        function getBottom() {
            let bottem = [1, 3, 5]
            let ul = document.createElement("ul")
            ul.setAttribute("style", "margin-top: 44%;margin-left: 10px;");
            ul.setAttribute("id", "MyUl");
            // ul.addEventListener('click',function(){
            //     window.onload = function(){
            //         console.log("完毕")
            //     }
            //     initBottom()
            //     let node = document.getElementById("head")
            //     node.setAttribute("style", "display: revert;top: -73px;transition: all 1s;");
            // },false);
            for (var i = 0; i < 10; i++) {
                for (let item in bottem) {
                    let li = document.createElement("li")
                    let a = document.createElement("a")
                    let aNode = document.querySelector(`#rs > div > table > tbody > tr:nth-child(${i}) > th:nth-child(${bottem[item]}) > a`)
                    if (aNode) {
                        a.href = aNode.href
                        a.innerHTML = aNode.innerHTML
                        li.style.marginBottom="7px"
                        li.appendChild(a);
                        ul.appendChild(li);
                    }
                }
            }
            let node = document.getElementById("My_left");
            node.appendChild(ul);
        }
    }
})();
