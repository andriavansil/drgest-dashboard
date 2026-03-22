import UserCard from "@/components/UserCard"
import CountChart from "@/components/CountChart"
import AttendanceChart from "@/components/attendanceCharts"
import FinanceChart from "@/components/FinanceChart"
import EventCalendar from "@/components/EventCalendar"
import Announcements from "@/components/Announcements"

const MedProPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARD*/}
        <div  className="flex gap-4 justify-between flex-wrap">
          <UserCard type="pacientes" />
          <UserCard type="consultas" />
          {/*<UserCard type="classes" />*/}
          <UserCard type="ações pendentes" />
        </div>
        {/* MIDDLE CHARTS*/}
        <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            {/* ATTENDANCE */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart/>
            </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* CALENDAR */}
        <EventCalendar />
        {/* ANNOUNCEMENTS */}
        <Announcements />
      </div>
    </div>
  )
}

export default MedProPage