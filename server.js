const PORTA = 5757;
// Server
const express = require('express');
const path = require('path');
const app = express();
// Configs
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Definir onde está o que será exibido no front /rotas 
app.use(express.static(path.join(__dirname, 'public')));

// Definir as views como html
app.set('views', path.join(__dirname, 'public'));  
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Ler CSV
const fs = require('fs');
const neatCsv = require('neat-csv');

let MAP = [];
fs.readFile('./Relatorio_cadop.csv', 'latin1',
async function (err, data) {
    if(err) throw err;
    MAP = await neatCsv(data,{separator: ';', skipLines: 2 });    
});

app.get('/', (req, res)=>{
  return res.render('public/index', {registros:RegistrosFiltrados});
});
app.get('/find/:ans/:cnpj/:razaoSocial/:nome/:modalidade/:email/:representante/:dataRegistro', (req, res) => {
  
  const ans = req.params.ans == '-1' ? '' : req.params.ans;
  const cnpj = req.params.cnpj == '-1' ? '' : req.params.cnpj;
  const razaoSocial = req.params.razaoSocial == '-1' ? '' : req.params.razaoSocial;
  const nome = req.params.nome == '-1' ? '' : req.params.nome;
  const modalidade = req.params.modalidade == '-1' ? '' : req.params.modalidade;
  const email = req.params.email == '-1' ? '' : req.params.email;
  const representante = req.params.representante == '-1' ? '' : req.params.representante;
  const dataRegistro = req.params.dataRegistro == '-1' ? '' : req.params.dataRegistro;
  
  const RegistrosFiltrados = [];
  for (const registro in MAP){
    if(
      ((MAP[registro]['Registro ANS']).indexOf(ans)>-1) &&
      ((MAP[registro]['CNPJ']).indexOf(cnpj)>-1) &&
      ((MAP[registro]['Razão Social']).indexOf(razaoSocial)>-1) &&
      ((MAP[registro]['Nome Fantasia']).indexOf(nome)>-1) &&
      ((MAP[registro]['Modalidade']).indexOf(modalidade)>-1) &&
      ((MAP[registro]['Endereço eletrônico']).indexOf(email)>-1) &&
      ((MAP[registro]['Cargo Representante']).indexOf(representante)>-1) &&
      ((MAP[registro]['Data Registro ANS']).indexOf(dataRegistro)>-1)
    ){
      RegistrosFiltrados.push(MAP[registro]);
    }
  }
  res.json(RegistrosFiltrados);
})

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`)
})
