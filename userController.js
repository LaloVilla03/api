let db = require('../API/lib/db');

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const userMiddleware = require('../API/Middleware/users');

module.exports={

    prodNombre:(req,res)=>{
        db.query(`SELECT * FROM productos`,
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.json(result);
            }
        }
        )
    },

    prodCantidad:(req,res)=>{
        db.query(`SELECT * FROM productos`,
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.json(result);
            }
        }
        )
    },

    agCli:(req,res)=>{
        db.query(`SELECT * FROM clientes`,
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.json(result);
            }
        }
        )
    },

    agVen:(req,res)=>{
        db.query(`SELECT * FROM vendedores`,
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.json(result);
            }
        }
        )
    },

    crearFactura:(req,res)=>{
        db.query(`INSERT INTO facturas (id,fecha,cliente,vendedor) VALUES ('${uuid.v4()}',now(),${db.escape(req.body.NombreCliente)},${db.escape(req.body.NombreVendedor)});`,
        (err,result)=>{
            if(err){
                console.log(err);
                throw err
            }else{
                console.log(result);
                for(let i=0;i<req.body.CantidadProductos.length;i++){
                    db.query(`INSERT INTO detalles_facturas (id,id_factura,id_producto,cantidad) VALUES ('${uuid.v4()}', ${result.insertId}, '${req.body.CantidadProductos[i].NombreProducto}', ${req.body.CantidadProductos[i].CantidadProducto});`,
                    
                    (err,result)=>{
                        if(err){
                            throw err
                            return res.status(400).send({msg:err});
                        }else{
                            console.log(req.body.CantidadProductos)
                            db.query(`UPDATE productos SET cantidad-= ${req.body.CantidadProductos[i].CantidadProducto} WHERE productos.id='${req.body.CantidadProductos[i].NombreProducto}';`,
                            (err,result)=>{
                                if(err){
                                    console.log(err);
                                }else{
                                    return res.status(200).send({msg:'Factura agregada con éxito.'})
                                }
                            }
                            )
                        }

                        //
                        
                    }
                    )
                }
            }
        }
        )
    },

    iniciarSesion:(req,res,next)=>{

        db.query(`SELECT * FROM administradores WHERE nombre_usuario = ${db.escape(req.body.username)};`,
        (err,result)=>{
           
            //el nombre de usuario no existe
            if(err){
                return res.status(400).send({
                    msg:err
                });
            }
            
            if(!result.length){
                return res.status(401).send({
                    msg:'Nombre de usuario incorrectos'
                    //nunca decir cual esta mal
                });
            }

            //revisar contraseña
            bcrypt.compare(req.body.contraseña, result[0]['contraseña'],
            (bErr,bResult)=>{
                //contraseña equivocada
                if(bErr){
                    return res.status(401).send({
                        msg:' contraseña incorrectos'
                        //nunca decir cual esta mal
                    });
                }
                if(bResult){
                    const token = jwt.sign({
                        username:result[0].username,
                        userId:result[0].id
                    },
                    'SECRETKEY',{
                        expiresIn:'7d'
                    }
                    );

                    db.query(`UPDATE administradores SET ultima_conexion=now() WHERE id='${result[0].id}'`);

                    return res.status(200).send({
                        msg:'Has iniciado sesión',
                        token,
                        user: result[0]
                    });
                }
            }
            );
        }
        );
    },


    registrar:(req,res,next)=>{
        
        db.query(`SELECT * FROM administradores WHERE LOWER(nombre_usuario)=LOWER (${db.escape(req.body.username)});`,

        //nombre de usuario ocupado
        (err,result)=>{
            if(result.length){
                return res.status(409).send({
                    msg:'Este nombre de usuario ya existe.'
                });
            }else{
                //el nombre de usuario esta disponble => se procede a hashear el passord
                bcrypt.hash(req.body.password,10,(err,hash)=>{
                    //problema al hashear
                    if (err){
                        return res.status(500).send({
                            msg: err
                        });
                    }else{
                        //contraseña hasheada, se procede a añadir a la base de datos
                        db.query(`INSERT INTO administradores (id,nombre_usuario,contraseña,fecha_registro) VALUES ('${uuid.v4()}', ${db.escape(req.body.username)}, ${db.escape(hash)}, now())`,
                        (err,result)=>{
                            if(err){
                                throw err;
                                return res.status(400).send({
                                    msg:err
                                });
                            }
                            
                            return res.status(201).send({
                                msg:'Registrado!'
                            });
                            
                            
                        }
                        );
                        
                    }

                });
                req.body.username.value='';
                req.body.password.value='';
                req.body.repeat_password.value='';
            }
           // window.location.replace('/login.html');
        });
        
    },

    crearProducto:(req,res,next)=>{
        db.query(`SELECT * FROM productos WHERE LOWER(nombre) = LOWER(${db.escape(req.body.nombProd)});`,
        
        (err,result)=>{
            if(result.length){
                return res.status(409).send({
                    msg:'Este producto ya esta registrado en la base de datos.'
                });
            }else{
                db.query(`INSERT INTO productos VALUES ('${uuid.v4()}', ${db.escape(req.body.nombProd)}, ${req.body.precio}, ${req.body.cantidad})`,
                (err,result)=>{
                    if(err){
                        throw err
                        return res.status(400).send({msg:err});
                    }
                    return res.status(200).send({msg:'Producto registrado con éxito'});
                }
                )
            }
        }
        )
  
    },

    crearCliente:(req,res,next)=>{
        db.query(`SELECT * FROM clientes WHERE LOWER(nombre) = LOWER(${db.escape(req.body.nombre)}) AND correo = ${db.escape(req.body.correo)};`,
        (err,result)=>{
            
            if(result.length){
                return res.status(409).send({msg:'Este cliente ya está registrado en la base de datos.'});
            }else{
                db.query(`INSERT INTO clientes (id,nombre,apellidos,correo) VALUES ('${uuid.v4()}', ${db.escape(req.body.nombre)}, ${db.escape(req.body.apellidos)}, ${db.escape(req.body.correo)});`,
                (err,result)=>{
                    if(err){
                        throw err
                        return res.status(400).send({msg:err});  
                    }
                    return res.status(200).send({msg:'Cliente registrado con éxito'});
                }
                );
            }
        }
        );
    },


    crearVendedor:(req,res,next)=>{
        
        db.query(`SELECT * FROM vendedores WHERE LOWER(nombre) = LOWER(${db.escape(req.body.nombre)}) AND LOWER(apellidos) = LOWER(${db.escape(req.body.apellidos)});`,
        (err,result)=>{
            if(result.length){
                return res.status(409).send({msg:'Este vendedor ya está registrado en la base de datos.'});
            }else{
                db.query(`INSERT INTO vendedores VALUES ('${uuid.v4()}', ${db.escape(req.body.nombre)}, ${db.escape(req.body.apellidos)}, now());`,
                (err,result)=>{
                    if(err){
                        throw err
                        return res.status(400).send({msg:err});  
                    }
                    return res.status(200).send({msg:'Vendedor registrado con éxito'});
                }
                );
            }
        }
        );
    },

    
}