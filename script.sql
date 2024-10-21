CREATE DATABASE progra_proyectoFinal;
USE progra_proyectoFinal;
CREATE TABLE administradores ( 
    id varchar(255) PRIMARY KEY, 
    nombre_usuario varchar(255), 
    contraseña varchar(255), 
    fecha_registro datetime, 
    ultima_conexion datetime 
);

CREATE TABLE productos (
    id varchar(255) PRIMARY KEY,
    nombre varchar(255),
    precio int(10),
    cantidad int(10)
);

CREATE TABLE clientes(
    id varchar(255) PRIMARY KEY,
    nombre varchar(255),
    apellidos varchar(255),
    facturas varchar(255),
    correo varchar(255)
);

CREATE TABLE vendedores(
    id varchar(255) PRIMARY KEY,
    nombre varchar(255),
    apellidos varchar(255),
    antiguedad datetime
);

CREATE TABLE facturas(
    id varchar(255) PRIMARY KEY,
    fecha datetime, 
    cliente varchar(255),
    vendedor varchar(255),
    total int(10)
);

CREATE TABLE detalles_facturas(
    id varchar(255) PRIMARY KEY,
    id_factura varchar(255),
    id_producto varchar(255),
	cantidad varchar(10),
    precio varchar(10),
    subtotal varchar(10)
);