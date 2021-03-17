-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `xiaochengxu`;
CREATE TABLE `xiaochengxu` (
  `id` varchar(255) NOT NULL COMMENT 'openid 用户唯一标识',
  `header` text NOT NULL COMMENT '头像',
  `name` text NOT NULL COMMENT '名字',
  `type` text NOT NULL COMMENT '等级',
  `time` int(11) NOT NULL COMMENT '用时',
  `timeData` text NOT NULL COMMENT '用时字符串',
  `date` text NOT NULL COMMENT '完成时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- 2021-03-17 11:32:07
