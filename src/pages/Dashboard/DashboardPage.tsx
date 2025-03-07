/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Select, message } from "antd";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import "../../App.css";
import TaskForm from "../../components/Task/TaskForm";

const { Option } = Select;

const Dashboard = () => {
  interface Task {
    uid: string;
    id_tarea: string;
    nameTask: string;
    descripcion: string;
    categoria: string;
    estatus: string;
    deadLine: string | number | Date;
    grupo: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksByGroup, setTasksByGroup] = useState<Task[]>([]); // Tareas por grupo
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const apiUrl = "https://practicaswebback.onrender.com";

  // Obtener tareas
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      message.error("No se encontró el token de autenticación.");
      return;
    }
  
    try {
      const response = await fetch(`${apiUrl}/get_tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      console.log(" Respuesta de la API:", result);
  
      if (!response.ok) {
        if (result.statusCode === 401 && result.intMessage === "El token ha expirado") {
          message.warning("⚠️ La sesión ha expirado. Inicia sesión nuevamente.");
          localStorage.removeItem("token"); // Eliminar token
          window.location.href = "/login"; // 🔄 Redirigir al login (opcional)
          return;
        }
        throw new Error(result.intMessage || "Error al obtener las tareas");
      }
  
      if (!Array.isArray(result.data)) {
        throw new Error("La respuesta de la API no contiene una lista de tareas.");
      }
  
      // Asegúrate de asignar el ID del documento correctamente
      setTasks(result.data.map((task: Task) => ({
        ...task,
        id_tarea: task.id_tarea, // Asegúrate de que cada tarea tenga el 'id_tarea' del documento de Firestore
      })));
    } catch (error) {
      console.error("❌ Error al obtener tareas:", error);
      message.error("Error de conexión con el servidor");
      setTasks([]);
    }
  };

  const fetchTasksByGroup = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("No se encontró el token de autenticación.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/tareas_usuario_grupo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Token expirado") {
          message.warning("⚠️ La sesión ha expirado. Inicia sesión nuevamente.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error(result.error || "Error al obtener las tareas por grupo");
      }

      if (!Array.isArray(result)) {
        throw new Error("La respuesta de la API no contiene una lista de tareas.");
      }

      // Asignamos los datos obtenidos al estado
      setTasksByGroup(result);
    } catch (error) {
      console.error("❌ Error al obtener tareas por grupo:", error);
      message.error("Error de conexión con el servidor");
      setTasksByGroup([]);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    fetchTasksByGroup();
  }, []);

  // Función para eliminar una tarea
  const handleDeleteTask = async (taskId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("No se encontró el token de autenticación.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/delete_task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`},
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Tarea eliminada con éxito");
        fetchTasks(); // Actualizar la tabla
        fetchTasksByGroup(); // Actualizar la tabla de tareas por grupo
      } else {
        message.error(result.intMessage || "Error al eliminar la tarea");
      }
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
      message.error("Error de conexión con el servidor");
    }
  };

  // Función para abrir el modal de edición
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
    form.setFieldsValue(task);
  };

  // Función para guardar cambios en la tarea
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedTask) return;
  
    console.log("Tarea seleccionada:", selectedTask); // Verifica que selectedTask tiene los valores correctos
  
    try {
      const values = await form.validateFields();
      // Incluye el ID de la tarea y el ID del grupo en los valores del formulario
      const updatedTask = { ...values, id_tarea: selectedTask.id_tarea, grupo: selectedTask.grupo };
      const response = await fetch(`${apiUrl}/update_task/${selectedTask.grupo}/${selectedTask.id_tarea}`, {  // Usa 'grupo' y 'id_tarea' aquí
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        message.success("Tarea actualizada con éxito");
        setIsModalVisible(false);
        fetchTasks(); // Recargar las tareas
        fetchTasksByGroup(); // Recargar las tareas por grupo
      } else {
        message.error(result.intMessage || "Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
      message.error("Error de conexión con el servidor");
    }
  };

  // Columnas de la tabla con botones de acción
  const columns = [
    { title: "Nombre", dataIndex: "nameTask", key: "nameTask" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Categoría", dataIndex: "categoria", key: "categoria" },
    { title: "Estatus", dataIndex: "estatus", key: "estatus" },
    {
      title: "Fecha Límite",
      dataIndex: "deadLine",
      key: "deadLine",
      render: (text: string | number | Date) => text ? new Intl.DateTimeFormat("es-ES").format(new Date(text)) : "No definida"
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Task) => (
        <>
          <Button type="primary" onClick={() => handleEditTask(record)} style={{ marginRight: 8 }}>
            Editar
          </Button>
          <Button type="default" danger onClick={() => handleDeleteTask(record.id_tarea)}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  // Columnas para tareas por grupo
  const columnsByGroup = [
    { title: "Nombre", dataIndex: "nameTask", key: "nameTask" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Categoría", dataIndex: "categoria", key: "categoria" },
    { title: "Estatus", dataIndex: "estatus", key: "estatus" },
    {
      title: "Fecha Límite",
      dataIndex: "deadLine",
      key: "deadLine",
      render: (text: string | number | Date) => text ? new Intl.DateTimeFormat("es-ES").format(new Date(text)) : "No definida"
    },
    {
      title: "Grupo",
      dataIndex: "grupo",
      key: "grupo",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Task) => (
        <>
          <Button type="primary" onClick={() => handleEditTask(record)} style={{ marginRight: 8 }}>
            Editar
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <BlurText
        text="Bienvenido a la página de inicio"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-2xl mb-8 text-center"
      />
      <TaskForm onTaskCreated={fetchTasks} />
      <Table dataSource={tasks} columns={columns} rowKey={(record) => record.id_tarea} title={() =>'Tareas Generales'} />
      <Table dataSource={tasksByGroup} columns={columnsByGroup} rowKey={(record) => record.id_tarea} title={() => 'Tareas por Grupo'} />

      {/* Modal de edición */}
      <Modal
        title="Editar Tarea"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveChanges}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Estatus" name="estatus" rules={[{ required: true, message: "Campo obligatorio" }]}>
            <Select>
              <Option value="pendiente">Pendiente</Option>
              <Option value="completado">Completado</Option>
              <Option value="terminado">Terminado</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;