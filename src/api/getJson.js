const data =
{
    "uid":21,
    "rid":2671804,
    "time":10,
    "requestUrl":null,
    "xaddUrl":null,
    "info":{
        "uid":21,
        "uname":23421,
        "class":"dfasdf"
    },
    "isOnePage":true
}
/**
    time : 默认提交时间间隔 秒
    requestUrl ：获取要求get url   需要获取的格式是   data.request.essay_topic    ——》是一个html代码
    xaddUrl : 提交的 post url 
    
    共有两个页面  ： 搜索页面和写作页面
    搜索页面： 有requestUrl则使用这个 ，无使用批改网的获取要求的api
       写作页面：
       有uid 则 直接写作
       无uid 则 需要完善个人信息才能答题
       
       无rid 则会返回搜索页面

       有 time 则使用time 的值，默认10秒
       有 xaddUrl 则使用 xaddUrl提交链接 ，需要注意的是如果设置的这个值 ，则需要注意跨域问题

 **/
