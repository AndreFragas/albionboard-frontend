export type ErrCallbackType = (err: {[key: string]: string}) => void;

export type LoginParams = {
  email: string;
  senha: string;
  rememberMe?: boolean;
};

export type UserDataType = {
  activeFlag: boolean;
  created_at: string;
  email: string;
  id: string;
  name: string;
  password: string;
  phone: string;
  photoUrl: string;
  role: string;
  updated_at: string;
  userType: string;
  user_config: any;
};

export type AuthValuesType = {
  loading: boolean;
  logout: () => void;
  user: UserDataType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
  partnerMenuItems: PartnerMenuItems[] | null;
};

export interface Partner {
  payload: {
    partnerName: string;
    restToken: string;
    wsKey: string;
    activeFlag: boolean;
  };
}

export interface PartnerMenuItems {
  action: string;
  subject: string;
  title: string;
  children?: PartnerMenuItems[];
  path?: string;
  icon?: string;
  disabled?: boolean;
}
