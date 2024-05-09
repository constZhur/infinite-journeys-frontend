import React from 'react';
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import {Button, Result} from "antd";
import {Link} from "react-router-dom";

const UserDeletedPage = () => {
    return (
        <PageTemplate>
            <Result
                className={'mt-32'}
                status="404"
                title="404"
                subTitle="Пользователь был удален или не существует"
                extra={
                    <Link to={'/'}>
                        <Button type="default">Вернуться на главную</Button>
                    </Link>
                }
            />
        </PageTemplate>
    );
};

export default UserDeletedPage;