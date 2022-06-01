import request from '@/utils/request'

let pigai="/";
let gpu120="/";
let py="/";
if(window.location.hostname == 'localhost'){
     pigai = '/api/';
     gpu120 = '/api/gpu120/';
     py = '/api/py/';
  }
// 1.获取当前作文要求页面
export function getRidRequest(rid,url){
    return request({
        url:url!=null?url:`${pigai}?c=api&a=writeview&uid=21&rid=${rid}`,
		method:'get',
	})
}

export function xadd(data,url){
    return request({
        url:url!=null?url:`${pigai}redis/xadd`,
		method:'json',
        data:data
	})
}


// 1 保存数据
export function saveData(data){
    return request({
        url:`${py}zhihui/index/save`,
		method:'json',
        data:{
            json:data
        }
	})
}
//2 读取数据
export function getData(id){
    return request({
        url:`${py}zhihui/index/load`,
		method:'json',
        data:{
            id:id
        }
	})
}

//3 写作页面提交接口
export function subWriteData(id,json){
    return request({
        url:`${py}zhihui/index/do_essay`,
		method:'json',
        data:{
            config_id:id,
            json:json
        }
	})
}