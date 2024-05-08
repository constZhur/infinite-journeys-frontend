import { makeAutoObservable } from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import { message } from "antd";

export default class CountryStore {
    rootStore: AppStore;

    isLoadingState = false;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    get loading() {
        return this.isLoadingState;
    }

    set loading(value) {
        this.isLoadingState = value;
    }

    create = async (values) => {
        try {
            this.loading = true;
            const json = JSON.stringify(values);
            const response = await $api.post('/countries', json);
            message.success('Страна успешно создана');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    getAll = async () => {
        try {
            this.loading = true;
            const response = await $api.get('/countries');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    findById = async (id) => {
        try {
            this.loading = true;
            const response = await $api.get(`/countries/${id}`);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    update = async (id, values) => {
        try {
            this.loading = true;
            const json = JSON.stringify(values);
            const response = await $api.put(`/countries/${id}`, json);
            message.success('Страна успешно обновлена');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    delete = async (id) => {
        try {
            this.loading = true;
            await $api.delete(`/countries/${id}`);
            message.success('Страна успешно удалена');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }
}
