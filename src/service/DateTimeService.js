import {LocalDateTime, ZoneOffset} from 'js-joda';

export default class DateTimeService {
    static convertBackDateToDate(unixTimestamp: number): Date {
        const milliseconds = unixTimestamp * 1000;
        return new Date(milliseconds);
    }

    static convertToDate(dateString) {
        const date = new Date(dateString);
        const isoString = date.toISOString();
        return isoString.substring(0, 23) + '+00:00';
    }

    static convertBackDateToString(isoDateString: string): string {
        const date = new Date(isoDateString);

        // Получение компонентов даты и времени
        const year = date.getFullYear(); // Год
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Месяц (с добавлением ведущего нуля)
        const day = ('0' + date.getDate()).slice(-2); // День (с добавлением ведущего нуля)
        const hours = ('0' + date.getHours()).slice(-2); // Часы (с добавлением ведущего нуля)
        const minutes = ('0' + date.getMinutes()).slice(-2); // Минуты (с добавлением ведущего нуля)

        // Форматирование строки с датой и временем
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

        return formattedDate;
    }



}
