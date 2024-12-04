import { useEffect, useState, useRef } from 'react';
import ShowNumber from '@/utils/number';
import coinPng from '@/assets/coin.png';
import userAvatarPng from '@/assets/use-avatar.png';
import icpIdentifyPng from '@/assets/icp.png';
import {linkToIcp}  from '@/api/apis';
import { cn } from '@/utils';
import { UserOutlined } from '@ant-design/icons';
import { Button, Modal, Input } from 'antd';




export const TopBar = ({ info, user }: { [propName: string]: any }) => {
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [principalVal, setPrincipalVal] = useState('');

  useEffect(() => {
    setName(user?.username || user?.first_name);
    setBalance(Number(info?.balance || 0));
  }, [info, user]);

  const inputPrincipal = useRef(null);

  const getPrincipalValue = (event: { target: { value: any } }) => {
    setPrincipalVal(event.target.value);
  };

  const submitPrincipalId = async ()=>{
    try{
      const res = await linkToIcp(user.id,principalVal);
      if (res.res_code === 'FAIL') {
        alert(res.res_msg || 'something wrong, please try again');
        return;
      }
      alert("Success")
      closeIcpModal();
    }  catch (error) {
      console.log('🚀 ~ bind icp ~ error:', error);
      alert('Network error,please check your link')
    }
    
  }



  const openIcpModal = () => {
    setOpenModal(true)
  }

  const closeIcpModal = () => {
    setOpenModal(false)
  }

  const modalStyles = {
    header: {
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
      borderTop: '0.5px solid #333',
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
          <div>Link wallet</div>
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
      <Modal
        title={<p>Link to your ICP wallet</p>}
        className="text-sm font-medium"
        styles={modalStyles}

        footer={
          <Button className="center" type="primary" onClick={submitPrincipalId} >
            Submit
          </Button>
        }
        open={openModal}
        onCancel={closeIcpModal}
      >
        <Input size="large" placeholder="Copy and paste your principal id here" value={principalVal} prefix={<UserOutlined />}
          ref={inputPrincipal} onChange={getPrincipalValue} />
      </Modal>
    </div>
  );
};
