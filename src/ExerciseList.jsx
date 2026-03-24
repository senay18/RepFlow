
// Show the current equipment list and the workout-generation action.
export default function ExerciseList(props){
    // Turn each equipment entry into a list item for display.
    const ExerciseListItems = props.workouts.map((workout, index)=>(
        <li key={`${workout}-${index}`}>{workout}</li>
    ));

    return(
    <section className="equipment-section">
        <h2>Equipment:</h2>
        <ul className="equipment" aria-live="polite">
            {ExerciseListItems}
        </ul>
        {props.workouts.length > 0 && (
            <div className="workout-container">
                <div>
                    <h3>Ready for your Workout?</h3>
                    <p>Generate a plan from your current equipment list.</p>
                </div>
                <button onClick={props.createWorkoutPlan} disabled={props.isGenerating}>
                    {props.isGenerating ? "Generating..." : "Get workout"}
                </button>
            </div>
        )}
    </section>
)}
