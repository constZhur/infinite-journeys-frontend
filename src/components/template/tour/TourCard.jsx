import React from 'react';
import {Card, Tag} from "antd";
import {Link} from "react-router-dom";
import DateTimeService from "../../../service/DateTimeService";

const TourCard = ({tour, inSinglePage}) => {
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
        <Link to={`/tours/${tour.id}`}>
            <Card hoverable={true}
                  title={<div className={'text-xl font-bold'}>{tour.title}</div>}
                  extra={<div
                      className={'text-gray-500'}>{DateTimeService.convertBackDateToString(tour.createdAt)}</div>}
                  actions={
                      [
                          <div className={'text-gray-400'}>{tour.country.name}</div>,
                          <div
                              className={'text-gray-400'}>{DateTimeService.convertBackDateToString(tour.startDate)}</div>,
                          <div
                              className={'text-gray-400'}>{DateTimeService.convertBackDateToString(tour.endDate)}</div>,
                          <div className={'text-gray-400'}>{tour.price}</div>,
                          <Tag color={colors[tour?.seller?.id % colors.length]}>{tour?.seller?.username}</Tag>,
                      ]
                  }
            >
                <div className={'flex justify-between'}>
                    {tour.description.length > 100 ? tour.description?.slice(0, 100) + '...' : tour.description}
                </div>
            </Card>
        </Link>
    );
};

export default TourCard;
