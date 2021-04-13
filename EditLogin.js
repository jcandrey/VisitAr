import React, { useCallback, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import EditUser from "./EditUser";
import Login from "./Login";
import BackIcon from "../images/BackIcon";
import useUser from "./useUser";
import Header from "../Header/Header";

function EditLogin({ navigation }) {
  let cargaImagen;
  const { userDB } = useUser();
  const [tarea, setTarea] = useState("Ingresar");
  let token;
  const handle = useCallback((values) => {
    var user = firebase.auth().currentUser;
    user
      .updatePassword(values.password)
      .then(() => {
        Alert.alert(
          "Cambio de Password",
          "El Password ha sido modificado",
          [{ text: "OK", onPress: () => console.log("OK") }],
          { cancelable: false }
        );
      })
      .catch((err) => {
        Alert.alert(
          "Cambio de Password",
          "Debes ingresar otro password",
          [{ text: "OK", onPress: () => console.log("OK") }],
          { cancelable: false }
        );
      });
  });
  [tarea];

  return tarea === "Ingresar" ? (
    <Formik
      initialValues={{ password2: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.password) {
          errors.password = "Debes ingresar un Password";
        } else if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
            values.password
          )
        )
          errors.password = "min 8 caracteres, un numero y una mayuscula";
        if (!values.password2) {
          errors.password2 = "Debes ingresar un Password";
        } else if (
          values.password !== values.password2 ||
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
            values.password2
          )
        )
          errors.password2 = "no concuerda con el nuevo password";
        return errors;
      }}
      onSubmit={(values) => handle(values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        isSubmitting,
        dirty,
      }) => (
        <View style={styles.container}>
          <Header></Header>
          <View style={styles.vista}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon color="grey" size="32" />
            </TouchableOpacity>
            <Text style={styles.title}> Cambiar Clave </Text>
          </View>

          <Text style={styles.text}>New Password</Text>
          <TextInput
            style={styles.inputGroup}
            name="password"
            secureTextEntry
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
          />
          <ErrorMessage
            style={{ color: "red" }}
            name="password"
            component={Text}
          />
          <Text style={styles.text}>Reescribir New Password</Text>
          <TextInput
            style={styles.inputGroup}
            name="password2"
            secureTextEntry
            onChangeText={handleChange("password2")}
            onBlur={handleBlur("password2")}
            value={values.password2}
          />
          <ErrorMessage
            style={{ color: "red" }}
            name="password2"
            component={Text}
          />
          <View style={styles.div}>
            <TouchableOpacity
              style={styles.boton1}
              //disabled={isSubmitting || !dirty}
              onPress={(e) => {
                handleSubmit(e), navigation.goBack();
              }}
            >
              <Text style={styles.texto}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  ) : tarea === "Regresar" ? (
    <Login />
  ) : (
    <EditUser />
  );
}

const styles = StyleSheet.create({
  vista: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
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
    marginLeft: 8,
    marginRight: 10,
  },

  inputGroup: {
    padding: 5,
    marginBottom: 10,
    marginRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
  },
  text: {
    marginBottom: 10,
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
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
  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: 25,
    color: "grey",
  },
  div: {
    alignItems: "center",
  },
});

export default EditLogin;
