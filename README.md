# AntEnergyAEutomaticCollection
1） 适配 个人 手机屏幕若采用区域间隔点选收集能量，适配个人手机能量区域
var boundTopY = 560 ;   //能量区域上 自己手机上的能量区域 需要更改本机适配 
var boundBomY =  820;   //能量区域下
var boundLeftX = 150;   //能量区域左
var boundRightX = 900;  //能量区域右
var enrgyBound = 80;   //自己手机能量球大小 120 取 80 跨度

2） 如采用点选六个能量球的位置 来收集，也需要自己匹配 六个能量球手机坐标
var energyPoint = [220,740,360,690,490,640,610,610,750,640,890,770] //自己手机 能量球位置 ，最多六个

3）好友页面 浇水按钮的手机坐标
var waterPointX = 980; //浇水按钮x坐标 
var waterPointY = 1520; 

4）允许浇水的好友数组
var waterFriendList = ["小猪佩奇","懒羊羊"] //浇水的 好友列表
var ownName = "自己的名字" //自己的名字
