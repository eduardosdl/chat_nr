module.exports = function(application) {

  application.get('/', function(req, res) {

    let validacao = [
      {
        value: '',
        msg: 'Não pode ser vazio',
        param: 'apelido',
        location: 'body'
      }
    ];
    
    res.render('index', { validacao: { errors: [] } });
  });
}