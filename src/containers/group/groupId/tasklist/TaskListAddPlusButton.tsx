import { IconPlus } from '@/assets/IconList';
import TaskCreateModal from '@/components/modal/TaskCreateModal';
import TooltipWrapper from '@/components/tooltip/TooltipWrapper';
import useQueryParameter from '@/hooks/useQueryParameter';
import useModalStore from '@/stores/ModalStore';

function TaskListAddPlusButton() {
  const { setModalOpen } = useModalStore();

  const { groupId } = useQueryParameter();

  return (
    <TooltipWrapper
      message='새로운 목록을 추가하시겠습니까?'
      className='flex justify-center'
      position='top-[-60%]'
    >
      <button
        type='button'
        onClick={() => setModalOpen(<TaskCreateModal groupId={groupId} />)}
        className='shadow-md bg-brand-primary hover:bg-interaction-hover text-white size-60 tablet:size-80 rounded-12 flex items-center justify-center'
        aria-label='새로운 목록 추가 버튼'
      >
        <IconPlus width={32} height={32} />
      </button>
    </TooltipWrapper>
  );
}

export default TaskListAddPlusButton;
