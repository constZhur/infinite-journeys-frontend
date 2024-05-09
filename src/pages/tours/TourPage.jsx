import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../../index";
import { Link, useParams } from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import { Badge, Button, Card, Divider, Form, Image, Pagination, Tag, Tree } from "antd";
import DateTimeService from "../../service/DateTimeService";
import TextArea from "antd/es/input/TextArea";
import SizeService from "../../service/SizeService";
import BuyOrderComponent from "../../components/utils/BuyOrderComponent";

const TourPage = () => {
    const { tourId } = useParams();
    const { store } = useContext(Context);
    const [tour, setTour] = useState(null);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [images, setImages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [form] = Form.useForm();
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await store.tours.findById(tourId);
                setTour(response);
                setIsAuthor(response?.seller?.id === store.user?.id);
                setImages(response?.attachments.filter(
                    file => file?.extension.toLowerCase() === 'png' ||
                        file?.extension.toLowerCase() === 'jpg' ||
                        file?.extension.toLowerCase() === 'jpeg' ||
                        file?.extension.toLowerCase() === 'gif' ||
                        file?.extension.toLowerCase() === 'bmp' ||
                        file?.extension.toLowerCase() === 'svg' ||
                        file?.extension.toLowerCase() === 'webp'
                ));
            } catch (error) {
                console.error('Error fetching tour:', error);
            }
        };
        fetchData();
    }, [store, tourId, updateTrigger]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await store.comments.findByFilter(tourId, page - 1, pageSize);
                setComments(response?.content?.sort((a, b) => b?.createdAt - a?.createdAt));
                setTotalComments(response.totalSize);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchData();
    }, [store, tourId, page, pageSize, updateTrigger]);

    const handleDeleteTour = async () => {
        await store.tours.delete(tourId);
        window.location.href = '/tours';
    };

    const colors = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple'
    ];

    const actions = [];

    if (isAuthor) {
        actions.push(
            <Link key="update" to={`/tours/update/${tourId}`}>
                <Button>Обновить</Button>
            </Link>
        );

        actions.push(
            <Button key="delete" onClick={handleDeleteTour}>Удалить</Button>
        );
    }

    return (
        <PageTemplate title={tour?.title}>
            <div className={'max-w-4xl mx-auto'}>
                <Card
                    actions={[
                        ...actions,
                        <div className={'text-gray-400'}>{DateTimeService.convertBackDateToString(tour?.startDate)}</div>,
                        <div className={'text-gray-400'}>{DateTimeService.convertBackDateToString(tour?.endDate)}</div>,
                        <div className={'text-gray-400'}>{tour?.price}</div>,
                        <Tag color={colors[Math.abs(tour?.seller?.id.hashCode) % colors.length]}>
                            {tour?.seller?.username}
                        </Tag>,
                        <BuyOrderComponent tourId={tourId} />,
                    ]}
                > <div className={'flex flex-col'}>
                        <p>{tour?.description}</p>
                        {<Divider />}
                        <div>
                            <Image.PreviewGroup>
                                {images?.map(image =>
                                    (
                                        <Image
                                            width={200}
                                            height={200}
                                            className={'object-cover'}
                                            src={`http://localhost:8080/files/download/${image?.id}`}
                                        />
                                    )
                                )}
                            </Image.PreviewGroup>
                        </div>
                    </div>
                </Card>

                <h2 className={'text-xl font-bold mt-4 mb-2'}>Комментарии</h2>
                <Divider />
                <Form
                    form={form}
                    name="comment"
                    layout={'vertical'}
                    initialValues={{ remember: true }}
                    onFinish={async (values) => {
                        await store.comments.create(tourId, values);
                        form.resetFields();
                        setUpdateTrigger(!updateTrigger);
                        setPage(1);
                    }}
                >
                    <Form.Item
                        className={'mt-4'}
                        label="Комментарий"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, введите комментарий!'
                            },
                            {
                                min: 5,
                                message: 'Комментарий должен содержать не менее 5 символов!'
                            },
                            {
                                max: 999,
                                message: 'Комментарий должен содержать не более 999 символов!'
                            }
                        ]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            loading={store.comments.loading}
                            className={'w-full'} type="dashed" htmlType="submit">
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
                <Divider />
                <Pagination
                    className={'mb-4'}
                    current={page}
                    pageSize={pageSize}
                    total={totalComments}
                    showSizeChanger
                    showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} комментариев`}
                    onChange={(page, pageSize) => {
                        setPage(page);
                        setPageSize(pageSize);
                    }}
                />

                <div className={'flex flex-col gap-2'}>
                    {comments?.map(comment =>
                        <Badge.Ribbon
                            text={DateTimeService.convertBackDateToString(comment?.createdAt)}
                            color="geekblue">
                            <Card
                                className={'p-2'}
                                title={<div className={'flex flex-row gap-2 items-center'}>
                                    <Link to={`/users/${comment?.author?.id}`}>
                                        {/*<span className={'text-gray-400 text-sm'}>Пользователь </span>*/}
                                        <Tag
                                            color={colors[comment?.author?.id % colors.length]}
                                        ><span
                                            className={'text-base'}>{comment?.author?.username || 'Аноним'}</span></Tag
                                        >
                                        {/*<span*/}
                                        {/*className={'text-gray-400 text-sm'}>прокомментировал</span>*/}
                                    </Link>
                                </div>}
                            >
                                {comment?.content}
                            </Card>
                        </Badge.Ribbon>
                    )}
                </div>
            </div>
        </PageTemplate>
    );
};

export default TourPage;
