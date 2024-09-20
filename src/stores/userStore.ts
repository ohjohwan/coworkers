// userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setTokenCookies, removeTokenCookies } from '@/utils/cookieUtils';

// user 인터페이스 추가
interface User {
  id: number;
  email: string;
  nickname: string;
  updatedAt: string;
  createdAt: string;
  image: string | null;
  teamId: string;
}

interface UserStoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setLogin: (user: User, atoken: string, rToken: string) => void;
  setLogout: () => void;
}

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      refreshToken: null,
      setLogin: (newUser: User, aToken: string, rToken: string) => {
        set({
          user: newUser,
          isLoggedIn: true,
          accessToken: aToken,
          refreshToken: rToken,
        });
        // 쿠키에 토큰 저장
        setTokenCookies(aToken, rToken);
      },
      setLogout: () => {
        set({
          user: null,
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
        });
        // 쿠키에서 토큰 삭제
        removeTokenCookies();
      },
    }),
    {
      name: 'User',
    },
  ),
);

export default useUserStore;
