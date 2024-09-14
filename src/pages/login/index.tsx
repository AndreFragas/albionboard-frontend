import {ReactNode} from 'react';
import {LoginComponent} from 'src/#albionboard/login';
import BlankLayout from 'src/@core/layouts/BlankLayout';

const Login = () => {
  return <LoginComponent />;
};

Login.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

Login.guestGuard = true;

export default Login;
