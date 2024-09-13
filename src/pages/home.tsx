import WebApp from '@twa-dev/sdk';
import { useCountDown } from 'ahooks';
import _ from 'lodash';
// import Recorder from 'js-audio-recorder';
import { useEffect, useRef, useState } from 'react';
import message from 'antd/es/message';
import SlideBar from '@/components/slide-bar';
// import { Tabbar } from '@/components/tabbar';
import { TopBar } from '@/components/topBar';
import { getCommonInfo, requestUserInfo, testUser, toClaim } from '@/api/apis';
import alermPng from '@/assets/alerm.png';
import { Close } from '@icon-park/react';
import levelPng1 from '@/assets/level1.png';
import levelPng2 from '@/assets/level2.png';
import { Popconfirm, Drawer } from 'antd';
import { useReactMediaRecorder } from "react-media-recorder-2";


function HomePage() {
  const videoRef = useRef(null);
  const [count, setCount] = useState(0); // 当前数量
  const [allCount, setAllCount] = useState(0); // 总量
  const [claim, setClaim] = useState(false);
  const [open, setOpen] = useState(false);
  const [isRecording,setIsRecording] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(true);
  const [leftTime, setLeftTime] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { user }: any = WebApp.initDataUnsafe;
  const currentUser = user ? user : testUser;

  const [_countDown, formattedRes] = useCountDown({
    leftTime: leftTime,
    // targetDate,
    interval: 1000,
    onEnd: () => {
      setClaim(true);
      setShouldPlay(false);
    },
  });

  useEffect(() => {
    // 初始化mini app 样式
    WebApp.enableClosingConfirmation();
    WebApp.setBackgroundColor('#02161C');
    WebApp.setHeaderColor('bg_color');
    // WebApp.setHeaderColor('#010101');
    WebApp.expand();

    console.log('WebApp.viewportHeight', WebApp.viewportHeight, WebApp.initData, currentUser);

    getCommon();
    init();
    // setClaim(true);
    // setLeftTime(4 * 60 * 60 * 1000);
  }, []);

  const onClaim = async () => {
    if (!testUser && !WebApp.initData) {
      message.error('Please open it in Telegram！');
      return;
    }

    // call api
    try {
      const res = await toClaim(currentUser?.id);

      if (res.res_code === 'FAIL') {
        message.error(res.res_msg || 'something wrong, please try again');
        return;
      }

      setClaim(false);
      setShouldPlay(true);
      init();
      //setLeftTime(4 * 60 * 60 * 1000);
    } catch (error) {
      console.log('🚀 ~ onClaim ~ error:', error);
    }
  };

  const init = async () => {
    try {
      if (!testUser && !WebApp.initData) {
        message.error('Please open it in Telegram！');
        return;
      }

      const result = await requestUserInfo(currentUser.id);
      console.log('🚀 ~ init ~ result:', result);

      if (result) {
        const { claim_info, user_acct_info } = result;

        // if have clain time to start, else false
        claim_info?.wait_time &&
          Number(claim_info?.wait_time) >= 0 &&
          setLeftTime(Number(claim_info?.wait_time) * 1000);
        setClaim(claim_info?.wait_time && Number(claim_info?.wait_time) <= 0 ? true : false);
        setShouldPlay(claim_info?.wait_time && Number(claim_info?.wait_time) > 0 ? false : true);
        setUserInfo(user_acct_info);
      }
      // acountStore.setToken(user?.id);
    } catch (error) {
      console.debug('🚀 ~ init ~ error:', error);
      message.error('something wrong, please try again');
    }
  };

  const getCommon = async () => {
    try {
      const res = await getCommonInfo();

      if (res) {
        const { communication_info } = res;
        console.log('🚀 ~ getCommonInfo ~ communication_info:', communication_info);
        setCount(Number(communication_info?.curr_num));
        setAllCount(Number(communication_info?.target));
      }
    } catch (error) {
      console.debug('🚀 ~ init ~ error:', error);
    }
  };

  const hiddenApp = () => {
    WebApp.openTelegramLink("https://t.me/univoice2bot?start");
    // WebApp.switchInlineQuery('start');
    WebApp.close();
  };

  const onClose = () => {
    setOpen(false);
  };

  const onOpenRecording = () => {
    setOpen(true);
  }

  const onStartRecording = () => {
    if(isRecording){
        stopRecording();
    }else {
        startRecording();
    }

    setIsRecording(!isRecording);
  };

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  async function convertMediaBlobUrlToBlob(mediaBlobUrl:any){
    try {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error al convertir mediaBlobUrl a Blob:", error);
      return null;
    }
  }

  return (
    <div className="h-full">
      <video
        className="absolute z-0 h-full w-full object-cover"
        ref={videoRef}
        autoPlay
        preload="auto"
        muted
        loop
        id="bg"
        playsInline={true}
      >
        <source src={'/bgVideo1.mp4'} type="video/mp4" />
      </video>

      <div className="relative z-10 h-full pb-20">
        <TopBar info={userInfo} user={user ? user : testUser} />

        <div className="p-3">
          <div className="mb-3 flex w-full items-center justify-between text-xs font-medium text-[#fff]">
            <div>Soul: {count}</div>
          </div>
          <div className="w-full">
            <SlideBar percent={_.round((count / allCount) * 100, 0)} />
          </div>

          <div className="pt-10"></div>
        </div>

        <div className="fixed bottom-1/3 right-0">
          {/* {claim && (
            <div className="flex h-[34px] items-center justify-center gap-x-1 rounded-l-[30px] border border-[rgba(255,255,255,0.2)] bg-gradient-to-r from-[rgba(255,255,255,0.26)] to-[rgba(255,255,255,0.00)] px-2 text-sm text-[#fff]">
              <img className="w-[22px]" src={alermPng} alt="coin" />+
              {_.padStart(formattedRes.hours, 2, '0')}:{_.padStart(formattedRes.minutes, 2, '0')}:
              {_.padStart(formattedRes.seconds, 2, '0')}
            </div>
          )} */}

          {claim && (
            <div
              className="flex h-[34px] cursor-pointer items-center justify-center gap-x-2 rounded-l-[30px] border border-r-0 border-[rgba(255,255,255,0.2)] bg-gradient-to-r from-[rgba(255,255,255,0.26)] to-[rgba(255,255,255,0.00)] px-3 text-sm text-[#fff]"
              onClick={() => onClaim()}
            >
              <img className="w-7" src={alermPng} alt="coin" />
              Claim
            </div>
          )}
        </div>

        <div className="item-center fixed bottom-[18%] left-0 flex w-full justify-center">
        
          <button
              className="btn btn-square btn-primary w-[228px] rounded-[30px] border-none bg-gradient-to-br from-[#1AEEC7] via-[#3284FF] to-[#DC3FFF]"
              onClick={()=>onOpenRecording()}
          >
              {shouldPlay && (
                <span className="btn-primary text-base font-semibold text-[#fff]">
                  Click to start Recording
                </span>
              )}
              {!shouldPlay && (
                <span className="btn-primary text-base font-semibold text-[#fff]">
                  {_.padStart(formattedRes.hours, 2, '0')}h {_.padStart(formattedRes.minutes, 2, '0')}
                  m {_.padStart(formattedRes.seconds, 2, '0')}s<br />Click to bot
                </span>
              )}
          </button>
        </div>
      </div>

      {/* <Tabbar /> */}
      <Drawer
        closeIcon={false}
        placement="bottom"
        closable={false}
        onClose={onClose}
        open={open}
        style={{
          background: '#24232A',
          color: '#fff',
          borderRadius: '20px 20px 0 0',
          height: '450px',
        }}
        bodyStyle={{ padding: '14px' }}
      >
        <div className="relative">
          <div className="absolute left-0 top-[20px] z-0 flex h-[200px] w-full items-center justify-center">
            <div className="h-[120px] w-1/2 rounded-full bg-gradient-to-tr from-[#E43FFF] to-[#3284FF] opacity-75 blur-[50px]"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="absolute right-0 top-[-5px]" onClick={() => onClose()}>
              <Close theme="outline" size="18" strokeWidth={3} />
            </div>
            <div className="mt-2 text-xl font-medium">Upload voice</div>
            <div className="item-center flex h-[160px] justify-center">
              <img src={isRecording ? levelPng1 : levelPng2} alt="" className="w-[160px]" />
            </div>

            <div>
                <button
                     className="btn btn-square btn-primary w-[228px] rounded-[30px] border-none bg-gradient-to-br from-[#1AEEC7] via-[#3284FF] to-[#DC3FFF]"
                     onClick={() => onStartRecording()}
                >
                  {isRecording && (
                       <span className="btn-primary text-base font-semibold text-[#fff]">
                        Click to stop Recording
                       </span>
                   )}
                  {!isRecording && (
                        <span className="btn-primary text-base font-semibold text-[#fff]">
                         Click to start Recording
                        </span>
                   )}
                </button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default HomePage;
