<?php
 $conn=mysql_connect("localhost","root","123456")or die(mysql_error()); //连接mysql                    
 mysql_select_db("xiaochengxu",$conn); //选择mysql数据库
 mysql_query("set names 'utf8'");//mysql编码
 
//  echo '{"data": {}}';
$type = $_POST['type'];
// $page = $_POST['page'];
$openid = $_POST['openid'];

    if (!preg_match('/^[0-2]{1}$/u', $type)&&!preg_match('/^[a-zA-Z0-9]{28}$/u', $openid)){
        echo '{"status": 0, "message": "非法参数提交！"}';
        exit;
    }
// $startRow = $page * 10;


// $sql1 = "select * from `xiaochengxu` where `type` = '$type' limit $startRow,10";
$sql1 = "select * from `xiaochengxu` where `type` = '".$type."' ORDER BY `time` LIMIT 20";
$rs = mysql_query($sql1,$conn); 
$list = array(); 
while($row = mysql_fetch_assoc($rs)) { 
    $list[] = $row; 
}

$sql2 = "select * from `xiaochengxu` where `type` = '$type' and `id` = '$openid'";
$myRs = mysql_query($sql2,$conn); 
$myList = array(); 
$myRow = mysql_fetch_assoc($myRs);
$myList[] = $myRow; 

if(mysql_num_rows($rs)==0){
    echo '{"status": 0, "message": "当前没有数据！"}';
}else{
    echo '{"data": '.json_encode($list).',"myData": '.json_encode($myList).', "type": "'.$type.'", "status": 1, "message": "获取成功！"}';
}