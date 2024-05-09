import {makeAutoObservable} from "mobx";
import UserStore from "./modules/UserStore";
import CommentStore from "./modules/CommentStore";
import {message, notification} from "antd";
import CountryStore from "./modules/CountryStore";
import TourStore from "./modules/TourStore";

export default class AppStore {

    countries = new CountryStore(this);
    tours = new TourStore(this);
    users = new UserStore(this);
    comments = new CommentStore(this);

    userState = null;
    isAuthState = false;

    get isAuth() {
        return this.isAuthState;
    }

    set isAuth(value) {
        this.isAuthState = value;
    }

    get user() {
        return this.userState;
    }

    set user(value) {
        this.userState = value;
    }

    constructor() {
        makeAutoObservable(this, {
                counties: false,
                tours: false,
                users: false,
                comments: false,
            },
            {
                deep: true
            });

        // Проверка авторизации
        this.checkAuth();
    }

    checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            this.loadUser(token);
        }
    }

    loadUser = (token) => {
        const {id, email, role} = JSON.parse(atob(token.split('.')[1]));
        const username = JSON.parse(atob(token.split('.')[1])).sub;
        this.user = {id, username, email, role};
        this.isAuth = true;
    }

    logout = () => {
        localStorage.removeItem('token');
        this.user = null;
        this.isAuth = false;
    }

    httpError = (e) => {
        // switch-case by http code
        const msg = 'Ошибка сервера';
        if (e.response) {
            switch (e.response?.status) {
                case 400 || 401:
                    if (e.response.data?.title === 'Constraint Violation') {
                        notification.error({
                            message: 'Ошибка валидации данных',
                            description: e.response.data?.violations?.map(v => <p>{v.message}</p>),
                        }, 10);
                    } else {
                        notification.error({
                            message: e.response.data?.title,
                            description: e.response.data?.detail,
                        }, 10);
                    }
                    break;
                case 403:
                    message.error('Недостаточно прав');
                    break;
                case 404:
                    message.error('Не найдено');
                    break;
                default:
                    notification.error({
                        message: e.response.data.title,
                        description: e.response.data.detail,
                    }, 10);
            }
        } else {
            message.error(msg);
        }
    }

    isAdmin(): boolean {
        return this.user?.role === 'ROLE_ADMIN';
    }

    isSeller(): boolean {
        return this.user?.role === 'ROLE_SELLER';
    }
}
