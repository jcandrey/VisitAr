import React, { useCallback, useState, alert } from "react";
import { Formik, ErrorMessage } from "formik";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getImagen, takeImagen } from "../pickImage/pick";
import Login from "./Login";
import useUser from "./useUser";
import BackIcon from "../images/BackIcon";

function EditUser({ navigation, setTask, task }) {
  let cargaImagen;
  const { user, userDB, setUserDB } = useUser();
  const [tarea, setTarea] = useState("Modificar");

  const MODIFICAR = gql`
    mutation updateUsuario($input: UsuarioInput) {
      updateUsuario(input: $input) {
        _id
      }
    }
  `;
  const [modificarUsuario] = useMutation(MODIFICAR);

  let token;
  const handle = useCallback(
    (values) => {
      let id = userDB.usuarios[0]._id;
      console.log("entre a Modificar GraphQL", values, id);
      modificarUsuario({
        variables: {
          input: {
            _id: id,
            especialidad: values.especialidad,
            apellido: values.apellido,
            imagen: cargaImagen,
            laboratorio: values.laboratorio,
            matricula: values.matricula,
            nombre: values.nombre,
            provincia: values.provincia,
            telefono: values.telefono,
          },
        },
      })
        .then(() => {
          Alert.alert(
            "Editar Usuario",
            "Los datos han sido modificados",
            [{ text: "OK", onPress: () => console.log("OK") }],
            { cancelable: false }
          );
        })
        .catch((err) => {
          Alert.alert(
            "Editar Usuario",
            "Error al modificar los datos",
            [{ text: "OK", onPress: () => console.log("OK") }],
            { cancelable: false }
          );
        });
    },
    [tarea]
  );

  function cargarImagen() {
    let result = getImagen();
    result.then((ans) => {
      cargaImagen = ans;
    });
  }

  function cargarImagen2() {
    setImagen(takeImagen());
    console.log(imagen);
  }

  return tarea !== "Regresar" ? (
    <Formik
      initialValues={{
        emailRegister: "",
        passwordRegister: "",
        uid: userDB && userDB.usuarios[0]._id,
        nombre: userDB && userDB.usuarios[0].nombre,
        apellido: userDB && userDB.usuarios[0].apellido,
        telefono: userDB && userDB.usuarios[0].telefono,
        rol: userDB && userDB.usuarios[0].rol,
        provincia: userDB && userDB.usuarios[0].provincia,
        matricula: userDB && userDB.usuarios[0].matricula,
        verificado: userDB && userDB.usuarios[0].verificado,
        laboratorio: userDB && userDB.usuarios[0].laboratorio,
        imagen: userDB && userDB.usuarios[0].imagen,
        especialidad: userDB && userDB.usuarios[0].especialidad,
      }}
      validate={(values) => {
        const errors = {};
        if (!values.nombre) errors.nombre = "Debes ingresar un Nombre";
        if (!values.apellido) errors.apellido = "Debes ingresar un Apellido";
        if (isNaN(values.telefono))
          errors.telefono = "Debes ingresar un Número";
        if (isNaN(values.matricula))
          errors.matricula = "Debes ingresar un Número";
        return errors;
        if (!userDB && !values.emailRegister) {
          errors.emailRegister = "Debes ingresar un Usuario";
        } else if (
          !userDB &&
          !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.emailRegister)
        )
          errors.emailRegister = "email incorrecto";
        if (!userDB && !values.passwordRegister) {
          errors.passwordRegister = "Debes ingresar un Password";
        } else if (
          !userDB &&
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
            values.passwordRegister
          )
        )
          errors.passwordRegister =
            "min 8 caracteres, un numero y una mayuscula";
        if (!values.provincia)
          errors.provincia = "Debes ingresar una Provincia";
        if (!values.laboratorio)
          errors.laboratorio = "Debes ingresar un Laboratorio";
        if (!values.especialidad)
          errors.especialidad = "Debes ingresar una Especialidad";
      }}
      onSubmit={(values) => {
        return handle(values);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        values,
        errors,
      }) => (
        <View style={styles.container}>
          <View style={styles.vista}>
            <TouchableOpacity
              style={styles.botonRegistro}
              onPress={() =>
                tarea !== "Registrarse"
                  ? navigation.goBack()
                  : setTask("Ingresar")
              }
            >
              <BackIcon color="grey" size="32" />
              <Text style={styles.backtitle}>Datos de Registro</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.text}>Los campos con * son obligatorios</Text>
          <ScrollView style={styles.margen}>
            <Text style={styles.text}>Nombre*</Text>
            <TextInput
              style={styles.inputGroup}
              name="nombre"
              onChangeText={handleChange("nombre")}
              onBlur={handleBlur("nombre")}
              value={values.nombre}
            />
            <ErrorMessage
              style={{ color: "red" }}
              name="nombre"
              component={Text}
            />

            <Text style={styles.text}>Apellido*</Text>
            <TextInput
              style={styles.inputGroup}
              name="apellido"
              onChangeText={handleChange("apellido")}
              onBlur={handleBlur("apellido")}
              value={values.apellido}
            />
            <ErrorMessage
              style={{ color: "red" }}
              name="apellido"
              component={Text}
            />
            <Text style={styles.text}>Teléfono (solo números)</Text>
            <TextInput
              style={styles.inputGroup}
              name="telefono"
              onChangeText={handleChange("telefono")}
              onBlur={handleBlur("telefono")}
              value={values.telefono}
              keyboardType="number-pad"
            />

            <ErrorMessage
              style={{ color: "red" }}
              name="telefono"
              component={Text}
            />

            <Text style={styles.text}>Provincia</Text>
            <TextInput
              style={styles.inputGroup}
              name="provincia"
              onChangeText={handleChange("provincia")}
              onBlur={handleBlur("provincia")}
              value={values.provincia}
            />
            {/* <ErrorMessage
              style={{ color: "red" }}
              name="provincia"
              component={Text}
            /> */}

            <Text style={styles.text}>Matrícula (solo números)</Text>
            <TextInput
              style={styles.inputGroup}
              name="matricula"
              onChangeText={handleChange("matricula")}
              onBlur={handleBlur("matricula")}
              value={values.matricula}
              keyboardType="number-pad"
            />
            <ErrorMessage
              style={{ color: "red" }}
              name="matricula"
              component={Text}
            />
            <Text style={styles.text}>Laboratorio</Text>
            <TextInput
              style={styles.inputGroup}
              name="laboratorio"
              onChangeText={handleChange("laboratorio")}
              onBlur={handleBlur("laboratorio")}
              value={values.laboratorio}
            />
            {/* <ErrorMessage
              style={{ color: "red" }}
              name="laboratorio"
              component={Text}
            /> */}

            <Text style={styles.text}>Especialidad</Text>
            <TextInput
              style={styles.inputGroup}
              name="especialidad"
              onChangeText={handleChange("especialidad")}
              onBlur={handleBlur("especialidad")}
              value={values.especialidad}
            />
            {/* <ErrorMessage
              style={{ color: "red" }}
              name="especialidad"
              component={Text}
            /> */}
          </ScrollView>
          <View style={styles.divCont}>
            <View style={styles.div}>
              <TouchableOpacity style={styles.boton1} onPress={cargarImagen}>
                <Text style={styles.texto}>Agregar una foto almacenada</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.div}>
              <TouchableOpacity style={styles.boton1} onPress={cargarImagen2}>
                <Text style={styles.texto}>Agregar una foto con tu cámara</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.div}>
              <TouchableOpacity
                style={styles.boton1}
                //disabled={isSubmitting}
                onPress={(e) => {
                  handleSubmit(e),
                    //refetch(),
                    tarea !== "Registrarse" ? navigation.goBack() : <Login />;
                }}
              >
                <Text style={styles.texto}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Formik>
  ) : (
    <Login />
  );
}

const styles = StyleSheet.create({
  vista: {
    display: "flex",
    flexDirection: "row",
  },
  backtitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 25,
    color: "grey",
  },
  botonRegistro: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
  },
  titulo: {
    fontSize: 15,
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
    color: "#7C88D5",
  },
  margen: {
    marginTop: 20,
    marginLeft: 5,
  },
  container: {
    fontFamily: "Roboto_500Medium",
    flex: 1,
    padding: 15,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
  },

  inputGroup: {
    flex: 1,
    padding: 5,
    marginBottom: 10,
    marginRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
  },
  text: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    color: "#7C88D5",
  },
  boton: {
    backgroundColor: "#7C88D5",
    borderRadius: 10,
    width: 100,
    height: 35,
    padding: 8,
    textAlign: "center",
    marginBottom: 10,
  },
  boton1: {
    backgroundColor: "#7C88D5",
    borderRadius: 10,
    width: 220,
    height: 35,
    padding: 8,
    textAlign: "center",
    marginBottom: 10,
  },
  texto: {
    fontFamily: "Roboto_500Medium",
    color: "white",
  },
  divCont: {
    paddingTop: 20,
  },
  div: {
    alignItems: "center",
  },
});

export default EditUser;
