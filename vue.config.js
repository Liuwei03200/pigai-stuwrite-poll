'use strict'
// 代码压缩混淆
// const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
	publicPath: '/zhihui/',//部署应用包的基本URL，
	outputDir: 'zhihui',//构建生产环境目录
	assetsDir: 'static',//防止静态资源，相对于outputDir目录
	indexPath: 'index.html',
	productionSourceMap:false,
	devServer:{
		open:false,//是否自动打开浏览器
		https:false,
		// host:'vue.pigai.org',
		hotOnly:false,
		proxy:{
			"/api/gpu120/":{
				target:"http://gpu120.wrask.com:8180/",
				secure:false,
				changeOrigin:true,
				pathRewrite:{
					"^/api/gpu120":""
				}
			},
			"/api/i+1/":{
				target:"http://daka.wrask.com/",
				secure:false,
				changeOrigin:true,
				pathRewrite:{
					"^/api/i+1":""
				}
			},
			"/api/py/":{
				target:"http://py.jukuu.com:8080/",
				secure:false,
				changeOrigin:true,
				pathRewrite:{
					"^/api/py":""
				}
			},
			"/api/":{
				target:"http://www.pigai.org/",
				secure:false,
				changeOrigin:true,
				pathRewrite:{
					"^/api":""
				}
			},
		},
	},

}
