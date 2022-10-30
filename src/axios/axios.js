import QS from 'qs'
import axios from 'axios'
// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
import store from '@/store/index';

//请求接口超时时间(目标是高性能所以设定为超过10秒的请求都认为是超时)
axios.defaults.timeout = 10000;

//请求头
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

//请求拦截器
axios.interceptors.request.use(
    config => {
        /*         
        每次发送请求之前判断vuex中是否存在token        
        如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
          */
        const token = store.state.token;
        token && (config.headers.Authorization = token);
        return config
    },
    error => {
        return Promise.error(error);
    }
)

//响应拦截器
axios.interceptors.response.use(
    response => {
        /*         如果返回的状态码为200,说明请求正常返回
                否则就为错误抛出异常 */
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                //401代表未登录
                case 401:
                    // router.replace()
                    break;
                /* 
                403 token过期
                登录过期对用户提示
                清除本地token和清空vuex中的token对象
                跳转登录页面
                */
                case 403:
                    break;
                //404请求不存在
                case 404:
                    break;
                //其他错误直接抛出提示
                default:
                // Toast({
                //     message: error.response.data.message,
                //     duration: 1500,
                //     forbidClick: true
                // });
            }
            return Promise.reject(error.response);
        }
    }
)

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}