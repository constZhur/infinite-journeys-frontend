import { makeAutoObservable } from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import { message } from "antd";

export default class TourStore {
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

            // Преобразование значений startDate и endDate в нужный формат
            const formattedValues = {
                ...values,
                startDate: values.startDate + ':00Z',
                endDate: values.endDate + ':00Z'
            };

            const json = JSON.stringify(formattedValues);
            const response = await $api.post('/tours', json);
            message.success('Тур успешно создан');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }


    getAll = async () => {
        try {
            const response = await $api.get('/tours');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e)
        }
    }


    findById = async (id) => {
        try {
            this.loading = true;
            const response = await $api.get(`/tours/${id}`);
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
            await $api.delete(`/tours/${id}`);
            message.success('Тур успешно удален');
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    update = async (id, values) => {
        try {
            this.loading = true;

            const formattedValues = {
                ...values,
                startDate: values.startDate + ':00Z',
                endDate: values.endDate + ':00Z'
            };

            const json = JSON.stringify(formattedValues);
            const response = await $api.put(`/tours/${id}`, json);
            message.success('Тур успешно обновлен');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    findByFilter = async (filter) => {
        try {
            this.loading = true;
            const json = JSON.stringify(filter);
            const response = await $api.post('/tours/filter', json);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    updatePrice = async (id, request) => {
        try {
            this.loading = true;
            const json = JSON.stringify(request);
            const response = await $api.put(`/tours/${id}/price`, json);
            message.success('Цена тура успешно обновлена');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    async uploadFiles(files) {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            const response = await $api.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            await $api.delete(`/files/${fileId}`);
            console.log('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}
