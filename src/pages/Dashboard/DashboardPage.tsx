import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import Aurora from "../../blocks/Backgrounds/Aurora/Aurora";
import '../../App.css';
import TaskForm from "../../components/Task/TaskForm";

const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
const Dashboard = () => {
    return (
      <div>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          speed={0.9}
        />
        <BlurText
        text="Bienvenido a la página de inicio"
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-2xl mb-8 text-center"
      />
      <div>
        <TaskForm />
      </div>
      </div>
    );

  }
export default Dashboard;
