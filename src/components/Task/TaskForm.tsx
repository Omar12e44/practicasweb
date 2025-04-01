/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";  

interface TaskFormProps {
  onTaskCreated?: () => void;
}

const { Option } = Select;

interface TaskForm {
  nameTask: string;
  descripcion: string;
  categoria: string;
  estatus: "Pendiente" | "En progreso" | "Completado";
  deadLine: dayjs.Dayjs;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onFinish = async (values: TaskForm) => {
    try {
      const taskData = {
        ...values,
        deadLine: values.deadLine.format("YYYY-MM-DD HH:mm:ss"),
      };

      // Obtener el token desde el almacenamiento local (o cualquier otro método que utilices)
      const token = localStorage.getItem("token");
      console.log(token);
      

      if (!token) {
        message.error("No se encontró el token de autenticación.");
        return;
      }
      console.log("Datos de la tarea que se enviarán:", taskData);


      const response = await fetch("http://127.0.0.1:5000/create_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Aquí se agrega el token
        },
        body: JSON.stringify(taskData),
        
                
      });
        
      const result = await response.json();

      if (response.ok) {
        message.success("Tarea creada exitosamente");
        form.resetFields();
        setIsModalVisible(false); // Cierra el modal
        if (onTaskCreated) {
          onTaskCreated(); // Llama a la función de actualización
        }
      } else {
        message.error(result.intMessage || "Error al crear la tarea");
      }
    } catch (error) {
      message.error("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Crear Nueva Tarea
      </Button>

      <Modal
        title="Nueva Tarea"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
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
              <option value="En revision">Revisión</option>
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
      </Modal>
    </>
  );
};

export default TaskForm;
