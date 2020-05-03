auto();// 自动打开无障碍服务
requestScreenCapture(); //请求截图

var boundTopY = 560 ;   //能量区域上 自己手机上的能量区域 需要更改本机适配 
var boundBomY =  820;   //能量区域下
var boundLeftX = 150;   //能量区域左
var boundRightX = 900;  //能量区域右
var enrgyBound = 80;   //自己手机能量球大小 120 取 80 跨度

var energyPoint = [220,740,360,690,490,640,610,610,750,640,890,770] //自己手机 能量球位置 ，最多六个

var waterPointX = 980; //浇水按钮x坐标
var waterPointY = 1520; 

var isWaterFriend = false; //是否给好友浇水
var isHelpCollect = true; //是否帮助好友收集
var waterFriendList = [] //浇水的 好友列表
var ownName = "自己的名字" //自己的名字
var lastPoaition = null  //图片识别 容易出错，容错计算
//打开森林页面
function openForestPage(){
    launchApp("支付宝") //打开支付宝
    text("首页").waitFor()
    sleep(500)  
    click("首页") //点击首页
    text("蚂蚁森林").waitFor()
    sleep(500)
    click("蚂蚁森林")  //点击蚂蚁森林
}


//拾取自己能量
function collectOwnEnergy(){
    text("公益林").waitFor()
    sleep(1000)
    if  ( null != textContains("收集能量").findOne(3000)) {
        var Energys = textContains("收集能量").find() //查找所有的可以搜集的能量
        for (var i = 0; i< Energys.length;i++) {
            var energyBound = Energys[i].bounds()
            click(energyBound.centerX(), energyBound.centerY());
        }
    }
}

//通过区域来点选
function collectOtherEnergyFromBound(){
    for (var x = boundLeftX ; x < boundRightX;x += enrgyBound ){
        for (var y = boundTopY; y < boundBomY; y += enrgyBound ){
            click(x,y)
        }
    }
}

//通过能量球的位置来点选
function collectOtherEnergyFromPoint(){
    for (var i = 0; i<energyPoint.length;i += 2){
        click(energyPoint[i],energyPoint[i+1])
    }
}

//拾取他人或者自己能量
function collectOtherEnergy(){
    //collectOtherEnergyFromBound()
    collectOtherEnergyFromPoint()
}

//点击查看更多好友
function swipToMoreFriends(){
    while(!text("查看更多好友").exists()) {
        swipe(device.width/2, device.height * (2/3), device.width/2, device.height/3, 1000);
    }
    text("查看更多好友").findOne().click()
    sleep(2000) 
}

//获取好友的名字 通过列表位置ByList
function getFriendNameByList(friend){
    return friend.child(2).child(0).child(0).text()
}

//获取好友的名字 通过森林主页
function getFriendNameByForstTitle(){
    if (id("com.alipay.mobile.nebula:id/h5_tv_title") != null){
       var friendName = id("com.alipay.mobile.nebula:id/h5_tv_title").findOne(3000).text() //** **的蚂蚁森林 */
    }
    return friendName.slice(0,-5) 
}

//判断点击的是不是自己
function judgeIfSelf(friend){
    var name  = getFriendNameByList(friend)
    if (name == ownName) {
        return  true
    } else {
        return false
    }

}

//给好友浇水
function waterFriendEnergy(){
    click(waterPointX,waterPointY)
    sleep(2000)
    if (text("浇水送祝福").exists()) {
        click("浇水送祝福")
        sleep(500)
    }
}

//遍历 好友列表 拾取好友能量 每个人都收
function selectFriendsEnergyByFriendList(){
    while(!text("没有更多了").exists()) {
        swipe(device.width/2, device.height * (5/6), device.width/2, device.height/6, 1000);
    }  
   var friendsList = className("android.webkit.WebView").findOne().child(0).child(0).child(1) //获取好友列表
    for (var i = 0;i<friendsList.childCount() ;i++){
        //toast(i)
         if(!judgeIfSelf(friendsList.child(i))){
            friendsList.child(i).click()
            sleep(2000)
            collectOtherEnergy()
            if (isWaterFriend) {
            var waterFriend =  judgeWaterDesignatedFriends(getFriendNameByList(friendsList.child(i))) //不给好友浇水 注释掉
            if (waterFriend) {waterFriendEnergy()} //不给好友浇水 注释掉
            }

            back()
            sleep(1000)
         }

    }
}

//根据图片 最终拾取 或 帮助好友拾取
function exeCollectOrHelpCollectEnergy(position){
    if  (lastPoaition == null || position.x != lastPoaition.x || position.y != lastPoaition.y ) {
        lastPoaition = position
    } else {
        swipe(device.width/2, device.height*(2/12), device.width/2, device.height/12, 1000); 
        return 
    }
    lastPoaition = position
    click(position.x,position.y+20)
    sleep(2000)
    collectOtherEnergy()
    if (isWaterFriend) {
    var waterFriend =  judgeWaterDesignatedFriends(getFriendNameByForstTitle()) //不给好友浇水 注释掉
    if (waterFriend) {waterFriendEnergy()} //不给好友浇水 注释掉
    }
    back()
    sleep(1000)
}

//根据图片点击拾取 并且滑动
function exeSelectFriendsEnergyByHaveEnergyPicture(){
    var positionCollectEnergy = getHasEnergyfriendPosition()
    var positionHelpCollectEnergy = getHelpCollectEnergyfriendPosition()
    if (positionCollectEnergy != null){
        exeCollectOrHelpCollectEnergy(positionCollectEnergy)
    } else if(isHelpCollect && null != positionHelpCollectEnergy) {
        exeCollectOrHelpCollectEnergy(positionHelpCollectEnergy)
    } else {
        swipe(device.width/2, device.height*(3/4), device.width/2, device.height/4, 1000);
        sleep(300)
    }
}

//根据图片识别 只拾取 有能量的 好友
function selectFriendsEnergyByHaveEnergyPicture(){
    while(!text("没有更多了").exists()) {
        exeSelectFriendsEnergyByHaveEnergyPicture()
    }
    for(var i = 0;i<3;i++){  //图片识别最后一点会加载不出，用for 遍历循环
        swipe(device.width/2, device.height*(3/4), device.width/2, device.height/4, 1000);
        while(getHasEnergyfriendPosition() != null) {
            exeSelectFriendsEnergyByHaveEnergyPicture()
        }
    }
}

//根据截屏对比 像素点，获取有能量的好友位置
function  getHasEnergyfriendPosition() {
    var img = captureScreen();
        //img 是截取屏幕图片
        //"#30bf6c" 第一个颜色
        //[0, 33, "#30bf6c"] 第二颜色和它的相对坐标
        //[34,45, "#ffffff"] 第三个颜色和他的相对坐标
      var  p = images.findMultiColors(img, "#1da06d",[[59, 0, "#1da06d"], [18,30, "#ffffff"]]);
    if(p!=null){
        return p;
    }else {
        return null;
        }
}

//根据截屏对比 像素点，获取可帮助待收的好友
function  getHelpCollectEnergyfriendPosition() {
    var img = captureScreen();
    // img 是截取屏幕图片
    // "#f99137" 第一个颜色
    // [0, 33, "#f99137"] 第二颜色和它的相对坐标
    // [34,45, "#f99137"] 第三个颜色和他的相对坐标
   var  p = images.findMultiColors(img, "#f99137",[[50, 0, "#f99137"], [50,50, "#f99137"]]);
    if(p!=null){
        return p;
    }else {
        return null;
        }
}

//根据普片位置获取像素
function getPointPixel(){
    var img = captureScreen();
    var color = images.pixel(img,1020,1395) 
    alert((color & 0xffffff).toString(16))
}

//给指定浇水的好友
function judgeWaterDesignatedFriends (friendName){
for (var i= 0;i< waterFriendList.length;i++) {
    if (waterFriendList[i] == friendName) {
        return  true
    } 
}
return false
}

//解锁手机
function unlock(){
    if(!device.isScreenOn()){
    	//点亮屏幕
        device.wakeUp();
        sleep(1000);
        
		//滑动屏幕到输入密码界面
        swipe(device.width/2, device.height/2, device.width/2, device.height/5, 1000);
        sleep(1000);
        id("com.android.systemui:id/keyi0").findOne(2000).click()  //根据密码布局找到对应按键
        sleep(500) 
        id("com.android.systemui:id/key1").findOne(2000).click()
        sleep(500)
        id("com.android.systemui:id/key2").findOne(2000).click()
        sleep(500)
        id("com.android.systemui:id/key3").findOne(2000).click()
        sleep(500)
        id("com.android.systemui:id/key4").findOne(2000).click()
        sleep(500)
        id("com.android.systemui:id/key5echo "# AntEnergyAEutomaticCollection" >> README.md").findOne(2000).click()
    }
}


//退出程序
function endCollectEnergy(){

    back();sleep(1000);
    back();sleep(1000);
    back();sleep(1000);
    home()
}

 unlock() //解锁
 openForestPage()  //打开蚂蚁森林界面
 collectOwnEnergy() //收取自己能量
 swipToMoreFriends() //打开更多好友列表
 selectFriendsEnergyByHaveEnergyPicture() //根据图片像素 收取有能量的好友
  //selectFriendsEnergyByFriendList() //遍历所有好友 收取能量
 endCollectEnergy() //结束收取

