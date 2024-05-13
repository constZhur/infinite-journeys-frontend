import React, { useContext, useEffect, useState } from 'react';
import { Context } from "../../index";
import { useNavigate, useParams } from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import { Button, Card, Form, Input, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";

const { Dragger } = Upload;

const CreateUpdateTourPage = () => {
    const { tourId } = useParams();
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [form] = Form.useForm();
    const [files, setFiles] = useState([]);

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

    const handleFileChange = ({ fileList }) => {
        setFiles(fileList);
    };

    useEffect(() => {
        if (tourId) {
            const fetchData = async () => {
                const response = await store.tours.findById(tourId);
                form.setFieldsValue({
                    title: response?.title,
                    description: response?.description,
                    startDate: response?.startDate,
                    endDate: response?.endDate,
                    price: response?.price,
                    country: response?.country?.name,
                    seller: response?.seller?.username,
                    files: [
                        ...response?.attachments?.map(file => ({
                            uid: file?.id,
                            name: file?.originalName + '.' + file?.extension,
                            status: 'done',
                            url: `http://77.246.158.253:8080/files/download/${file?.id}`
                        }))
                    ]
                });
                setFiles(response?.attachments?.map(file => ({
                    uid: file?.id,
                    name: file?.originalName + '.' + file?.extension,
                    status: 'done',
                    url: `http://77.246.158.253:8080/files/download/${file?.id}`
                })));
            };
            fetchData();
        }
    }, [form, tourId, store.tours]);


    return (
        <PageTemplate
            title={tourId ? 'Редактирование тура' : 'Создание тура'}
        >
            <Card className={'max-w-4xl mx-auto'}>
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={async (values) => {
                        try {
                            let fileIds = [];
                            if (files.length > 0) {
                                fileIds = await store.tours.uploadFiles(files);
                            }
                            const result = tourId ?
                                await store.tours.update(tourId, { ...values, files: fileIds }) :
                                await store.tours.create({ ...values, files: fileIds });
                            if (result) {
                                form.resetFields();
                                setFiles([]);
                                navigate(`/tours/${result?.id}`);
                            }
                        } catch (error) {
                            console.error('Error creating/updating tour:', error);
                        }
                    }}
                >
                    <Form.Item
                        label="Название"
                        name="title"
                        rules={[{ required: true, message: 'Введите название тура' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Описание"
                        name="description"
                        rules={[{ required: true, message: 'Введите описание тура' }]}
                    >
                        <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Form.Item>
                    <Form.Item
                        label="Дата начала"
                        name="startDate"
                        rules={[{ required: true, message: 'Введите дату начала тура' }]}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>
                    <Form.Item
                        label="Дата окончания"
                        name="endDate"
                        rules={[{ required: true, message: 'Введите дату окончания тура' }]}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>
                    <Form.Item
                        label="Цена"
                        name="price"
                        rules={[{ required: true, message: 'Введите цену тура' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Страна"
                        name="countryId"
                        rules={[{ required: true, message: 'Выберите страну' }]}
                    >
                        <Select>
                            {countries?.map(country =>
                                <Select.Option key={country.id} value={country.id}>{country.name}</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Прикрепленные файлы"
                        name="files"
                    >
                        <Dragger
                            beforeUpload={file => {
                                setFiles([...files, file]);
                                return false;
                            }}
                            onChange={handleFileChange}
                            fileList={files}
                            onRemove={file => {
                                setFiles(files.filter(f => f.uid !== file.uid));
                            }}
                            multiple={true}
                            maxCount={10}
                        >
                            <p className="ant-upload-drag-icon"></p>
                            <p className="ant-upload-text">Нажмите или перетащите файлы в эту область</p>
                            <p className="ant-upload-hint">Поддерживается одиночная или массовая загрузка.</p>
                        </Dragger>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {tourId ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageTemplate>
    );
};

export default CreateUpdateTourPage;
