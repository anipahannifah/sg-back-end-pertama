const express = require ('express')
const koneksi = require ('./config/database')
const bodyParser = require ('body-parser')
const app = express();
const PORT = 5000;

//set body parser
app.use (bodyParser.json());
app.use (bodyParser.urlencoded({ extended : false}));

app.get('/', (req,res) => { 
    return res.status(200).json({pesan: 'wow berhasil'})
});

app.get('/api/bootcamps',(req, res)=> {
    var statement = 'SELECT * from bootcamp';
    koneksi.query(statement,(err, rows, field)=>{
        if(err){
            return res.status(500).json({ message : 'ada kesalahan'});
        }
        console.log(rows);
        res.status(200).json({success : true, data: rows})
    });
});

app.post('/api/bootcamp/insert',(req,res)=>{
    const data = {...req.body};
    var statement = 'INSERT INTO bootcamp SET ?';

    koneksi.query(statement, data, (err, rows, field)=>{
        if(err){
            return res.status(500).json({ message : 'Gagal insert data!', error : err});
        }
    res.status(201).json({success : true, message: 'berhasil!'})
    });
});

app.delete('/api/bootcamp/delete/:id',(req,res)=>{
    var statement1 = 'SELECT * FROM bootcamp WHERE id = ?';
    var statement2 = 'DELETE FROM bootcamp WHERE id = ?';
    koneksi.query(statement1, req.params.id, (err, rows, field)=> {
        if(err){
            return res.status(500).json({ message : 'Gagal hapus data!', error : err});
        }

        if(!rows.length){
            return res.status(500).json({ message: `Id ${req.params.id} tidak ditemukan`});
        }

        koneksi.query(statement2, req.params.id, (err, rows, field)=> {
            if(err) throw err;

            if(rows.affectedRows == 1){
                res.status(200).json({success : true, message: 'berhasil hapus data!'});
            }
        });
    });
});

app.put('/api/bootcamp/update/:id',(req,res)=>{
    var statement1 = 'SELECT * FROM bootcamp WHERE id = ?';
    var statement2 = 'UPDATE bootcamp  SET ? WHERE id = ?';
    const data = {...req.body};
    koneksi.query(statement1, req.params.id, (err, rows, field)=> {
        if(err){
            return res.status(500).json({ message : 'Gagal hapus data!', error : err});
        }

        if(!rows.length){
            return res.status(500).json({ message: `Id ${req.params.id} tidak ditemukan`});
        }

        koneksi.query(statement2, [data, req.params.id], (err, rows, field)=> {
            if(err) throw err;

            if(rows.affectedRows ==1){
                res.status(200).json({success : true, message: 'berhasil Update!'});

            }
        });
    });
});




app.listen(PORT, ()=>  console.log(`server running at port : ${PORT}`));