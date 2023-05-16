import {Button, Card, Col, DatePicker, Form, Input, Layout, Row, Select, Space, theme} from "antd";
import React, {useEffect, useState} from "react";
import {useFetch} from "use-http";
import {
    LARAVEL_API_ACCOUNT_ME,
    LARAVEL_API_URL,
    NEWS_API_EVERYTHING,
    NEWS_API_KEY,
    NEWS_API_TOP_HEADLINES_SOURCES,
    NEWS_API_URL,
    NEWS_DATA_API_KEY,
    NEWS_DATA_API_NEWS,
    NEWS_DATA_API_URL,
    NYTIMES_API_ARTICLE,
    NYTIMES_API_KEY,
    NYTIMES_API_URL
} from "../../common/constants";
import qs from "qs";
import Swal from "sweetalert2";
import ProfileDrawer from "./components/ProfileDrawer";

const {RangePicker} = DatePicker;
const {Content} = Layout;

const Home = () => {
    const {token} = theme.useToken();
    const [form] = Form.useForm();

    const [api, setApi] = useState('newsapi');

    const [user, setUser] = useState({});
    const [userSettings, setUserSettings] = useState({});

    const date = new Date();
    date.setDate(date.getDate() - 2);
    const [newsSettings, setNewsSettings] = useState({
        query: 'bitcoin',
        country: 'us',
        dateFrom: date.toDateString(),
        dateTo: new Date().toDateString(),
        sources: '',
        category: 'General',
        language: 'en',
    });

    const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });


    const [news, setNews: {}] = useState([]);
    const [newsApiSources, setNewsApiSources] = useState([]);

    const {get: getNyTimes} = useFetch(`${NYTIMES_API_URL}`);
    const {get: getNewsApi} = useFetch(`${NEWS_API_URL}`);
    const {get: getLaravelApi} = useFetch(`${LARAVEL_API_URL}`, token ? {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        }
    } : {});
    const {get: getNewsDataApi} = useFetch(`${NEWS_DATA_API_URL}`);

    const filterFormStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
        marginBottom: 24,
    };

    const onFinishFilter = (values) => {
        setNewsSettings({
            query: values.query ? values.query : 'bitcoin',
            country: 'us',
            dateFrom: values.date ? values.date[0].format('YYYY-MM-DD') : '',
            dateTo: values.date ? values.date[1].format('YYYY-MM-DD') : '',
            sources: values.source ? values.source.join(',') : '',
            category: values.category ? values.category : 'General',
        })
        setNews({});
        if (api === 'newsapi') {
            loadNewsAPI();
        }
        if (api === 'nytimes') {
            loadNYTimesNews();
        }
        if (api === 'newsdata') {
            loadNewsDataAPI();
        }
    };

    const loadNewsDataAPI = () => {
        setNews({});
        getNewsDataApi(`${NEWS_DATA_API_NEWS}?${qs.stringify({
            'apiKey': `${NEWS_DATA_API_KEY}`,
            'q': `${newsSettings.query}`,
            'country': `${newsSettings.country}`,
        })}`).then((res) => {
            setNews(res);
            console.log(res)
        }).catch((err) => {
            console.log(err);
        });
    }

    const loadNYTimesNews = () => {
        setNews({});
        getNyTimes(`${NYTIMES_API_ARTICLE}?${qs.stringify({
            'api-key': `${NYTIMES_API_KEY}`,
        })}`).then((res) => {
            setNews(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const loadNewsAPI = () => {
        setNews({});
        getNewsApi(`${NEWS_API_EVERYTHING}?${qs.stringify({
            'apiKey': `${NEWS_API_KEY}`,
            'q': `${newsSettings.query}`,
            'sources': `${newsSettings.sources}`,
            'from': `${newsSettings.dateFrom}`,
            'to': `${newsSettings.dateTo}`
        })}`).then((res) => {
            setNews(res);
        }).catch((err) => {
            console.log(err);
        })
    };

    const loadNewsAPISources = () => {
        setNewsApiSources([]);
        getNewsApi(`${NEWS_API_TOP_HEADLINES_SOURCES}?${qs.stringify({
            'apiKey': `${NEWS_API_KEY}`,
        })}`).then((res) => {
            setNewsApiSources(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    const getUser = () => {
        getLaravelApi(`${LARAVEL_API_ACCOUNT_ME}`)
            .then((res) => {
                if (res.is_error) {
                    toast.fire({
                        icon: 'error',
                        title: 'Error getting user',
                    });
                    return;
                }

                setUser(res.data.user);
            })
            .catch(error => console.log(error))
            .finally(() => {

            });
    };

    useEffect(() => {
        if (api === 'newsapi') {
            loadNewsAPISources();
            loadNewsAPI();
        }
        if (api === 'nytimes') {
            loadNYTimesNews();
        }
        if (api === 'newsdata') {
            loadNewsDataAPI();
        }

        const userSession = localStorage.getItem('user')
        if (userSession !== null) {
            setUser(JSON.parse(userSession));
        }

    }, [])


    return (
        <Content
            className='content-news'
            style={{
                marginTop: '50px',
                padding: '0 50px',
            }}
        >
            {token && user ? <ProfileDrawer UserData={user}/> : ''}

            <Form
                form={form}
                name="advanced_search"
                style={filterFormStyle}
                onFinish={onFinishFilter}
                onFinishFailed={(e) => {
                    console.log(e)
                }}>
                <Row gutter={24}>
                    <Col
                        span={8}
                        key={1}
                        xs={24}
                        xl={6}
                    >
                        <Form.Item
                            name='api'
                            label='Select API'
                            initialValue={"newsapi"}
                        >
                            <Select
                                onChange={(value) => {
                                    setApi(value);
                                }}
                                options={[
                                    {value: 'newsapi', label: 'NewsAPI.org'},
                                    {value: 'nytimes', label: 'New York Times'},
                                    {value: 'newsdata', label: 'News Data API'},
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        span={8}
                        key={2}
                        xs={24}
                        xl={6}
                    >
                        <Form.Item
                            name='query'
                            label='Search'
                            initialValue=''
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col
                        span={8}
                        key={3}
                        xs={24}
                        xl={6}
                    >
                        <Form.Item
                            name='date'
                            label='Date Range'
                        >
                            <RangePicker/>
                        </Form.Item>
                    </Col>
                    <Col
                        span={8}
                        key={4}
                        xs={24}
                        xl={6}
                    >
                        <Form.Item
                            name='source'
                            label='Source'
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                options={newsApiSources.sources !== undefined && newsApiSources.sources.map((item: any) => {
                                    return {value: item.id, label: item.name}
                                })}
                            />
                        </Form.Item>
                    </Col>
                    <Col
                        span={8}
                        xs={24}
                        xl={6}
                    >
                        <Form.Item
                            name='category'
                            label='Category'
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{textAlign: 'right'}}>
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            Search
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            Clear
                        </Button>
                    </Space>
                </div>
            </Form>
            <Row>
                {api === 'nytimes' && news.response !== undefined ? news.response.docs.map((item, index) => {
                    return (
                        <Col
                            key={'nytimes-' + index}
                            xs={24}
                            xl={6}
                            style={{
                                padding: '0 10px 10px'
                            }}>
                            <Card
                                hoverable
                                bordered={false}
                                cover={<img alt="example"
                                            src={item.multimedia.length > 0 ? 'https://nytimes.com/' + item.multimedia[0].url : ''}/>}
                                onClick={() => {
                                    window.open(item.web_url, '_blank');
                                }}
                            >
                                {item.headline.main}
                            </Card>
                        </Col>
                    )
                }) : ''}
                {api === 'newsapi' && news !== undefined && news.articles !== undefined ? news.articles.map((item, index) => {
                    return (
                        <Col
                            key={'newsapi-' + index}
                            xs={24}
                            xl={6}
                            style={{
                                padding: '0 10px 10px'
                            }}>
                            <Card
                                hoverable
                                bordered={false}
                                cover={<img alt="example"
                                            src={item.urlToImage}/>}
                                onClick={() => {
                                    window.open(item.url, '_blank');
                                }}
                            >
                                {item.title}
                            </Card>
                        </Col>
                    )
                }) : ''}
                {api === 'newsdata' && news !== undefined && news.results !== undefined ? news.results.map((item, index) => {
                    return (
                        <Col
                            key={'newsdata-' + index}
                            xs={24}
                            xl={6}
                            style={{
                                padding: '0 10px 10px'
                            }}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => {
                                    window.open(item.link, '_blank');
                                }}
                            >
                                {item.title}
                            </Card>
                        </Col>
                    )
                }) : ''}
            </Row>
        </Content>
    )
}

export default Home;