import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Context } from "../../index";
import { Card, Divider, Tag, Avatar, Button, Modal, Input, message } from "antd";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";


const Profile = () => {
    const { username } = useParams();
    const { store } = useContext(Context);
    const [user, setUser] = useState({});
    const [actions, setActions] = useState([]);
    const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false); // Состояние видимости модального окна для пополнения счета
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false); // Состояние видимости модального окна для снятия со счета
    const [amount, setAmount] = useState(''); // Состояние для хранения суммы для пополнения или снятия

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

    const handleTopUp = () => {
        setIsTopUpModalVisible(true);
    };

    const handleWithdraw = () => {
        setIsWithdrawModalVisible(true);
    };

    const handleCancel = () => {
        setIsTopUpModalVisible(false);
        setIsWithdrawModalVisible(false);
    };

    const handleConfirmTopUp = async () => {
        try {
            await store.users.topUpBalance(amount);
            setIsTopUpModalVisible(false);
            message.success('Баланс успешно пополнен');
            // Обновление данных пользователя после успешного пополнения счета
            await store.users.getProfileInfo(username).then(data => setUser(data));
        } catch (error) {
            console.error('Error topping up balance:', error);
            message.error('Произошла ошибка при пополнении баланса');
        }
    };

    const handleConfirmWithdraw = async () => {
        try {
            await store.users.withdrawFromBalance(amount);
            setIsWithdrawModalVisible(false);
            message.success('Сумма успешно списана с баланса');
            // Обновление данных пользователя после успешного снятия со счета
            await store.users.getProfileInfo(username).then(data => setUser(data));
        } catch (error) {
            console.error('Error withdrawing from balance:', error);
            message.error('Произошла ошибка при списании суммы с баланса');
        }
    };

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
                                <div className={'flex flex-row justify-between mb-1.5 pb-2'}>
                                    <p className={'text-gray-500'}>Баланс</p>
                                    <p>{user?.balance}</p>
                                </div>
                                <div className={'flex flex-col'}>
                                    <Button type="primary" onClick={handleTopUp} style={{ marginBottom: '8px' }}>Пополнить счет</Button>
                                    <Button type="primary" onClick={handleWithdraw}>Снять со счета</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            {/* Модальное окно для пополнения счета */}
            <Modal
                title="Пополнение счета"
                visible={isTopUpModalVisible}
                onOk={handleConfirmTopUp}
                onCancel={handleCancel}
            >
                <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Введите сумму для пополнения"
                />
            </Modal>
            {/* Модальное окно для снятия со счета */}
            <Modal
                title="Снятие со счета"
                visible={isWithdrawModalVisible}
                onOk={handleConfirmWithdraw}
                onCancel={handleCancel}
            >
                <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Введите сумму для снятия"
                />
            </Modal>
        </PageTemplate>
    );
};

export default Profile;
