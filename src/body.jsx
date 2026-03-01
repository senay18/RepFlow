import './app.css'
import React from "react";
import ExerciseList from './ExerciseList';

export default function Body(){

    //store users workouts
    const[workouts, setWorkouts] = React.useState([]);
    const [equipmentInput, setEquipmentInput] = React.useState("");
    const [workoutPlan, setWorkoutPlan] = React.useState(null);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [planError, setPlanError] = React.useState("");

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

        {workouts.length > 0 && (
            <ExerciseList
            workouts={workouts}
            createWorkoutPlan={createWorkoutPlan}
            isGenerating={isGenerating}
            />
        )}

        {planError && <p className="plan-error">{planError}</p>}

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
