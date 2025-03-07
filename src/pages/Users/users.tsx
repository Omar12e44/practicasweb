import { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const apiUrl = "https://practicaswebback.onrender.com";
const UserList = () => {
  interface User {
    id: string;
    userName: string;
    email: string;
    rol: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: User[] }>(`${apiUrl}/get_usuarios`);
      setUsers(res.data.data); // Extraer el array de usuarios de la propiedad `data`
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Error al cargar usuarios');
    }
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/delate_users/${id}`);
      message.success('Usuario eliminado');
      fetchUsers();
    } catch {
      message.error('Error al eliminar usuario');
    }
  };

  const showEditModal = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      username: user.userName,
      email: user.email,
      rol: user.rol,
      password: '',
    });
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
    setSelectedUser(null);
  };

  const handleUpdate = async (values: { username: string; email: string; rol: string; password: string }) => {
    if (selectedUser) {
      try {
        await axios.put(`${apiUrl}/update_users/${selectedUser.id}`, values);
        message.success('Usuario actualizado');
        fetchUsers();
        setIsEditModalVisible(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error updating user:', error);
        message.error('Error al actualizar usuario');
      }
    }
  };

  const handleAdd = async (values: { username: string; email: string; rol: string; password: string }) => {
    try {
      await axios.post(`${apiUrl}/add_users`, values);
      message.success('Usuario agregado');
      fetchUsers();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Error adding user:', error);
      message.error('Error al agregar usuario');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Nombre',
      dataIndex: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
    },
    {
      title: 'Acciones',
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}>Editar</Button>
          <Popconfirm
            title="¿Eliminar usuario?"
            onConfirm={() => deleteUser(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 20 }}>
        Agregar Usuario
      </Button>
      <Table columns={columns} dataSource={users} loading={loading} rowKey="id" />
      <Modal
        title="Editar Usuario"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedUser && (
          <Form form={form} onFinish={handleUpdate}>
            <Form.Item name="username" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Por favor ingrese el email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Por favor ingrese el rol' }]}>
              <Select>
                <Option value="admin">Admin</Option>
                <Option value="worker">Worker</Option>
                <Option value="master">Master</Option>
              </Select>
            </Form.Item>
       
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Actualizar
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="Agregar Usuario"
        visible={isAddModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd}>
          <Form.Item name="username" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Por favor ingrese el email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Por favor ingrese el rol' }]}>
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="worker">Worker</Option>
              <Option value="master">Master</Option>
            </Select>
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Por favor ingrese la contraseña' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Agregar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;