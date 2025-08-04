/* src\components\CompanySchedule\CompanySchedule.tsx */
// #section Imports
import { useCompanyScheduleController } from "../../modules/companySchedule/companySchedule.hooks";
import type { DayOfWeek } from "../../modules/companySchedule/companySchedule.t";
// #end-section
// #variable WEEK_DAYS
const WEEK_DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
// #end-variable

type props = {
  companyId: string
}

// #component CompanySchedule
const CompanySchedule = ({companyId}:props) => {
  // #hook useCompanyScheduleController() - weeklySchedule, toggleDayClosed, handleAddTurn, handleRemoveTurn, handleConfirmTurn, handleTurnInputChange, handleSubmit  
    const { 
      weeklySchedule,
      toggleDayClosed,
      handleAddTurn,
      handleRemoveTurn,
      handleTurnInputChange,
      handleSubmit
    } = useCompanyScheduleController(companyId);
  // #end-hook

  // #section return
  return (
    <form onSubmit={handleSubmit}>
      {/* #section - Logic for render blocks of days whit all their functionality */}
      {WEEK_DAYS.map((day) => {
        const schedule = weeklySchedule[day];
        return (
          <div key={day} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ textTransform: 'capitalize' }}>{day}</h3>

            {/* #section - Checkbox for indicate the days that the company is closed */}
            <label>
              <input
                type="checkbox"
                checked={schedule.isClosed}
                onChange={() => toggleDayClosed(day)}
              />
              Cerrado
            </label>
            {/* #end-section */}

            {/* #section - Iterate for every existing turn in a day */}
            <div style={{ marginTop: '1rem' }}>
              {schedule.turns.map((turn, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  <input
                    id={`start-${day}-${index}`}
                    type="time"
                    value={turn.start}
                    disabled={schedule.isClosed}
                    onChange={handleTurnInputChange}  // 1. OK: debe recibir evento y manejar estado en tiempo real
                    required  // 2. Sugerido para que el input sea obligatorio en el formulario
                  />
                  {' - '}
                  <input
                    id={`end-${day}-${index}`}
                    type="time"
                    value={turn.end}
                    disabled={schedule.isClosed}
                    onChange={handleTurnInputChange}  // Igual aquí
                    required  // Igual sugerido
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTurn(day, index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            {/* #end-section */}

            {/* #section - Button for add a new turn in the current day */}
            <button
              type="button"
              onClick={() => handleAddTurn(day)}
            >
              Agregar turno
            </button>
            {/* #end-section */}
          </div>
        );
      })}
      {/* #end-section */}

      {/* #section - Submit button for whole week schedule */}
      <button type="submit" style={{ marginTop: '1rem' }}>
        Confirmar toda la semana
      </button>
      {/* #end-section */}
    </form>
  );
  // #end-section




};

export default CompanySchedule;
// #end-component
