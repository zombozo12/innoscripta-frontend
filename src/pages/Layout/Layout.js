import {Link, Outlet} from 'react-router-dom';
import {Layout as LayoutAnt, Menu} from 'antd';
import {useState} from "react";

const {Header, Footer} = LayoutAnt;

const Layout = () => {
    const [user, setUser] = useState({});

    return (
        <LayoutAnt className="layout">
            <Header>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={
                        [
                            {
                                key: '1',
                                label: <Link to="/">Home</Link>,
                            },
                            {
                                key: '2',
                                label: localStorage.getItem('access_token') !== null ?
                                    <Link to="/logout">Logout</Link> :
                                    <Link to="/login">Login</Link>,
                            },
                        ]
                    }
                />
            </Header>
            <Outlet/>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                Wiguna R ©2023 Created by Ant Design
            </Footer>
        </LayoutAnt>
    );
}

export default Layout;