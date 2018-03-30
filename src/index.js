!function () {
    let vueLazy = {};
    let offset = 450;

    let lazy = {};
    let count = 0;
    let timer = 0;
    let queue = {};

    let Helper = {
        getRandomKey() {
            return 'vue-lazy-' + (Math.random() + '').replace(/\D/g, '');
        },
    };

    let Handler = {
        setAttr(el,type,value) {
            if(type === 'class') {
                let origin = el.getAttribute(type);
                el.setAttribute(type, `${origin} ${value}`);
            } else {
                el.setAttribute(type, value);
            }
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
                for (let i in queue) {
                    if (queue.hasOwnProperty(i)) {
                        let current = queue[i];
                        let top = current.dom.getBoundingClientRect().top;
                        let left = current.dom.getBoundingClientRect().left;
                        if ((top - offset) < window.innerHeight && (left - offset) < window.innerWidth) {
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
        let id = dom['vue-lazy-id'];
        if (!queue.hasOwnProperty(id) && dom && dom.nodeType && typeof cb === 'function') {
            queue[id] = {
                dom: dom,
                callback: cb
            };
            lazy._keepTimer();
        }
        return id;
    };


    vueLazy.install = function (Vue, options) {
        Vue.directive('lazy', {
            bind(el, binding) {
                let type = binding.arg;
                let value = binding.value;
                if (typeof binding.value == 'function' || !binding.arg) {
                    return console.error('[Vue warn]: Invalid parameter, Expected String or number.');
                }

                if(!el.hasOwnProperty('vue-lazy-id')){
                    el['vue-lazy-id'] = Helper.getRandomKey();
                }

                lazy.set(el, ()=> {
                    Handler.setAttr(el, type, value);
                });
            },
            update(el, binding) {
                let type = binding.arg;
                let value = binding.value;
                let key = el['vue-lazy-id'];
                if(queue.hasOwnProperty(key)) {
                    lazy.set(el, ()=> {
                        Handler.setAttr(el, type, value);
                    });
                }
            },
            unbind(el) {
                let key = el['vue-lazy-id'];
                delete  queue[key];
            }
        });
    };

    if (typeof exports == "object") {
        module.exports = vueLazy;
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return vueLazy
        });
    } else if (window.Vue) {
        window.vueLazy = vueLazy;
        Vue.use(vueLazy);
    }
}();
