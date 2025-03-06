import { useEffect, useState } from "react";
import { Table, Button, Input, Modal, Form, Select, message, DatePicker } from "antd";
import {
  obtenerGrupos,
  obtenerMisGrupos,
  crearGrupo,
  eliminarGrupo,
  agregarUsuarioAGrupo,
  obtenerUsuarios,
  agregarTareaAGrupo,
} from "./grupoService";

const Grupos = () => {
  const [grupos, setGrupos] = useState<{ id: string; name: string; created_by: string; created_at: string }[]>([]);
  const [misGrupos, setMisGrupos] = useState<{ id: string; name: string; created_by: string; created_at: string }[]>([]);
  const [nuevoGrupo, setNuevoGrupo] = useState("");
  const [rol, setRol] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal para agregar usuario
  const [isModalTareaVisible, setIsModalTareaVisible] = useState(false); // Modal para agregar tarea
  
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<{ id: string; name: string } | null>(null);
  const [usuarios, setUsuarios] = useState<{ userName: string; id: string; name: string }[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<string[]>([]);
  const [tareaDetails, setTareaDetails] = useState({
    nameTask: "",
    descripcion: "",
    categoria: "",
    estatus: "",
    deadLine: "",
  });


  useEffect(() => {
    verificarRolYToken();
  }, []);

  useEffect(() => {
    if (rol && token) {
      console.log("Rol y token obtenidos, cargando grupos...");
      cargarGrupos();
      cargarUsuarios();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rol, token]);

  const verificarRolYToken = () => {
    const userRol = localStorage.getItem("rol");
    const userToken = localStorage.getItem("token");
    console.log("Rol obtenido:", userRol);
    console.log("Token obtenido:", userToken);
    setRol(userRol || "");
    setToken(userToken);
  };

  const cargarGrupos = async () => {
    if (!token) return console.error("Token no encontrado");
    try {
      if (rol === "admin" || rol === "master") {
        console.log("Obteniendo todos los grupos...");
        const response = await obtenerGrupos();
        const data = response.data as { data: { id: string; name: string; created_by: string; created_at: string }[] };
        setGrupos(Array.isArray(data.data) ? data.data : []);
      } else {
        console.log("Obteniendo mis grupos...");
        const response = await obtenerMisGrupos();
        const data = response.data as { data: { id: string; name: string; created_by: string; created_at: string }[] };
        setMisGrupos(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error("Error cargando grupos:", error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await obtenerUsuarios();
      const responseData = response.data as { data: { userName: string; id: string; name: string }[] };
      if (Array.isArray(responseData.data)) {
        setUsuarios(responseData.data);
      } else {
        console.error("Los datos de usuarios no son un array:", responseData.data);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const handleCrearGrupo = async () => {
    if (!token || !nuevoGrupo.trim()) return;
    try {
      await crearGrupo(nuevoGrupo);
      setNuevoGrupo("");
      cargarGrupos();
    } catch (error) {
      console.error("Error creando grupo:", error);
    }
  };

  const handleEliminarGrupo = async (idGrupo: string) => {
    if (!token) return;
    try {
      await eliminarGrupo(idGrupo, token);
      message.success("Grupo eliminado exitosamente");
      cargarGrupos();
    } catch (error) {
      console.error("Error eliminando grupo:", error);
    }
  };

  const handleAgregarUsuario = (grupo: { id: string; name: string }) => {
    setGrupoSeleccionado(grupo);
    setIsModalVisible(true);
  };

  const handleConfirmarAgregarUsuario = async () => {
    if (!token || !grupoSeleccionado || !usuarioSeleccionado) return console.error("Token, grupo o usuario no encontrado");
    const usuario = usuarios.find((u) => u.id === usuarioSeleccionado);
    if (usuario) {
      try {
        await agregarUsuarioAGrupo(grupoSeleccionado.id, usuario.id, usuario.userName);
        setIsModalVisible(false);
        setGrupoSeleccionado(null);
        setUsuarioSeleccionado(null);
        cargarGrupos();
      } catch (error) {
        console.error("Error agregando usuario al grupo:", error);
        alert("No tienes permisos para agregar usuarios a este grupo.");
      }
    } else {
      console.error("Usuario no encontrado.");
      alert("Usuario no encontrado.");
    }
  };


  const handleConfirmarAgregarTarea = async () => {
    if (!token || !grupoSeleccionado || usuariosSeleccionados.length === 0) return console.error("Token, grupo o usuarios no encontrados");
  
    const usernames = usuariosSeleccionados.map((id) => {
        const usuario = usuarios.find((u) => u.id === id);
        return usuario ? usuario.userName : null;
    }).filter((name) => name !== null);
  
    if (usernames.length === 0) return alert("No se han seleccionado usuarios válidos.");

    // Validar y formatear la fecha
    let fechaFormateada = "";
    try {
        if (!tareaDetails.deadLine) {
            throw new Error("Fecha no proporcionada");
        }
        console.log("Fecha de vencimiento proporcionada:", tareaDetails.deadLine);
        const fecha = new Date(tareaDetails.deadLine);
        if (isNaN(fecha.getTime())) {
            throw new Error("Fecha inválida");
        }
        fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
        console.error("Error de fecha:", error);
        alert("La fecha de vencimiento no es válida.");
        console.log("fec", fechaFormateada);
        return; // Detener ejecución si la fecha es inválida
    }

    const dataToSend = {
        idGrupo: grupoSeleccionado.id,
        idsUsuarios: usuariosSeleccionados,
        usernames: usernames,
        nameTask: tareaDetails.nameTask,
        descripcion: tareaDetails.descripcion,
        categoria: tareaDetails.categoria,
        estatus: tareaDetails.estatus,
        deadLine: fechaFormateada,
    };

    console.log("Datos que se enviarán al backend:", dataToSend);
    try {
        await agregarTareaAGrupo(dataToSend, token);
        setIsModalTareaVisible(false); // Cerrar la modal de tarea
        setGrupoSeleccionado(null);
        setUsuariosSeleccionados([]);
        setTareaDetails({
            nameTask: "",
            descripcion: "",
            categoria: "",
            estatus: "",
            deadLine: "",
        });
        cargarGrupos();
    } catch (error) {
        console.error("Error agregando tarea al grupo:", error);
        alert("No tienes permisos para agregar tareas a este grupo.");
    }
};


  const columns = [
    {
      title: "Nombre del Grupo",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Creado Por",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Fecha de Creación",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: { id: string; name: string; created_by: string; created_at: string }) => (
        (rol === "admin" || rol === "master") && (
          <>
            <Button type="link" onClick={() => handleAgregarUsuario(record)}>Agregar Usuario</Button>
            <Button type="link" onClick={() => handleEliminarGrupo(record.id)}>Eliminar</Button>
            <Button type="link" onClick={() => { setIsModalTareaVisible(true); setGrupoSeleccionado(record); }}>
              Agregar Tarea
            </Button>
          </>
        )
      ),
    },
  ];
  return (
    <div>
      <h2>Gestión de Grupos</h2>

      {/* Formulario para crear un nuevo grupo (solo admin/master) */}
      {(rol === "admin" || rol === "master") && (
        <div>
          <Input
            type="text"
            placeholder="Nombre del grupo"
            value={nuevoGrupo}
            onChange={(e) => setNuevoGrupo(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <Button type="primary" onClick={handleCrearGrupo}>Crear Grupo</Button>
        </div>
      )}

      {/* Lista de grupos */}
      <h3>{rol === "worker" ? "Mis Grupos" : "Todos los Grupos"}</h3>
      <Table
        dataSource={rol === "worker" ? misGrupos : grupos}
        columns={columns}
        rowKey="id"
      />

<Modal
  title="Agregar Tarea al Grupo"
  visible={isModalTareaVisible}
  onOk={handleConfirmarAgregarTarea}
  onCancel={() => setIsModalTareaVisible(false)}
>
  <Form layout="vertical">
    {/* Seleccionar Usuarios */}
    <Form.Item label="Seleccionar Usuarios">
      <Select
        mode="multiple"
        value={usuariosSeleccionados}
        onChange={(value) => setUsuariosSeleccionados(value)}
        style={{ width: '100%' }}
      >
        {usuarios.map((usuario) => (
          <Select.Option key={usuario.id} value={usuario.id}>
            {usuario.userName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    {/* Campos para la tarea */}
    <Form.Item label="Nombre de la Tarea">
      <Input
        value={tareaDetails.nameTask}
        onChange={(e) => setTareaDetails({ ...tareaDetails, nameTask: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="Descripción">
      <Input
        value={tareaDetails.descripcion}
        onChange={(e) => setTareaDetails({ ...tareaDetails, descripcion: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="Categoría">
      <Input
        value={tareaDetails.categoria}
        onChange={(e) => setTareaDetails({ ...tareaDetails, categoria: e.target.value })}
      />
    </Form.Item>
    <Form.Item label="Estatus">
      <Input
        value={tareaDetails.estatus}
        onChange={(e) => setTareaDetails({ ...tareaDetails, estatus: e.target.value })}
      />
    </Form.Item>
    <Form.Item 
    label="Fecha de Vencimiento"
    name="deadLine"
    rules={[{ required: true, message: "Selecciona la fecha límite" }]}
>
    <DatePicker 
        showTime 
        format="YYYY-MM-DD HH:mm:ss" 
        onChange={(_date, dateString) => setTareaDetails({ ...tareaDetails, deadLine: String(dateString) })}
    />
</Form.Item>
  </Form>
</Modal>
      {/* Modal para agregar usuario al grupo */}
      <Modal
  title="Agregar Usuario al Grupo"
  visible={isModalVisible}
  onOk={handleConfirmarAgregarUsuario}
  onCancel={() => {
    setIsModalVisible(false);
    setUsuarioSeleccionado(null); // Resetear el usuario seleccionado
  }}
>
  <Form layout="vertical">
  <Form.Item label="Seleccionar Usuario">
  <Select
    value={usuarioSeleccionado}
    onChange={(value) => setUsuarioSeleccionado(value)}
    style={{ width: '100%' }}
  >
    {usuarios.map((usuario) => (
      <Select.Option key={usuario.id} value={usuario.id}>
        {usuario.userName}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default Grupos;