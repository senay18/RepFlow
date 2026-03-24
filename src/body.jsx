import './app.css'
import React from "react";
import ExerciseList from './ExerciseList';

// Manage equipment input, list state, and generated workout plans.
export default function Body(){

    // Store the equipment list and the current plan request state.
    const[workouts, setWorkouts] = React.useState([]);
    const [equipmentInput, setEquipmentInput] = React.useState("");
    const [workoutPlan, setWorkoutPlan] = React.useState(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [planError, setPlanError] = React.useState("");

    // Add equipment unless the input is blank or already present.
    function addWorkout(event){
        event.preventDefault();
        const newWorkout = equipmentInput.trim();
        if (!newWorkout) {
            return;
        }

        const alreadyAdded = workouts.some((item) => item.toLowerCase() === newWorkout.toLowerCase());
        if (alreadyAdded) {
            setEquipmentInput("");
            return;
        }

        setWorkouts((prev)=>[...prev, newWorkout]);
        setEquipmentInput("");
    }

    // Ask the local API to build a workout plan from the saved equipment.
    async function createWorkoutPlan(){
        if (workouts.length === 0 || isGenerating) {
            return;
        }

        setIsGenerating(true);
        setPlanError("");

        try {
            const response = await fetch("/api/workout-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ equipment: workouts }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.error || "Unable to generate workout plan.");
            }

            if(!payload.plan?.days || !Array.isArray(payload.plan.days)) {
                throw new Error("Invalid plan format returned from Claude.");
            }

            setWorkoutPlan(payload.plan);
        } catch (error) {
            setPlanError(error instanceof Error ? error.message : "Unable to generate workout plan.");
        } finally {
            setIsGenerating(false);
        }
    }

    return(
    <main className='page-content'>
        {/* Collect equipment before generating a plan. */}
        <form onSubmit={addWorkout}>
            <input
            type='text'
            placeholder='e.g. Dumbbells, Kettlebells'
            aria-label='Add workouts'
            name='workout'
            value={equipmentInput}
            onChange={(event) => setEquipmentInput(event.target.value)}
            />
        <button className='p-3 text-center justify-center items-center'>+ Add workout</button>
        </form>

        {/* Show the equipment list once at least one item has been added. */}
        {workouts.length > 0 && (
            <ExerciseList
            workouts={workouts}
            createWorkoutPlan={createWorkoutPlan}
            isGenerating={isGenerating}
            />
        )}

        {planError && <p className="plan-error">{planError}</p>}

        {/* Render the generated plan when the API returns valid data. */}
        {workoutPlan && (
            <section className="plan-container" aria-live="polite">
                <h2>{workoutPlan.title}</h2>
                <p>{workoutPlan.summary}</p>

                <div className="plan-grid">
                    {workoutPlan.days.map((day) => (
                        <article className="plan-day" key={day.name}>
                            <h3>{day.name}</h3>
                            <p>{day.focus}</p>
                            <ul>
                                {day.exercises.map((exercise) => (
                                    <li key={exercise}>{exercise}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>
        )}
    </main>
)
}
