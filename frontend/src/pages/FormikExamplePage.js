import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const FormikExamplePage = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-2">
          <label>Email</label>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" className="text-red-500" />

          <label>Passwort</label>
          <Field type="password" name="password" />
          <ErrorMessage
            name="password"
            component="div"
            className="text-red-500"
          />

          <button type="submit" disabled={isSubmitting}>
            Einloggen
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormikExamplePage;
