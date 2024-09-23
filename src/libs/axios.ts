import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

// 리프레시 토큰을 사용하여 액세스 토큰 갱신
async function refreshAccessToken(): Promise<string> {
  const user = localStorage.getItem('User');

  let refreshToken;
  if (user) {
    const parseUser = JSON.parse(user);
    refreshToken = parseUser.state.refreshToken;
  }

  if (!refreshToken) throw new Error('리프레시 토큰이 없습니다.');

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      { refreshToken },
    );
    const { accessToken, newRefreshToken } = response.data;

    // 새로운 액세스 및 리프레시 토큰 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return accessToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('리프레시 토큰 갱신 실패:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('토큰 갱신 실패. 다시 로그인하세요.');
  }
}

// 요청 인터셉터: 액세스 토큰이 있으면 요청에 추가
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// 응답 인터셉터: 401 에러 발생 시 토큰 갱신 시도
instance.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 오류 발생 시 (만료된 액세스 토큰 처리)
    // eslint-disable-next-line no-underscore-dangle
    if (error.response?.status === 401 && !originalRequest._retry) {
      // eslint-disable-next-line no-underscore-dangle
      originalRequest._retry = true; // 무한 루프 방지

      try {
        // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져옴
        const newAccessToken = await refreshAccessToken();

        // 요청 헤더에 새로운 액세스 토큰을 추가하여 다시 시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // eslint-disable-next-line no-underscore-dangle
        return await axios(originalRequest);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('토큰 갱신 후에도 요청 실패:', err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error); // 다른 오류는 그대로 반환
  },
);

export default instance;
