const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: localStorage.getItem("token") || null,
      userEmail: localStorage.getItem("userEmail") || null,
      // Datos estáticos para la UI
      SELECTED_COUNTRIES: [
        "Australia",
        "England",
        "Canada",
        "USA",
        "South Africa",
        "United Arab Emirates",
        "Malta",
        "Ireland",
        "NZL"
      ],

      infoPaises : [
        {
          country: "Australia",
          name: "Australia",
          description: "País de paisajes diversos y cultura vibrante",
          imageUrl: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "England",
          name: "Reino Unido",
          description: "Cuna del idioma inglés con rica historia",
          imageUrl: "https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "Canada",
          name: "Canadá",
          description: "País de paisajes naturales y ciudades cosmopolitas",
          imageUrl: "https://plus.unsplash.com/premium_photo-1694475393287-88027e0fbde4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "USA",
          name: "Estados Unidos",
          description: "País diverso con oportunidades educativas y culturales",
          imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "South Africa",
          name: "Sudáfrica",
          description: "País con diversidad cultural y paisajes únicos",
          imageUrl: "https://plus.unsplash.com/premium_photo-1697730061063-ad499e343f26?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "United Arab Emirates",
          name: "Emiratos Árabes Unidos",
          description: "País de lujo y modernidad en el desierto, Disfruta de Dubai, en este increíble país.",
          imageUrl: "https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "Malta",
          name: "Malta",
          description: "Isla mediterránea con playas paradisíacas",
          imageUrl: "https://plus.unsplash.com/premium_photo-1661963984279-1b0fa1b3ac0d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
          country: "Ireland",
          name: "Irlanda",
          description: "País verde con una rica tradición cultural y educativa",
          imageUrl: "https://images.unsplash.com/photo-1589927986089-35812389fcc2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
        },
        {
          country: "NZL",
          name: "Nueva Zelanda",
          description: "Paisajes de película y excelente calidad de vida",
          imageUrl: "https://images.unsplash.com/photo-1532210312229-872e8f842dd0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
        }
      ],
      cursosFront: [
        {
          country: "CampamentoVerano",
          name: "Campamento de Verano",
          destinos: "United States, Canada, Malta, Irlanda, Sudáfrica, Dubai, Reino Unido",
          edades: "12-17 años",
          description: "Un campamento de verano para jóvenes de 12 a 17 años.",
          imageUrl: "https://example.com/summer_camp.jpg",
          duration: "2 semanas",
          services: "Alojamiento, actividades, clases de inglés, excursiones",
          idiomas: "Inglés"
        },
        {
          country: "InglesUK",
          name: "Curso de Inglés en UK",
          destinos: "Reino Unido",
          edades: "18+",
          description: "Curso intensivo de inglés en Londres.",
          imageUrl: "https://example.com/uk_english.jpg",
          duration: "4 semanas",
          services: "Alojamiento con familia, clases, actividades culturales",
          idiomas: "Inglés"
        },
      ],
      // Datos dinámicos del backend
      destinos: [],
      ciudades: [],
      idiomas: [],
      cursos: [],
      servicios: [],
      clientes: [],
      testimonios: [],
      usuario: null
    },
    actions: {
      //-------------------------------------------------------------------------------------------
      // AUTENTICACIÓN
      //-------------------------------------------------------------------------------------------
      
      /**
       * Inicia sesión de usuario
       * @param {string} email - Email del usuario
       * @param {string} clave - Contraseña del usuario
       * @returns {Object} - Objeto con éxito y mensaje
       */
      login: async (email, clave) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, clave })
          });

          const data = await response.json();
          
          if (response.ok) {
            // Guardar token y email en localStorage y store
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", email);
            setStore({ 
               ...getStore(),
              token: data.token,
              userEmail: email
            });
            return { success: true, message: "Inicio de sesión exitoso" };
          } else {
            return { success: false, message: data.error || "Error en credenciales" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      /**
       * Cierra la sesión del usuario
       */
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        setStore({ 
          token: null,
          userEmail: null,
          usuario: null
        });
      },

      //-------------------------------------------------------------------------------------------
      // USUARIOS
      //-------------------------------------------------------------------------------------------
      
      /**
       * Crea un nuevo usuario
       * @param {Object} userData - Datos del usuario
       * @returns {Object} - Objeto con éxito y mensaje
       */
      createUsuario: async (userData) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuario`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
          });

          const data = await response.json();
          
          if (response.ok) {
            return { success: true, message: "Usuario creado exitosamente" };
          } else {
            return { success: false, message: data.error || "Error al crear usuario" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      /**
       * Obtiene información del usuario actual
       * @returns {Object} - Objeto con éxito y datos del usuario
       */
      getCurrentUser: async () => {
        const store = getStore();
        if (!store.token) return { success: false, message: "No autenticado" };
        
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuario/edit`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.token}`
            }
          });

          const data = await response.json();
          
          if (response.ok) {
            setStore({...getStore(), usuario: data });
            return { success: true, usuario: data };
          } else {
            return { success: false, message: data.error || "Error al obtener usuario" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      /**
       * Actualiza información del usuario
       * @param {Object} userData - Datos actualizados del usuario
       * @returns {Object} - Objeto con éxito y mensaje
       */
      updateUsuario: async (userData) => {
        const store = getStore();
        if (!store.token) return { success: false, message: "No autenticado" };
        
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuario/edit`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(userData)
          });

          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), usuario: data });
            return { success: true, message: "Usuario actualizado" };
          } else {
            return { success: false, message: data.error || "Error al actualizar" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      //-------------------------------------------------------------------------------------------
      // DESTINOS
      //-------------------------------------------------------------------------------------------
      
      /**
       * Obtiene todos los destinos
       * @returns {Object} - Objeto con éxito y lista de destinos
       */
      getDestinos: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/destino`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), destinos: data });
            return { success: true, destinos: data };
          } else {
            return { success: false, message: data.error || "Error al obtener destinos" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      /**
       * Crea un nuevo destino
       * @param {Object} destinoData - Datos del destino
       * @returns {Object} - Objeto con éxito y mensaje
       */
      createDestino: async (destinoData) => {
        const store = getStore();
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/destino`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(destinoData)
          });

          const data = await response.json();
          
          if (response.ok) {
            // Actualizar lista de destinos en el store
            const newDestinos = [...store.destinos, data];
            setStore({ ...getStore(), destinos: newDestinos });
            return { success: true, message: "Destino creado" };
          } else {
            return { success: false, message: data.error || "Error al crear destino" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      // Implementar updateDestino, deleteDestino siguiendo el mismo patrón...

      //-------------------------------------------------------------------------------------------
      // CIUDADES
      //-------------------------------------------------------------------------------------------
      
      /**
       * Obtiene todas las ciudades
       * @returns {Object} - Objeto con éxito y lista de ciudades
       */
      getCiudades: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ciudad`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), ciudades: data });
            return { success: true, ciudades: data };
          } else {
            return { success: false, message: data.error || "Error al obtener ciudades" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      /**
       * Crea una nueva ciudad
       * @param {Object} ciudadData - Datos de la ciudad
       * @returns {Object} - Objeto con éxito y mensaje
       */
      createCiudad: async (ciudadData) => {
        const store = getStore();
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ciudad`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(ciudadData)
          });

          const data = await response.json();
          
          if (response.ok) {
            // Actualizar lista de ciudades en el store
            const newCiudades = [...store.ciudades, data];
            setStore({ ...getStore(), ciudades: newCiudades });
            return { success: true, message: "Ciudad creada" };
          } else {
            return { success: false, message: data.error || "Error al crear ciudad" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      //-------------------------------------------------------------------------------------------
      // IDIOMAS
      //-------------------------------------------------------------------------------------------
      
      /**
       * Obtiene todos los idiomas
       * @returns {Object} - Objeto con éxito y lista de idiomas
       */
      getIdiomas: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/idioma`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), idiomas: data });
            return { success: true, idiomas: data };
          } else {
            return { success: false, message: data.error || "Error al obtener idiomas" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      // Implementar createIdioma, updateIdioma, deleteIdioma...

      //-------------------------------------------------------------------------------------------
      // CURSOS
      //-------------------------------------------------------------------------------------------
      
      /**
       * Obtiene todos los cursos
       * @returns {Object} - Objeto con éxito y lista de cursos
       */
      getCursos: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/curso`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), cursos: data });
            return { success: true, cursos: data };
          } else {
            return { success: false, message: data.error || "Error al obtener cursos" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      /**
       * Crea un nuevo curso
       * @param {Object} cursoData - Datos del curso
       * @returns {Object} - Objeto con éxito y mensaje
       */
      createCurso: async (cursoData) => {
        const store = getStore();
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/curso`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(cursoData)
          });

          const data = await response.json();
          
          if (response.ok) {
            // Actualizar lista de cursos en el store
            const newCursos = [...store.cursos, data];
            setStore({ ...getStore(), cursos: newCursos });
            return { success: true, message: "Curso creado" };
          } else {
            return { success: false, message: data.error || "Error al crear curso" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      //-------------------------------------------------------------------------------------------
      // SERVICIOS
      //-------------------------------------------------------------------------------------------
      
      /**
       * Obtiene todos los servicios
       * @returns {Object} - Objeto con éxito y lista de servicios
       */
      getServicios: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/servicio`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), servicios: data });
            return { success: true, servicios: data };
          } else {
            return { success: false, message: data.error || "Error al obtener servicios" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      // Implementar createServicio, updateServicio, deleteServicio...

      //-------------------------------------------------------------------------------------------
      // CLIENTES
      //-------------------------------------------------------------------------------------------
      
      /**
       * Crea un nuevo cliente (lead)
       * @param {Object} clienteData - Datos del cliente
       * @returns {Object} - Objeto con éxito y mensaje
       */
      createCliente: async (clienteData) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cliente`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clienteData)
          });

          const data = await response.json();
          
          if (response.ok) {
            return { success: true, message: "Sus datos han sido registrados" };
          } else {
            return { success: false, message: data.error || "Error al registrar cliente" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },


      updateCliente: async (id, updatedData) => {
        const store = getStore();
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cliente/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(updatedData)
          });

          const data = await response.json();
          
          if (response.ok) {
            // Actualizar el store local
            const updatedClientes = store.clientes.map(cliente => 
              cliente.idCliente === id ? { ...cliente, ...updatedData } : cliente
            );
            
            setStore({ ...getStore(), clientes: updatedClientes });
            
            return { success: true, message: "Cliente actualizado", cliente: data };
          } else {
            return { success: false, message: data.error || "Error al actualizar cliente" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      getClientes: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cliente`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), clientes: data });
            return { success: true, clientes: data };
          } else {
            return { success: false, message: data.error || "Error al obtener clientes" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };  
        }
      },

      /**
       * Obtiene un cliente por email
       * @param {string} email - Email del cliente
       * @returns {Object} - Objeto con éxito y datos del cliente
       */
      getClienteByEmail: async (email) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cliente/email/${email}`);
          const data = await response.json();
          
          if (response.ok) {
            return { success: true, cliente: data };
          } else {
            return { success: false, message: data.error || "Cliente no encontrado" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      //-------------------------------------------------------------------------------------------
      // TESTIMONIOS
      //-------------------------------------------------------------------------------------------
      
      /**
       * Obtiene todos los testimonios
       * @returns {Object} - Objeto con éxito y lista de testimonios
       */
      getTestimonios: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/testimonio`);
          const data = await response.json();
          
          if (response.ok) {
            setStore({ ...getStore(), testimonios: data });
            return { success: true, testimonios: data };
          } else {
            return { success: false, message: data.error || "Error al obtener testimonios" };
          }
        } catch (error) {
          return { success: false, message: "Error de conexión: " + error.message };
        }
      },

      // Implementar createTestimonio, updateTestimonio, deleteTestimonio...

      //-------------------------------------------------------------------------------------------
      // FUNCIONES ADICIONALES
      //-------------------------------------------------------------------------------------------
      
      /**
       * Inicializa los datos necesarios al cargar la app
       */
      initializeData: async () => {
        const actions = getActions();
        await actions.getDestinos();
        await actions.getIdiomas();
        await actions.getCursos();
        await actions.getServicios();
        await actions.getTestimonios();
      },

      /**
       * Verifica si el usuario está autenticado
       * @returns {boolean} - Estado de autenticación
       */
      isAuthenticated: () => {
        return !!getStore().token;
      }
    }
  };
};

export default getState;