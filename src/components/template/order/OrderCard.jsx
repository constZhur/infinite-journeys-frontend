import React from 'react';
import { Card, Tag } from "antd";
import DateTimeService from "../../../service/DateTimeService";

const OrderCard = ({ order }) => {
    const colors = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geek-blue',
        'purple'
    ];

    return (
        <Card
            hoverable={true}
            title={<div className={'text-xl font-bold'}>{order.tourTitle}</div>}
            extra={<div className={'text-gray-500'}>{DateTimeService.convertBackDateToString(order.createdAt)}</div>}
            actions={[
                <div className={'text-gray-400'}>{order.countryName}</div>,
                <div className={'text-gray-400'}>{DateTimeService.convertBackDateToString(order.startDate)}</div>,
                <div className={'text-gray-400'}>{DateTimeService.convertBackDateToString(order.endDate)}</div>,
                <div className={'text-gray-400'}>{order.price}</div>,
                <Tag color={colors[Math.abs(order.sellerName.hashCode) % colors.length]}>
                    {order.sellerName}
                </Tag>,
            ]}
        >
            <div className={'flex justify-between'}>
                {order.tourDescription?.length > 100 ? order.tourDescription?.slice(0, 100) + '...' : order.tourDescription}
            </div>
        </Card>
    );
};

export default OrderCard;
