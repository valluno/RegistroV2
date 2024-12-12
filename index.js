import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
//TOKEN PARA VER REGISTROS
let tokenGetRegistros=   "G8TB56ERJBC1513GFPQIGNAGFJA97452A";
//TOKEN PARA REGISTRAR REGISTROS
let tokenPostRegistros = "Y5ETRAVH5543AHBJLOPQAZ549BMSDVJ4K";
//TOKEN PARA ELIMILAR REGISTROS
let tokenDelete = "SBBDF555HGNDFBKFB45BFDSBNFD55BSFD";

const app = express();
app.use(bodyParser.json());

const readData = () => {
 const data = fs.readFileSync("./db.json"); 
 return JSON.parse(data);  
}
http://localhost:5000/
app.get("/",(req,res) => {
 const data = readData();   
 res.send("API--V1, HECHA EN NODEJS");
 
});
//http://localhost:5000/registros
//TRAE TODOS LOS REGISTROS
//http://localhost:5000/registros/token/G8TB56ERJBC1513GFPQIGNAGFJA97452A
app.get("/registros/token/:token",(req,res) => {
    const data = readData();  
    let token = req.params.token; 
    token = token.toString();
    //compararCadenas(token,);
    if(token.length == 33){

        //let c0 = token.charAt(32);
        //let c1 = tokenGetRegistros.charAt(32);
        let b =  compararCadenas(token,tokenGetRegistros);
        //res.send(token + "  " + tokenGetRegistros + " POSICION 32: " + c0 + "   " + c1 + " CONDICION: " + b + " LONGITUD: " + token.length);
        if(b == true){
         res.json(data.registros);
        }else{
         res.send("REGISTROS NO ENCONTRADOS");  
        }    
    }else{
      res.send("REGISTROS NO ENCONTRADOS");  
    }

});
//http://localhost:5000/busqueda/token/valor
app.get("/busqueda/token/:token",(req,res) => {
  let token = req.params.token;
  const data = readData();
  const registro = data.registros.find((registros) => registros.token === token);
  if(registro == undefined){
    res.send("EL TOKEN INGRESADO NO REGISTRA");
  }else{
    res.json(registro); 
  }
  
});

/*
 {
   "name":"TEXTO"
 }
*/
//http://localhost:5000/registros/registrar/token/Y5ETRAVH5543AHBJLOPQAZ549BMSDVJ4K
app.post("/registros/registrar/token/:token",(req,res) => {
     
  let token = req.params.token;
  token = token.toString();
  
  if(token.length == 33){

   let b = compararCadenas(token,tokenPostRegistros);

   if(b == true){
    const body = req.body;
    const name = body.name;
    const data = readData();
    const id = data.registros.length + 1;

    var tokenNuevo = crearToken(id);
    const nuevoRegistro = {
     "id": id,
     "name":name,
     "token":tokenNuevo
    }
    data.registros.push(nuevoRegistro);
    fs.writeFileSync("./db.json", JSON.stringify(data));
    //res.send("VALOR DE LA CONDICION: " + b + " name: " + name + " ID NUEVO: " + id); 
    res.send("REGISTRO EXITOSO: TOKEN GENERADO: " + tokenNuevo);
 
   }else{
    res.send("NO SE PUDO REALIZAR EL PROCESO"); 
   }
  

  }else{
   res.send("NO SE PUDO REALIZAR EL PROCESO"); 
  }

});
//http://localhost:5000/registros/elimilar/token/SBBDF555HGNDFBKFB45BFDSBNFD55BSFD
/*
 {
   "token":""
 } 
*/
app.delete("/registros/elimilar/token/:token", (req, res) => {
  const data = readData();
  let token = req.params.token;
  if(token === tokenDelete){
    
    //buscar registro
    const body = req.body;
    let tokenBuscar = body.token;

    if(tokenBuscar === "NULL"){
     res.send("ESTE PROCESO NO ES PERMITIDO");
    }else{

      const registro = data.registros.find((registros) => registros.token === tokenBuscar);

      if(registro === undefined){

        res.send("TOKEN INGRESADO: " + tokenBuscar + ", NO EXISTE");
      }else{
        const registroIndex = data.registros.findIndex((registros) => registros.token === tokenBuscar);
        data.registros.splice(registroIndex, 1);
        fs.writeFileSync("./db.json", JSON.stringify(data));
        //res.send("INDEX A ELIMILAR: " + registroIndex);
        res.send("REGISTRO ELIMINADO SATISFACTORIAMENTE\n" + " NAME QUE TENIA: " + registro.name + " \nTOKEN QUE TENIA: " + registro.token);
  
      }

    }
   
    

  
  }else{
    res.send("EL TOKEN INGRESADO NO TIENE AUTORIZACION PARA ELIMILAR");
  }
});



app.listen(5000, () => {
    console.log("Servidor escuchando por el, puerto 5000");
});

function compararCadenas(cadena1,cadena2){
 let c1;
 let c2;
 for (var i = 0; i < cadena1.length; i++) {
  c1=cadena1.charAt(i);
  c2=cadena2.charAt(i);
  if(c1==c2){

  }else{
    return false;
  }
 }

 return true;

}

function crearToken(idNuevo){
 //generar cadena de 35 caracteres
  var token = idNuevo + "";
  var cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";//36
  var indAleatorio = 0;

  for (var i = 0; i < 36;) {

    indAleatorio = Math.floor(Math.random() * 35);
    if(indAleatorio >= 0 && indAleatorio <= 35){    
      token = token + cadena.charAt(indAleatorio);
      i++;
    }
  
  }

  return token;
}