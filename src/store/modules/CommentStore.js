import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import {message} from "antd";

export default class CommentStore {
    rootStore: AppStore;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    isLoadingState = false;

    get loading() {
        return this.isLoadingState;
    }

    set loading(value) {
        this.isLoadingState = value;
    }

    create = async (tourId, values) => {
        try {
            this.loading = true;
            const json = JSON.stringify({
                tourId: tourId,
                content: values.content,
            });
            const response = await $api.post('/comments', json);
            message.success('Комментарий успешно создан');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }

    findByFilter = async (tourId, page, pageSize) => {
        try {
            this.loading = true;
            const json = JSON.stringify({
                tourId: Number(tourId),
                page: page,
                size: pageSize
            });
            const response = await $api.post(`/comments/tour`, json);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        } finally {
            this.loading = false;
        }
    }
}
