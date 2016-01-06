# 掌上游天涯项目架构图

## TL;DR
按以下步骤依次操作可以快速启动开发环境
1. 进入项目根目录
2. `npm i`，安装依赖
3. `cp config.example.json config.json`，复制项目模板文件并按自己的需求修改
4. `npm start`，使用nodemon监听文件更改并自动重启服务器
    1. **\*NIX**：`DEBUG=tianya-haijiao:* npm start`，使用debug模块打印log
    2. **Windows**: `set DEBUG=tianya-haijiao:*` 然后`npm start`即可使用debug打印log

## TOC
- [项目基本信息](#base_info)
- [文件结构](#project_structure)
    - [bin](#project_structure-bin)
    - [doc](#project_structure-doc)
    - [misc](#project_structure-misc)
    - [models](#project_structure-model)
    - [test](#project_structure-test)
    - [v1](#project_structure-v1)


## <a name="base_info"></a>项目基本信息
- 目标平台：Linux
- 运行环境：NodeJS `v0.11.6+` with `--harmony` flag
- 数据库：MongoDB `v2.6+` and Redis
- 请使用ESLint并使用项目根目录的.eslintrc配置文件来保持代码风格一致


## <a name="project_structure"></a>项目文件结构
整个项目采用MVC架构，基本项目结构如下图
```asciidoc
tian_ya_hai_jiao_api/                  项目根目录
├── bin/                     此目录包含一些执行脚本，如启动应用，插入测试数据等
├── config.example.json 	 配置文件模板
├── config.json 	         配置文件
├── doc/                     此目录包含项目的所有接口文档，文档按模块组织，每个模块内又按具体功能组织文件
├── index.js			 	项目入口文件
├── misc/                    数据库配置，用户认证配置等杂项文件
├── models/  				数据库模型文件
├── online_chat.js		   基于socket.io的即时聊天服务器
├── package.json			 npm的声明文件，包含项目的依赖等
├── README.md				包含对此此项目的一些介绍，就是当前说看到的内容
├── test/  				  此目录包含所有测试文件，目前只做功能性测试
└── v1/   				   此目录包含所有路由文件
```

下面是对每个目录的具体介绍

### <a name="project_structure-bin"></a>Bin目录
此目录包含一些执行脚本，如启动应用，插入测试数据等
```asciidoc
bin/
├── delete_database.js  删除数据库，方便测试
├── import_data_from_csv.js 从csv文件导入数据
├── remove_data_from_csv.js 从csv文件移出数据
├── import_data_from_db.js  从数据库导入数据
├── root.js			 插入root用户，此项目最高权限的后台管理员需要通过此脚本来创建
└── start.js		    启动应用

```
> 注意：启动应用前需要复制项目根目录的config.example.json文件并命名为config.json然后按当前环境修改配置才能正常启动

### <a name="project_structure-doc"></a>Doc目录
项目API文档使用[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)格式编写，后转化成HTML格式以便开发人员在线查阅。
```asciidoc
doc/
├── readme.app.html  	  移动App使用的API接口文档
└── readme.html 		   后台使用的API接口文档
```

### <a name="project_structure-misc"></a>Misc目录
任何无法被分类到其他目录的文件都放在此目录，但是随着项目开发，此目录内的文件应该随时整理归类。
```asciidoc
misc/
├── db.js                           数据库连接
├── index.js                        操作
├── jpush.js                        JPush通知推送
├── map_service/                    连接定位服务器的库
├── passport.js                     Passport配置
├── passport_qq_token.js			废弃
└── passport_wechat_token.js		废弃

```

### <a name="project_structure-model"></a>Model目录
使用Mongoose定义MongoDB数据库的文档模型
```asciidoc
models/
├── index.js          导出文件
├── wishing_wall.js   许愿墙Model
├── ...
└── ...

```

### <a name="project_structure-test"></a>Test目录
接口测试，使用Mocha组织测试文件，Chai（Expect）做断言，supertest测试接口，目前只做了功能性测试，运行`npm test`可以开始测试
```asciidoc
test/
├── fixtures/				 此目录包含一些测试需要用到的辅助文件
│   ├── dummy.json			定义测试需要用到的数据
│   ├── icon.jpg			  测试上传功能用的图片
│   └── prepare.js			测试辅助代码
└── functional/			   所有测试文件所在的目录
```

### <a name="project_structure-v1"></a>V1目录
此项目提供的API的第一版，里面包含所有的接口，每个模块一个文件，通过index.js导出所有接口
```asciidoc
v1
├── index.js          导出所有接口
├── wishing_wall.js   许愿墙接口
├── ...
└── ...
```
