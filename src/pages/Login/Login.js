import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginFormPage, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Tabs} from 'antd';
import {Link} from "react-router-dom";
import {useFetch} from "use-http";
import {LARAVEL_API_LOGIN, LARAVEL_API_URL} from "../../common/constants";
import {useCallback, useEffect, useState} from "react";

const Login = () => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState('');
    const {post, response} = useFetch(`${LARAVEL_API_URL}`)

    if (user !== null || token !== null) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', token);
    }
    const handleOnFinish = (values) => {
        login(values);
    };

    const login = useCallback(async (values) => {
        const login = await post(`${LARAVEL_API_LOGIN}`, values)
        if (response.ok) {
            setUser(login.data.user)
            setToken(login.data.access_token)
            console.log(login)
        }
    }, [post, response])

    useEffect(() => {
        if (token !== '') {
            window.location.href = '/'
        }
    }, [token])

    return (
        <div
            style={{
                backgroundColor: 'white',
                height: 'calc(100vh - 48px)',
                margin: -24,
            }}
        >
            <LoginFormPage
                backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
                logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                title="Innoscripta News"
                subTitle="Take Home Assignment"
                submitter={{
                    searchConfig: {
                        submitText: 'Login',
                    },
                }}
                onFinish={handleOnFinish}
            >
                <Tabs
                    centered
                >
                    <Tabs.TabPane key={'login'} tab={'Login'}/>
                </Tabs>
                <ProFormText
                    name="email"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'Email address'}
                    rules={[
                        {
                            required: true,
                            message: 'Email address cannot be empty.',
                        },
                        {
                            type: 'email',
                            message: 'Email address is invalid.',
                        }
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'Password'}
                    rules={[
                        {
                            required: true,
                            message: 'Password cannot be empty.',
                        },
                        {
                            min: 8,
                            message: 'Password must be at least 8 characters.',
                        }
                    ]}
                />
                <div
                    style={{
                        marginBlockEnd: 24,
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        Remember me
                    </ProFormCheckbox>
                    <Link
                        style={{
                            float: 'right',
                        }}
                        to="/register">
                        Register
                    </Link>
                </div>
            </LoginFormPage>
        </div>
    );
};

export default Login;