import { FC } from "react";
import ReactCountdown from "react-countdown";

export interface CountdownProps {
  date?: Date;
}

export const Countdown: FC<CountdownProps> = ({ date }) => {
  const renderItem = (unit: string, value: number) => (
    <div className="flex text-center justify-center items-center text-sm border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.25)] p-4 rounded-lg text-white w-20 h-20 mr-2">
      <div>
        <div>{value}</div>
        <div>{unit}</div>
      </div>
    </div>
  );
  return (
    <ReactCountdown
      date={date}
      renderer={({ days, hours, minutes, seconds }) => (
        <div className="flex">
          {renderItem('days', days)}
          {renderItem('hrs', hours)}
          {renderItem('mins', minutes)}
          {renderItem('secs', seconds)}
        </div>
      )}
    />
  );
};
