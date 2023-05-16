import axios from "axios";

export default axios.create({
  //Note: Declarare en este archivo la ruta base que se utilizara en el proyecto
  baseURL: "https://sellia-web-page-test.s3.us-east-2.amazonaws.com",
  timeout: 15000,

  headers: {
    'Content-Type' :'application/json',
	},
});