import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Token ������ �����Ͽ� ����� �� �ֽ��ϴ�.
interface DecodedToken {
  exp: number;
}

// �������� ��ū�� ����Ͽ� �׼��� ��ū ����
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('�������� ��ū�� �����ϴ�.');

  try {
    const response = await axios.post('/auth/refresh', { refreshToken });
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

  const decodedToken = jwt_decode<{ exp: number }>(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}
