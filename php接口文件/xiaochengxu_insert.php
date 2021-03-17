<?php
 $conn=mysql_connect("localhost","root","123456")or die(mysql_error()); //连接mysql              
 mysql_select_db("xiaochengxu",$conn); //选择mysql数据库
 mysql_query("set names 'utf8'");//mysql编码



//插入数据前，进行数据验证
$id=mysql_real_escape_string($_POST['id']);
$header=mysql_real_escape_string($_POST['header']);
$name=mysql_real_escape_string($_POST['name']);
$type=mysql_real_escape_string($_POST['type']);
$time=mysql_real_escape_string($_POST['time']);
$timeData=mysql_real_escape_string($_POST['timeData']);
$date=mysql_real_escape_string($_POST['date']);

    if (!$id){
        echo '{"status": 0, "message": "ID信息获取失败，请重新进入小程序！！"}';
        exit;
    }

    if (!preg_match('/^[0-2]{1}$/u', $type)&&!preg_match('/^[a-zA-Z0-9]{28}$/u', $id)&&!preg_match('/^[0-9]*$/u', $time)&&!preg_match('/^[\x{4e00}-\x{9fa5}0-9]*$/u', $timeData)&&!preg_match('/^\d{4}\\/\d{2}\\/\d{2} \d{2}:\d{2}:\d{2}$/u', $date)&&$id&&$header&&$name&&$type&&$time){
        echo '{"status": 0, "message": "非法参数提交，插入失败！"}';
        exit;
    }

$result=mysql_query("select * from `xiaochengxu` where `id` = '$id' and `type` = '$type'")or die(mysql_error());

if(mysql_num_rows($result)==0){
    $sql="INSERT INTO xiaochengxu(`id`, `header`, `name`, `type`, `time`, `timeData`, `date`) VALUES ('$id','$header','$name','$type','$time','$timeData','$date')";
    if(mysql_query($sql)){
        echo '{"status": 1, "message": "数据插入成功！"}';
    }else{
        echo '{"status": 0, "message": "数据插入失败！"}';
    }
}else{
    $row = mysql_fetch_array($result);
    if($row['time']>$time){
        $sql3 = "update `xiaochengxu` set `time`='$time',`timeData`='$timeData',`date`='$date' where `id`='$id' and `type` = '$type'";
        if(mysql_query($sql3)){
            echo '{"status": 1, "message": "数据更新成功！"}';
        }else{
            echo '{"status": 0, "message": "数据更新失败！"}';
        }
    }else{
        echo '{"status": 0, "message": "用时比记录最佳用时长，请再接再厉哦！"}';
    }
}