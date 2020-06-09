const express  = require("express");
const server = express();


const db = require("./database/db")


server.use(express.static("public"));


server.use(express.urlencoded({extended: true}));

// template engine
const nunjucks = require('nunjucks');
nunjucks.configure("src/views", {
    express: server,
    noCache: true
});




server.get("/", function(req, res){
   return res.render("index.html", {
       title: "Seu marketPlace de coleta de resíduos"
   });
});



server.get("/create-point", function(req, res){


 

    //console.log(req.query);
    return res.render("create-point.html");
});


server.post("/savepoint", function(req, res){

       const query = `
        INSERT INTO places (
            image, 
            name, 
            address, 
            address2, 
            state, 
            city, 
            items
        ) VALUES (?,?,?,?,?,?,?);`


    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ];    


   function afterInsertDara(err){
        if(err){
            console.log(err);
            //return res.send("Erro no cadastro");          
            return res.render("create-point.html", {saved:false});


        }else{
            console.log("cadastrado com sucesso");
            console.log(this);
            return res.render("create-point.html", {saved: true});
        }
   } 

   db.run(query, values, afterInsertDara)
    
});





server.get("/search", function(req, res){

    const search = req.query.search;

    if(search == ""){
         return res.render("search-results.html", {total: 0});
    }


    //pegar os dados do banco de dados
       db.all(`SELECT * FROM places WHERE  city LIKE '%${search}' `, function(err, rows){
        if(err){
            return console.log(err);
        }   

        const total = rows.length;

        //mostrar a pagina hmtl com os dados do banco de dados 
        return res.render("search-results.html", {places: rows, total: total});
    });


    
})






/*server.get("/create-point", function(req, res){
    res.render(__dirname + "/views/create-point.html");
});*/

/*server.get("/search-results", function(req, res){
    res.sendFile(__dirname + "/views/search-results.html"); 
});*/

//Ligar o servidorn
server.listen(3000);