import React, { useContext } from 'react';
import { Context } from "../../index";
import { useNavigate } from "react-router-dom";
import {Button} from "antd";

const BuyOrderComponent = ({ tourId }) => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const handleBuyTour = async () => {
        try {
            const json = { tourId };
            await store.users.buyOrder(json);
            navigate('/my-tours');
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
        }
    };

    return (
        <Button type="primary" onClick={handleBuyTour}>Купить</Button>
    );
};

export default BuyOrderComponent;
