import { useEffect, useState,useRef } from 'react';
import ShowNumber from '@/utils/number';
import coinPng from '@/assets/coin.png';
import userAvatarPng from '@/assets/use-avatar.png';
import icpIdentifyPng from '@/assets/icp.png';
import { cn } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Button, Modal,Input } from 'antd';




export const TopBar = ({ info, user }: { [propName: string]: any }) => {
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [principalVal,setPrincipalVal] = useState('');

  useEffect(() => {
    setName(user?.username || user?.first_name);
    setBalance(Number(info?.balance || 0));
  }, [info, user]);

  const inputPrincipal = useRef(null);

  const getPrincipalValue = (event: { target: { value: any } }) => {
    setPrincipalVal(event.target.value);
  };

  const showIcpModal =  () => {
    setOpenModal(!openModal);
  };

  const openIcpModal =() =>{
    setOpenModal(true)
  }

  const modalStyles = {
    header: {
      borderLeft: `5px solid`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    body: {
      boxShadow: 'inset 0 0 5px #999',
      borderRadius: 5,
    },
    mask: {
      backdropFilter: 'blur(10px)',
    },
    footer: {
      borderTop: '1px solid #333',
    },
    content: {
      boxShadow: '0 0 30px #999',
    },
  };

  return (
    // fixed top-0 z-[100]
    <div className="navbar w-full px-3">
      <div className="navbar-start">
        <div className="flex h-[34px] items-center justify-center gap-x-1 rounded-[30px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.18)] px-4 text-sm text-[#fff]">
          <img className="ml-[-8px] mr-2 w-6" src={userAvatarPng} alt="wallet" />
          <div>{name}</div>
        </div>
      </div>
      <div className="navbar-center" onClick={openIcpModal}>
        <div className="flex h-[34px] items-center justify-center gap-x-1 rounded-[30px] border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.18)] px-4 text-sm text-[#fff]">
          <img className="ml-[-8px] mr-2 w-6" src={icpIdentifyPng} alt="wallet" />
          <div>Link your Icp wallet</div>
        </div>
        <Modal
          title={<p>Loading Modal</p>}
          className="text-sm font-medium"
          styles={modalStyles}
          
          footer={
            <Button className="center" type="primary" onClick={showIcpModal}>
              Submit
            </Button>
          }
          open={openModal}
          onCancel={showIcpModal}
        >
        <Input size="large" placeholder="large size" value={principalVal} prefix={<UserOutlined/>} 
              ref={inputPrincipal} onChange={getPrincipalValue}/>
        </Modal>
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
