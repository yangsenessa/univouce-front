import { useEffect, useState } from 'react';
import dogPng from '@/assets/dog.png';
import levelupPng from '@/assets/levelup.png';
import { cn } from '@/utils';

const SlideBar = ({
  percent,
  className = '',
  isLevel = false,
  level = 1,
  LTR = false,
}: {
  percent: number;
  className?: string;
  LTR?: boolean;
  isLevel?: boolean;
  level?: number;
}) => {
  const [direct, setDirect] = useState(false);

  useEffect(() => {
    setDirect(LTR);
  }, [LTR]);

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative h-4 w-full rounded-lg bg-[rgba(255,255,255,0.2)] shadow-[0_0_3px_0_rgba(255,255,255,0.2)] backdrop-blur-[3px]',
          className,
        )}
      >
        <div
          className={cn(
            'absolute top-[2px] h-[calc(100%-4px)] rounded-lg from-[#2FA8FF] via-[#37F3FF] to-[#E22EFF]',
            !direct ? 'bg-gradient-to-r' : 'bg-gradient-to-l',
          )}
          style={
            !direct
              ? { width: `calc(${percent}% - 4px)`, left: '2px' }
              : { width: `calc(${percent}% - 4px)`, right: '2px' }
          }
        ></div>

        <div
          className={cn(
            'absolute top-[50%] h-max w-max translate-y-[-50%]',
            !direct ? 'translate-x-[-50%]' : 'translate-x-[50%]',
            !isLevel ? 'translate-y-[-50%]' : 'translate-y-[-40%]',
          )}
          style={!direct ? { left: `${percent}%` } : { right: `${percent}%` }}
        >
          <img className="w-7" src={isLevel ? levelupPng : dogPng} alt="" />
          {isLevel && (
            <div className="absolute left-[50%] top-[50%] w-max translate-x-[-50%] translate-y-[-78%] scale-75 text-xs font-semibold text-[#2C5C9B]">
              LV{level}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideBar;
