import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Col, Drawer, Form, Input, Row, Space} from 'antd';
import './ProfileDrawer.css'
import PropTypes from "prop-types";
import {useFetch} from "use-http";
import {LARAVEL_API_ACCOUNT_CHANGE_PROFILE, LARAVEL_API_URL} from "../../../common/constants";
import Swal from "sweetalert2";

const ProfileDrawer = (UserData) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [user: {}, setUser] = useState({});
    const [newsSettings, setNewsSettings] = useState({});
    const [userSettings, setUserSettings] = useState({});
    const [parsedUser, setParsedUser] = useState({});
    const {post} = useFetch(`${LARAVEL_API_URL}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
        },
    });
    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });

    useEffect(() => {
        setUser(UserData.UserData);

        setUserSettings(UserData.UserData.settings);
        setNewsSettings(UserData.UserData.news_preferences);

    }, [UserData.UserData, UserData.UserData.settings, UserData.UserData.news_preferences]);

    const handleProfileSave = (values) => {
        const data = {
            name: values.name,
            news_preferences: {
                authors: values.authors.split(','),
                country: values.country,
                sources: values.sources.split(','),
                language: values.language,
                categories: values.category.split(','),
            },
            settings: {
                theme: values.theme === 'checked' ? 'dark' : 'light',
            }
        };

        post(`${LARAVEL_API_ACCOUNT_CHANGE_PROFILE}`, data)
            .then((response) => {
                if (response.is_error) {
                    toast.fire({
                        icon: 'error',
                        title: 'Error updating profile',
                    });
                    return;
                }

                toast.fire({
                    icon: 'success',
                    title: 'Profile updated successfully',
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const showDrawer = () => {
        setOpen(true);

        if (typeof user === 'object') {
            const parsed = {
                name: user.name,
                email: user.email,
                news_preferences: JSON.parse(user.news_preferences),
                settings: JSON.parse(user.settings)
            };

            setParsedUser(parsed);

        }
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showDrawer}>
                Profile
            </Button>
            <Drawer
                title="Your Profile"
                onClose={onClose}
                open={open}
                // afterOpenChange={onClose}
                bodyStyle={{paddingBottom: 80}}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    initialValues={{
                        name: parsedUser && parsedUser.name !== undefined ? parsedUser.name : '',
                        email: parsedUser && parsedUser.email !== undefined ? parsedUser.email : '',
                        theme: parsedUser && parsedUser.settings !== undefined ? (parsedUser.settings.theme === 'dark' ? 'checked' : '') : '',
                        authors: parsedUser && parsedUser.news_preferences !== undefined ? parsedUser.news_preferences.authors.join(',') : '',
                        country: parsedUser && parsedUser.news_preferences !== undefined ? parsedUser.news_preferences.country : '',
                        sources: parsedUser && parsedUser.news_preferences !== undefined ? parsedUser.news_preferences.sources.join(',') : '',
                        language: parsedUser && parsedUser.news_preferences !== undefined ? parsedUser.news_preferences.language : '',
                        category: parsedUser && parsedUser.news_preferences !== undefined ? parsedUser.news_preferences.categories.join(',') : '',
                    }}
                    onFinish={handleProfileSave}
                >
                    <Row>
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Name cannot be empty'
                                        }
                                    ]
                                }
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Email cannot be empty'
                                        },
                                        {
                                            type: 'email',
                                            message: 'Please enter a valid email'
                                        },
                                    ]
                                }
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        Settings
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="theme"
                                label="Theme"
                                valuePropName={parsedUser && parsedUser.settings !== undefined ? (parsedUser.settings.theme === 'dark' ? 'checked' : '') : ''}
                            >
                                <Checkbox>Dark</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        News Preferences
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="authors"
                                label="Authors"
                                placeholder="Authors (comma-separated)"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="country"
                                label="Country"
                                placeholder="Country"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="sources"
                                label="Sources"
                                placeholder="Sources"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="language"
                                label="Language"
                                placeholder="Language"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col
                            xs={24}
                            xl={24}
                        >
                            <Form.Item
                                name="category"
                                label="Category"
                                placeholder="Sources"
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form>
            </Drawer>
        </>
    );
};

ProfileDrawer.propTypes = {
    UserData: PropTypes.object.isRequired,
};

export default ProfileDrawer;