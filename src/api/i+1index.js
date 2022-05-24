import request from '@/utils/request'

// 1.获取当前Rid的简介内容
// http://daka.wrask.com/redis/hgetall?key=rid-2642549:config
export function geRidIntro(rid){
    return request({
        url:`/redis/hgetall?key=rid-${rid}:config`,
		method:'get',
	})
}
// 2.获取当前Rid的所有题信息
// http://daka.wrask.com/redis/rg_pyexecute?cmd=GB().map(lambda x:execute('hgetall', x['key'])).run('rid-2642549:config:tid-*')&name=rg.eodic 
export function geRidTids(rid){
	return request({
		url:`/redis/rg_pyexecute?cmd=GB().map(lambda x:execute('hgetall', x['key'])).run('rid-${rid}:config:tid-*')&name=rg.eodic`,
		method:'get',
	})
}

// 3.tid打分接口 
// curl -X 'POST' \
//   'http://daka.wrask.com/requests/post_dict?url=http%3A%2F%2Fgpu120.wrask.com%3A8180%2Futil%2Fsentdiff' \
//   -H 'accept: application/json' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "src": "I love it.",
//   "tgt": "I like it."
// }'
export function getScore(url,data){
	return request({
		url:`/requests/post_dict?url=${url}`,
		method:'json',
        data:data
	})
}