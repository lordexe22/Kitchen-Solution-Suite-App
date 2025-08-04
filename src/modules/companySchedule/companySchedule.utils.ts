/* src\modules\companySchedule\companySchedule.utils.ts */
// #section Imports
import type { WeeklySchedule, DayOfWeek } from "./companySchedule.t";
import { fetchWithJWT } from "../../utils/fetch";
// #end-section
// #variable BASE_URL
const BASE_URL = "http://localhost:4000/api/companies";
// #end-variable

// #function validateWeeklySchedule - valida la variable weeklySchedule completa
export const validateWeeklySchedule = (schedule: WeeklySchedule): boolean => {
  let isValid = true;

  for (const day in schedule) {
    const { isClosed, turns } = schedule[day as DayOfWeek];

    if (!isClosed) {
      if (turns.length === 0) {
        console.error(`Error: El día ${day} está habilitado pero no tiene turnos.`);
        isValid = false;
        continue;
      }

      for (const [i, turn] of turns.entries()) {
        if (!turn.start || !turn.end) {
          console.error(`Error: El turno ${i + 1} del día ${day} tiene hora de inicio o fin vacía.`);
          isValid = false;
        }
      }
    }
  }

  return isValid;
};
// #end-function
// #function updateCompanySchedule - Actualiza el horario semanal de una compañía
export const updateCompanySchedule = async (
  companyId: string,
  schedule: WeeklySchedule
): Promise<void> => {
  await fetchWithJWT<void>(`${BASE_URL}/${companyId}/schedule`, "PUT", schedule);
};
// #end-function