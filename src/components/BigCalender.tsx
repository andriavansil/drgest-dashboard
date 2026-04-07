"use client";

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const localizer = momentLocalizer(moment)

const BigCalendar = ({
    data,
}: {
    data:{title: string; start: Date; end: Date}[]
}) => {
    const [view, setView] = useState<View>(Views.WEEK);

    const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
};
    return (
        <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        views={['week', 'day']}
        view={view}
        style={{ height: "95%" }}
        onView={handleOnChangeView}
        min={new Date(2000, 0, 1, 7, 0, 0)}
        max={new Date(2030, 11, 31, 22, 0, 0)}
        />
    );
};

export default BigCalendar;