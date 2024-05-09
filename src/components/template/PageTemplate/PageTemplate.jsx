import React, {useContext, useEffect, useState} from 'react';
import st from "./PageTemplate.module.css"
import {Link} from "react-router-dom";
import {Button, Dropdown} from "antd";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {ApiOutlined, BugFilled, SettingOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";

const PageTemplate = ({children, title}) => {
    const {store} = useContext(Context);
    const [items, setItems] = useState([])

    useEffect(() => {
        const tmp = [
            {
                icon: <UserOutlined/>,
                label: <Link to={`/users/${store.user?.username}`}>Мой Профиль</Link>
            },
            {
                icon: <SettingOutlined/>,
                label: <Link to={"/users/settings"}>Настройки</Link>
            }, {
                type: "divider"
            }
        ]


        if (store.isAdmin()) {
            tmp.push({
                type: "divider"
            }, {
                icon: <TeamOutlined/>,
                label: <Link to={"/users"}>Пользователи</Link>
            }, {
                type: "divider"
            })
        }


        tmp.push({
            label: <Link to={'/logout'}>Выйти</Link>,
            danger: true,
        })

        setItems(tmp)
    }, [store, setItems])


    return (
        <div className={st.pageContainer}>
            {
                store.isAuth &&
                <>
                    <div className={st.goHome}>
                        <Button type={"dashed"} onClick={() => window.history.back()}>
                            Назад
                        </Button>

                    </div>
                    <div className={st.goTours}>
                        <Link to={"/tours"}>
                            <Button type={"dashed"}>
                                Туры
                            </Button>
                        </Link>
                        <Link to={"/counties"}>
                            <Button type={"dashed"}>
                                Страны
                            </Button>
                        </Link>
                        <Link to={"/my-tours"}>
                            <Button type={"dashed"}>
                                Мои Туры
                            </Button>
                        </Link>

                        <Dropdown
                            placement={"bottomRight"}
                            // trigger={"click"}
                            overlayStyle={{
                                width: "220px",
                                paddingTop: "10px",

                            }}
                            menu={{
                                items
                            }}
                        >
                            <Button type={"default"}>
                                {store.user.username}
                            </Button>
                        </Dropdown>
                    </div>
                </>
            }
            {
                title &&
                <div className={st.header}>
                    {title}
                </div>
            }
            <div className={st.content}>
                {children}
            </div>
        </div>
    );
};

export default observer(PageTemplate);