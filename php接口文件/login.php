<?php

    /*
       *登录（调用wx.login获取）
       * @param $code string
       * @param $rawData string
       * @param $signatrue string
       * @param $encryptedData string
       * @param $iv string
       * @return $code 成功码
       * @return $session3rd  第三方3rd_session
       * @return $data  用户数据
   */
    function login()
    {
        //开发者使用登陆凭证 code 获取 session_key 和 openid
        $APPID = '';//自己配置
        $AppSecret = '';//自己配置
      
        include_once "wxBizDataCrypt.php";  //加载解密文件，在官方有下载
        
        $code = $_POST['code'];
        $url = "https://api.weixin.qq.com/sns/jscode2session?appid=" . $APPID . "&secret=" . $AppSecret . "&js_code=" . $code . "&grant_type=authorization_code";
        $arr = vget($url);  // 一个使用curl实现的get方法请求
        $arr = json_decode($arr, true);
        // var_dump($arr);
        $openid = $arr['openid'];
        $session_key = $arr['session_key'];
        
        // 数据签名校验
        $signature = $_POST['signature'];
        $rawData = $_POST['rawData'];
        $signature2 = sha1($rawData . $session_key);
        if ($signature != $signature2) {
            return json_decode("['code' => 500, 'msg' => '数据签名验证失败！']");
        }
        
        $encryptedData = $_POST['encryptedData'];
        $iv = $_POST['iv'];
        $pc = new WXBizDataCrypt($APPID, $session_key);
        $errCode = $pc->decryptData($encryptedData, $iv, $data );  //其中$data包含用户的所有数据
        $data = json_decode($data,true);
        if ($errCode == 0) {
           $user_id = md5($data['openId']);
           //缓存七天
           //Cache::set("$user_id",$data['openId'],60*60*24*7);
           $userInfo = [
               'open_id'    => $data['openId'],
               'nickName'   => $data['nickName'],
               'avatarUrl'  => $data['avatarUrl'],
               'gender'     => $data['gender'],
               'country'    => $data['language'],
               'province'   => $data['province'],
               'city'       => $data['city'],
               'create_time'=> date('Y-m-d H:i:s'),
               'update_time'=> date('Y-m-d H:i:s'),
           ];
           echo '{"status": 0, "msg": "登陆成功！", "session_key": "'.$session_key.'", "openid": "'.$openid.'", "userData": '.json_encode($userInfo).'}';
           //从数据库中查找用户信息
        //   $uid = Db::name('wx_user')->field('id')->where('open_id',$data['openId'])->find()['id'];
           //判断用户是否已经授权登录（没有则注册）
        //   if(empty($uid)){
               //若为查询到则为新用户
            //   $uid = Db::name('wx_user')->insertGetId($userInfo);
        //   }
           //存储7天作为登录时的验证(token),其中键是md5加密后的openId,值是数据库中用户的id
            // Cache::set($user_id,$uid,60*60*24*7);
            // dump($data);
            // echo $user_id;
            // die;//打印解密所得的用户信息
        } else {
            echo $errCode;//打印失败信息
        }
    }
 
    function vget($url){
        $info=curl_init();
        curl_setopt($info,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($info,CURLOPT_HEADER,0);
        curl_setopt($info,CURLOPT_NOBODY,0);
        curl_setopt($info,CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($info,CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($info,CURLOPT_URL,$url);
        $output= curl_exec($info);
        curl_close($info);
        return $output;
    } 

login();

?>