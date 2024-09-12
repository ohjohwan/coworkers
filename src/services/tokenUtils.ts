import axios from '@/libs/axios';
import jwt_decode from 'jwt-decode';

// Token ������ �����Ͽ� ����� �� �ֽ��ϴ�.
interface DecodedToken {
  exp: number;
}

// �������� ��ū�� ����Ͽ� �׼��� ��ū ����
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('�������� ��ū�� �����ϴ�.');

  try {
    const response = await axios.post('/auth/refresh-token', { refreshToken });
    const { accessToken, newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error('�������� ��ū ���� ����:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('��ū ���� ����. �ٽ� �α����ϼ���.');
  }
}

// ��ū ���� ���� Ȯ��
export function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const decodedToken = jwt_decode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // ���� �ð��� �� ������ ��ȯ
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('��ū ���ڵ� ����:', error);
    return true;
  }
}
