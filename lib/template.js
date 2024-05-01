var sanitizeHtml = require('sanitize-html');

module.exports = {
    html : function (title, list, body, control){
      return `
      <!doctype html>
      <html>
        <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          <a href="/author">Author</a>
          ${list}
          ${control}
          ${body}
        </body>
      </html>
      `
    },
    list : function (topics){
      var list = '<ul>';
      var i = 0;
      while(i < topics.length){
        list = list + `<li><a 
        href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`
        i++;
      }
      list = list + '</ul>';
      return list;
    },
    authorSelect : function(authors, author_id){
      var tag = ''
        authors.forEach(function(value){
          var selected = '';
          if(value.id === author_id){
            selected = ' selected'
          }
          tag += `<option value = "${value.id}" ${selected}>${sanitizeHtml(value.nam)}</option>`
        });
      return `<select name = "author">
              ${tag}
            </select>`;
    },
    authorList : function(authors){
      var table = `<table>
                    <tr>
                      <td>title</td>
                      <td>profile</td>
                      <td>update</td>
                      <td>delete</td>
                    </tr>`
      authors.forEach(function(value){
        table += `<tr>
                    <td>${sanitizeHtml(value.name)}</td>
                    <td>${sanitizeHtml(value.profile)}</td>
                    <td><a href="/author/update?id=${value.id}">update</a></td>
                    <td>
                      <form action="/author/delete_process" method = "post">
                        <input type="hidden" name=id value="${value.id}">
                        <input type="submit" value="delete">
                      </form>
                    </td>
                  </tr>`
      });
      table += `</table>
                <style>
                  table{
                    border-collapse: collapse;
                  }
                  td{
                    border: 1px solid black;
                  }
                </style>`
      return table;
    }
  }