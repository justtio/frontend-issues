import { Axios } from 'axios';

export class AxiosRetry {
  //维护一个promise
  private fetchNewTokenPromise: Promise<any> | null = null;

  private baseUrl: string;
  private url: string;
  private getRefreshToken: () => string | null;
  private unauthorizedCode: string | number;
  private onSuccess: (res: any) => any;
  private onError: () => any;

  constructor({
    baseUrl,
    url,
    getRefreshToken,
    unauthorizedCode,
    onSuccess,
    onError,
  }: {
    baseUrl: string;
    url: string;
    getRefreshToken: () => string | null;
    unauthorizedCode: string | number;
    onSuccess: (res: any) => any;
    onError: () => any;
  }){
    this.baseUrl = baseUrl;
    this.url = url;
    this.getRefreshToken = getRefreshToken;
    this.unauthorizedCode = unauthorizedCode;
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  requestWrapper<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      //先把请求函数保存下来
      const requestFn = request;
      return request()
        .then(resolve)
        .catch(err => {
          if(err?.state === this.unauthorizedCode && !(err?.config?.url === this.url)) {
            if(!this.fetchNewTokenPromise) {
              this.fetchNewTokenPromise = this.fetchNewToken();
            }
            this.fetchNewTokenPromise
              ?.then(() => {
                //获取token后重新请求
                requestFn()
                  .then(resolve)
                  .catch(reject);
              })
              .finally(() => {
                //请求完成后清空promise
                this.fetchNewTokenPromise = null;
              });
          } else {
            reject(err);
          }
        })
    })
  }

  //获取token的函数
  fetchNewToken() {
    return new Axios({
      baseURL: this.baseUrl,
    })
      .get(this.url, {
        headers: {
          Authorization: this.getRefreshToken(),
        },
      })
      .then(this.onSuccess)
      .catch(() => {
        this.onError();
        return Promise.reject();
      })
  }
}