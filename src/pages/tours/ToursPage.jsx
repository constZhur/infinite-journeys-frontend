import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Card, Divider, Form, Input, Pagination, Select, Space } from 'antd';
import { Context } from '../../index';
import TourCard from '../../components/template/tour/TourCard';
import PageTemplate from '../../components/template/PageTemplate/PageTemplate';
import {SearchOutlined} from "@ant-design/icons";

const ToursPage = () => {
    const { store } = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();

    const [firstCheckDone, setFirstCheckDone] = useState(false);
    const [firstFetchDone, setFirstFetchDone] = useState(false);

    const [tours, setTours] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [tourNameFilter, setTourNameFilter] = useState('');

    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCountries = await store.countries.getAll();
                setCountries(fetchedCountries);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchData();
    }, [store]);

    useEffect(() => {
        if (data) {
            setTours(data.content);
        }
    }, [data]);

    const updateData = useCallback(async () => {
        if (!firstCheckDone) return;

        try {
            const responseData = await store.tours.findByFilter({
                page: page - 1,
                size: pageSize,
                countryId: selectedCountry || undefined,
                tourName: tourNameFilter || undefined,
            });

            setData(responseData);
            setFirstFetchDone(true);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }, [firstCheckDone, store.tours, page, selectedCountry, pageSize, tourNameFilter]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTours = await store.tours.getAll();

                setTours(fetchedTours);
                setFirstCheckDone(true);
                updateData();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (firstFetchDone) return;
        fetchData();
    }, [store, updateData, firstFetchDone]);

    const handleChangePage = async value => {
        setPage(value);
        setSearchParams(searchParams => {
            searchParams.set('page', value);
            return searchParams;
        });
    };

    const handleTourNameFilterChange = (e) => {
        const value = e.target.value;
        setTourNameFilter(value);
        setSearchParams(searchParams => {
            searchParams.set('tourName', value);
            return searchParams;
        });
    };

    const handleChangePageSize = async (p, s) => {
        setPageSize(s);
        setPage(p);

        setSearchParams(searchParams => {
            searchParams.set('page', p);
            searchParams.set('size', s);
            return searchParams;
        });
    };

    const handleSelectCountry = value => {
        setSelectedCountry(value);
    };

    return (
        <PageTemplate title={'Список туров'}>
            {firstCheckDone && (
                <div className={'max-w-4xl mx-auto'}>
                    <Form layout="vertical"
                          initialValues={{
                              tourNameFilter: searchParams.get('tourName') || 'ALL',
                          }}
                    >
                        <Card>
                            <Space wrap>
                                <Form.Item label={'Поиск по названию'}>
                                    <Input id="tourNameFilter" placeholder={'Дальний Восток'} onChange={handleTourNameFilterChange}/>
                                </Form.Item>
                                <Select
                                    style={{ width: 205, marginTop: '6px' }}
                                    onChange={handleSelectCountry}
                                    allowClear
                                    value={selectedCountry?.id || undefined}
                                    options={countries.map(country => ({
                                        value: country.id,
                                        label: country.name,
                                    }))}
                                />
                                <Button
                                    style={{ marginTop: '6px' }}
                                    type="primary"
                                    icon={<SearchOutlined/>}
                                    onClick={updateData}
                                />
                            </Space>
                        </Card>

                        {data && (
                            <Card className={'mt-2'} size={'small'}>
                                <div className={'flex flex-row justify-between items-center px-2'}>
                                    <Pagination
                                        defaultCurrent={1}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} из ${total}`}
                                        total={data.totalSize}
                                        current={page}
                                        showSizeChanger
                                        onChange={handleChangePage}
                                        onShowSizeChange={handleChangePageSize}
                                        pageSizeOptions={['5', '10', '20', '50', '100']}
                                        defaultPageSize={5}
                                    />
                                    {/* Условный рендеринг кнопки "Создать пост" */}
                                    {(store.isAdmin() || store.isSeller()) && (
                                        <Link to={'/tours/create'}>
                                            <Button type={'dashed'}>Создать пост</Button>
                                        </Link>
                                    )}
                                </div>
                            </Card>
                        )}
                    </Form>
                    <Divider dashed className={'my-2'} />
                    <div className={'scroll-auto'}>
                        <div className={'flex flex-col gap-2'}>
                            {tours.map(tour => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PageTemplate>
    );
};

export default ToursPage;

