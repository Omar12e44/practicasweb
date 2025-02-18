import { Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface TaskFormValues {
  nameTask: string;
  descripcion: string;
  categoria: string;
  estatus: "Pendiente" | "En progreso" | "Completado";
  deadLine: dayjs.Dayjs; // DatePicker usa dayjs
}

const TaskForm: React.FC = () => {
  const [form] = Form.useForm();

  // Función para enviar la tarea al backend
  const onFinish = async (values: TaskFormValues) => {
    try {
      const taskData = {
        nameTask: values.nameTask,
        descripcion: values.descripcion,
        categoria: values.categoria,
        estatus: values.estatus,
        deadLine: values.deadLine.format("YYYY-MM-DD HH:mm:ss"), // Formatear fecha
      };

      const response = await fetch("http://127.0.0.1:5000/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Tarea creada exitosamente");
        form.resetFields();
      } else {
        message.error(result.intMessage || "Error al crear la tarea");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Error de conexión con el servidor");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Nombre de la Tarea"
        name="nameTask"
        rules={[{ required: true, message: "Este campo es obligatorio" }]}
      >
        <Input placeholder="Ej: Hacer reporte" />
      </Form.Item>

      <Form.Item
        label="Descripción"
        name="descripcion"
        rules={[{ required: true, message: "Este campo es obligatorio" }]}
      >
        <Input.TextArea placeholder="Describe la tarea" />
      </Form.Item>

      <Form.Item
        label="Categoría"
        name="categoria"
        rules={[{ required: true, message: "Selecciona una categoría" }]}
      >
        <Input placeholder="Ej: Trabajo, Personal, Salud" />
      </Form.Item>

      <Form.Item
        label="Estatus"
        name="estatus"
        rules={[{ required: true, message: "Selecciona un estatus" }]}
      >
        <Select placeholder="Selecciona un estatus">
          <Option value="Pendiente">Pendiente</Option>
          <Option value="En progreso">En progreso</Option>
          <Option value="Completado">Completado</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Fecha Límite"
        name="deadLine"
        rules={[{ required: true, message: "Selecciona una fecha límite" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Crear Tarea
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskForm;
