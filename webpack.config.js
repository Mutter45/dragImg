const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
    //指定为开发环境
    mode: 'development',
    // 入口文件
    entry: './src/main.ts',
    //指定打包文件所在文件
    output: {
        //指定打包文件所在目录
        path: path.resolve(__dirname, 'dist'),
        //
        filename: "bundle.js",
        environment:{
            //不使用箭头函数
            arrowFunction:false,
            const:false,
        }
    },
    module: {
        //指定要加载的规则
        rules: [
            {
                //test指定规则生效的文件
                test: /\.ts$/,
                //要是用的loader
                use: [
                    //配置babel
                    {
                        //指定加载器
                        loader: "babel-loader",
                        //设置babel
                        options: {
                            //设置预定义的环境
                            presets: [
                                [
                                    //指定环境的插件
                                    "@babel/preset-env",
                                    //配置信息
                                    {
                                        //要兼容的目标浏览器
                                        targets: {
                                            "chrome": "86",
                                            "ie":"11",
                                        },
                                        //指定corejs版本
                                        "corejs": "3",
                                        //指定corejs的方式，"usage"表示按需加载
                                        "useBuiltIns": "usage"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader',
                ],
                exclude: /node-modules/
            },
            {
                test: /\.less$/,
                use: [
                    //执行顺序从下到上，从右到左
                    "style-loader", 
                    "css-loader", 
                    {
                        //引入postcss
                        loader: "postcss-loader",
                        options:{
                            postcssOptions: {
                                plugins:[
                                    [
                                        "postcss-preset-env",
                                        {
                                            browsers: ["last 10 versions"],
                                        }
                                    ]
                                ]
                            },
                        }
                    },
                    "less-loader"
                ],
              },
              //处理图片资源
              {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset",
              },
              { 
                test: /\.html$/, 
                loader:'html-loader',
            }
        ]
    },
    //配置插件
    plugins: [
        //每次打包前先删除上次打包文件
        new CleanWebpackPlugin(),
        //自动生成html文件
        new HTMLWebpackPlugin(
            {
                // 设置header下title
                // title:'typescript测试'
                //设置模板html
                template: "./src/index.html",
            }
        )
    ],
    //用来设置引用模块
    resolve: {
        //拓展名
        extensions: ['.js', '.ts']
    }
}