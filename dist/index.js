'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function () {
    var vueLazy = {};
    var offset = 450;

    var lazy = {};
    var count = 0;
    var timer = 0;
    var queue = {};
    var action = ['method'];
    var _options = {
        error: '',
        loading: 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
    };

    var Helper = {
        getRandomKey: function getRandomKey() {
            return 'vue-lazy-' + (Math.random() + '').replace(/\D/g, '');
        }
    };

    var Handler = {
        setAttr: function setAttr(el, type, value) {
            if (type === 'class') {
                var origin = el.getAttribute(type);
                el.setAttribute(type, origin + ' ' + value);
            } else if (type === 'src') {
                var img = new Image();
                img.onload = function () {
                    el.setAttribute(type, value);
                };
                img.src = value;
                img.onerror = function () {
                    _options.error && el.setAttribute(type, _options.error);
                };
            } else {
                el.setAttribute(type, value);
            }
        },
        setFunc: function setFunc(cb) {
            cb && cb();
        }
    };

    /* 懒加载进程暴露在 Block 全局变量 */
    if (window.Block && !window.Block.vueLazyProcess) {
        queue = window.Block.vueLazyProcess = {};
    }

    /* 定时器维护 */
    lazy._keepTimer = function () {
        if (timer === 0) {
            timer = setInterval(function () {
                count = 0;
                for (var i in queue) {
                    if (queue.hasOwnProperty(i)) {
                        var current = queue[i];
                        var top = current.dom.getBoundingClientRect().top;
                        var left = current.dom.getBoundingClientRect().left;
                        if (top - offset < window.innerHeight && left - offset < window.innerWidth) {
                            current.callback();
                            delete queue[i];
                        } else {
                            count++;
                        }
                    }
                }
                if (count === 0) {
                    clearInterval(timer);
                    timer = 0;
                }
            }, 350);
        }
    };

    /* 设置懒加载 */
    lazy.set = function (dom, cb) {
        var id = dom['vue-lazy-id'];
        if (!queue.hasOwnProperty(id) && dom && dom.nodeType && typeof cb === 'function') {
            queue[id] = {
                dom: dom,
                callback: cb
            };
            lazy._keepTimer();
        }
        return id;
    };

    vueLazy.install = function (Vue) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                _options[i] = options[i];
            }
        }
        Vue.directive('lazy', {
            bind: function bind(el, binding) {
                var type = binding.arg;
                var value = binding.value;
                var funFlag = action.indexOf(type) === -1;
                if (funFlag && typeof binding.value == 'function' || !binding.arg) {
                    return console.error('[Vue warn]: Invalid parameter, Expected String or number.');
                }
                if (!funFlag && typeof binding.value !== 'function') {
                    return console.error('[Vue warn]: Invalid parameter, Expected function.');
                }

                if (!el.hasOwnProperty('vue-lazy-id')) {
                    el['vue-lazy-id'] = Helper.getRandomKey();
                }

                if (funFlag && type === 'src' && el.tagName.toLowerCase() === 'img') {
                    Handler.setAttr(el, type, _options.loading);
                }

                var callback = function callback() {
                    if (!funFlag) {
                        Handler.setFunc(value);
                        return;
                    }
                    Handler.setAttr(el, type, value);
                };
                lazy.set(el, callback);
            },
            update: function update(el, binding) {
                var type = binding.arg;
                var value = binding.value;
                var key = el['vue-lazy-id'];
                if (queue.hasOwnProperty(key)) {
                    var callback = function callback() {
                        if (action.indexOf(type) > -1) {
                            Handler.setFunc(value);
                            return;
                        }
                        Handler.setAttr(el, type, value);
                    };
                    lazy.set(el, callback);
                }
            },
            unbind: function unbind(el) {
                var key = el['vue-lazy-id'];
                delete queue[key];
            }
        });
    };

    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == "object") {
        module.exports = vueLazy;
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return vueLazy;
        });
    } else if (window.Vue) {
        window.vueLazy = vueLazy;
        Vue.use(vueLazy);
    }
}();