import { IconSecession } from '@/assets/IconList';
import MemberDeleteModal from '@/components/modal/MemberDeleteModal';
import useModalStore from '@/stores/ModalStore';

function UserSecessionButton() {
  const { setModalOpen } = useModalStore();

  return (
    <button
      type='button'
      onClick={() => setModalOpen(<MemberDeleteModal />)}
      className='text-status-danger flex gap-8 items-center'
    >
      <IconSecession /> <span>회원 탈퇴하기</span>
    </button>
  );
}

export default UserSecessionButton;
