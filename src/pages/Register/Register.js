import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginFormPage as RegisterFormPage, ProFormCheckbox, ProFormText} from '@ant-design/pro-components';
import {Tabs} from 'antd';
import {Link} from "react-router-dom";
import {useFetch} from "use-http";
import {LARAVEL_API_REGISTER, LARAVEL_API_URL} from "../../common/constants";
import {useState} from "react";
import Swal from "sweetalert2";

const Register = () => {
    const [user, setUser] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const {post} = useFetch(`${LARAVEL_API_URL}`)

    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });

    const handleOnFinish = (values) => {
        register(values)
            .then((res) => {
                if (res.is_error) {
                    toast.fire({
                        icon: 'error',
                        title: JSON.stringify(res.data.errors),
                    });

                    setFormErrors(res.data.errors);
                    return;
                }

                toast.fire({
                    icon: 'success',
                    title: res.data.message,
                });
                setUser(res.data.user)
                window.location.href = '/login'
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                localStorage.setItem('user', JSON.stringify(user));
            });
    };

    const register = async (values) => {
        return await post(`${LARAVEL_API_REGISTER}`, values);
    };

    return (
        <div
            style={{
                backgroundColor: 'white',
                height: 'calc(100vh - 48px)',
                margin: -24,
            }}
        >
            <RegisterFormPage
                backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
                logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
                title="Innoscripta News"
                subTitle="Take Home Assignment"
                submitter={{
                    searchConfig: {
                        submitText: 'Register',
                    },
                }}
                onFinish={handleOnFinish}
            >
                <Tabs
                    centered
                >
                    <Tabs.TabPane key={'register'} tab={'Register'}/>
                </Tabs>
                <ProFormText
                    name="name"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'Full name'}
                    rules={[
                        {
                            required: true,
                            message: 'Full name cannot be empty.',
                        },
                        {
                            type: 'string',
                            message: 'Email address is invalid.',
                        },
                        {
                            min: 3,
                            message: 'Full name must be at least 3 characters.',
                        }
                    ]}
                />
                <ProFormText
                    name="email"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'Email address'}
                    rules={[
                        {
                            validator: async () => {
                                if (formErrors.email) {
                                    const prom = Promise.reject(formErrors.email[0])
                                    setFormErrors({})
                                    return prom
                                }
                                return Promise.resolve()
                            },
                        },
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
                <ProFormText.Password
                    name="password_confirmation"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined className={'prefixIcon'}/>,
                    }}
                    placeholder={'Password confirmation'}
                    rules={[
                        {
                            required: true,
                            message: 'Password confirmation cannot be empty.',
                        },
                        {
                            min: 8,
                            message: 'Password confirmation must be at least 8 characters.',
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
            </RegisterFormPage>
        </div>
    );
};

export default Register;