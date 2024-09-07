// import { CheckOne, Right } from '@icon-park/react';
import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import message from 'antd/es/message';
import { CommonListItem } from '@/components/common';
import { getTaskList, testUser } from '@/api/apis';
// import { Tabbar } from '@/components/tabbar';
import alertPng from '@/assets/alert.png';
import tasksPng from '@/assets/tasks.png';
import telegramPng from '@/assets/telegram.png';
import twitterPng from '@/assets/twitter.png';

const Tasks = () => {
  const initList = [
    {
      task_id: 'FOLLOW-X',
      icon: twitterPng,
      title: 'Follow our X account',
      coin: 5000,
      isComplete: false,
    },
    {
      icon: telegramPng,
      title: 'Follow our Telegram account',
      coin: 5000,
      isComplete: false,
    },
    {
      icon: alertPng,
      title: 'Daily reward',
      coin: 5000,
      isComplete: false,
    },
    {
      icon: telegramPng,
      title: 'Join group',
      coin: 5000,
      isComplete: false,
    },
  ];
  const { user }: any = WebApp.initDataUnsafe;
  const currentUser = user ? user : testUser;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  // init data
  const initData = async () => {
    // get task list
    try {
      if (!testUser && !WebApp.initData) {
        message.error('Please open it in Telegram！');
        return;
      }
      setLoading(true);

      const result = await getTaskList(currentUser.id);
      console.log('🚀 ~ init ~ result:', result);
      setLoading(false);

      if (result?.add_tasks) {
        const newList = result?.add_tasks.map((item: any, idx: number) => {
          return {
            ...initList[idx],
            ...item,
          };
        });

        setList(newList || []);
        return;
      }

      setList([]);
    } catch (error) {
      setLoading(false);
      console.debug('🚀 ~ init ~ error:', error);
      message.error('something wrong, please try again');
    }
  };

  return (
    <div className="relative h-full overflow-auto px-4 pb-20 pt-14">
      <div className="absolute left-0 top-[-20px] z-0 flex h-[200px] w-full items-center justify-center">
        <div className="h-[120px] w-1/2 rounded-full bg-gradient-to-tr from-[#E43FFF] to-[#3284FF] opacity-75 blur-[50px]"></div>
      </div>
      <div className="text-center">
        <div className="relative z-10">
          <div className="flex items-center justify-center">
            <img src={tasksPng} alt="" className="w-28" />
          </div>
          <div className="mb-2 text-2xl font-bold">Tasks</div>
          <div className="text-xs text-[#fff] opacity-75">
            Some quick example text to build on the card title
            <br /> and make up the bulk of the card's content.
          </div>
        </div>
      </div>
      <div className="mb-2 mt-5 text-sm font-medium">Tasks list</div>
      <div className="w-full">
        {loading && (
          <div className="mt-5 flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}
        <div className="">
          {!loading &&
            list.map((item: any, index) => {
              return (
                <CommonListItem
                  customeIconClass={item?.task_id === 'FOLLOW-X' ? 'px-1' : ''}
                  item={item}
                  key={`item_keys_${index}`}
                  user={user || testUser}
                />
              );
            })}
        </div>
      </div>

      {/* <Tabbar /> */}
    </div>
  );
};

export default Tasks;
