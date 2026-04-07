import UserCard from "@/components/UserCard"
import FinanceChart from "@/components/FinanceChart"
import Announcements from "@/components/Announcements"
import CountChartContainer from "@/components/CounChartContainer"
import AttendanceChartContainer from "@/components/AttendanceChartContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"

const MedProPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARD*/}
        <div  className="flex gap-4 justify-between flex-wrap">
          <UserCard type="pacientes" />
          <UserCard type="consultas hoje" />
          <UserCard type="ações pendentes" />
        </div>
        {/* MIDDLE CHARTS*/}
        <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChartContainer />
            </div>
            {/* ATTENDANCE */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChartContainer/>
            </div>
        </div>
        {/* BOTTOM CHART 
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>*/}
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* CALENDAR */}
        <EventCalendarContainer searchParams={searchParams} />
        {/* ANNOUNCEMENTS 
        <Announcements />*/}
      </div>
    </div>
  )
}

export default MedProPage