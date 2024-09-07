// import { Home } from '@icon-park/react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import activePng from '@/assets/active.png';
// import centerSvg from '@/assets/svg/center.svg';
import earn1Svg from '@/assets/svg/earn.svg';
import earnSvg from '@/assets/svg/earn.svg';
import friend1Svg from '@/assets/svg/friend1.svg';
import friendSvg from '@/assets/svg/friend.svg';
import home1Svg from '@/assets/svg/home1.svg';
import homeSvg from '@/assets/svg/home.svg';
import task1Svg from '@/assets/svg/task1.svg';
import taskSvg from '@/assets/svg/task.svg';
import { cn } from '@/utils';

export const Tabbar = () => {
  const videoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [active, setActive] = useState('/swap');
  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <div className="btm-nav z-50 bg-[#24232A] text-sm font-medium">
      {contextHolder}
      <button
        className={`${active === '/' ? '' : 'text-[#999]'}`}
        onClick={() => navigate('/', { replace: true })}
      >
        <div className="relative">
          <div
            className={cn(
              'absolute left-0 top-0 h-full w-full scale-[135%] opacity-0',
              active === '/' ? 'opacity-100' : '',
            )}
          >
            <img className="w-full" src={activePng} alt="" />
          </div>
          <div className="relative z-10 flex w-full flex-col items-center justify-center">
            <img className="w-5" src={active === '/' ? home1Svg : homeSvg} alt="home" />
            Home
          </div>
        </div>
      </button>
      <button
        className={`${active.startsWith('/tasks') ? '' : 'text-[#999]'}`}
        onClick={() => navigate(`/tasks`, { replace: true })}
      >
        <div className="relative">
          <div
            className={cn(
              'absolute left-0 top-[7px] z-0 h-full w-full scale-[170%] opacity-0',
              active === '/tasks' ? 'opacity-100' : '',
            )}
          >
            <img className="w-full" src={activePng} alt="" />
          </div>
          <div className="relative z-10 flex w-full flex-col items-center justify-center">
            <img
              className="w-5"
              src={active.startsWith('/tasks') ? task1Svg : taskSvg}
              alt="task"
            />
            Task
          </div>
        </div>
      </button>
      <button
        className={`relative ${active.startsWith('/sounds') ? '' : 'text-[#999]'}`}
        onClick={() => navigate(`/sounds`, { replace: true })}
      >
        <div className="absolute top-[-25px] flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#24232A] p-1">
          {/* <img src={centerSvg} alt="" /> */}

          <video
            className="h-full w-full rounded-full object-cover"
            ref={videoRef}
            autoPlay
            preload="auto"
            muted
            loop
            id="bg"
            playsInline={true}
          >
            <source src={'/center.mp4'} type="video/mp4" />
          </video>
        </div>
      </button>
      <button
        className={`${active.startsWith('/earn') ? '' : 'text-[#999]'}`}
        onClick={() => {
          messageApi.open({
            type: 'info',
            content: 'coming soon',
            className: 'text-[#fff]',
          });
          return;
        }}
      >
        <div className="relative">
          <div
            className={cn(
              'absolute left-0 top-[7px] z-0 h-full w-full scale-[170%] opacity-0',
              active === '/earn' ? 'opacity-100' : '',
            )}
          >
            <img className="w-full" src={activePng} alt="" />
          </div>
          <div className="relative z-10 flex w-full flex-col items-center justify-center">
            <img className="w-5" src={active.startsWith('/earn') ? earn1Svg : earnSvg} alt="earn" />
            Earn
          </div>
        </div>
      </button>
      <button
        className={`${active.startsWith('/friends') ? '' : 'text-[#999]'}`}
        onClick={() => navigate(`/friends`, { replace: true })}
      >
        <div className="relative">
          <div
            className={cn(
              'absolute left-0 top-[-2px] z-0 h-full w-full scale-[130%] opacity-0',
              active === '/friends' ? 'opacity-100' : '',
            )}
          >
            <img className="w-full" src={activePng} alt="" />
          </div>
          <div className="relative z-10 flex w-full flex-col items-center justify-center">
            <img
              className="w-5"
              src={active.startsWith('/friends') ? friend1Svg : friendSvg}
              alt="friend"
            />
            Friend
          </div>
        </div>
      </button>
    </div>
  );
};
