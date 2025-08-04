/* src\modules\companySchedule\companySchedule.t.ts */
// #type DayOfWeek
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
// #end-type
// #type ScheduleTimeRange
export interface ScheduleTimeRange {
  start: string; // formato 'HH:mm'
  end: string;   // formato 'HH:mm'
}
// #end-type
// #type DailySchedule
export interface DailySchedule {
  isClosed: boolean;
  turns: ScheduleTimeRange[]; // varios turnos en el mismo día
}
// #end-type
// #type WeeklySchedule
export interface WeeklySchedule {
  monday: DailySchedule;
  tuesday: DailySchedule;
  wednesday: DailySchedule;
  thursday: DailySchedule;
  friday: DailySchedule;
  saturday: DailySchedule;
  sunday: DailySchedule;
}
// #end-type
