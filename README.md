# 猜数字小程序GuessNumber

## 程序介绍：
### 游戏使用说明
  1. 用户首先需在首页选定好猜数字的难度等级（默认初级）；
  2. 然后点击首页的“猜数字”生成随机数开始游戏；
  3. 在游戏页面的数字框内输入你的数字猜想，当一组数据全部填完后会在下方显示猜想的正确性提示。若猜想数字且位置全部正确，则游戏结束，否则自动弹出下一组猜想输入框；
  4. 游戏结束时会上传本次游戏数据，记录至排名。

### 游戏等级提示
  1. 初级：1到6猜4个数；
  2. 中级：1到8猜5个数；
  3. 高级：0到9猜6个数；
  4. 一组随机数内无重复数字。

### 致谢
  1. 感谢 @伟大的污妖王 提供的创作灵感；
  2. 感谢 @Zero 对本小程序的实现。


## 程序安装说明：
### 需要更改的正确api接口地址（https协议）：

  \GuessNumber\pages\rank\index.js
  42行：接口文件-》xiaochengxu.php

  \GuessNumber\pages\content\index.js
  136行：接口文件-》xiaochengxu_insert.php

  \GuessNumber\pages\index\index.js
  183行：接口文件-》login.php

### 接口文件配置修改：
  更改数据库连接信息：\php接口文件\xiaochengxu_insert.php（第2行）、\php接口文件\xiaochengxu.php（第2行）
  更改小程序配置信息：\php接口文件\login.php（17、18行）、\GuessNumber\project.config.json（28行）


