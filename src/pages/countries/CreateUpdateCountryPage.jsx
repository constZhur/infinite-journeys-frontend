import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import { Context } from "../../index";

const CreateUpdateCountryPage = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();
    const { countryId } = useParams();
    const [form] = Form.useForm();
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (countryId) {
            const fetchData = async () => {
                try {
                    const response = await store.countries.findById(countryId);
                    form.setFieldsValue({
                        name: response?.name,
                    });
                    setIsEditMode(true);
                } catch (error) {
                    console.error('Error fetching country:', error);
                }
            };
            fetchData();
        }
    }, [countryId, form, store.countries]);

    const onFinish = async (values) => {
        try {
            if (isEditMode) {
                await store.countries.update(countryId, values);
                message.success('Страна успешно обновлена');
            } else {
                await store.countries.create(values);
                message.success('Страна успешно создана');
            }
            form.resetFields();
            navigate('/countries');
        } catch (error) {
            console.error('Error creating/updating country:', error);
        }
    };

    return (
        <PageTemplate title={isEditMode ? 'Редактирование страны' : 'Создание страны'}>
            <Card className={'max-w-4xl mx-auto'}>
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Название"
                        name="name"
                        rules={[{ required: true, message: 'Введите название страны' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditMode ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </PageTemplate>
    );
};

export default CreateUpdateCountryPage;
