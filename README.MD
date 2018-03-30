# Vue 2.0 懒加载指令 ( Vue lazyload directive )

> 轻量级 Vue 2.0 懒加载自定义指令；<br>
> 支持懒加载dom属性；<br>
> 资源合理释放；<br>


## 安装：

> * ES6

``` bash
 
npm install vue-directive-lazyload --save; 

```

```javascript

import lazy from 'vue-directive-lazy';
Vue.use(lazy);

```

> * 直接引入:
```html
<script src="./vue.js"></script>
<script src="./dist/index.js"></script>
```


## 使用 How to use:


### 常规


```html

<p v-lazy:class="className">延迟绑定className,className会追加在已有class内</p>

<img v-lazy:img="imgSrc">延迟加载图片</p>

```

```javascript
new Vue({
	el: "dom",
	data() {
	    return {
	        className: 'customClass',
	        imgSrc: 'http://img.jpg'
	    }
	}
});
```


## License

MIT

