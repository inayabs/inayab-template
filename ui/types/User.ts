type User = {
  first_name: string;
  last_name: string;
  email: string;
  roles: any;
};

type UserLogin = {
  email: string;
  password: string;
  twoFactorCode: string | null;
};

type UserResetRequest = {
  email: string;
};

type UserChangePassword = {
  new_password: string;
  confirm_password: string;
  token: string;
};

type UserUpdateTwoFactor = {
  two_factor: boolean;
};

type UserVerifyCode = {
  email: string;
  code: string;
};

type UserInfo = {
  first_name: string;
  last_name: string;
  email: string;
};

type UserPass = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

type UserGeneral = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
};
