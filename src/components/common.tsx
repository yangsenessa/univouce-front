import { CheckSmall, Right } from '@icon-park/react';
import WebApp from '@twa-dev/sdk';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { finishTask } from '@/api/apis';
import rightBg from '@/assets/check.png';
import coinPng from '@/assets/coin.png';
import delSvg from '@/assets/svg/del.svg';
import playSvg from '@/assets/svg/play.svg';
import suspendSvg from '@/assets/svg/suspend.svg';
import voicePng from '@/assets/voice.png';
import { cn } from '@/utils';

export const CommonListItem = ({
  item,
  hideAction = false,
  customeClass = '',
  customeIconClass = '',
  user,
}: {
  item: any;
  hideAction?: boolean;
  customeClass?: string;
  customeIconClass?: string;
  user?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [isComplate, setComplate] = useState(item.status === 'FINISH');

  useEffect(() => {
    !isComplate && setComplate(item.status === 'FINISH');
  }, [isComplate]);

  const onTapTask = async () => {
    if (isComplate) return;

    setLoading(true);

    item.task_url && WebApp.openLink(item.task_url);

    // todo call api
    try {
      const res = await finishTask(user, item.task_id);
      console.log('🚀 ~ onTapTask ~ res:', res);

      setComplate(true);
      setLoading(false);
    } catch (error) {
      console.log('🚀 ~ onTapTask ~ error:', error);
      setLoading(false);
      message.error('something wrong, please try again');
    }
  };

  return (
    <div
      onClick={() => !hideAction && onTapTask()}
      className={cn(
        'my-4 flex min-h-16 w-full cursor-pointer items-center justify-between gap-x-3 rounded-lg bg-[rgba(255,255,255,0.14)] px-3 py-3 shadow-[0_0_6px_0_rgba(255,255,255,0.4)] backdrop-blur-[3px]',
        customeClass,
      )}
    >
      <div className={cn('w-8', customeIconClass)}>
        <img src={item.logo || item.icon} alt="" />
      </div>
      <div className="flex flex-1 flex-col items-start justify-center gap-y-1 text-sm">
        <div>{item.task_desc}</div>
        <div className="flex items-center justify-center gap-x-1 text-xs text-[#FFC925]">
          <img className="w-4" src={coinPng} alt="coin" />+{item.rewards}
        </div>
      </div>
      <div className={`flex items-center justify-center gap-x-2 ${hideAction ? 'hidden' : ''}`}>
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : isComplate ? (
          <div className="relative flex h-5 w-5 items-center justify-center">
            <img src={rightBg} alt="" className="absolute h-full w-full" />
            <CheckSmall theme="filled" size="16" strokeWidth={3} className="relative z-10" />
          </div>
        ) : (
          <Right theme="outline" size="24" strokeWidth={3} />
        )}
      </div>
    </div>
  );
};

export const FriendListItem = ({ item }: { item: any }) => {
  return (
    <div className="my-4 flex min-h-16 w-full cursor-pointer items-center justify-between gap-x-3 rounded-lg bg-[rgba(255,255,255,0.14)] px-3 py-2 shadow-[0_0_6px_0_rgba(255,255,255,0.4)] backdrop-blur-[3px]">
      <div className="w-12">
        <img src={item.avatar} alt="" />
      </div>
      <div className="flex flex-1 flex-col items-start justify-center gap-y-1 text-sm font-medium">
        <div>{item.name}</div>
      </div>
      <div className="flex items-center justify-center gap-x-1 text-sm">
        <img className="w-5" src={coinPng} alt="coin" />+{item.coin}
      </div>
    </div>
  );
};

export const VoiceListItem = ({
  item,
  index,
  onDelete,
}: {
  item: any;
  index: number;
  onDelete: (item: any, index: number) => void;
}) => {
  const audioRef = useRef<any>();
  // 播放，暂停
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!item && !item.file_obj) return;

    var urlstr = item.file_obj;
    var re = /http/gi;
    var newstr = urlstr.replace(re, "https");
    console.log('File url:', newstr)

    //audioRef.current = new Audio(item.file_obj);
    audioRef.current = new Audio(newstr);
    audioRef.current.preload = "metadata";
    audioRef.current.autoplay = true;
    audioRef.current.type = "audio/wav"

    if (audioRef.current == null) {
      console.error('Audio ref error!');
    }

    audioRef.current.onloadeddata = () => {
      console.log('onloadeddata done!!!')
    }

    audioRef.current.onload = () => {
      console.log('onload done!!!')
    }

    audioRef.current.onloadstart = () => {
      console.log('onloadstart done!!!')
    }

    audioRef.current.onloadedmetadata = () => {
      console.log('onloadedmetadata exec!!!')
      const time = audioRef.current.duration;

      console.log('onloadedmetadata time', time);
      time && setDuration(time);
    };

    audioRef.current.onloadeddata = () => {
      console.log('onloadeddata exec!!!')
      const time = audioRef.current.duration;

      console.log('onloadeddata time', time);
      time && setDuration(time);
    }

    return () => {
      audioRef.current = null;
      setPlaying(false);
    };
  }, [item]);

  const playAudio = () => {
    audioRef.current.load()
    const audio = audioRef.current;

    playing ? audio.pause() : audio.play();
    setPlaying(!playing);

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setPlaying(false);
    };
  };

  return (
    <div>
      <div className="sm:mr-4 text-xs text-white front-lignt">
        -{item.gmt_create}
      </div>
      <div className="my-4 flex min-h-16 w-full cursor-pointer items-center justify-between gap-x-3 rounded-lg bg-[rgba(255,255,255,0.14)] px-3 py-2 shadow-[0_0_6px_0_rgba(255,255,255,0.4)] backdrop-blur-[3px]">
        <div className="relative h-12 w-12 cursor-pointer" onClick={() => playAudio()}>
          <img src={item.icon || voicePng} alt="" />

          <div className="absolute top-0 flex h-full w-full items-center justify-center">
            <img src={playing ? suspendSvg : playSvg} alt="" />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start justify-center gap-y-1 text-sm">
          <div className="flex w-full items-center justify-start gap-x-2">
            <progress
              className="progress progress-primary w-[55%] max-w-[200px]"
              value={currentTime && duration ? _.round((currentTime / duration) * 100, 2) : 0}
              max="100"
            ></progress>
            {_.round(duration, 2)}s
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-[22px] cursor-pointer" onClick={() => onDelete(item, index)}>
            <img src={delSvg} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
