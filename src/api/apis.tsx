import { $api, requestApi,uploadApi} from './index';

export const testUser = {
  id: '6470370650',
  // id: 6528826249,
  username: 'TorresLi',
  first_name: 'Torres',
  allows_write_to_pm: false,
  language_code: 'zh-CN',
  last_name: 'Li',
};

export const getData = async (url: string, data: any) => {
  return await $api.get(url, data);
};

export const postData = async (url: string, data: any) => {
  return await $api.post(url, data);
};

export const testGet = async (initData: string) => {
  return await requestApi(`/test?${initData}`, 'GET', {});
};

export const testPost = async (initData: string) => {
  return await requestApi(`/test`, 'POST', { initData });
};

// /univoice/getuserappinfo.do?userid=xxx
export const requestUserInfo = async (user_id: string) => {
  return await requestApi(`/univoice/getuserappinfo.do`, 'get', { userid: user_id });
};

export const getCommonInfo = async () => {
  return await requestApi(`/univoice/getcommoninfo.do`, 'get', {});
};

export const getTaskList = async (user_id: string) => {
  return await requestApi(`/univoice/getuserboosttask.do`, 'get', { userid: user_id });
};

export const finishTask = async (webAppUser: any, task_id: string) => {
  return await requestApi(`/univoice/finshuserboosttask.do`, 'post', { webAppUser, task_id });
};

export const uploadVoice = async (user_id:string, blob:any) => {
  return await uploadApi(`/univoice/uploadvoice.do`,'post', user_id, blob);
};

export const inviteFriend = async (user_id: string) => {
  return await requestApi(`/univoice/invitefriends.do`, 'get', { userid: user_id });
};

export const getVoiceTasks = async (user_id: string) => {
  return await requestApi(`/univoice/voicetaskview.do`, 'get', { userid: user_id });
};

export const delVoice = async (prd_id: string) => {
  return await requestApi(`/univoice/deletevoice.do`, 'get', { prd_id });
};

export const upgradeVsd = async (user_id: string) => {
  return await requestApi(`/univoice/upgradevsd.do`, 'get', { userid: user_id });
};

export const upgradeGpu = async (user_id: string) => {
  return await requestApi(`/univoice/upgradegpu.do`, 'get', { userid: user_id });
};

export const toClaim = async (user_id: string) => {
  return await requestApi(`/univoice/claimtask.do`, 'get', { userid: user_id });
};

export const linkToIcp = async(userid:string, principalid:string) =>{
  return await requestApi(`/univoice/linkicp.do`,'post',{userid, principalid})
}
