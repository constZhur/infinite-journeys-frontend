import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Context } from "../../index";
import PageTemplate from "../../../../../WebstormProjects/infinite-journeys-frontend/src/components/template/PageTemplate/PageTemplate";
import { Card, Divider, Tag, Avatar } from "antd";
import TextArea from "antd/es/input/TextArea";
import DateTimeService from "../../service/DateTimeService";

const Profile = () => {
    const { username } = useParams();
    const { store } = useContext(Context);
    const [user, setUser] = useState({});
    const [actions, setActions] = useState([]);

    useEffect(() => {
        store.users.getProfileInfo(username).then(data => setUser(data))
        const tmp = [];
        if (store.user?.username === username) {
            tmp.push(
                <Link to={`/users/settings`}>
                    Настройки
                </Link>
            )
        } else {
            tmp.push(
                <Link to={`/users/${user?.id}/message`}>
                    Написать сообщение
                </Link>
            )
        }

        if (store.isAdmin()) {
            tmp.push(
                <Link to={`/users?id=${user?.id}`}>
                    Показать в админке
                </Link>
            )
        }
        setActions(tmp);

    }, [store, store.users, user?.id, username]);

    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

    return (
        <PageTemplate title={`Профиль ${user?.username}`}>
            <div className={'max-w-4xl mx-auto'}>
                <Card
                    actions={actions}
                >
                    <div className={'flex flex-row gap-4 justify-between items-center'}>
                        <div className={'flex flex-col items-center'}>
                            <Avatar
                                className={'w-32 h-32 flex justify-center items-center'}
                                style={{ backgroundColor: colors[user?.id % colors.length], verticalAlign: 'middle' }}
                                size="large"
                            >
                                {user?.username}
                            </Avatar>
                            <h1 className={'text-2xl font-bold'}>{user?.username}</h1>
                        </div>
                        <div className={'flex flex-col w-60'}>
                            <div className={'flex flex-col'}>
                                <div className={'flex flex-row justify-between mb-1.5 pb-2'}>
                                    <p className={'text-gray-500'}>Почта</p>
                                    <p><a href={`mailto:${user?.email}`}>{user?.email}</a></p>
                                </div>
                                <div className={'flex flex-row justify-between mb-1.5 pb-2'}>
                                    <p className={'text-gray-500'}>Роль</p>
                                    <p className={'-mr-2'}>
                                        {
                                            user?.role === 'ROLE_ADMIN' ?
                                                <Tag color={'blue'}>
                                                    Админ
                                                </Tag> : user?.role === 'ROLE_SELLER' ?
                                                    <Tag color={'magenta'}>
                                                        Продавец
                                                    </Tag> : user?.role === 'ROLE_BUYER' ?
                                                        <Tag color={'gray'}>
                                                            Покупатель
                                                        </Tag> : <Tag color={'red'}>
                                                            Нет
                                                        </Tag>

                                        }
                                    </p>
                                </div>
                                <div className={'flex flex-row justify-between mb-1.5 pb-2'}>
                                    <p className={'text-gray-500'}>Гендер</p>
                                    <p className={'-mr-2'}>
                                        {
                                            user?.gender === 'MALE' ?
                                                <Tag color={'blue'}>
                                                    Мужчина
                                                </Tag> : user?.gender === 'FEMALE' ?
                                                    <Tag color={'magenta'}>
                                                        Женщина
                                                    </Tag> :
                                                    <Tag color={'gray'}>
                                                        Не указан
                                                    </Tag>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </PageTemplate>
    );
};

export default Profile;
