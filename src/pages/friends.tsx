import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';
// import { Button } from '';
import { CommonListItem, FriendListItem } from '@/components/common';
import { inviteFriend, testUser } from '@/api/apis';
// import { Tabbar } from '@/components/tabbar';
// import avatarPng from '@/assets/avatar.png';
import giftPng from '@/assets/gift.png';
import addSvg from '@/assets/svg/add.svg';
import inviteSvg from '@/assets/svg/invite.svg';

const Friends = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user }: any = WebApp.initDataUnsafe;
  const currentUser = user ? user : testUser;
  // const initList = [
  //   {
  //     avatar: avatarPng,
  //     name: 'Follow our X account',
  //     coin: 2500,
  //     isComplete: false,
  //   },
  //   {
  //     avatar: avatarPng,
  //     name: 'Follow our X account',
  //     coin: 2500,
  //     isComplete: false,
  //   },
  //   {
  //     avatar: avatarPng,
  //     name: 'Daily reward',
  //     coin: 2500,
  //     isComplete: false,
  //   },
  //   {
  //     avatar: avatarPng,
  //     name: 'Join group',
  //     coin: 2500,
  //     isComplete: false,
  //   },
  // ];
  // const shareUrl = 'https://t.me/share/url?url=https://t.me/TorliBlogBot/univoice'; // 分享链接
  const [shareUrl, setShareUrl] = useState<string>('');
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState(0);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    initData();
  }, []);

  // init data
  const initData = async () => {
    // get share use list
    // setList(initList);

    try {
      setLoading(true);
      let result = await inviteFriend(currentUser?.id);
      console.log('🚀 ~ initData ~ result:', result);

      setLoading(false);
      if (result) {
        const { friend_info_group, rewards, task_desc, invite_url } = result;

        setList(friend_info_group || []);
        setShareUrl(invite_url || '');
        setRewards(rewards || 0);
        setTitle(task_desc || '');
      }
    } catch (error) {
      setLoading(false);
      console.log('🚀 ~ initData ~ error:', error);
      message.error('something wrong, please try again');
    }
  };

  const share = () => {
    WebApp.openTelegramLink(`https://t.me/share/url?url=${shareUrl}`);
  };

  const onCopySuccess = () => {
    messageApi.open({
      type: 'success',
      content: 'Copy Success!',
      className: 'text-[#fff]',
    });
  };

  return (
    <div className="h-full overflow-auto px-4 pb-20 pt-5">
      {contextHolder}

      <div className="text-center">
        <div className="mb-2 text-2xl font-bold">INVITE FRIENDS</div>
        <div className="text-xs text-[#fff] opacity-75">
          Score 5% of your buddies
          <br />+ an extra 1% from their referrals
        </div>
      </div>

      <div className="mt-10">
        <CommonListItem
          item={{
            icon: giftPng, // 顶部头像
            task_desc: title || 'Invite friends earn tokens', // 名称
            rewards: rewards,
          }}
          hideAction={true}
          customeClass="gap-x-3"
          customeIconClass="w-9"
        />
      </div>
      <div className="mb-2 mt-10 text-sm font-medium">{`List of your friends ${list.length ? `(${list.length})` : ''}`}</div>
      <div>
        {loading && (
          <div className="mt-5 flex items-center justify-center">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}
        <div className="">
          {!loading &&
            list.map((item, index) => {
              return <FriendListItem item={item} key={`item_keys_${index}`} />;
            })}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-x-2">
        <div className="flex-1">
          <button
            className="btn btn-square btn-primary btn-block border-none bg-[#36F]"
            onClick={() => share()}
            disabled={!shareUrl}
          >
            <img src={inviteSvg} alt="" />
            <span className="btn-primary text-base font-semibold text-[#fff]">Invite a friend</span>
          </button>
        </div>

        <CopyToClipboard text={shareUrl} onCopy={() => onCopySuccess()}>
          <button className="btn btn-square btn-primary border-none bg-[#36F]" disabled={!shareUrl}>
            <img src={addSvg} alt="" />
          </button>
        </CopyToClipboard>
      </div>

      {/* <Tabbar /> */}
    </div>
  );
};

export default Friends;
