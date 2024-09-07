import { useEffect, useState } from 'react';
import ShowNumber from '@/utils/number';
import coinPng from '@/assets/coin.png';
import userAvatarPng from '@/assets/use-avatar.png';
import { cn } from '@/utils';

export const TopBar = ({ info, user }: { [propName: string]: any }) => {
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    setName(user?.username || user?.first_name);
    setBalance(Number(info?.balance || 0));
  }, [info, user]);

  return (
    // fixed top-0 z-[100]
    <div className="navbar w-full px-3">
      <div className="navbar-start">
        <div className="flex h-[34px] items-center justify-center gap-x-1 rounded-[30px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.18)] px-4 text-sm text-[#fff]">
          <img className="ml-[-8px] mr-2 w-6" src={userAvatarPng} alt="wallet" />
          <div>{name}</div>
        </div>
      </div>

      <div className="navbar-end">
        <div className="flex h-[34px] items-center justify-center gap-x-1 rounded-[30px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.18)] px-4 py-[6px] text-xs text-[#FFC925]">
          <img className="w-[22px]" src={coinPng} alt="coin" />+
          <ShowNumber
            className={cn('text-sm font-medium')}
            value={{
              value: `${balance}`,
              scale: 2,
              thousand: { symbol: ['M', 'K'] },
            }}
          />
        </div>
      </div>
    </div>
  );
};
