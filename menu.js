const btnProd = document.getElementById('agProd');
btnProd.addEventListener('click', () => {

    let nombre = document.getElementById('nombProd').value;
    let cantidad = document.getElementById('cantProd').value;
    let precio = document.getElementById('precProd').value;

    let info = {
        nombProd: nombre,
        cantidad: cantidad,
        precio: precio
    }
    /*
    DUDAS------------------------------------------
    INSERTAR LA RUTA DE 'isLoggedIn' PARA VERIFICAR SI ESTA AUTORIZADO PERO COMO HACERLO? COMO MANDAR EL "authorization:Bearer:'token'" 
     */
    fetch('http://localhost:3002/api/crear_producto', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: { 'Content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => { console.log(data) });
});

const btnCli = document.getElementById('agCli');
btnCli.addEventListener('click', () => {

    let nombre = document.getElementById('nombCli').value;
    let apellidos = document.getElementById('apeCli').value;
    let correo = document.getElementById('corCli').value;

    let info = {
        nombre: nombre,
        apellidos: apellidos,
        correo: correo
    }
    console.log(info);

    fetch('http://localhost:3002/api/crear_cliente', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: { 'Content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => { console.log(data) });
});


const btnVend = document.getElementById('agVen');
btnVend.addEventListener('click', () => {
    let nombre = document.getElementById('nombVen').value;
    let apellidos = document.getElementById('apeVen').value;

    let info = {
        nombre: nombre,
        apellidos: apellidos
    }
    console.log(info);

    fetch('http://localhost:3002/api/crear_vendedor', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: { 'Content-type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => { console.log(data) });
});




const crearFactura = document.getElementById('crearFac');
crearFactura.addEventListener('click', () => {
    let divFac = document.getElementById('facturas');
    let info = `
    <h3>Nueva factura</h3><br>

    <form>
    <label for="facCli">Nombre del cliente</label><br>
    <select id="facCli"></select><br><br>

    <label for="facVen">Nombre del vendedor</label><br>
    <select id="facVen"></select><br><br>

    <label for="facProd">Cantidad de productos</label><br>
    <input type="number" id="facProd"><br><br>

    <button type="button" id="btnMas">Añadir productos</button><br><br>
    

    </form><br>
        
    <div id="prodNuevos"></div><br>
    `;
    divFac.innerHTML = info;

    fetch('http://localhost:3002/api/agregar_cliente')
        .then((response)=>response.json())
        .then((json)=>{
            let menu = document.getElementById('facCli');
            let opciones="";
            for(i=0;i<json.length;i++){
                opciones+=`<option value="${json[i].id}">${json[i].nombre}</option>`;
            }
            menu.innerHTML= opciones;
        });

        fetch('http://localhost:3002/api/vendedor')
        .then((response)=>response.json())
        .then((json)=>{
            let menuVen=document.getElementById('facVen');
            let opciones="";
            for(let i=0;i<json.length;i++){
                opciones+=`<option value="${json[i].id}">${json[i].nombre}</option>`
            }
            menuVen.innerHTML=opciones;
        });

    const masProd = document.getElementById('btnMas');
    masProd.addEventListener('click', () => {
        let cantProd = document.getElementById('facProd').value;
        let divFac = document.getElementById('prodNuevos');
        let info = " ";

        for (let i = 0; i < cantProd; i++) {
            info += `
            <h4>Producto ${i + 1}</h4>
            <label for="nombProdNue${i}">Nombre</label><br>
            <select id="nombProdNue${i}"></select><br>
            
            <label for="cantProdNue${i}">Cantidad </label><br>
            <input type="number" id="cantProdNue${i}"></input><br><br>
            `
        }

       
        fetch('http://localhost:3002/api/prod_nombre')
        .then((response)=>response.json())
        .then((json)=>{
            for(let j=0;i<json.length;j++){
                let selectProd=document.getElementById('nombProdNue'+j);
                let opciones="";
                for(let i=0;i<json.length;i++){   
                    opciones+=`<option value="${json[i].id}">${json[i].nombre}</option>`
                }
                selectProd.innerHTML=opciones
            }
        })
        
        divFac.innerHTML = info;


    });

});


const btnEnvFac=document.getElementById('btnSubmit');
btnEnvFac.addEventListener('click',()=>{ 
    let nomCliFac=document.getElementById('facCli').value;
    let nomVenFac=document.getElementById('facVen').value;
    let cantProdFac=document.getElementById('facProd').value;
    let infoProd=[];

    for(let i=0; i<cantProdFac;i++){
        let nombreProd=document.getElementById('nombProdNue'+i).value;
        let cantidadProd=document.getElementById(`cantProdNue${i}`).value;

        infoProd.push({
            NombreProducto:nombreProd,
            CantidadProducto:cantidadProd
        });
    }

    let info={
        NombreCliente:nomCliFac,
        NombreVendedor:nomVenFac,
        CantidadProductos:infoProd
    }
    console.log(info)

    fetch('http://localhost:3002/api/crear_factura', {
        method: 'POST',
        body: JSON.stringify(info),
        headers: { 'Content-type': 'application/json' }
        
    })
    .then(res=>res.json())
    .then(data=>{console.log(data);})
    .catch(err=>console.log(err));
});