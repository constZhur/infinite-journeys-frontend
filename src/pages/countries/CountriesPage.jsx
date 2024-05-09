import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, Space, message } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import { Context } from '../../index';
import PageTemplate from '../../components/template/PageTemplate/PageTemplate';
import { SearchOutlined } from "@ant-design/icons";

const CountriesPage = () => {
    const { store } = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();

    const [firstCheckDone, setFirstCheckDone] = useState(false);
    const [firstFetchDone, setFirstFetchDone] = useState(false);

    const [countries, setCountries] = useState([]);
    const [countryNameFilter, setCountryNameFilter] = useState('');

    const [data, setData] = useState(null);

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
            setCountries(data.content);
        }
    }, [data]);

    const updateData = useCallback(async () => {
        if (!firstCheckDone) return;

        try {
            const responseData = await store.countries.findByFilter({
                countryName: countryNameFilter || undefined,
            });

            setData(responseData);
            setFirstFetchDone(true);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }, [firstCheckDone, store.countries, countryNameFilter]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFirstCheckDone(true);
                updateData();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (firstFetchDone) return;
        fetchData();
    }, [store, updateData, firstFetchDone]);

    const handleCountryNameFilterChange = (e) => {
        const value = e.target.value;
        setCountryNameFilter(value);
        setSearchParams(searchParams => {
            searchParams.set('countryName', value);
            return searchParams;
        });
    };

    const handleDeleteCountry = async (id) => {
        try {
            await store.countries.delete(id);
            message.success('Страна успешно удалена');
            updateData(); // Обновляем данные после удаления
            window.location.reload(); // Обновляем страницу
        } catch (error) {
            console.error('Error deleting country:', error);
        }
    };

    return (
        <PageTemplate title={'Список стран'}>
            {firstCheckDone && (
                <div className={'max-w-4xl mx-auto'}>
                    <Form layout="vertical"
                          initialValues={{
                              countryNameFilter: searchParams.get('countryName') || 'ALL',
                          }}
                    >
                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Form.Item label={'Поиск по названию'} style={{ marginBottom: 0, marginRight: '8px' }}>
                                        <Input id="countryNameFilter" placeholder={'Россия'} onChange={handleCountryNameFilterChange}/>
                                    </Form.Item>
                                    <Button style={{ marginTop: '29px' }}
                                            type="primary"
                                            icon={<SearchOutlined/>}
                                            onClick={updateData}
                                    />
                                </div>
                                {store.isAdmin() && (
                                    <Link to={'/countries/create'} style={{ marginTop: '29px' }}>
                                        <Button type={'default'}>Создать страну</Button>
                                    </Link>
                                )}
                            </div>
                        </Card>


                    </Form>
                    <Divider dashed className={'my-2'} />
                    <div className={'scroll-auto'}>
                        <div className={'flex flex-col gap-2'}>
                            {countries.map(country => (
                                <Card
                                    key={country.id}
                                    className={'p-2'}
                                    title={country.name}
                                    extra={
                                        <Space>
                                            <Link to={`/countries/update/${country.id}`}>
                                                <Button>Обновить</Button>
                                            </Link>
                                            <Button onClick={() => handleDeleteCountry(country.id)}>Удалить</Button>
                                        </Space>
                                    }
                                >
                                    <p>{country.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </PageTemplate>
    );
};

export default CountriesPage;
