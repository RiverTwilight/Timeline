import main from "./components/content";
import injectCss from "../tampermonkey/injectCss";

// ==UserScript==
// @name         URP-Beautifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  URP 教务系统全面美化插件 | Make your URP education system more elegant.
// @author       RiverTwilight
// @match        http://10.28.63.111:9002/*
// @match        http://10.28.63.111:9001/*
// @grant        none
// ==/UserScript==
injectCss()
main();

