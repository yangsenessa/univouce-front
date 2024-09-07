import { Close } from '@icon-park/react';
import WebApp from '@twa-dev/sdk';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Drawer, message } from 'antd';
import { VoiceListItem } from '@/components/common';
import SlideBar from '@/components/slide-bar';
// import { Tabbar } from '@/components/tabbar';
import ShowNumber from '@/utils/number';
import {
  delVoice,
  getVoiceTasks,
  requestUserInfo,
  testUser,
  upgradeGpu,
  upgradeVsd,
} from '@/api/apis';
import coinPng from '@/assets/coin.png';
import durationPng from '@/assets/duration.png';
import gpuPng from '@/assets/gpu.png';
import levelPng1 from '@/assets/level1.png';
import levelPng2 from '@/assets/level2.png';
import levelSuccessPng from '@/assets/level-success.png';
import closeSvg from '@/assets/svg/close.svg';
import walletSvg from '@/assets/svg/wallet.svg';
import trainingPng from '@/assets/training.png';
import upPng from '@/assets/up.png';
// import voicePng from '@/assets/voice.png';
import vsdPng from '@/assets/vsd.png';
import { cn } from '@/utils';

const Sounds = () => {
  // const [messageApi, contextHolder] = message.useMessage();

  const [balance, setBalance] = useState(0);

  const { user }: any = WebApp.initDataUnsafe;
  const currentUser = user ? user : testUser;
  const [open, setOpen] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const [list, setList] = useState([]);
  const [type, setType] = useState('VSD');

  const [loading, setLoading] = useState(false);
  const [gpuLevel, setGpuLevel] = useState({
    top_level: 6,
    level: 1,
    upgrade_cost: 50000,
    times: 3,
  });

  const [vsdLevel, setVsdLevel] = useState({
    top_level: 12,
    level: 1,
    upgrade_cost: 45000,
    times: 45,
  });

  useEffect(() => {
    initUser();
    initData();
  }, []);

  const initUser = async () => {
    try {
      if (!testUser && !WebApp.initData) {
        message.error('Please open it in Telegram！');
        return;
      }

      const result = await requestUserInfo(currentUser.id);
      console.log('🚀 ~ init ~ result:', result);

      if (result) {
        const { user_acct_info } = result;

        setBalance(user_acct_info?.balance);
      }
      // acountStore.setToken(user?.id);
    } catch (error) {
      console.debug('🚀 ~ init ~ error:', error);
      message.error('something wrong, please try again');
    }
  };

  // init data
  const initData = async () => {
    // TODO get use sounds list
    try {
      if (!testUser && !WebApp.initData) {
        message.error('Please open it in Telegram！');
        return;
      }
      setLoading(true);
      const result = await getVoiceTasks(currentUser.id);
      console.log('🚀 ~ init ~ result:', result);

      setLoading(false);

      if (result) {
        const { producer_group, GPU_LEVEL, VSD_LEVEL } = result;

        setGpuLevel(GPU_LEVEL);
        setVsdLevel(VSD_LEVEL);
        setList(producer_group || []);
      }
    } catch (error) {
      setLoading(false);
      console.debug('🚀 ~ init ~ error:', error);
      message.error('something wrong, please try again');
    }
  };

  const onDelete = async (item: any, index: number) => {
    try {
      await delVoice(item.prd_id);

      message.success('Delete success');
      list.splice(index, 1);
      setList([...list]);
    } catch (error) {
      console.log('🚀 ~ onDelete ~ error:', error);
      message.error('something wrong, please try again');
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = (key: string) => {
    setType(key);
    if (type === 'GPU') {
      if (Number(gpuLevel.top_level) <= Number(gpuLevel.level)) {
        message.warning("You are on the top level");
      } else {
        setOpen(true);
      }
      
    }
    if (type === 'VSD') {
      if (Number(vsdLevel.top_level) <= Number(vsdLevel.level)) {
        message.warning("You are on the top level");
      } else {
        setOpen(true);
      }
    }
  };

  const onLevelUp = async () => {
    try {
      // TODO level up api
      if (type === 'GPU') {
        if (Number(gpuLevel?.upgrade_cost) > balance) {
          message.error('Not enough VOICE');
          return;
        }

        const resultGpu = await upgradeGpu(currentUser?.id);
        console.log('🚀 ~ onLevelUp ~ result1:', resultGpu);

        if(resultGpu.data?.res_code === 'FAIL'){

          message.error('Upgrade duration time fail!');
          return;
        }

      }

      if (type === 'VSD') {
        if (Number(vsdLevel?.upgrade_cost) > balance) {
          message.error('Not enough VOICE');
          return;
        }
        const resultVsd = await upgradeVsd(currentUser?.id);
        console.log('🚀 ~ onLevelUp ~ result1:', resultVsd);

        if(resultVsd.data?.res_code === 'FAIL'){
           message.error('Upgrade trainning time fail!');
           return;
        }
      }

      // success 之后刷新数据，关闭弹框，出现升级成功提示
      message.success('Upgrade success!!')
      setOpen(false);
      setShowMask(true);
      initData()
    } catch (error) {
      console.log('🚀 ~ onLevelUp ~ error:', error);
      setOpen(false);
      message.error('something wrong, please try again');
    }
  };

  return (
    <div className="h-full overflow-auto px-4 pb-20">
      <div className="flex items-center justify-between pt-5">
        <div>
          <div className="mb-2 text-sm font-medium">$VOICE</div>
          <div className="flex items-center justify-center gap-x-1 rounded-[30px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.18)] px-2 py-1 text-xs text-[#FFC925]">
            <img className="w-5" src={coinPng} alt="coin" />+
            <ShowNumber
              className={cn('text-xs')}
              value={{
                value: `${balance}`,
                scale: 2,
                thousand: { symbol: ['M', 'K'] },
              }}
            />
          </div>
        </div>
        <div>
          <img src={walletSvg} alt="wallet" />
        </div>
      </div>

      <div className="mt-10 flex h-max items-center justify-between">
        <div className="w-32 cursor-pointer" onClick={() => onOpen('GPU')}>
          <div className="relative">
            <img src={trainingPng} alt="" />

            <div className="absolute left-[-2%] top-[-30%]">
              <img className="w-1/2" src={gpuPng} alt="" />
            </div>

            <div className="absolute right-3 top-2">
              <div className="text-right text-sm font-bold">Training</div>
              <div className="text-right text-xs">
                {gpuLevel?.level}/{gpuLevel?.top_level}
              </div>
            </div>
            <div className="absolute bottom-2 flex items-center justify-center">
              <img className="w-1/2" src={upPng} alt="" />
            </div>
          </div>
        </div>
        <div className="w-32 cursor-pointer" onClick={() => onOpen('VSD')}>
          <div className="relative">
            <img src={durationPng} alt="" />

            <div className="absolute left-[-5%] top-[-15%]">
              <img className="w-1/2" src={vsdPng} alt="" />
            </div>

            <div className="absolute right-3 top-2">
              <div className="text-right text-sm font-bold">Duration</div>
              <div className="text-right text-xs">
                {vsdLevel?.level}/{vsdLevel?.top_level}
              </div>
            </div>
            <div className="absolute bottom-2 flex items-center justify-center">
              <img className="w-1/2" src={upPng} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-x-10">
        <SlideBar
          percent={_.round((Number(gpuLevel?.level) / Number(gpuLevel?.top_level)) * 100, 1)}
        />
        <SlideBar
          percent={_.round((Number(vsdLevel?.level) / Number(vsdLevel?.top_level)) * 100, 1)}
          LTR={true}
        />
      </div>

      <div className="mb-2 mt-10 text-sm font-medium">My Voices</div>
      <div>
        {loading && (
          <div className="mt-5 flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}
        <div>
          {!loading &&
            list.map((item, index) => {
              return (
                <VoiceListItem
                  item={item}
                  key={`item_keys_${index}`}
                  index={index}
                  onDelete={onDelete}
                />
              );
            })}
        </div>
      </div>

      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-screen bg-[rgba(0,0,0,0.6)] backdrop-blur-[5px]',
          showMask ? 'block' : 'hidden',
        )}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="relative flex w-full items-center justify-center">
            <div className="absolute left-[8px] top-[37%] w-full text-center text-2xl font-semibold text-white">
              LV {type === 'GPU' && gpuLevel && Number(gpuLevel?.top_level) > Number(gpuLevel?.level) && Number(gpuLevel?.level)}
              {type === 'VSD' && vsdLevel &&  Number(gpuLevel?.top_level) > Number(gpuLevel?.level) && Number(vsdLevel?.level)}
            </div>
            <img className="w-3/4" src={levelSuccessPng} alt="" />
          </div>
          <span className="mt-4 cursor-pointer" onClick={() => setShowMask(false)}>
            <img src={closeSvg} alt="" />
          </span>
        </div>
      </div>

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
            <div className="mt-2 text-xl font-medium">Level up</div>
            <div className="item-center flex h-[160px] justify-center">
              <img src={type === 'GPU' ? levelPng1 : levelPng2} alt="" className="w-[160px]" />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-medium">
                <div>
                  {`${type} LV:`} {type === 'GPU' ? gpuLevel?.level : vsdLevel?.level}
                </div>
                <div>
                  {type === 'GPU' ? gpuLevel?.level : vsdLevel?.level}/
                  {type === 'GPU' ? gpuLevel?.top_level : vsdLevel?.top_level}
                </div>
              </div>
              <div className="mt-5">
                <SlideBar
                  isLevel={true}
                  level={type === 'GPU' ? gpuLevel?.level : vsdLevel?.level}
                  percent={
                    type === 'GPU'
                      ? _.round((Number(gpuLevel?.level) / Number(gpuLevel?.top_level)) * 100, 1)
                      : _.round((Number(vsdLevel?.level) / Number(vsdLevel?.top_level)) * 100, 1)
                  }
                />
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center">
              <button
                className="btn btn-square btn-primary btn-block border-none bg-gradient-to-r from-[#E43FFF] to-[#3284FF]"
                onClick={() => onLevelUp()}
              >
                <img src={coinPng} alt="" />
                <span className="btn-primary text-base font-semibold text-[#fff]">
                  {type === 'GPU' ? gpuLevel?.upgrade_cost : vsdLevel?.upgrade_cost} VOICE
                </span>
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Sounds;
