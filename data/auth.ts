
/**
 * NOTE: Storing plain-text passwords in source code is a major security risk.
 * In a real-world application, you should use a secure authentication provider
 * or store hashed passwords in a database. This is for demonstration purposes only.
 */
type UserCredential = {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export const USER_CREDENTIALS: UserCredential[] = [
  {
    username: 'admin',
    password: 'r&dk1@@025',
    role: 'admin'
  },
  {
    username: 'mindx',
    password: '123',
    role: 'user'
  }
];
