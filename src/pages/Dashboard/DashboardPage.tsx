/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Select } from "antd";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import "../../App.css";
import TaskForm from "../../components/Task/TaskForm";

const Dashboard = () => {
  interface Task {
    id_tarea: any;
    grupo: any;
    uid: string;
    id: string;
    nameTask: string;
    descripcion: string;
    categoria: string;
    estatus: string;
    deadLine: string | number | Date;
    grupo_name?: string; // Nombre del grupo (opcional)
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksByGroup, setTasksByGroup] = useState<Task[]>([]); // Tareas por grupo
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [form] = Form.useForm();
  const [rol, setRol] = useState<string | null>(null); // Estado para almacenar el rol del usuario

  //const apiUrl = "https://practicaswebback.onrender.com";
  const apiUrl = "http://127.0.0.1:5000"; // URL de la API local (opcional)


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
        id: task.id, // Asegúrate de que cada tarea tenga el 'id' del documento de Firestore
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
  
      if (!Array.isArray(result.data)) {
        throw new Error("La respuesta de la API no contiene una lista de tareas.");
      }
  
      // Mapea los datos para asegurarte de que los campos necesarios estén presentes
      const tasks = result.data.map((task: Task) => ({
        ...task,
        grupo: task.grupo, // ID del grupo
        grupo_name: task.grupo_name, // Nombre del grupo
        id_tarea: task.id_tarea, // ID de la tarea
      }));
  
      // Asignamos los datos obtenidos al estado
      setTasksByGroup(tasks);
    } catch (error) {
      console.error("❌ Error al obtener tareas por grupo:", error);
      message.error("Error de conexión con el servidor");
      setTasksByGroup([]);
    }
  };


  useEffect(() => {
    fetchTasks();
    fetchTasksByGroup();
    const userRol = localStorage.getItem("rol");
    setRol(userRol); // Guardar el rol del usuario en el estado
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
    setSelectedTask(task); // Establece la tarea seleccionada
    setIsModalVisible(true); // Muestra el modal
  
    // Configura los valores del formulario con los datos de la tarea seleccionada
    form.setFieldsValue({
      nameTask: task.nameTask || "", // Nombre de la tarea
      descripcion: task.descripcion || "", // Descripción de la tarea
      categoria: task.categoria || "", // Categoría de la tarea
      estatus: task.estatus || "", // Estatus de la tarea
      deadLine: task.deadLine || "", // Fecha límite de la tarea
    });
  };
  // Función para guardar cambios en la tarea
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedTask) return;
  
    console.log("Tarea seleccionada:", selectedTask); // Verifica que selectedTask tiene los valores correctos
  
    try {
      const values = await form.validateFields();

      console.log("Valores del formulario:", values); // Verifica los valores del formulario
  
      // Obtén el group_id y task_id de la tarea seleccionada
      const groupId = selectedTask.grupo; // Campo correcto para el group_id
      const taskId = selectedTask.id_tarea; // Campo correcto para el task_id
  
      if (!groupId || !taskId) {
        throw new Error("group_id o task_id no están definidos");
      }
  
      // Construye la URL con los parámetros correctos
      const response = await fetch(`${apiUrl}/update_task/${groupId}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        message.success("Tarea actualizada con éxito");
        setIsModalVisible(false);
        fetchTasksByGroup(); // Recargar las tareas por grupo
      } else {
        message.error(result.intMessage || "Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
      message.error("Error de conexión con el servidor");
    }
  };


  const handleSaveGeneralTask = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedTask) return;
  
    try {
      const values = await form.validateFields();
      console.log("Valores del formulario (tarea general):", values);
  
      const taskId = selectedTask.id; // Usar el campo `id` para tareas generales
  
      if (!taskId) {
        throw new Error("task_id no está definido");
      }
  
      const response = await fetch(`${apiUrl}/update_general_task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        message.success("Tarea general actualizada con éxito");
        setIsModalVisible(false);
        fetchTasks(); // Recargar las tareas generales
      } else {
        message.error(result.intMessage || "Error al actualizar la tarea general");
      }
    } catch (error) {
      console.error("❌ Error al actualizar tarea general:", error);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Task) => (
        <>
          <Button type="primary" onClick={() => handleEditTask(record)}   style={{ marginRight: 8 }}>
            Editar
          </Button>
          <Button type="default" danger onClick={() => handleDeleteTask(record.id)}>
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
      title: "Grupo", // Nueva columna para el nombre del grupo
      dataIndex: "grupo_name",
      key: "grupo_name",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Task) => (
        <>
          <Button type="primary" onClick={() => handleEditTask(record)} style={{ marginRight: 8 }}>
            Editar
          </Button>
          {rol === "admin" && (
        <Button type="default" danger onClick={() => handleDeleteTask(record.id)}>
          Eliminar
        </Button>
      )}
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
      <Table dataSource={tasks} columns={columns} rowKey={(record) => record.id} title={() =>'Tareas Generales'} />
      <Table dataSource={tasksByGroup} columns={columnsByGroup} rowKey={(record) => record.id} title={() => 'Tareas por Grupo'} />

      {/* Modal de edición */}
      <Modal
  title="Editar Tarea"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  onOk={() => {
    if (selectedTask?.grupo) {
      handleSaveChanges(); // Guardar tarea por grupo
    } else {
      handleSaveGeneralTask(); // Guardar tarea general
    }
  }}
>
  <Form form={form} layout="vertical">
    {/* Mostrar todos los campos si es una tarea general o si el usuario es admin */}
    {(!selectedTask?.grupo || rol === "admin") && (
      <>
        <Form.Item
          label="Nombre"
          name="nameTask"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Descripción" name="descripcion">
          <Input />
        </Form.Item>
        <Form.Item label="Categoría" name="categoria">
          <Input />
        </Form.Item>
      </>
    )}
    {/* Campo de estatus siempre visible */}
    <Form.Item
      label="Estatus"
      name="estatus"
      rules={[{ required: true, message: "Campo obligatorio" }]}
    >
      <Select>
        <Select.Option value="Pendiente">Pendiente</Select.Option>
        <Select.Option value="En proceso">En proceso</Select.Option>
        <Select.Option value="Completado">Completado</Select.Option>
        <Select.Option value="Revisión">Revisión</Select.Option>
      </Select>
    </Form.Item>
    {/* Mostrar fecha límite solo si es admin */}
    {rol === "admin" && (
      <Form.Item label="Fecha Límite" name="deadLine">
        <Input />
      </Form.Item>
    )}
  </Form>
</Modal>
    </div>
  );
};

export default Dashboard;
