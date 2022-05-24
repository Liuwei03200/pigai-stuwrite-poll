import request from '@/utils/request'

const pigai = '/api/';
const gpu120 = '/api/gpu120/'
// 1.获取当前作文要求页面
export function getRidRequest(rid){
    return request({
        url:`${pigai}?c=api&a=writeview&uid=21&rid=${rid}`,
		method:'get',
	})
}