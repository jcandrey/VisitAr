import React, { useCallback, useState } from "react";
import { Formik, ErrorMessage } from "formik";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import firebase from "firebase/app";
import "firebase/auth";
import AltaUser from "./AltaUser";
import EditLogin from "./EditLogin";

function Login(props) {
  let cargaImagen;
  let provider = new firebase.auth.GoogleAuthProvider();
  const [task, setTask] = useState("Ingresar");
  let token;
  const handle = useCallback((values) => {
    if (task === "Ingresar")
      firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(() => {
          Alert.alert(
            "Login",
            "Ahora te encuentras logueado",
            [{ text: "OK", onPress: () => console.log("OK") }],
            { cancelable: false }
          );
        })
        .catch((err) => {
          Alert.alert(
            "Login",
            "Usuario o Password incorrecto",
            [{ text: "OK", onPress: () => console.log("OK") }],
            { cancelable: false }
          );
        });
    [task];
  });

  return task === "Ingresar" ? (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Debes ingresar un Usuario";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email))
          errors.email = "email incorrecto";
        if (!values.password) {
          errors.password = "Debes ingresar un Password";
        } else if (
          !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
            values.password
          )
        )
          errors.password = "min 8 caracteres, un numero y una mayuscula";
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
          <Text style={styles.text}>Email</Text>
          <TextInput
            name="email"
            style={styles.inputGroup}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            keyboardType="email-address"
          />
          <ErrorMessage
            style={{ color: "red" }}
            name="email"
            component={Text}
          />
          <Text style={styles.text}>Password</Text>
          <TextInput
            name="password"
            style={styles.inputGroup}
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
          <View style={styles.div}>
            <TouchableOpacity
              style={styles.boton}
              //disabled={isSubmitting || !dirty}
              onPress={(e) => handleSubmit(e)}
            >
              <Text style={styles.texto}>Ingresar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.div}>
            <TouchableOpacity
              style={styles.boton}
              onPress={() => setTask("Registrarse")}
            >
              <Text style={styles.texto}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  ) : (
    <AltaUser />
  );
}

const styles = StyleSheet.create({
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
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto_500Medium",
    flex: 1,
    padding: 15,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    marginBottom: 10,
    color: "#7C88D5",
  },
  inputGroup: {
    padding: 5,
    marginBottom: 10,
    marginRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9",
    fontFamily: "Roboto_400Regular",
  },
  boton: {
    backgroundColor: "#7C88D5",
    borderRadius: 10,
    width: 220,
    height: 35,
    padding: 8,
    textAlign: "center",
    margin: 10,
  },
  texto: {
    textAlign: "center",
    fontFamily: "Roboto_500Medium",
    color: "white",
  },
  div: {
    alignItems: "center",
  },
});

export default Login;
