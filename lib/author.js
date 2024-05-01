var db = require('./db.js')
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

exports.index = function(request, response){
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query('SELECT * FROM author', function(error2, authors){
            var title = 'Author List';
            var data = template.authorList(authors);
            var list = template.list(topics);
            var html = template.html(title, list, 
                `<h2>${title}</h2><p>${data}</p>
                <form action="/author/create_process" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                <p>
                    <input type="submit" value="Create">
                </p>
                </form>`,'');
            response.writeHead(200);
            response.end(html);
        })
      });
}

exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          INSERT INTO author (name, profile)
            VALUES(?, ?)`, [post.name, post.profile], function(err, result){
              if(err){
                throw err;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();
        })
      });
}

exports.update = function(request, response){
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query('SELECT * FROM author', function(error2, authors){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query('SELECT * FROM author WHERE id = ?', [queryData.id], function(error3, author){
                var title = 'Author List';
                var data = template.authorList(authors);
                var list = template.list(topics);
                var html = template.html(title, list, 
                    `<h2>${title}</h2><p>${data}</p>
                    <form action="/author/update_process" method="post">
                    <p><input type="hidden" name="id" value=${queryData.id}></p>
                    <p><input type="text" name="name" placeholder="name" value=${sanitizeHtml(author[0].name)}></p>
                    <p>
                        <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="Update">
                    </p>
                    </form>`,'');
                response.writeHead(200);
                response.end(html);
            });
        });
      });
}

exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          UPDATE author SET name = ?, profile = ? WHERE id = ?`,
          [post.name, post.profile, post.id], function(err, result){
            if(err){
              throw err;
            }
            response.writeHead(302, {Location: `/author/update?id=${post.id}`});
            response.end();
        })
      }); 
}

exports.delete_process = function(request, response){
    var body = '';
      request.on('data', function(data){
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query('DELETE FROM topic WHERE author_id =?', [post.id], function(err, result){
            if(err){
                throw err;
            }
            db.query('DELETE FROM author WHERE id = ?', [post.id], function(err2, result){
                if(err2){
                    throw err2;
                }
                response.writeHead(302, {Location: `/author`});
                response.end();
              });
        });
    });
}