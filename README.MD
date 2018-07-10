# Vue 2.0 懒加载指令 ( Vue lazyload directive )

> 轻量级 Vue 2.0 懒加载自定义指令；<br>
> 支持懒加载dom属性；<br>
> 支持懒加载函数调用；<br>
> 资源合理释放；<br>


## 安装：

> * ES6

``` bash
 
npm install vue-directive-lazy --save; 
yarn add vue-directive-lazy;

```

```javascript

import lazy from 'vue-directive-lazy';
Vue.use(lazy,{
    error: '',
    loading: ''
});

```

## Constructor Options

|key|description|default|options|
|:---|---|---|---|
|`error`|src of the image upon load fail||`String`
|`loading`|src of the image while loading|`data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=`|`String`|
> error 参数为空情况下，图片加载失败将默认展示 loading 参数的图片


> * 直接引入:
```html
<script src="./vue.js"></script>
<script src="./dist/index.js"></script>
```


## 使用 How to use:


### 常规


```html

<p v-lazy:class="className">延迟绑定className,className会追加在已有class内</p>

<img v-lazy:src="imgSrc">延迟加载图片</p>

<div v-lazy:method="trigger">触发函数调用</div>
```

```javascript
new Vue({
	el: "dom",
	data() {
	    return {
	        className: 'customClass',
	        imgSrc: 'http://img.jpg'
	    }
	},
	methods: {
	    trigger: function() {
	        // do something
	    }
	}
});
```


## License

MIT

