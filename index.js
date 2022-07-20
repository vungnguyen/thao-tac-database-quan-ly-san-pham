const http = require('http');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'DB',
    charset: 'utf8_general_ci'
});
connection.connect((err) => {
    if (err) {
        connection.log(err);
    }else {
        console.log('connect success');
        const sql = "create table if not exists product(id int primary key not null auto_increment, name varchar(30) not null,price int not null)";
        connection.query(sql,(err) => {
            if (err) {
                console.log(err);
            }
            console.log('create success');
        })
    }
});

const server = http.createServer(async(req, res) => {
    try {
        if(req.url === '/product/create' && req.method === 'POST') {
             const buffers = [];
            for await (const chunk of req) {
                buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            const product = JSON.parse(data);
            const sqlCreate = `inserts into product(name,price) values('${product.name}', '${product.price}');`;
            connection.query(sqlCreate,(err, result,field) => {
                if (err) throw err;
                res.end(JSON.stringify(product));
            })
        }
    }catch (err) {
        return res.end(err.message);
    }
});
server.listen(3000,() => {
    console.log('server is running at http://localhost:3000');
})