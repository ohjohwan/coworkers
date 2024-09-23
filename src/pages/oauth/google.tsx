import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '@/libs/axios';
import useUserStore from '@/stores/userStore';

function GoogleOAuth() {
  const router = useRouter();
  const { code, state } = router.query; // URL에서 code와 state 추출
  const { setLogin } = useUserStore(); // 로그인 후 유저 정보를 저장할 상태 관리

  useEffect(() => {
    const fetchGoogleToken = async () => {
      if (code && state) {
        try {
          // 백엔드로 code를 전송하여 구글 토큰을 요청
          const response = await axios.post('/auth/signIn/google', {
            state: String(state),
            redirectUri: 'http://localhost:3000/oauth/google', // 구글에 등록한 리디렉트 URI
            token: String(code), // URL에서 추출한 code를 token으로 전송
          });

          const { user, accessToken, refreshToken } = response.data;

          // 유저 정보 및 토큰 저장
          setLogin(user, accessToken, refreshToken);

          // 성공적으로 로그인된 후 원하는 페이지로 리디렉션
          router.push('/');
        } catch (error) {
          console.error('Google OAuth 로그인 중 오류 발생:', error);
          // 오류가 발생한 경우 처리 (예: 오류 페이지로 이동)
          router.push('/auth/signin?error=google_login_failed');
        }
      }
    };

    fetchGoogleToken();
  }, [code, state, router, setLogin]);

  return (
    <div className='flex justify-center items-center h-screen'>
      <p>Google 로그인 처리 중...</p>
    </div>
  );
}

export default GoogleOAuth;
