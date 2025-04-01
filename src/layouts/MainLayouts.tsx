import { ReactNode, useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, message } from 'antd';
import { Link } from 'react-router-dom';


interface MainLayoutProps {
  children: ReactNode;
}

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(null); // Estado para almacenar el rol del usuario


  const {
    token: {  borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const storedRole = localStorage.getItem('rol');
    setRole(storedRole);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("id_usuario");
    
    message.success("Sesión cerrada correctamente");
    window.location.href = "/"; // Redirige al login
  };
  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Barra lateral */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240} // Establecemos un ancho fijo
        style={{
          background: '#003366', // Azul oscuro para la barra lateral
          position: 'fixed', // Hacemos que se quede pegado a la izquierda
          height: '100vh', // Aseguramos que ocupe toda la altura
        }}
      >
        <div
          style={{
            height: 64,
            background: '#004C99', // Azul intermedio para la parte superior
            margin: 16,
            borderRadius: borderRadiusLG,
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <CheckSquareOutlined />,
              label: <Link to="/dashboard">Tareas</Link>,
            },
            ...(role === 'admin'
              ? [
                  {
                    key: '2',
                    icon: <VideoCameraOutlined />,
                    label: <Link to="/grupos">Grupos</Link>,
                  },
                  {
                    key: '3',
                    icon: <UploadOutlined />,
                    label: <Link to="/usuarios">Usuarios</Link>,
                  },
                ]
              : []),
          ]}
          style={{
            background: '#003366', 
          }}
        />
      </Sider>

      {/* Contenido principal */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'margin-left 0.3s', backgroundColor: '#F8F9FA' }}>
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: '#0066CC', // Azul principal para el header
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'white', // Color blanco para el texto en el header
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '20px',
              width: 64,
              height: 64,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white', // Color blanco para el ícono
            }}
          />
          <Button type="default" onClick={handleLogout}>
  Cerrar Sesión
</Button>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#F8F9FA', // Fondo claro para el contenido
            borderRadius: borderRadiusLG,
            flex: 1, // Asegura que el contenido ocupe el espacio restante
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
