import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from "antd";

interface User {
  id: string;
  userName: string;
  email: string;
  rol: string;
}

const CrudUsers = () => {
  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios
  const [isModalVisible, setIsModalVisible] = useState(false); // Control del modal
  const [editingUser, setEditingUser] = useState<User | null>(null); // Usuario en edición
  const [form] = Form.useForm();

  const apiUrl = "http://127.0.0.1:5000"; // Cambia esto por la URL de tu API

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/get_usuarios`);
      const result = await response.json();

      if (!Array.isArray(result.data)) {
        throw new Error("La respuesta de la API no contiene un array de usuarios.");
      }

      setUsers(result.data); // Asegúrate de que `result.data` sea un array
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      message.error("Error al cargar los usuarios.");
    }
  };

  // Crear o actualizar usuario
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Actualizar usuario
        await fetch(`${apiUrl}/update_users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            rol: values.rol,
            username: values.userName,
          }),
        });
        message.success("Usuario actualizado con éxito.");
      } else {
        // Crear usuario
        await fetch(`${apiUrl}/add_users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            rol: values.rol,
            username: values.userName,
          }),
        });
        message.success("Usuario creado con éxito.");
      }
      setIsModalVisible(false);
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      message.error("Error al guardar el usuario.");
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id: string) => {
    try {
      await fetch(`${apiUrl}/delete_users/${id}`, {
        method: "DELETE",
      });
      message.success("Usuario eliminado con éxito.");
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      message.error("Error al eliminar el usuario.");
    }
  };

  // Abrir modal para crear o editar usuario
  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue({
        userName: user.userName,
        email: user.email,
        rol: user.rol,
      });
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Columnas de la tabla
  const columns = [
    { title: "Nombre", dataIndex: "userName", key: "userName" },
    { title: "Correo", dataIndex: "email", key: "email" },
    { title: "Rol", dataIndex: "rol", key: "rol" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: User) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Crear Usuario
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        title={editingUser ? "Editar Usuario" : "Crear Usuario"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveUser}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre"
            name="userName"
            rules={[{ required: true, message: "El nombre es obligatorio." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: "El correo es obligatorio." },
              { type: "email", message: "El correo no es válido." },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Rol"
            name="rol"
            rules={[{ required: true, message: "El rol es obligatorio." }]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="worker">Worker</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CrudUsers;