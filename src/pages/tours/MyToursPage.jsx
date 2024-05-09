import React, { useContext, useEffect, useState } from 'react';
import {Button, Card, Divider, Form, Pagination} from 'antd';
import { Context } from '../../index';
import OrderCard from '../../components/template/order/OrderCard';
import PageTemplate from '../../components/template/PageTemplate/PageTemplate';

const MyToursPage = () => {
    const { store } = useContext(Context);
    const [orders, setOrders] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await store.users.getMyOrders();
                console.log(response);
                setOrders(response);
                setPageSize(response.length);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [store]);

    const handleChangePage = async value => {
        setPage(value);
    };

    const handleChangePageSize = async (p, s) => {
        setPageSize(s);
        setPage(p);
    };

    return (
        <PageTemplate title={'Мои заказы'}>
            <div className={'max-w-4xl mx-auto'}>
                <Form layout="vertical">

                    <Card className={'mt-2'} size={'small'}>
                        <div className={'flex flex-row justify-between items-center px-2'}>
                            <Pagination
                                defaultCurrent={1}
                                showTotal={(total, range) => `${range[0]}-${range[1]} из ${total}`}
                                total={pageSize}
                                current={page}
                                showSizeChanger
                                onChange={handleChangePage}
                                onShowSizeChange={handleChangePageSize}
                                pageSizeOptions={['5', '10', '20', '50', '100']}
                                defaultPageSize={5}
                            />
                        </div>
                    </Card>

                    <Divider dashed className={'my-2'}/>

                    <div className={'scroll-auto'}>
                        <div className={'flex flex-col gap-2'}>
                            {orders.map(order => (
                                <OrderCard key={order.id} order={order}/>
                            ))}
                        </div>
                    </div>
                </Form>
            </div>
        </PageTemplate>
    );
};

export default MyToursPage;
