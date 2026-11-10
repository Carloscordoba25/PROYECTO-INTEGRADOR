export const storage = {
    //1. MÉTODO PARA LEER:
    leer(nombreDato) {
        try {
            const datoGuardado = localStorage.getItem(nombreDato);

            if (datoGuardado == null) {
                return null;
            }
            return JSON.parse(datoGuardado); 
        
        } catch (error) {
            console.error("Error al leer los datos: ", error);
            return null;
        }
    },      //Aquí se pone una coma para continuar con el siguiente elemento (método) del objeto.    


    //2. MÉTODO PARA GUARDAR -guardar(nombreDato, datos)-:
    guardar(nombreDato, datos) {  //"datos" será un objeto.
        try {
            const datosConvertidos = JSON.stringify(datos);  //Se convierte "datos" a String.

            //Aquí se guarda propiamente (ya convertido a texto de JSON):
            localStorage.setItem(nombreDato, datosConvertidos);

            return {ok: true};  //Salió bien.

        } catch (error) {
            console.error("Error al guardar datos: ", error);

            return {ok: false, error: error.message};  //NO salió bien.
        }
    },


    //3. MÉTODO BORRAR:
    borrar(nombreDato) {
        try {
            localStorage.removeItem(nombreDato);
            return {ok: true};

        } catch (error) {
            console.error("Error al eliminar: ", error);

            return {ok: false, error: error.message};
        }
    },

    //3. MÉTODO PARA COMPROBAR SI EXISTE UN DATO:
    comprobar(nombreDato) {
        try {
            return localStorage.getItem(nombreDato) !== null;  //Como decir: Entrégame un dato que nos e null. Si entra aquí, sería TRUE (luego se mostrará un mensaje de éxito en la lógica).

        } catch (error) {
            console.error("Error al comprobar el dato: ", error);
            return false;
        }
    }
};