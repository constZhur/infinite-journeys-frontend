import { makeAutoObservable } from "mobx";
import $api from "../../http";
import { message } from "antd";
import AppStore from "../AppStore";

export default class UserStore {
    rootStore: AppStore;

    isLoading = false;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    get isLoadingState() {
        return this.isLoading;
    }

    set isLoadingState(state) {
        this.isLoading = state;
    }

    register = async (values) => {
        try {
            this.isLoadingState = true;
            delete values.confirm;
            const response = await $api.post('/auth/sign-up', values);
            localStorage.setItem('token', response.data.token);
            this.rootStore.loadUser(response.data.token);
            message.info('Добро пожаловать, ' + this.rootStore.user.username + "!");
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    login = async (values) => {
        try {
            this.isLoadingState = true;
            const response = await $api.post('/auth/sign-in', values);
            localStorage.setItem('token', response.data.token);
            this.rootStore.loadUser(response.data.token);

            message.info('С возвращением, ' + this.rootStore.user.username + "!");
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    changeUsername = async (values) => {
        try {
            this.isLoadingState = true;
            await $api.patch('/users/change-username', values);
            message.success('Имя пользователя успешно изменено');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    changeEmail = async (values) => {
        try {
            this.isLoadingState = true;
            await $api.patch('/users/change-email', values);
            message.success('Электронная почта успешно изменена');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    changePassword = async (values) => {
        try {
            this.isLoadingState = true;
            await $api.post('/users/change-password', values);
            message.success('Пароль успешно изменен');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    getUsersByFilter = async (filter) => {
        try {
            const json = JSON.stringify(filter);
            const response = await $api.post('/users/filter', json);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    getProfileInfo = async (username) => {
        try {
            const response = await $api.get(`/users/profile/${username}`);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    ban = async (id, days, hours, minutes) => {
        try {
            const requestData = {
                id: id,
                days: days,
                hours: hours,
                minutes: minutes
                // другие поля, если они есть
            };

            const json = JSON.stringify(requestData);
            await $api.put('/users/ban', json);
            message.success('Пользователь успешно забанен');
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    unban = async (id) => {
        try {
            await $api.put(`/users/unban/${id}`);
            message.success('Пользователь успешно разбанен');
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }


    delete = async (userId) => {
        try {
            this.isLoadingState = true;
            await $api.post('/users/delete', { userId });
            message.success('Пользователь успешно удален');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    changeRole = async (values) => {
        try {
            this.isLoadingState = true;
            await $api.put('/users/change-role', values);
            message.success('Роль пользователя успешно изменена');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    isSuperuser = async () => {
        try {
            this.isLoadingState = true;
            const response = await $api.get('/users/is-superuser');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            return false;
        } finally {
            this.isLoadingState = false;
        }
    }

    getCurrentBalance = async () => {
        try {
            this.isLoadingState = true;
            const response = await $api.get('/users/balance');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            return null;
        } finally {
            this.isLoadingState = false;
        }
    }

    topUpBalance = async (amount) => {
        try {
            this.isLoadingState = true;
            await $api.post('/users/top-up-balance', { amount });
            message.success('Баланс успешно пополнен');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    withdrawFromBalance = async (amount) => {
        try {
            this.isLoadingState = true;
            await $api.post('/users/withdraw-from-balance', { amount });
            message.success('Сумма успешно списана с баланса');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.isLoadingState = false;
        }
    }

    buyOrder = async (orderRequest) => {
        try {
            this.isLoadingState = true;
            const response = await $api.post('/users/buy-order', orderRequest);
            message.success('Заказ успешно совершен');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            return null;
        } finally {
            this.isLoadingState = false;
        }
    }

    getMyOrders = async () => {
        try {
            this.isLoadingState = true;
            const response = await $api.get('/users/my-orders');
            console.log(response.data)
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            return null;
        } finally {
            this.isLoadingState = false;
        }
    }
}
