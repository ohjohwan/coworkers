import DetailContent from '@/containers/board/detailBoard/detailContent/detailContent';
import CommentList from '@/containers/board/detailBoard/comment/commnetList/commentList';
import AddComment from '@/containers/board/detailBoard/addComment/addComment';
import { useRouter } from 'next/router';

function ArticleDetailPage() {
  const router = useRouter();
  const { boardId } = router.query;

  // boardId를 바로 number로 변환
  const numericBoardId = Number(boardId);

  return (
    <main className='main-container relative mt-116'>
      <DetailContent boardId={numericBoardId} />
      <AddComment boardId={numericBoardId} />
      <CommentList articleId={numericBoardId} limit={10} />
    </main>
  );
}

export default ArticleDetailPage;
