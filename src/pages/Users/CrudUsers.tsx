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
  //const apiUrl = "https://practicaswebback.onrender.com";

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

  // Crear usuario
  const createUser = async (values: { email: string; rol: string; userName: string; password: string }) => {
    try {
      const response = await fetch(`${apiUrl}/add_users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          rol: values.rol,
          username: values.userName,
          password: values.password, // Enviar la contraseña al backend
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el usuario.");
      }

      message.success("Usuario creado con éxito.");
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al crear usuario:", error);
      message.error("Error al crear el usuario.");
    }
  };

  // Actualizar usuario
  const updateUser = async (values: { email: string; rol: string; userName: string }) => {
    try {
      const response = await fetch(`${apiUrl}/update_users/${editingUser?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          rol: values.rol,
          username: values.userName,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario.");
      }

      message.success("Usuario actualizado con éxito.");
      fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      message.error("Error al actualizar el usuario.");
    }
  };

  // Guardar usuario (crear o actualizar)
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser(values); // Llamar a la función de actualización
      } else {
        await createUser(values); // Llamar a la función de creación
      }
      setIsModalVisible(false);
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
          {!editingUser && ( // Mostrar el campo de contraseña solo al crear un usuario
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "La contraseña es obligatoria." }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default CrudUsers;